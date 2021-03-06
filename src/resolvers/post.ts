import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { getConnection } from "typeorm";
import { Post } from "../entities/Post";
import { Updoot } from "../entities/Updoot";
import { User } from "../entities/User";
import { isAuth } from "../middlewares/isAuth";
import { MyContext } from "../types";

@InputType()
class PostInput {
  @Field()
  title: string;
  @Field()
  text: string;
}

@ObjectType()
class PaginatedPosts {
  @Field(() => [Post])
  posts: Post[];
  @Field()
  hasMore: boolean;
}
@Resolver(Post)
export class PostResolver {
  @FieldResolver(() => String)
  textSnippet(@Root() root: Post) {
    return root.text.length > 50 ? `${root.text.slice(0, 50)}...` : root.text;
  }

  @FieldResolver(() => User)
  creator(@Root() post: Post, @Ctx() { userLoader }: MyContext) {
    return userLoader.load(post.creatorId);
  }

  @FieldResolver(() => Int, { nullable: true })
  async voteStatus(
    @Root() post: Post,
    @Ctx() { updootLoader, req }: MyContext
  ) {
    if (!req.session.userId) {
      return null;
    }
    const updoot = await updootLoader.load({
      postId: post.id,
      userId: req.session.userId,
    });
    return updoot ? updoot.value : null;
  }

  @Query(() => PaginatedPosts)
  async posts(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string
  ): Promise<PaginatedPosts> {
    const realLimit = Math.min(50, limit);
    const fakeLimit = realLimit + 1;
    const qb = await getConnection()
      .getRepository(Post)
      .createQueryBuilder("p");
    // if (userId) {
    //   qb.addSelect((subquery) => {
    //     return subquery
    //       .select("value")
    //       .from(Updoot, "updoot")
    //       .where("userId = :userId", { userId: req.session.userId })
    //       .andWhere("postId = p.id");
    //   }, "p_voteStatus");
    // }
    qb.orderBy("p.createdAt", "DESC").limit(fakeLimit);
    if (cursor) {
      qb.where("p.createdAt < :cursor", { cursor: new Date(parseInt(cursor)) });
    }
    const posts = await qb.getMany();
    return {
      posts: posts.slice(0, realLimit),
      hasMore: posts.length === fakeLimit,
    };
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async vote(
    @Arg("postId", () => Int) postId: number,
    @Arg("value", () => Int) value: number,
    @Ctx() { req }: MyContext
  ) {
    const isUpdoot = value !== -1;
    const realValue = isUpdoot ? 1 : -1;
    const { userId } = req.session;
    const updoot = await Updoot.findOne({ where: { postId, userId } });

    // user wants to change its vote
    if (updoot && updoot.value !== realValue) {
      await getConnection().transaction(async (tm) => {
        tm.update(Updoot, { postId, userId }, { value: realValue });
        tm.update(
          Post,
          { id: postId },
          { points: () => `points + ${2 * realValue}` }
        );
        //query builder alternative
        /* tm.createQueryBuilder()
          .update(Post)
          .set({ points: () => `points + ${2 * realValue}` })
          .where({ id: postId })
          .execute(); */
      });
    } else if (!updoot) {
      // user has never voted before
      await getConnection().transaction(async (tm) => {
        tm.insert(Updoot, {
          userId,
          postId,
          value: realValue,
        });
        tm.update(
          Post,
          { id: postId },
          { points: () => `points + ${realValue}` }
        );
      });
    }
    return true;
  }

  @Query(() => Post, { nullable: true })
  post(@Arg("id", () => Int) id: number): Promise<Post | undefined> {
    return Post.findOne(id);
  }

  @Mutation(() => Post, { nullable: true })
  @UseMiddleware(isAuth)
  async updatePost(
    @Arg("id", () => Int) id: number,
    @Arg("input") input: PostInput,
    @Ctx() { req }: MyContext
  ): Promise<Post | undefined> {
    // await Post.update({ id, creatorId: req.session.userId }, { ...input });
    // const post = await Post.findOne(id);
    // if (req.session.userId !== post?.creatorId) {
    //   return undefined;
    // }
    // return post;
    const post = await Post.findOne({ id, creatorId: req.session.userId });
    if (!post) {
      return undefined;
    }
    post.title = input.title;
    post.text = input.text;
    return Post.save(post);
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async createPost(
    @Ctx() { req }: MyContext,
    @Arg("input") input: PostInput
  ): Promise<Post> {
    return Post.create({ ...input, creatorId: req.session.userId }).save();
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deletePost(
    @Arg("id", () => Int) id: number,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    /* const post = await Post.findOne(id);
    if (!post) {
      return false;
    }
    if (post.creatorId !== req.session.userId) {
      throw new Error("not authorized");
    }
    await Updoot.delete({ postId: id }); */
    await Post.delete({ id, creatorId: req.session.userId });
    return true;
  }
}

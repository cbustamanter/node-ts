import { Field, Int, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { EntityWithBase, EntityWithDates } from "./mixins/EntityManager";
import { Updoot } from "./Updoot";
import { User } from "./User";

@ObjectType()
@Entity()
export class Post extends EntityWithDates(EntityWithBase(BaseEntity)) {
  @Field(() => String)
  @Column()
  title!: string;

  @Field()
  @Column()
  text!: string;

  @Field()
  @Column({ type: "int", default: 0 })
  points!: number;

  @Field(() => Int, { nullable: true })
  @Column("int", {
    nullable: true,
    select: false,
  }) // workaround to have  a computed column since it's not supported yet
  voteStatus: number | null; // 1 or -1 or null

  @Field()
  @Column()
  creatorId!: number;

  @Field()
  @ManyToOne(() => User, (creator) => creator.posts)
  creator: User;

  @OneToMany(() => Updoot, (updoot) => updoot.post)
  updoots: Updoot[];
}

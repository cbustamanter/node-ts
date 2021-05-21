import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, ManyToOne } from "typeorm";
import { EntityWithBase, EntityWithDates } from "./mixins/EntityManager";
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
  points: number;

  @Field()
  @Column()
  creatorId!: number;

  @ManyToOne(() => User, (creator) => creator.posts)
  creator: User;
}

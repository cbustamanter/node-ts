import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, OneToMany } from "typeorm";
import { EntityWithDates, EntityWithBase } from "./mixins/EntityManager";
import { Post } from "./Post";

@ObjectType()
@Entity()
export class User extends EntityWithDates(EntityWithBase(BaseEntity)) {
  @Field(() => String)
  @Column({ unique: true })
  username!: string;

  @Field(() => String)
  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @OneToMany(() => Post, (post) => post.creator)
  posts: Post[];
}

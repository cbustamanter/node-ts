import { Entity, Property, PrimaryKey } from "@mikro-orm/core";
import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class User {
  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Field(() => String)
  @Property({ type: "date" })
  createdAt = new Date();

  @Field(() => String)
  @Property({ onUpdate: () => new Date(), type: "date" })
  updateAt = new Date();

  @Field(() => String)
  @Property({ type: "text", unique: true })
  username!: string;

  @Field(() => String)
  @Property({ type: "text", unique: true })
  email!: string;

  @Property({ type: "text" })
  password!: string;
}

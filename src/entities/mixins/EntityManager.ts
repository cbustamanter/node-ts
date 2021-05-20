import { Field, Int, ObjectType } from "type-graphql";
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

//Generic constructor
export type Constructor<T = {}> = new (...args: any[]) => T;

export function EntityWithBase<TBase extends Constructor>(Base: TBase) {
  @ObjectType()
  abstract class AbstractBase extends Base {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id!: number;
  }
  return AbstractBase;
}

export function EntityWithDates<TBase extends Constructor>(Base: TBase) {
  @ObjectType()
  abstract class AbstractBase extends Base {
    @Field()
    @CreateDateColumn()
    createdAt: Date;

    @Field()
    @UpdateDateColumn()
    updateAt: Date;
  }
  return AbstractBase;
}

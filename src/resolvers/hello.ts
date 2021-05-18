import { Resolver, Query } from "type-graphql";

@Resolver()
export class HelloResolver {
  @Query(() => String)
  test() {
    return "Response from graphql";
  }
}

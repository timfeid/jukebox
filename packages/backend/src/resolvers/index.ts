import { NonEmptyArray } from "type-graphql";
import { SearchResolver } from "./search.resolver";
import { PlayerResolver } from "./player.resolver";

export const resolvers: NonEmptyArray<Function> = [
  SearchResolver,
  PlayerResolver,
]

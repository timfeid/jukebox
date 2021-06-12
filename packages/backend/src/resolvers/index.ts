import { NonEmptyArray } from "type-graphql";
import { SearchResolver } from "./search.resolver";
import { PlayerResolver } from "./player.resolver";
import { SongResolver } from "./song.resolver";

export const resolvers: NonEmptyArray<Function> = [
  SearchResolver,
  PlayerResolver,
  SongResolver,
]

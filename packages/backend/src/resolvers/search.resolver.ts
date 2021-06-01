import { PrismaClient } from ".prisma/client";
import { Arg, Query, Resolver } from "type-graphql";
import { API } from "@gym/ytm-api";
import { SearchResult } from "../schema/search";

@Resolver(SearchResult)
export class SearchResolver {
  @Query(returns => [SearchResult])
  async search(@Arg('input') input: string) {
    const results = await API.search(input)

    return results.filter(result => !!result.youtubeId)
  }
}

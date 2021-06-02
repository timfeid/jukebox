import { PrismaClient } from ".prisma/client";
import { Arg, Query, Resolver } from "type-graphql";
import { API } from "@gym/ytm-api";
import { SearchResult } from "../schema/search";
import { prisma } from '../prisma-client'
import { Suggestion } from "../schema/suggestion";

@Resolver(SearchResult)
export class SearchResolver {
  @Query(returns => [SearchResult])
  async search(@Arg('input') input: string) {
    const results = await API.search(input)

    await prisma.previousSearches.upsert({
      create: {
        query: input,
      },
      update: {
        updatedAt: new Date(),
      },
      where: {
        query: input,
      },
    })

    return results.filter(result => !!result.youtubeId)
  }

  @Query(returns => [Suggestion])
  async suggestions(@Arg('input') input: string) {
    try {

      const results = await API.suggestion(input)

      return results
    } catch (e) {
      console.error(e)

      return []
    }
  }
}

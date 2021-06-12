import { PrismaClient } from ".prisma/client";
import { Arg, Query, Resolver } from "type-graphql";
import { API } from "@gym/ytm-api";
import { prisma } from '../prisma-client'
import { Suggestion } from "../schema/suggestion";
import { PlayedSong } from "../schema/played-song";

@Resolver(PlayedSong)
export class SongResolver {
  @Query(returns => [PlayedSong])
  async mostPopularSongs(@Arg('take', {defaultValue: 10}) take: number) {
    return await prisma.previousPlays.findMany({
      orderBy: {
        total: 'desc',
      },
      take,
    })
  }
}

import { PrismaClient } from ".prisma/client";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { API } from "@gym/ytm-api";
import { prisma } from '../prisma-client'
import { Suggestion } from "../schema/suggestion";
import { PlayedSong } from "../schema/played-song";
import { Context } from "koa";
import { User } from "../schema/user";
import Container, { Service } from "typedi";
import { UserService } from "../services/user.service";

@Resolver(User)
@Service()
export class UserResolver {
  constructor (private readonly userService = Container.get(UserService)) {}

  @Query(returns => User)
  async user(@Ctx() ctx: Context, @Arg('take', {defaultValue: 10}) take: number) {
    return this.userService.getUser(ctx.ip)
  }

  @Mutation(returns => User)
  async setUserName(@Ctx() ctx: Context, @Arg('name') name: string) {
    return {
      name,
      mac: 'something different',
    }
  }
}

import 'reflect-metadata'
import { ApolloServerTestClient } from "apollo-server-testing"
import { createTestClient } from 'apollo-server-testing'
import { createApolloServer } from "../src/apollo-server"
import { PrismaClient } from '.prisma/client'

let testClient: ApolloServerTestClient
export const prisma = new PrismaClient()

export async function init () {
  testClient = createTestClient(await createApolloServer())
}

export {
  testClient
}

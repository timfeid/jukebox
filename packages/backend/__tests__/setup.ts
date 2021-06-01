import 'reflect-metadata'
import { init } from "./test-client"
import dotenv from 'dotenv'

before(async () => {
  dotenv.config()
  await init()
})

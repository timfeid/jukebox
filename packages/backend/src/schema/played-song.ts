import { ArgsType, Field, ObjectType } from 'type-graphql'
import { SearchResult } from './search'

@ObjectType()
export class PlayedSong extends SearchResult {
  @Field()
  total: number
}

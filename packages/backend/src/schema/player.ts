import { Field, ObjectType } from 'type-graphql'
import { SearchResult } from './search'

@ObjectType()
export class PlayerResult {
  @Field(type => SearchResult, {nullable: true})
  currentSong?: SearchResult

  @Field(type => [SearchResult])
  queue: SearchResult[]
}

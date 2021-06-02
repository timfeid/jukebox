import { Field, ObjectType } from 'type-graphql'
import { CurrentSong } from './current-song'
import { SearchResult } from './search'

@ObjectType()
export class PlayerResult {
  @Field(type => CurrentSong, {nullable: true})
  currentSong?: CurrentSong

  @Field(type => [SearchResult])
  queue: SearchResult[]
}

import { Field, ObjectType } from 'type-graphql'
import { CurrentSong } from './current-song'
import { SearchResult } from './search'

@ObjectType()
export class User {
  @Field()
  name: string

  @Field()
  mac: string
}

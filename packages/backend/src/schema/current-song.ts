import { ArgsType, Field, ObjectType } from 'type-graphql'
import { SearchResult } from './search'

@ObjectType()
export class CurrentSong extends SearchResult {
  constructor (data: Partial<SearchResult> = {}) {
    super()
    Object.assign(this, data)
  }

  @Field()
  timeElapsed: number

  @Field()
  totalTime: number
}

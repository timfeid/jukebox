import { ArgsType, Field, ObjectType } from 'type-graphql'
import { SearchResult as BaseSearchResult } from '@gym/ytm-api'

@ObjectType()
@ArgsType()
export class SearchResult implements BaseSearchResult {
  @Field()
  title: string

  @Field()
  album: string

  @Field()
  albumArt: string

  @Field()
  artist: string

  @Field()
  youtubeId: string
}

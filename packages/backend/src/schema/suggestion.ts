import { ArgsType, Field, ObjectType } from 'type-graphql'
import { Run as BaseRun, Suggestion as BaseSuggestion } from '@gym/ytm-api/src/api/parse/suggestions'

@ObjectType()
export class Run implements BaseRun {
  @Field()
  text: string

  @Field({ nullable: true })
  bold: boolean | null
}

@ObjectType()
export class Suggestion implements BaseSuggestion {
  @Field(_ => [Run])
  runs: Run[]

  @Field()
  query: string
}


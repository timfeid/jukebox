export type Run = {
  text: string
  bold?: boolean
}

export type Suggestion = {
  query: string
  runs: Run[]
}

export function parseSuggestions(rawResults: any) {
  const suggestions: Suggestion[] = []

  if (rawResults && rawResults.contents) {
    for (const data of (rawResults.contents[0]?.searchSuggestionsSectionRenderer?.contents || [])) {
      suggestions.push({
        query: data.searchSuggestionRenderer.navigationEndpoint.searchEndpoint.query,
        runs: data.searchSuggestionRenderer.suggestion.runs,
      })
    }
  }

  return suggestions
}

export type Run = {
  text: string
  bold?: boolean
}

export type Suggestion = {
  query: string
  runs: Run[]
}

function parseContent(contents: any) {
  const results: Suggestion[] = []
  if (contents) {
    for (const content of contents) {
      for (let music of content.musicShelfRenderer.contents) {
        music = music.musicResponsiveListItemRenderer
        results.push({
          query: '',
          runs: [],
          // title: music.flexColumns[0].musicResponsiveListItemFlexColumnRenderer.text.runs[0].text,
          // albumArt: music.thumbnail.musicThumbnailRenderer.thumbnail.thumbnails.pop().url,
          // album: music.flexColumns[1].musicResponsiveListItemFlexColumnRenderer.text.runs[2]?.text,
          // artist: music.flexColumns[1].musicResponsiveListItemFlexColumnRenderer.text.runs[0].text,
          // youtubeId: music.flexColumns[0].musicResponsiveListItemFlexColumnRenderer.text.runs[0].navigationEndpoint?.watchEndpoint?.videoId,
        })
      }
    }
  }

  return results
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

export type SearchResult = {
  title: string
  album: string
  albumArt: string
  artist: string
  youtubeId: string
}

function parseContent(contents: any) {
  const results: SearchResult[] = []
  if (contents) {
    for (const content of contents) {
      if (content?.musicShelfRenderer?.contents) {
        for (let music of content.musicShelfRenderer.contents) {
          music = music.musicResponsiveListItemRenderer
          results.push({
            title: music.flexColumns[0].musicResponsiveListItemFlexColumnRenderer.text.runs[0].text,
            albumArt: music.thumbnail.musicThumbnailRenderer.thumbnail.thumbnails.pop().url,
            album: music.flexColumns[1].musicResponsiveListItemFlexColumnRenderer.text.runs[2]?.text,
            artist: music.flexColumns[1].musicResponsiveListItemFlexColumnRenderer.text.runs[0].text,
            youtubeId: music.flexColumns[0].musicResponsiveListItemFlexColumnRenderer.text.runs[0].navigationEndpoint?.watchEndpoint?.videoId,
          })
        }
      }
    }
  }

  return results
}

export function parseSearch(rawResults: any) {
  const results: SearchResult[] = []

  if (rawResults.contents.tabbedSearchResultsRenderer?.tabs) {

    for (const tab of rawResults.contents.tabbedSearchResultsRenderer.tabs) {
      const contents = tab.tabRenderer.content.sectionListRenderer.contents
      return parseContent(contents)
    }
  } else {
    return parseContent(rawResults.contents.sectionListRenderer.contents)
  }

  return results
}

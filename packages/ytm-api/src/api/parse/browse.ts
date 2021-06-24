import { SearchResult } from "./search"

function parseContent(contents: any) {
  const results: SearchResult[] = []
  if (contents) {
    for (const content of contents) {
      for (let music of content.musicPlaylistShelfRenderer.contents) {
        music = music.musicResponsiveListItemRenderer
        results.push({
          title: music.flexColumns[0].musicResponsiveListItemFlexColumnRenderer.text.runs[0].text,
          albumArt: music.thumbnail.musicThumbnailRenderer.thumbnail.thumbnails.pop().url,
          album: music.flexColumns[2]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs ? music.flexColumns[2]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs[0].text : '',
          artist: music.flexColumns[1].musicResponsiveListItemFlexColumnRenderer.text.runs[0].text,
          youtubeId: music.flexColumns[0].musicResponsiveListItemFlexColumnRenderer.text.runs[0].navigationEndpoint?.watchEndpoint?.videoId,
        })
      }
    }
  }

  return results
}

export function parseBrowse(rawResults: any) {
  const results: SearchResult[] = []

  if (rawResults.contents.singleColumnBrowseResultsRenderer?.tabs) {

    for (const tab of rawResults.contents.singleColumnBrowseResultsRenderer.tabs) {
      const contents = tab.tabRenderer.content.sectionListRenderer.contents
      return parseContent(contents)
    }
  } else {
    return parseContent(rawResults.contents.sectionListRenderer.contents)
  }

  return results
}

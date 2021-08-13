import { createRequest } from "./create-request"
import { parseBrowse } from "./parse/browse"


export async function browse(browseId: string) {
  try {
    const response = await createRequest('browse', {
      browseId,
      browseEndpointContextSupportedConfigs: {
        browseEndpointContextMusicConfig: {
          pageType: 'MUSIC_PAGE_TYPE_PLAYLIST',
        },
      },
    })
    // console.log(response.data.responseContext.serviceTrackingParams[0].params)
    // console.log(response.data.header.musicDetailHeaderRenderer.title.runs)
    // console.log(response.data.header.musicDetailHeaderRenderer.subtitle.runs)
    return parseBrowse(response.data)
  } catch (e) {
    console.error(e)
    console.log(e.response.data.error.errors)
  }
}

import axios, { AxiosRequestConfig } from "axios"
import { USER_AGENT, YTM_DOMAIN, YTM_ENDPOINT, YTM_PARAMS } from "../config"
import { generateAuthToken } from "../helpers"

let ytcfg: Record<string, any> = {}

function createApiContext() {
  return {
    capabilities: {},
    client: {
        clientName: ytcfg.INNERTUBE_CLIENT_NAME,
        clientVersion: ytcfg.INNERTUBE_CLIENT_VERSION,
        gl: ytcfg.GL,
        hl: ytcfg.HL,
    },
    request: { internalExperimentFlags: [], sessionIndex: '0' },
    user: {
        enableSafetyMode: false,
    },
  }

}

const defaultHeaders: Record<string, string> = {
  'Content-Type': 'application/json',
  'origin': YTM_DOMAIN,
  'user-agent': USER_AGENT,
  'cookie': process.env.COOKIE,
}

async function initalize() {
  const authHeader = generateAuthToken(process.env.COOKIE)

  const headers = Object.assign({}, defaultHeaders)

  if (authHeader) {
    headers.authorization = authHeader
  }

  const res = await axios.get(YTM_DOMAIN, {
    headers,
  })

  res.data.split('ytcfg.set(').map(v => {
    try {
        return JSON.parse(v.split(');')[0])
    } catch (_) {}
  }).filter(Boolean).forEach(cfg => (ytcfg = Object.assign(cfg, ytcfg)))
}

export async function createRequest(url: string, data: Record<string, any>, asAnonymous = false) {
  let headers = Object.assign({}, defaultHeaders)
  if (!ytcfg.VISITOR_DATA) {
    await initalize()
  }
  if (!asAnonymous) {
    const authHeader = generateAuthToken(process.env.COOKIE)
    if (authHeader) {
      headers = Object.assign({
        'authorization': authHeader,
        'x-origin': YTM_DOMAIN,
        'X-Goog-Visitor-Id': ytcfg.VISITOR_DATA || '',
      }, defaultHeaders)
    }
  }

  const context = createApiContext()

  try {

    return await axios.post(`${YTM_ENDPOINT}${url}`, {
      ...data,
      context,
    }, {
      params: YTM_PARAMS,
      headers,
    })
  } catch (e) {
    console.log(e.response.data)
  }
}

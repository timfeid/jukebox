import { YTM_DOMAIN } from "./config"
import cookie from 'cookie'
import crypto from 'crypto'

export function generateAuthToken (cookies: string) {
  try {

    cookies = cookie.parse(cookies)

    const dateTime = Math.round((new Date()).getTime() / 1000)

    const before = [
      dateTime,
      cookies['__Secure-3PAPISID'],
      YTM_DOMAIN,
    ]

    const sha = crypto.createHash('sha1')
    sha.update(before.join(' '))

    const boo = sha.digest('hex')

    return `SAPISIDHASH ${dateTime}_${boo}`
  } catch (e) {
    // console.log(e)
    return ''
  }
}

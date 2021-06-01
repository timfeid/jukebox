import dotenv from 'dotenv'

dotenv.config()

// search('bring me the horizon').then(results => {
//   console.log(results)
// })


export { API } from './api'
export { SearchResult } from './api/parse/search'

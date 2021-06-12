import { fetch, request } from "../fetcher/graphql"
import SongCard from "./SongCard"

export default function TopSongs ({topSongs}) {

  const { data, error } = fetch(`
    query {
      mostPopularSongs(take: 9) {
        title
        artist
        album
        albumArt
        total
      }
    }
  `)

  if (!data) {
    return <div></div>
  }

  return (
    <div className="grid grid-rows-3 grid-flow-col justify-between w-full">
      {data.mostPopularSongs.map((song, index) => (
        <div key={index} className="flex items-center" style={{width: 'auto'}}>
          <div className="text-5xl mr-8 pb-4 text-pink-300 text-center" style={{opacity: .2, fontFamily: 'Squada One', width: '3rem', minWidth: '3rem'}}>
            {(index+1).toString().padStart(2, '0')}
          </div>
          <div className="pb-4 mr-2">
            <SongCard {...song} />
          </div>
        </div>
      ))}
    </div>
  )
}

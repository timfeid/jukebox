import { usePlayerContext } from "../context/player.context"
import { fetch, request } from "../fetcher/graphql"
import SongCard from "./SongCard"

export default function TopSongs ({topSongs}) {

  const player = usePlayerContext()
  const { data, error } = fetch(`
    query {
      mostPopularSongs(take: 12) {
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
    <div style={{gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', maxHeight: player.state.currentSong ? '16rem' : '22rem'}} className="grid justify-between w-full">
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

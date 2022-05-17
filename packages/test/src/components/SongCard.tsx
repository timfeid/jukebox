type Props = {
  className?: string
  albumArt: string
  artist: string
  title: string
  album: string
}
export default function SongCard (song: Props) {
  return (
    <div class={`flex ${song.className}`}>
      <img class="mr-4" src={song.albumArt} width="60" height="60" />
      <div class="flex flex-col justify-center">
        <div class="text-blue-100 font-light leading-5">
          {song.artist} - {song.title}
        </div>
        <div class="text-gray-500 font-light text-sm leading-5">
          {song.album}
        </div>
      </div>
    </div>
  )
}

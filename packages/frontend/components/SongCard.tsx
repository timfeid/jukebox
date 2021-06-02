export default function SongCard ({title, artist, albumArt, album, className = undefined}) {
  return (
    <div className={`flex ${className}`}>
      <img className="mr-4" src={albumArt} width="60" height="60" />
      <div className="flex flex-col justify-center">
        <div className="text-blue-100 font-light leading-5">
          {artist} - {title}
        </div>
        <div className="text-gray-500 font-light text-sm leading-5">
          {album}
        </div>
      </div>
    </div>
  )
}

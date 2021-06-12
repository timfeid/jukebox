import Styles from '../styles/SongImage.module.scss'

export default function SongCard ({title, artist, albumArt, album, className = undefined}) {
  albumArt = albumArt.replace(/w120-h120/, 'w400-h400')
  return (
    <div className={`flex ${Styles.card} ${className}`}>
      <div className={Styles.imageContainer}>
        <img className={Styles.image} src={albumArt} width="200" height="200" />
        <img className={Styles.imageOverlay} src={albumArt} width="200" height="200" />

      </div>
      <div className="flex flex-col justify-center">
        <div className={Styles.title}>
          {title}
        </div>
        <div className={Styles.artist}>
          {artist}
        </div>
        <div className={Styles.album}>
          {album}
        </div>
      </div>
    </div>
  )
}

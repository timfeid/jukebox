import Styles from '../styles/SongImage.module.scss'

export default function SongCard ({title, artist, albumArt, album, className = undefined}) {
  return (
    <div className={`flex ${className}`}>
      <div>
        <div className={`${Styles.imageContainer}`} style={{marginRight: '1rem', width: '60px', minWidth: '60px'}}>
          <img className={Styles.image} src={albumArt} width="60" height="60" style={{width: '60px!important', height: '60px'}} />
          <img className={Styles.imageOverlay} src={albumArt} width="60" height="60" style={{width: '60px!important', height: '60px'}} />

        </div>
      </div>
      <div className="flex flex-col justify-center">
        <div className="text-blue-100 leading-5">
          {title}
        </div>
        <div className="text-blue-100 font-light text-sm leading-5" style={{opacity: .7}}>
          {artist}
        </div>
      </div>
    </div>
  )
}

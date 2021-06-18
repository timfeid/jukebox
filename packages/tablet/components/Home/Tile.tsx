import Styles from '../../styles/Tile.module.scss'

export default function Tile ({children, title}) {

  return (
    <div className={Styles.tile}>
      <div className={Styles.title}>
        {title}
      </div>
      <div className={Styles.tileContainer}>
        {children}
      </div>
    </div>
  )
}

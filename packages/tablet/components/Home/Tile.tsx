import Styles from '../../styles/Tile.module.scss'

export default function Tile ({children, title, colSpan, rowSpan}: {children: any, title: string, colSpan?: number, rowSpan?: number}) {
  const classNames = [Styles.tile]

  if (colSpan) {
    classNames.push(`col-span-${colSpan}`)
  }

  if (rowSpan) {
    classNames.push(`row-span-${rowSpan}`)
  }

  return (
    <div className={classNames.join(' ')}>
      <div className={Styles.title}>
        {title}
      </div>
      <div className={Styles.tileContainer}>
        {children}
      </div>
    </div>
  )
}

import { layerTypeName } from './layerTypeNames'

type LayerListItemProps = {
  title: string
  layerType: string
  visible: boolean
  selected: boolean
  onToggle: () => void
  onSelect: () => void
}

export function LayerListItem({ title, layerType, visible, selected, onToggle, onSelect }: LayerListItemProps) {
  return (
    <li className={selected ? 'layer-row selected' : 'layer-row'}>
      <input type="checkbox" checked={visible} onChange={onToggle} aria-label={`Show ${title}`} />
      <button className="layer-row-button" onClick={onSelect}>
        <span className="layer-title">{title}</span>
        <small>{layerTypeName(layerType)}</small>
      </button>
    </li>
  )
}

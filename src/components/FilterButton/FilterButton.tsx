import React, { FC } from 'react'

import './FilterButton.css'

interface FilterButtonProps {
  title: string
  onClick: () => void
  sortingDirection?: string
}

const FilterButton: FC<FilterButtonProps> = ({
  title,
  onClick,
  sortingDirection,
}) => {
  return (
    <button onClick={onClick} className='Button'>
      {title}
      {sortingDirection}
    </button>
  )
}

export default FilterButton

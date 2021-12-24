import React, { FC } from 'react'

import './CountryCard.css'

export interface CountryProps {
  name: string
  region: string
  area: number
}

const CountryCard: FC<CountryProps> = ({ name, region, area }) => {
  return (
    <div className='CountryCard'>
      <p className='InfoText' id='name'>
        {name}
      </p>
      <p className='InfoText' id='region'>
        Region: {region}
      </p>
      <p className='InfoText' id='area'>
        Area size: {area} km&sup2;
      </p>
    </div>
  )
}

export default CountryCard

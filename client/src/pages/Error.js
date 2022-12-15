import React from 'react'

import pikachu from '../images/sad-pikachu.gif';

export default function Error() {
  return (
    <div className='error'>
      <img src={pikachu} alt={"picture not found"} className="cryingpikachu"></img>
        <h2>Looks like we ran into an error... try again.</h2>
    </div>
  )
}

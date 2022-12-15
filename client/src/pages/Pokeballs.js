import React from 'react';
import { Link } from "react-router-dom";

export default function Pokeballs() {
    return (
        <div className='contentwrapper'>
            <h1>Poke Balls</h1>
            <div className='outerbox'>
                <Link to="/PokeBalls/standard"><div className='innerbox'>Standard Poke Balls</div></Link>
                <Link to="/PokeBalls/special"><div className='innerbox'>Special Poke Balls</div></Link>
                <Link to="/PokeBalls/apricorn"><div className='innerbox'>Apricorn Poke Balls</div></Link>
            </div>
        </div>
    )
}

<Link to="/PokeBalls">Poke-Balls</Link>

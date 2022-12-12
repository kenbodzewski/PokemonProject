import React from 'react';
import { Link } from "react-router-dom";

export default function Pokeballs() {
    return (
        <div className='contentwrapper'>
            <h1>PokeBalls</h1>
            <div className='outerbox'>
                <Link to="/PokeBalls/standard"><div className='innerbox'>Standard PokeBalls</div></Link>
                <Link to="/PokeBalls/special"><div className='innerbox'>Special PokeBalls</div></Link>
                <Link to="/PokeBalls/apricorn"><div className='innerbox'>Apricorn PokeBalls</div></Link>
            </div>
        </div>
    )
}

<Link to="/PokeBalls">Poke-Balls</Link>

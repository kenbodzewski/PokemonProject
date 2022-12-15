import React from 'react'
import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

import pokeball from '../images/pokeball.png';
import '../styles/Balls.css';

export default function Balls({ url }) {
    const [ state, setState ] = useState([]);
    const navigate = useNavigate();
    
    useEffect(() => {
        fetch(url)
            .then((res) => {
                if (!res.ok){
                    throw new Error();
                } else {
                    return res;
                }
            })
            .then(response => response.json())
            .then(json => setState(json.items))
            .catch(() => navigate("/error"));
    }, [])
    
    const balltype = url.split("/");

    return (
        <div className='contentwrapper'>
            <Link to="/PokeBalls" className='back'>&lt; Back to Poke Balls</Link> 
            <h1>{ balltype[ balltype.length - 1 ].toUpperCase() }</h1>
            <div className='ballscontainer'>
                {state.map((ballInfo) => {
                    return <Ball ballInfo={ ballInfo } key={ ballInfo.name } />
                })}
            </div>
        </div>
    )
}

function Ball({ ballInfo }) {
    const name = ballInfo.name;

    const [ state, setState ] = useState({
        description: "",
        img: ""
    });

    const balldetails = async () => {
        try {
            const response = await fetch( ballInfo.url );
            const json = await response.json();

            const description = json.effect_entries[0].effect;
            const img = json.sprites.default;

            setState({
                description: description,
                img: img
            });
        } catch (error) {
            // navigate("/error");
            setState({
                description: "could not retrieve ball",
                img: pokeball
            });
        }
    };

    useEffect(() => {
        balldetails()
    }, []) // do not remove empty array or infinite fetch loop occurs

    return(
        <div className='ballcontainer'>
            <div className='spritecontainer'>
                <img src={state.img} alt="Ball" className='sprite' />
            </div>
            <h3>{ name.toUpperCase() }</h3>
            <div>{ state.description }</div>
        </div>     
    )
}

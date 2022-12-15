// external imports
import React from 'react'
import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

// internal imports
import pokeball from '../images/pokeball.png';
import '../styles/Balls.css';

// retrieves all the pokeballs of a given category: special, standard, apricorn
export default function Balls({ url }) {
    // state for holding a list of pokeballs containing a name and a URL to detailed data
    const [ state, setState ] = useState([]);
    // use navigate on error
    const navigate = useNavigate();
    
    // called on component render
    useEffect(() => {
        // fetch all the pokeballs of a given category using the passed in URL
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
            .catch(() => navigate("/error")); // if there is an error navigate to error page because no balls can be retrieved
    }, [])
    
    // grab the name of ball category
    const balltype = url.split("/");

    return (
        <div className='contentwrapper'>
            <Link to="/PokeBalls" className='back'>&lt; Back to Poke Balls</Link> 
            <h1>{ balltype[ balltype.length - 1 ].toUpperCase() }</h1>
            {/* map through the list of balls and for each ball call the Ball component with pased in prop */}
            <div className='ballscontainer'>
                {state.map((ballInfo) => {
                    return <Ball ballInfo={ ballInfo } key={ ballInfo.name } />
                })}
            </div>
        </div>
    )
}

// displays a single ball by using the passed in ballInfo to make 
// a fetch call to retrieve the rest of the info needed
function Ball({ ballInfo }) {
    // create a variable for the name of the ball
    const name = ballInfo.name;
    // have a default img url and description
    const [ state, setState ] = useState({
        description: "",
        img: ""
    });

    // retrieve all of the ball details using the url from the passed in prop
    const balldetails = async () => {
        try {
            const response = await fetch( ballInfo.url );
            // dont need to explicitly throw error because if fetch fails the below line will
            const json = await response.json();
            const description = json.effect_entries[0].effect;
            const img = json.sprites.default;
            // set the state using the info retrieved above
            setState({
                description: description,
                img: img
            });
        } catch (error) { // if an error is thrown, rather than navigating away, fill the ball properties with dummy data
            setState({
                description: "could not retrieve ball",
                img: pokeball
            });
        }
    };

    // call balldetails on component render
    useEffect(() => {
        balldetails()
    }, []) // do not remove empty array or infinite fetch loop occurs

    return(
        <div className='ballcontainer'>
            <div className='spritecontainer'>
                <img src={state.img} alt="Ball" className='sprite' />
            </div>
            {/* display the name in all caps, it looks better */}
            <h3>{ name.toUpperCase() }</h3> 
            <div>{ state.description }</div>
        </div>     
    )
}

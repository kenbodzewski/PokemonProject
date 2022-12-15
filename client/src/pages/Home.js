import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

import Pokemon from '../components/Pokemon';
import '../styles/Pokemon.css';
import pokeball from '../images/pokeball.png';

export default function Home() {
	const navigate = useNavigate();

	const [ url, setUrl ] = useState('https://pokeapi.co/api/v2/pokemon/?offset=0&limit=52');
	const [ pokemons, setPokemons ] = useState([]);
	const [ next, setNext ] = useState([]);
	const [ prev, setPrev ] = useState([]);

	const getPokemons = async () => {
        try {
            const response = await fetch(url);
            const json = await response.json();
            setPokemons(json.results);
			setNext(json.next);
			setPrev(json.previous);
			if (json.next === null){
				setPrev(json.previous.replace("limit=10", "limit=52").replace("offset=1134", "offset=1092"));
			}
        } catch (error) {
            // console.log({ message: error.message });
			navigate("/error");
        }  
    };

	useEffect(() => {
		getPokemons();
		// brings you to top of page when changing pages
		window.scrollTo(0, 0);
	}, [url]) // everytime url changes (next and prev buttons) then useEffect runs, in our case calling the getPokemons function
	
	const nextPage = () => {
		setUrl(next);
	}

	const prevPage = () => {
		setUrl(prev);
	}
	
	function page(num) {
		setUrl('https://pokeapi.co/api/v2/pokemon/?offset=' + ((num - 1) * 52) + '&limit=52')
	}

	let pageList = [];

	for (let i = 1; i < 24; i++){
		pageList.push(
			<button key={ i } onClick={ () => page(i) } className='button'>{ 
                <>
                    <img src={ pokeball } alt='Pokeball' className='pagenumber'/>
                    <p className='pagenumber'> {i} </p>
                </>
            }</button>
		)
	}

	return (
		<div className='outerbox'>
			{pokemons.map(pokemon => {
				return <Pokemon key={ pokemon.name } url={ pokemon.url }></Pokemon>
			})}
			<div className='buttoncontainer'>
				{prev != null && 
					<button onClick={ prevPage } className="button">&lt; Prev</button>
				}
				{ pageList }
				{next != null &&
					<button onClick={ nextPage } className="button">Next &gt;</button>
				}
			</div>
		</div>
	)
}

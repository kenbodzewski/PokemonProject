// external imports
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

// internal imports
import Pokemon from '../components/Pokemon';
import '../styles/Pokemon.css';
import pokeball from '../images/pokeball.png';

// component for the Home page that displays all the Pokemon
export default function Home() {
	// need to be able to navigate on error
	const navigate = useNavigate();

	// states for all of the info we need 
	const [ url, setUrl ] = useState('https://pokeapi.co/api/v2/pokemon/?offset=0&limit=52');
	const [ pokemons, setPokemons ] = useState([]);
	const [ next, setNext ] = useState([]);
	const [ prev, setPrev ] = useState([]);

	// get a list of all the pokemon, this list only contains the name and a URL to a details page
	const getPokemons = async () => {
        try {
            const response = await fetch(url);
			// dont need to explicity throw error because if fetch fails below line will
            const json = await response.json();
            setPokemons(json.results);
			setNext(json.next);
			setPrev(json.previous);
			// had to handle edge case where API changes the limit and offset
			if (json.next === null){
				setPrev(json.previous.replace("limit=10", "limit=52").replace("offset=1134", "offset=1092"));
			}
        } catch (error) {
            // if the above fetch failed we need to navigate to error page because we wont have ANY pokemon
			navigate("/error");
        }  
    };

	// call getPokemons and scroll to the top of the page
	useEffect(() => {
		getPokemons();
		// brings you to top of page when changing pages
		window.scrollTo(0, 0);
	}, [url]) // everytime url changes (next and prev buttons) then useEffect runs, in our case calling the getPokemons function
	
	// set url for next button
	const nextPage = () => {
		setUrl(next);
	}

	// set url for prev button
	const prevPage = () => {
		setUrl(prev);
	}
	
	// create all of the URLs for the page buttons at bottom of page
	function page(num) {
		setUrl('https://pokeapi.co/api/v2/pokemon/?offset=' + ((num - 1) * 52) + '&limit=52')
	}
	let pageList = [];
	// function repeatedly calles the page function (above) with all numbers needed
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

	// show all the pokemon and make links at the bottom of the page for other page navigation
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

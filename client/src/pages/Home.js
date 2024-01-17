// external imports
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

// internal imports
// import useAuth from '../store/Auth';
import Pokemon from '../components/Pokemon';
import '../styles/Pokemon.css';
import pokeball from '../images/pokeball.png';


// component for the Home page that displays all the Pokemon
export default function Home() {
	// const { userProfile } = useAuth();
	const navigate = useNavigate();
	const [ pagination, setPagination ] = useState({
		prev: null, 
		current: 1, 
		next: 2, 
		totalPages: null
		}
	);
	const [ url, setUrl ] = useState(`http://localhost:3001/pokemon/?page=${pagination.current}`);
	const [ pokemons, setPokemons ] = useState([]);
	
    const getPokemon = async () => {
        try {
            const response = await fetch(url);
			// dont need to explicity throw error because if fetch fails below line will
            const json = await response.json();
			setPokemons(json);
		}
		catch (error) {
			navigate("/error")
		}
	}

	useEffect(() => {
		getCount();
		getPokemon();
	}, [url])

	
	const getCount = async () => {
		try {
			const response = await fetch('http://localhost:3001/numpages');
			let count = await response.json();
			count = count.numPages;
		  	setPagination(prevPagination => ({...prevPagination, totalPages: count}));
		} catch (error) {
			navigate("/error")
		}
	};

	const goToPage = (pageNumber) => {
		setUrl(`http://localhost:3001/pokemon/?page=${pageNumber}`);
		window.scrollTo(0, 0);
		let prev;
		let next;
		let current = pageNumber;
		// make sure that next and prev wont go beyond the needed page numbers: -1, or 22
		if (pageNumber === 1){
			prev = null;
		} else{
			prev = pageNumber - 1;
		}
		if (pageNumber === pagination.totalPages){
			next = null;
		} else{
			next = pageNumber + 1;
		}
		setPagination({
			prev: prev, 
			current: current, 
			next: next, 
			totalPages: pagination.totalPages
			}
		)
	}

	let buttonList = [];
	// total number of pokemon divide by 52 then add one page for the remainder
	for (let i = 1; i <= pagination.totalPages ; i++){
		buttonList.push(
			<button key={ i } onClick={ () => goToPage(i) } className='button'>{ 
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
				return <Pokemon key={ pokemon.poke_name } pokemon={ pokemon }></Pokemon>
			})}
			<div className='buttoncontainer'>
				{pagination.prev != null && 
					<button onClick={ () => goToPage(pagination.prev) } className="button">&lt; Prev</button>
				}
				{buttonList}
				{pagination.next != null &&
					<button onClick={ () => goToPage(pagination.next) } className="button">Next &gt;</button>
				}
			</div>
		</div>
	)
}

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
	// change what pokemons contains from a list of Pokemon names and urls, to objects conatining 
	// Pokemon data
	const [ pokemons, setPokemons ] = useState([]);
	// TODO: remove square brackets from useState([])? since this state does not hold an array?
	const [ next, setNext ] = useState();
	const [ prev, setPrev ] = useState();
	const [ count, setCount ] = useState();

	const [ likes, setLikes ] = useState([]);

	// TODO: grab all likes from server side: /likes
	const getLikes = async () => {
		const response = await fetch("http://localhost:3001/likes");
		const json = await response.json();
		// console.log(json)
		setLikes(json)
	}

	// get a list of all the pokemon, this list only contains the name and a URL to a details page
	const setPokemonPrevAndNext = async () => {
        try {
            const response = await fetch(url);
			// dont need to explicity throw error because if fetch fails below line will
            const json = await response.json();

			const pokeList = []

			// instead of just assigning Pokemon a value of pokemon name and urls, assign all the data
			for (const pokemon of json.results){
				const pokeResponse = await fetch(pokemon["url"]);

				// TODO: is this await necessary?
				const pokeJson = await pokeResponse.json();
				const name = pokeJson.name.toUpperCase();
				// set the image url 
				let image = pokeJson.sprites.other["official-artwork"].front_default;
				// if the url is null then set it to default image
				if (pokeJson.sprites.other["official-artwork"].front_default === null) {
					image = pokeball;
				}
				// if there is more than one type then assign both to a string
				let types = pokeJson.types[0].type.name;
				if (pokeJson.types.length === 2){
					types += ", " + pokeJson.types[1].type.name;
				}

				// TODO: ADJUST THIS AS NEW POKEMON HAVE BEEN CREATED total is above 905
				// if the number is over 905 it isnt actually a valid Pokemon number
				let number = pokeJson.id;
				if (Number(pokeJson.id) > 2000){
					number = 'N/A';
				}
				// set the height of the Pokemon
				const height = pokeJson.height;
				// set the weight of the Pokemon
				const weight = pokeJson.weight;

				const likeList = likes.filter(like => like.name == name) 
				// console.log(likeList)

				const tempPoke = {
								name: name,
								image: image,
								types: types,
								number: number,
								height: height,
								weight: weight,
								// temporary
								likes: likes.length
							}
				pokeList.push(tempPoke)
			}

			setPokemons(pokeList)
			setCount(json.count)
			setNext(json.next);
			setPrev(json.previous);
			// had to handle edge case where API changes the limit and offset
			if (json.next === null){
				setPrev(json.previous.replace("limit=2", "limit=52").replace("offset=1298", "offset=1248"));
			}
        } catch (error) {
            // if the above fetch failed we need to navigate to error page because we wont have ANY pokemon
			navigate("/error");
        }  
    };

	// call getPokemons and scroll to the top of the page
	useEffect(() => {
		const asyncFunction = async () => {
			const a = await getLikes();
			const b = await setPokemonPrevAndNext();
		}
		asyncFunction()

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
	// TODO: make sure the math using in the for loop checksout
	// total number of pokemon divide by 52 then add one page for the remainder
	for (let i = 1; i <= Math.floor((count/52) + 1) ; i++){
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
			{/* code to visualize what resides in the likes state and the count of likes */}
			<div>
				<a>
					Count: {likes.length}
				</a>
				<br></br>
				<a>
					{JSON.stringify(likes, null, 2)}
				</a>
			</div>
			{pokemons.map(pokemon => {
				return 	<>
							<div className='pokemoncard'>
								<img src={ pokemon.image } alt={ pokemon.name } className="pokepic" />
								<div className='info'>
									<div className='pokename'>{ pokemon.name }</div>
									<div>{"Pokemon #: " + pokemon.number }</div>
									<div>{"Type(s): " + pokemon.types }</div>
									<div>{"Height: " + (pokemon.height/10) + " meters" }</div>
									<div>{"Weight: " + (pokemon.weight/10) + " kilograms" }</div>
									<div>{"Likes: " + pokemon.likes}</div>
								</div>
							</div>
						</>
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


// const [state1, setState1] = useState([]);
// const [state2, setState2] = useState([]);

// const getState1 = async () => {
// 	const response = await fetch("http://localhost:3001/state1");
// 	const json = await response.json();

// 	const name = json.name;
// 	const height = json.height;

// 	const halfPerson = {
// 		name: name,
// 		height: height
// 	}

// 	setState1(halfPerson)
// }

// const getState2 = async () => {
// 	const response = await fetch("http://localhost:3001/state2");
// 	const json = await response.json();

// 	const weight = json.weight;
// 	const race = json.race;

// 	const wholePerson = {
// 		name: state1.name,
// 		height: state1.height,
// 		weight: weight,
// 		race: race
// 	}

// 	setState2(wholePerson)
// }

// useEffect(() => {
// 	const asyncFunction = async () => {
// 		await getState1();
// 		await getState2();
// 	}
// 	asyncFunction()

// 	// brings you to top of page when changing pages
// 	window.scrollTo(0, 0);
// }, [])
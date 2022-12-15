// external imports
import React from 'react'
import { useState, useEffect } from 'react';
import useAuth from '../store/Auth';
import { useNavigate } from 'react-router-dom';

// internal imports
import pokeball from '../images/pokeball.png';

// this component displays a single pokemon using a passed in url from whatever calls it
export default function Pokemon(props) { // url
	// need to be able to display different view based on whether there is a logged
	// in user and who that user is
	const { userProfile } = useAuth();

	// state for holding all the information needed to properly present a pokemon and its info
	const [ pokemonInfo, setPokemon ] = useState({
		name: "",
		image: "",
		types: "",
		number: "",
		height: "",
		weight: ""
	});

	// retrieves all the necessary informaion on a pokemon using the url prop
	const pokemon = async () => {
		try {
			// fetch pokemon's info
			const response = await fetch(props.url);
			// dont need to explicity throw error because below line will if response is bad
			const json = await response.json();
			// change the string for the name to all uppercase BEFORE using setPokemon
			const name = json.name.toUpperCase();
			// set the image url 
			let image = json.sprites.other["official-artwork"].front_default;
			// if the url is null then set it to default image
			if (json.sprites.other["official-artwork"].front_default === null) {
				image = pokeball;
			}
			// if there is more than one type then assign both to a string
			let types = json.types[0].type.name;
			if (json.types.length === 2){
				types += ", " + json.types[1].type.name;
			} 
			// if the number is over 905 it isnt actually a valid Pokemon number
			let number = json.id;
			if (Number(json.id) > 905){
				number = 'N/A';
			}
			// set the height of the Pokemon
			const height = json.height;
			// set the weight of the Pokemon
			const weight = json.weight;

			// set the pokemon state using all the information retrieved above
			setPokemon({
				name: name,
				image: image,
				types: types,
				number: number,
				height: height,
				weight: weight
			})

		} catch (error) {
			// if there was an error when fetching the Pokemon's info, set its information below
			// this way the component will load with static data, instead of crashing the page
			setPokemon({
				name: "could not fetch Pokemon",
				image: pokeball,
				types: "N/A",
				number: "N/A",
				height: "N/A",
				weight: "N/A"
			})
		}  
	};

	// get the pokemon's information when the component renders
	useEffect(() => {
        pokemon()
    }, [props.url]) // when the prop changes call useEffect, this is used in the search page

  	return (
		// display the Pokemon info
		<div className='pokemoncard'>
			<img src={ pokemonInfo.image } alt={ pokemonInfo.name } className="pokepic" />
			<div className='info'>
				{/* conditional rendering to determine whether likes and buttons should be displayed (only when a user is logged in) */}
				{userProfile ? (
					<Like pokemonName={ pokemonInfo.name } userId={ userProfile._id }/>
				) : (
					<div></div>
				)}
				<div className='pokename'>{ pokemonInfo.name }</div>
				<div>{"Pokemon #: " + pokemonInfo.number }</div>
				<div>{"Type(s): " + pokemonInfo.types }</div>
				<div>{"Height: " + (pokemonInfo.height/10) + " meters" }</div>
				<div>{"Weight: " + (pokemonInfo.weight/10) + " kilograms" }</div>
			</div>
		</div>
  	)
}

// this function displays the total number of likes a pokemon has and conditionally renders
// a like or unlike button based on whether the logged in user has already liked this Pokemon
function Like({ pokemonName, userId }) {
	// logged in user's like on this Pokemon, default 0
	const [ likes, setLikes ] = useState(0);
	// the total number of likes this Pokemon has, default to retrieving because it takes a
	// little while to retrieve all the likes
	const [allLikes, setAllLikes ] = useState('retrieving...');
	// need to be able to nevaigate when some errors are caught
	const navigate = useNavigate();

	// post a like for this user and pokemon
	const like = () => {
		fetch("/like", {
            method: 'POST',
            body: JSON.stringify({
				pokemonName: pokemonName,
				userId: userId
			}),
            headers: {
                'Content-Type': 'application/json'
            }
        })	// if the POST fails throw an error
			.then(res =>{
				if (!res.ok){
					throw new Error();
				} else {
					return res;
				}
			})
			.then(() => findlike())
			.then(() => findlikes())
			// for now if an error is thrown it navigates to an error page, I would like to improve this 
			// in the future but for now there wasn't a simple solution
			.catch(() => navigate("/error"));
	}

	// delete a like for this user and pokemon
	const unlike = () => {
		fetch("/like", {
            method: 'DELETE',
            body: JSON.stringify({
				pokemonName: pokemonName,
				userId: userId
			}),
            headers: {
                'Content-Type': 'application/json'
            }
        })	// if the fetch fails throw an error
			.then(res =>{
				if (!res.ok){
					throw new Error();
				} else {
					return res;
				}
			})
			.then(() => findlike())
			.then(() => findlikes())
			// for now if an error is thrown it navigates to an error page, I would like to improve this 
			// in the future but for now there wasn't a simple solution
			.catch(() => navigate("/error"));
	}

	// find a like associated with logged in user and this Pokemon
	const findlike = async () => {
		// only look for a like if the name is not null or an empty string
		if (pokemonName !== null && pokemonName !== ""){
			const url = '/like/?pokemonName=' + pokemonName + "&userId=" + userId;
			fetch(url)
				.then(res => res.json()) // dont need to explicity throw error because below line will if response is bad
				.then(json => setLikes(json.length))
				.catch(() => setLikes(3)); // if there is an error set likes to an impossible number, conditional rendering will handle this error below
		}
	}

	// find all likes for this Pokemon
	const findlikes = async () => {
		//console.log(pokemonName);
		if (pokemonName !== null && pokemonName !== ""){
			const url = '/like/?pokemonName=' + pokemonName;
			fetch(url)
				.then(res => res.json()) // dont need to explicity throw error because below line will if response is bad
				.then(json => setAllLikes(json.length))
				.catch(() => setAllLikes("could not find likes")); // if error on retrieval, setAllLike to string
		}
	}

	// call findlike and findlikes on render, call again if pokemonName changes
	useEffect(() => {
		findlike();
		findlikes();
	}, [pokemonName])

	return (
		<div className='likecontainer'>
			<div>{"Likes: " + allLikes}</div>
			{/* conditionally render either a like button or unlike button based on whether the logged in user has liked this Pokemon before */}
			{((likes === 0)) ? (<button onClick={ like } className='likebutton'>Like</button>) : 
				((likes === 1) ? (<button onClick={ unlike } className='unlikebutton'>Unlike</button>) : (<div>Could not find like</div>))	
			}
		</div>
	)
}
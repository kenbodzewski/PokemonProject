// external imports
import React from 'react'
import { useState, useEffect } from 'react';
import useAuth from '../store/Auth';
import { useNavigate } from 'react-router-dom';

// internal imports
import pokeball from '../images/pokeball.png';

// this component displays a single pokemon using a passed in url from whatever calls it
export default function Pokemon(props) { // url
    // check to see if there are two types or one and adjust the string accordingly
    let typeText = props.pokemon.type_name_1;
        if (props.pokemon.type_name_2 != null){
            typeText = 'Types: ' + typeText + ', ' + props.pokemon.type_name_2;
        } else {
            typeText = 'Type: ' + typeText;
        }

    return (	
            <>
                <div className='pokemoncard'>
                    {/* TODO: there is one pokemon with no image_url, maybe not worth checking
                    this for all 1000+ pokemon when only one has an issue? */}
                    {props.pokemon.img_url != 'None' ? (
                        <img src={ props.pokemon.img_url } alt={ props.pokemon.poke_name.toUpperCase() } className="pokepic" />
                    ):(
                        <img src={ pokeball } alt={ props.pokemon.poke_name.toUpperCase() } className="pokepic" />
                    )}
                    <div className='info'>
                        <div className='pokename'>{ props.pokemon.poke_name.toUpperCase() }</div>
                        <div>Pokemon #: {props.pokemon.pokemon_id}</div>
                        <div>{ typeText }</div>
                        <div>Height: {props.pokemon.height / 10}  meters</div>
                        <div>Weight: {props.pokemon.weight / 10} kilograms</div>
                        <br></br>
                        <div>Fun fact: {props.pokemon.fun_fact}</div>
                    </div>
                </div>
            </>
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
		fetch("http://localhost:3001/like", {
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
		fetch("http://localhost:3001/like", {
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
			const url = 'http://localhost:3001/like/?pokemonName=' + pokemonName + "&userId=" + userId;
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
			const url = 'http://localhost:3001/like/?pokemonName=' + pokemonName;
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
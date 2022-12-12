import React from 'react'
import { useState, useEffect } from 'react';
import useAuth from '../store/Auth';

import pokeball from '../images/pokeball.png';

export default function Pokemon(props) { // url
	const { userProfile } = useAuth();

	const [ pokemonInfo, setPokemon ] = useState({});

	const [ image, setImage ] = useState("");

	const [ types, setTypes ] = useState("");

	const [ number, setNumber] = useState("");

	const pokemon = async () => {
		try {
			const response = await fetch(props.url);
			const json = await response.json();
			// change the string for the name to all uppercase BEFORE using setPokemon
			json.name = json.name.toUpperCase();
			setPokemon(json);
			setImage(json.sprites.other["official-artwork"].front_default);
			if (json.sprites.other["official-artwork"].front_default === null) {
				setImage(pokeball);
			}
			if (json.types.length === 2){
				setTypes(json.types[0].type.name + ", " + json.types[1].type.name);
			} else {
				setTypes(json.types[0].type.name);
			}
			if (Number(json.id) > 905){
				setNumber('N/A');
			} else {
				setNumber(json.id);
			}
		} catch (error) {
			console.log({ message: error.message });
		}  
	};
	

	useEffect(() => {
        pokemon()
    }, []) // do not remove empty array or infinite fetch loop occurs

  	return (
		<div className='pokemoncard'>
			<img src={ image } alt={ pokemonInfo.name } className="pokepic" />
			<div className='info'>
				{userProfile ? (
					<Like pokemonName={ pokemonInfo.name } userId={ userProfile._id }/>
				) : (
					<div></div>
				)}
				<div className='pokename'>{ pokemonInfo.name }</div>
				<div>{"Pokemon #: " + number }</div>
				<div>{"Type(s): " + types }</div>
				<div>{"Height: " + (pokemonInfo.height/10) + " meters" }</div>
				<div>{"Weight: " + (pokemonInfo.weight/10) + " kilograms" }</div>
			</div>
		</div>	
  	)
}

function Like({ pokemonName, userId }) {
	const [ likes, setLikes ] = useState(0);
	const [allLikes, setAllLikes ] = useState('none');

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
        })
			.then(() => findlike())
			.then(() => findlikes())
	}

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
        })
			.then(() => findlike())
			.then(() => findlikes())
	}

	const findlike = async () => {
		//console.log(pokemonName);
		if (pokemonName != null){
			const url = new URL(`http://localhost:3001/like/`);
			url.search = new URLSearchParams({
				pokemonName: pokemonName,
				userId: userId
			});
			//console.log(url);
			fetch(url)
				.then(res => res.json())
				.then(json => setLikes(json.length))
		}
	}

	const findlikes = async () => {
		//console.log(pokemonName);
		if (pokemonName != null){
			const url = new URL(`http://localhost:3001/like/`);
			url.search = new URLSearchParams({
				pokemonName: pokemonName,
			});
			//console.log(url);
			fetch(url)
				.then(res => res.json())
				.then(json => setAllLikes(json.length))
		}
	}

	useEffect(() => {
		findlike();
		findlikes();
	}, [pokemonName])

	return (
		<div className='likecontainer'>
			<div>{"Likes: " + allLikes}</div>
			{((likes === 0)) ? (<button onClick={ like } className='likebutton'>Like</button>) : 
				((likes === 1) ? (<button onClick={ unlike } className='unlikebutton'>Unlike</button>) : (<div></div>))	
			}
		</div>
	)
}
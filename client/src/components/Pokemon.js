import React from 'react'
import { useState, useEffect } from 'react';
import useAuth from '../store/Auth';

import pokeball from '../images/pokeball.png';

export default function Pokemon(props) { // url
	const { userProfile } = useAuth();

	const [ pokemonInfo, setPokemon ] = useState({
		name: "",
		image: "",
		types: "",
		number: "",
		height: "",
		weight: ""
	});

	const pokemon = async () => {
		try {
			const response = await fetch(props.url);
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
			let number = json.id;
			if (Number(json.id) > 905){
				number = 'N/A';
			}
			// set the height of the Pokemon
			const height = json.height;
			// set the weight of the Pokemon
			const weight = json.weight;

			setPokemon({
				name: name,
				image: image,
				types: types,
				number: number,
				height: height,
				weight: weight
			})

		} catch (error) {
			console.log({ message: error.message });
		}  
	};


	// // setting all the values for the the states of the Pokemon
	// const [ name, setName ] = useState("");
	// const [ image, setImage ] = useState("");
	// const [ types, setTypes ] = useState("");
	// const [ number, setNumber] = useState("");
	// const [ height, setHeight] = useState("");
	// const [ weight, setWeight ] = useState("");

	// const pokemon = async () => {
	// 	try {
	// 		const response = await fetch(props.url);
	// 		const json = await response.json();
	// 		// change the string for the name to all uppercase BEFORE using setPokemon
	// 		setName(json.name.toUpperCase());
	// 		// set the image url 
	// 		setImage(json.sprites.other["official-artwork"].front_default);
	// 		// if the url is null then set it to default image
	// 		if (json.sprites.other["official-artwork"].front_default === null) {
	// 			setImage(pokeball);
	// 		}
	// 		// if there is more than one type then assign both to a string
	// 		if (json.types.length === 2){
	// 			setTypes(json.types[0].type.name + ", " + json.types[1].type.name);
	// 		} else { // otherwise just add the one tupe to the string
	// 			setTypes(json.types[0].type.name);
	// 		}
	// 		// if the Pokemon's ID is over 905 then set this to N/A because its not actually the #
	// 		if (Number(json.id) > 905){
	// 			setNumber('N/A');
	// 		} else { // otherwise just set the number to the Id
	// 			setNumber(json.id);
	// 		}
	// 		// set the height of the Pokemon
	// 		setHeight(json.height);
	// 		// set the weight of the Pokemon
	// 		setWeight(json.weight);
	// 	} catch (error) {
	// 		console.log({ message: error.message });
	// 	}  
	// };
	

	useEffect(() => {
        pokemon()
    }, [props.url]) // when the prop changes call useEffect, this is used in the search page

  	return (
		<div className='pokemoncard'>
			<img src={ pokemonInfo.image } alt={ pokemonInfo.name } className="pokepic" />
			<div className='info'>
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
		// <div className='pokemoncard'>
		// 	<img src={ image } alt={ name } className="pokepic" />
		// 	<div className='info'>
		// 		{userProfile ? (
		// 			<Like pokemonName={ name } userId={ userProfile._id }/>
		// 		) : (
		// 			<div></div>
		// 		)}
		// 		<div className='pokename'>{ name }</div>
		// 		<div>{"Pokemon #: " + number }</div>
		// 		<div>{"Type(s): " + types }</div>
		// 		<div>{"Height: " + (height/10) + " meters" }</div>
		// 		<div>{"Weight: " + (weight/10) + " kilograms" }</div>
		// 	</div>
		// </div>
  	)
}

function Like({ pokemonName, userId }) {
	const [ likes, setLikes ] = useState(0);
	const [allLikes, setAllLikes ] = useState('none');

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
        })
			.then(() => findlike())
			.then(() => findlikes())
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
        })
			.then(() => findlike())
			.then(() => findlikes())
	}

	// 
	const findlike = async () => {
		//console.log(pokemonName);
		if (pokemonName !== null && pokemonName !== ""){
			// const url = new URL(`http://localhost:3001/like/`);
			// url.search = new URLSearchParams({
			// 	pokemonName: pokemonName,
			// 	userId: userId
			// });
			const url = '/like/?pokemonName=' + pokemonName + "&userId=" + userId;
			//console.log(url);
			fetch(url)
				.then(res => res.json())
				.then(json => setLikes(json.length))
		}
	}

	const findlikes = async () => {
		//console.log(pokemonName);
		if (pokemonName !== null && pokemonName !== ""){
			// const url = new URL(`http://localhost:3001/like/`);
			// url.search = new URLSearchParams({
			// 	pokemonName: pokemonName,
			// });
			const url = '/like/?pokemonName=' + pokemonName;
			fetch(url)
				.then(res => res.json())
				.then(json => {
					setAllLikes(json.length)
					json.map(like => {
						if (like.userId === userId){
							setLikes(likes + 1);
						}
					})
				})
		}
	}

	useEffect(() => {
		//findlike();
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
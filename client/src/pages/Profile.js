import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google';

import useAuth from '../store/Auth';
import ForumEntry from '../components/ForumEntry';
import '../styles/Profile.css';

export default function Profile() {
	// allows us to use the userProfile and the removeUser to get user info and logout
	const { userProfile,  removeUser } = useAuth();

	// allows us to create a function for navigating away upon logout
	const navigate = useNavigate();

	// function for navigating home when the logout button is clicked
	const navigateHome = () => {
		navigate("/");
	}

	// function for logging out the user and navigating to /home
	const logoutAndNavigate = () => {
		googleLogout();
		removeUser();
		navigateHome();
	}

	const [ forumEntries, setForumEntries ] = useState([]);

	const getForumEntries = async () => {
		const entry = await fetch("http://localhost:3001/forumEntryForUser/" + userProfile._id);
		const entryJson = await entry.json();
		setForumEntries(entryJson);
		//console.log(entryJson);
	}

	const [ likes, setLikes ] = useState([]);

	const getLikes = async () => {
		const likes = await fetch("http://localhost:3001/likesforuser/" + userProfile._id);
		const likesJson = await likes.json();
		setLikes(likesJson);
		//console.log(likesJson);
	}

	useEffect(() => {
		getForumEntries();
		getLikes();
	}, [])

	return (
		<div className='userprofile'>
			{/* <div className='userinfo'>{"User ID: " + userProfile._id}</div> */}
			<div className='userinfo'>{"User Name: " + userProfile.userName}</div>
			<div className='userinfo'>{"Email: " + userProfile.email}</div>
			<div className='userinfo'>{"Favorite PokeMon: "}</div>
			{likes.map((pokemon) => {
				return (
					<span key={pokemon._id}>{pokemon.pokemonName + ", "}</span>
				)
			})}
			<br/>
			{forumEntries.map((entry) => {
                return (
                    <Link to={"/ForumEntry/" + entry._id } key={ entry._id }>
                        <ForumEntry entry={ entry } key={ entry._id + 1 } />
                    </Link>
                )
            })}
			<button onClick={ logoutAndNavigate } className='logout' >Logout</button>
		</div>
	)
}

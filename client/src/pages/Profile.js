import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google';
import { useForm } from 'react-hook-form';

import useAuth from '../store/Auth';
import ForumEntry from '../components/ForumEntry';
import '../styles/Profile.css';

export default function Profile() {
	// allows us to use the userProfile and the removeUser to get user info and logout
	const { userProfile, addUser, removeUser } = useAuth();
	
	const { register, handleSubmit } = useForm();

	const [ userName, setUserName ] = useState(userProfile.userName);

	const [ userEmail, setUserEmail ] = useState(userProfile.email);

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
		const entry = await fetch("/forumEntryForUser/" + userProfile._id);
		const entryJson = await entry.json();
		setForumEntries(entryJson);
		//console.log(entryJson);
	}

	const [ likes, setLikes ] = useState([]);

	const getLikes = async () => {
		const likes = await fetch("/likesforuser/" + userProfile._id);
		const likesJson = await likes.json();
		setLikes(likesJson);
		//console.log(likesJson);
	}

	useEffect(() => {
		getForumEntries();
		getLikes();
	}, [])

	const onSubmit = (data) => {
		//console.log(userProfile._id);
		fetch(("/user/" + userProfile._id), {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
		}).then(res => res.json())
		.then(user => {
			//console.log(user);
			removeUser();
			addUser(user);
		})
		.then(() => getForumEntries())
	}

	return (
		<>
			<div className='userprofile'>
				<h2>Accout Information</h2>
				{/* <div className='userinfo'>{"User ID: " + userProfile._id}</div> */}
				<div className='userinfo'>{"User Name: " + userProfile.userName}</div>
				<div className='userinfo'>{"Email: " + userProfile.email}</div>

				<form onSubmit={ handleSubmit(onSubmit) } className="editprofile">
					<input { ...register("userName") } 
						// placeholder={}
						value={ userName }
						required
						onChange={ (e) => setUserName(e.target.value) }
						/>
					<input { ...register("email") } 
						value={ userEmail }
						required
						onChange={ (e) => setUserEmail(e.target.value) }
						className='useremail'
						/>
					<input 
						value="Submit Changes"
						type="submit" 
						className="submitinput"
						/>
				</form>

				<h2>Account Activity</h2>
				<div className='userinfo'>{"Favorite PokeMon: "}</div>
				{likes.map((pokemon) => {
					return (
						<span key={pokemon._id}>{pokemon.pokemonName + ", "}</span>
					)
				})}
				{forumEntries.map((entry) => {
					return (
						<Link to={"/ForumEntry/" + entry._id } key={ entry._id }>
							<ForumEntry entry={ entry } key={ entry._id + 1 } />
						</Link>
					)
				})}
				<button onClick={ logoutAndNavigate } className='logout' >Logout</button>
			</div>
		</>
	)
}

// external imports
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google';
import { useForm } from 'react-hook-form';

// internal imports
import useAuth from '../store/Auth';
import ForumEntry from '../components/ForumEntry';
import '../styles/Profile.css';

// component for displaying a logged in user's profile information
export default function Profile() {
	// allows us to create a function for navigating away upon logout
	const navigate = useNavigate();
	
	// allows us to use the userProfile and the removeUser to get user info and logout
	const { userProfile, addUser, removeUser } = useAuth();

	// gives us acces to form hook
	const { register, handleSubmit } = useForm();

	const [ userName, setUserName ] = useState(userProfile.userName);

	const [ userEmail, setUserEmail ] = useState(userProfile.email);

	// function for navigating home when the logout button is clicked
	const navigateHome = () => {
		navigate("/");
	}

	// function for logging out the user and navigating to /home
	const logoutAndNavigate = () => {
		// logout of google
		googleLogout();
		// remove user from our persistent data
		removeUser();
		// navigate to the home page
		navigateHome();
	}

	// state for holding this users forumEntries
	const [ forumEntries, setForumEntries ] = useState([]);

	// get all forum entries this user has made
	const getForumEntries = async () => {
		const entry = await fetch("http://localhost:3001/forumEntryForUser/" + userProfile._id);
		// dont need to explicity throw error because if fetch fails below line will
		// (catch is located in the function that calls this one)
		const entryJson = await entry.json();
		setForumEntries(entryJson);
	}

	// state for holding the names of the pokemon this user has liked
	const [ likes, setLikes ] = useState([]);

	// get all the likes that this user has made
	const getLikes = async () => {
		try{
			const likes = await fetch("http://localhost:3001/likesforuser/" + userProfile._id);
			if (!likes.ok){
				throw new Error('error');
			}
			const likesJson = await likes.json();
			setLikes(likesJson);
		} catch { // if the fetch fails then set the likes info to below:
			setLikes([{
				pokemonName: "could not find your favorite pokemon",
				_id: "123456789"
			}])
		}
		
	}

	// call get forums and getLikes on render
	useEffect(() => {
		try {
			getForumEntries();
			getLikes();
		} catch (error) {
			navigate("/error");
		}	
	}, [])

	// form to update user info is submitted
	const onSubmit = (data) => {
		//console.log(userProfile._id);
		fetch(("http://localhost:3001/user/" + userProfile._id), {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
		})
		// dont need to explicity throw error because if fetch fails below line will
		.then(res => res.json())
		.then(user => {
			removeUser();
			addUser(user);
		})
		.then(() => getForumEntries())
		.catch(() => navigate("/error")) // on error navigate to error page
	}

	return (
		<div className='userprofile'>
			<h2>Account Information</h2>
			{/* <div className='userinfo'>{"User Name: " + userName}</div>
			<div className='userinfo'>{"Email: " + userEmail}</div> */}

			<form onSubmit={ handleSubmit(onSubmit) } className="editprofile">
				<input { ...register("userName") } 
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
			<div className='userinfo'>{"Favorite Pokemon: "}</div>
			{likes.map((pokemon) => {
				return (
					<span key={pokemon._id}>{pokemon.pokemonName + ", "}</span>
				)
			})}
			{forumEntries.map((entry) => {
				return (
					<Link to={"/ForumEntry/" + entry._id } key={ entry._id } className='forumpost'>
						<ForumEntry entry={ entry } key={ entry._id + 1 } />
					</Link>
				)
			})}
			<button onClick={ logoutAndNavigate } className='logout' >Logout</button>
		</div>
	)
}

import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ForumEntry({ entry }) {
	const [ name, setName ] = useState("");
	const navigate = useNavigate();
    
	const getEntry = async () => {
		// const user = await fetch("http://localhost:3001/user/" + entry.authorId);
		//console.log(entry.authorId);
		if (entry.authorId !== ""){
			try {
				const user = await fetch("/user/" + entry.authorId);
				const userJson = await user.json();
				setName(userJson.userName);
			} catch (error) {
				//console.log({ message: error.message });
				navigate("/error");
			}
		}
	}

	useEffect(() => {
		getEntry();
	}, [entry])

    return (
		<div className='forumentry'>
			<div className='forumentryheader'>
				<div className='entryauthor'>{ name }</div>
				<div className='entrydate'>{ new Date(entry.date).toLocaleTimeString()+ " " + new Date(entry.date).toLocaleDateString() }</div>
			</div>
			<div className='entrytitle'>{ entry.entryTitle }</div>
			<div className='entrymessage'>{ entry.entryMessage }</div>
		</div>
    )
}

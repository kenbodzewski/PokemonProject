import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ForumEntry({ entry }) {
	const [ name, setName ] = useState("");
	const navigate = useNavigate();
    
	const getEntry = async () => {
		// only want to make fetch if an authorId exists otherwise fetch fails
		if (entry.authorId !== ""){
			try {
				const user = await fetch("/user/" + entry.authorId);
				const userJson = await user.json();
				setName(userJson.userName);
			} catch {
				setName("author not found");
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

import React from 'react'
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import '../styles/ForumEntry.css';

export default function ForumEntry({ entry }) {
	const [ name, setName ] = useState("");
    
	const getEntry = async () => {
		const user = await fetch("http://localhost:3001/user/" + entry.authorId);
		const userJson = await user.json();
		setName(userJson.userName);
	}

	useEffect(() => {
		getEntry();
	}, [])

    return (
		<div className='forumentry'>
			<div className='forumentryheader'>
				<div className='entryauthor'>{ name }</div>
				<div className='entrydate'>{ entry.date }</div>
			</div>
			<div className='entrytitle'>{ entry.entryTitle }</div>
			<div className='entrymessage'>{ entry.entryMessage }</div>
		</div>
    )
}

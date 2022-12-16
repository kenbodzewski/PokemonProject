// external imports
import React from 'react'
import { useState, useEffect } from 'react';

// this component is for showing individual forum posts, it is called by both
// the Forum component as well as the ForumEntryDetails component
export default function ForumEntry({ entry }) { // takes in a forum entry object
	// state for holding the name of the author for a forum post
	const [ name, setName ] = useState("");
    
	// this retrieves an author's name using their user ID
	const getEntry = async () => {
		// only want to make fetch if an authorId exists otherwise fetch fails
		if (entry.authorId !== ""){
			try {
				const user = await fetch("http://localhost:3001/user/" + entry.authorId);
				// dont need to explicitly throw an error because if the fetch failed
				// then the below line will throw an error
				const userJson = await user.json();
				setName(userJson.userName);
			} catch { // catch an error (failed fetch) and set the author's name below
				setName("author not found");
			}
		}
	}

	// call getEntry on component render
	useEffect(() => {
		getEntry();
	}, [entry])

    return (
		// displays a forum post using the data passed in as prop and the author retrieved above
		<div className='forumentry'>
			<div className='forumentryheader'>
				<div className='entryauthor'>{ name }</div>
				{/* looks ugly, but this gets the date in the format that I like */}
				<div className='entrydate'>{ new Date(entry.date).toLocaleTimeString()+ " " + new Date(entry.date).toLocaleDateString() }</div>
			</div>
			<div className='entrytitle'>{ entry.entryTitle }</div>
			<div className='entrymessage'>{ entry.entryMessage }</div>
		</div>
    )
}

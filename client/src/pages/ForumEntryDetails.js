// external imports
import React from 'react'
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

// internal imports
import useAuth from '../store/Auth';
import ForumEntry from '../components/ForumEntry';
import CreateComment from '../components/CreateComment';

// component for displaying the detailed view of a forum post including all comments
export default function ForumEntryDetails() {
	// need access to the userProfile for conditional rendering
	const { userProfile } = useAuth();
	const navigate = useNavigate();

	// state for an individual forum entry
	const [ forumEntry, setForumEntry ] = useState({
		authorId: "",
		date: "",
		entryMessage: "",
		entryTitle: "",
		_id: ""
	});

	//const [ forumId, setForumId ] = useState("");
	const [ comments, setComments ] = useState([]);

	// gives us access to params
	const params = useParams();

	// get the forum entry associated with the given id (this is just one entry not a group)
	const getForum = async () => {
		const entry = await fetch("http://localhost:3001/forumEntry/" + params.id);
		// dont need to explicity throw error because if fetch fails below line will
		// (catch is located in the function that calls this one)
		const entryJson = await entry.json();

		const authorId = entryJson.authorId;
		const date = entryJson.date;
		const entryMessage = entryJson.entryMessage;
		const entryTitle = entryJson.entryTitle;
		const _id = entryJson._id;

		// use retrieved data to set all properties of the state object
		setForumEntry({
			authorId: authorId,
			date: date,
			entryMessage: entryMessage,
			entryTitle: entryTitle,
			_id: _id
		})
	}

	// get all the comments associated with this forumId (set above in getForum)
	const getComments = async () => {
		const comments = await fetch("http://localhost:3001/comments/" + params.id);
		// dont need to explicity throw error because if fetch fails below line will
		// (catch is located in the function that calls this one)
		const commentsJson = await comments.json();
		setComments(commentsJson);
	}
  
	// call getForum and getComments on render
	useEffect(() => {
		try {
			getForum();
			getComments();
		} catch (error) {
			// if either of the above functions throws an error (failed fetch)
			// then navigage to error page
			navigate("/error");
		}
	}, [])

    return (
		<div className='forumwrapper'>
			<Link to="/Forum" className='back'>&lt; Back to Forum</Link>
			<ForumEntry entry={forumEntry} />
			<div className='comments'>
				{comments.map((comment) => {
					return (
						<Comment comment={comment} key={comment._id } />
					)
				})}
			</div>
			{/* conditionally render the CreateComment component based on whether a user is logged in */}
			{userProfile ? (
				<CreateComment forumId={ forumEntry } getComments={ getComments } />
            ) : (
                <></>
            )}	
        </div>
  	)
}

// component for displaying comment
function Comment({ comment }) {
	// set the author name to default empty string until we retrieve it using the ID
	const [ authorName, setAuthorName ] = useState("");

	// get the author's name using the id (from prop)
	const getAuthorName = async () => {
		fetch('http://localhost:3001/user/' + comment.authorId)
			// dont need to explicity throw error because if fetch fails below line will
			.then(response => response.json())
			.then(author => setAuthorName(author.userName))
			// if an error is thrown (bad fetch response) then set author in catch
			.catch(() => setAuthorName("couldn't find author"))
	}

	// call getAuthorName on render
	useEffect(() => {
		getAuthorName();
	}, [])

	return(
		<div className="comment">
			<div className='authordate'>
				<div>{ authorName }</div>
				<div>{ new Date(comment.date).toLocaleTimeString()+ " " + new Date(comment.date).toLocaleDateString() }</div>
			</div>
			<div className='commentmessage'>{ comment.commentMessage }</div>
		</div>
	)
}
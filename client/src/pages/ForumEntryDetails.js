import React from 'react'
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

import useAuth from '../store/Auth';
import ForumEntry from '../components/ForumEntry';
import CreateComment from '../components/CreateComment';

export default function ForumEntryDetails() {
	const { userProfile } = useAuth();

	const [ forumEntry, setForumEntry ] = useState({
		authorId: "",
		date: "",
		entryMessage: "",
		entryTitle: "",
		_id: ""
	});

	//const [ forumId, setForumId ] = useState("");
	const [ comments, setComments ] = useState([]);

	const params = useParams();

	// get the forum entry associated with the given id (this is just one entry not a group)
	const getForum = async () => {
		const entry = await fetch("/forumEntry/" + params.id);
		const entryJson = await entry.json();

		const authorId = entryJson.authorId;
		const date = entryJson.date;
		const entryMessage = entryJson.entryMessage;
		const entryTitle = entryJson.entryTitle;
		const _id = entryJson._id;

		setForumEntry({
			authorId: authorId,
			date: date,
			entryMessage: entryMessage,
			entryTitle: entryTitle,
			_id: _id
		})
		
		// setForumEntry([entryJson]);
		// console.log(entryJson);
		// setForumId(entryJson._id)
	}

	// get all the comments associated with this forumId (set above in getForum)
	const getComments = async () => {
		const comments = await fetch("/comments/" + params.id);
		const commentsJson = await comments.json();
		setComments(commentsJson);
	}
  
	useEffect(() => {
		getForum();
		getComments();
	}, [])

    return (
		<div className='forumwrapper'>
			<Link to="/Forum" className='back'>&lt; Back to Forum</Link>
            {/* {forumEntry.map((entry) => {
                return <ForumEntry entry={ entry } key={ entry._id } />
            })} */}
			<ForumEntry entry={forumEntry} />
			<div className='comments'>
				{comments.map((comment) => {
					return (
						<Comment comment={comment} key={comment._id } />
						// <div key={ comment._id } className="comment">
						// 	<div className='authordate'>
						// 		<div key={ comment._id + 1}>{ comment.authorId }</div>
						// 		<div key={ comment._id + 2}>{ new Date(comment.date).toLocaleTimeString()+ " " + new Date(comment.date).toLocaleDateString() }</div>
						// 	</div>
						// 	<div key={ comment._id + 3 } className='commentmessage'>{ comment.commentMessage }</div>
						// </div>
					)
				})}
			</div>
			{userProfile ? (
				<CreateComment forumId={ forumEntry } getComments={ getComments } />
				// <Link to={"/createComment/" + forumEntry._id}>
				// 	<div className='comment'>Create New Comment</div>
				// </Link>
            ) : (
                <></>
            )}
			
        </div>
  	)
}

function Comment({ comment }) {
	const [ authorName, setAuthorName ] = useState("");

	const getAuthorName = async () => {
		fetch('/user/' + comment.authorId)
			.then(response => response.json())
			.then(author => setAuthorName(author.userName))
	}

	useEffect(() => {
		getAuthorName();
	}, [])

	return(
		<>
			<div className="comment">
				<div className='authordate'>
					<div>{ authorName }</div>
					<div>{ new Date(comment.date).toLocaleTimeString()+ " " + new Date(comment.date).toLocaleDateString() }</div>
				</div>
				<div className='commentmessage'>{ comment.commentMessage }</div>
			</div>
		</>
	)
}
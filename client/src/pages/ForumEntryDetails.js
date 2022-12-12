import React from 'react'
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

import useAuth from '../store/Auth';
import ForumEntry from '../components/ForumEntry';
import CreateComment from './CreateComment';

export default function ForumEntryDetails() {
	const { userProfile } = useAuth();

	const [ forumEntry, setForumEntry ] = useState([]);

	const [ forumId, setForumId ] = useState("");

	const [ comments, setComments ] = useState([]);

	const params = useParams();

	const getForum = async () => {
		const entry = await fetch("http://localhost:3001/forumEntry/" + params.id);
		const entryJson = await entry.json();
		//console.log(entryJson);
		setForumEntry([entryJson]);
		//console.log(forumEntry);
		setForumId(entryJson._id)
	}

	const getComments = async () => {
		const comments = await fetch("http://localhost:3001/comments/" + params.id);
		const commentsJson = await comments.json();
		setComments(commentsJson);
		//console.log(commentsJson);
		//console.log(comments)
	}
  
	useEffect(() => {
		getForum();
		getComments();
	}, [])

    return (
		<div className='contentwrapper'>
			<Link to="/Forum" className='back'>&lt; Back to Forum</Link>
            {forumEntry.map((entry) => {
                return <ForumEntry entry={ entry } key={ entry._id } />
            })}
			<div className='comments'>
				{comments.map((comment) => {
					return (
						<div key={ comment._id } className="comment">
							<div className='authordate'>
								<div key={ comment._id + 1}>{ comment.authorId }</div>
								<div key={ comment._id + 2}>{ comment.date }</div>
							</div>
							<div key={ comment._id + 3 } className='commentmessage'>{ comment.commentMessage }</div>
						</div>
					)
				})}
			</div>
			{userProfile ? (
                <CreateComment forumId={ forumId } />
            ) : (
                <></>
            )}
            {/* <Link to={"/createComment/"}>
                <div className='comment'>Create New Comment</div>
            </Link> */}
        </div>
  	)
}

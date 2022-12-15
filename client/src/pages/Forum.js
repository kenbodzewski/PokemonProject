// external imports
import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

// internal imports
import useAuth from '../store/Auth';
import ForumEntry from '../components/ForumEntry';
import '../styles/Forum.css';

// component for rendering all top level forum posts (no comments)
export default function Forum() {
    // allows us to use the userProfile 
	const { userProfile } = useAuth();
    // allows us to navigate on error
    const navigate = useNavigate();
    // state for all the forum entries
    const [ state, setState ] = useState([]);
    
    const entries = async () => {
        try {
            // notice that the call to the endpoint is to forumEntries, not forum
            const response = await fetch("/forumEntries");
            // dont need to explicity throw error because if fetch fails below line will
            const responseJson = await response.json();
            setState(responseJson);
        } catch (error) { // if fetch fails navigate to error page becuase none of the posts were found
            navigate("/error");
        }
    };
    
    // call entries on render
    useEffect(() => {
        entries();
    }, [])

    return (
        // display all of the forum posts
        <div className='forumwrapper'>
            {state.map((entry) => {
                return (
                    <Link to={"/ForumEntry/" + entry._id } key={ entry._id } className="forumentrylink">
                        <ForumEntry entry={ entry } key={ entry._id + 1 } />
                    </Link>
                )
            })}
            {/* only show the createForumEntry link if a user is logged in */}
            {userProfile ? (
                <Link to={"/CreateForumEntry"} >
                    <div className='forumentry'>Create New Post</div>
                </Link>
            ) : (
                <></>
            )}
        </div>
    )
}

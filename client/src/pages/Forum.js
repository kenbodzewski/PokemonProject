import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import useAuth from '../store/Auth';
import ForumEntry from '../components/ForumEntry';
import '../styles/Forum.css';

export default function Forum() {
    // allows us to use the userProfile and the removeUser to get user info and logout
	const { userProfile } = useAuth();
    const navigate = useNavigate();

    const [ state, setState ] = useState([]);
    
    const entries = async () => {
        try {
            // notice that the call to the endpoint is to forumEntries, not forum
            const response = await fetch("/forumEntries");
            const responseJson = await response.json();
            setState(responseJson);
        } catch (error) {
            //console.log({ message: error.message });
            navigate("/error");
        }
    };
    
    useEffect(() => {
        entries();
    }, [])

    return (
        <div className='forumwrapper'>
            {state.map((entry) => {
                return (
                    <Link to={"/ForumEntry/" + entry._id } key={ entry._id } className="forumentrylink">
                        <ForumEntry entry={ entry } key={ entry._id + 1 } />
                    </Link>
                )
            })}
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

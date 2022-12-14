import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import useAuth from '../store/Auth';

export default function CreateComment({ forumId, getComments }) {
    const { register, handleSubmit } = useForm();
    const { userProfile } = useAuth();
    const [ placeholder, setPlaceholder] = useState("");

    const onSubmit = (data) => {
        // set the authorId of data to the userProfile's ID
        data.authorId = userProfile._id;
        data.forumEntryId = forumId;
        // added this so that it will set date to current time rather than when server is booted up
        data.date = Date.now(); 
        //console.log(data)
        fetch("/comment", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        // this is to refresh the state in the ForumEntryDetails component causing the page to rerender with the new comment included
        }).then(() => getComments())
        .then(() => setPlaceholder(""))
    };
  
    return (
        <form onSubmit={ handleSubmit(onSubmit) } className="createcomment">
            <textarea { ...register("commentMessage") } 
                placeholder="Enter comment"
                value={ placeholder }
                className="commentinput"
                required
                onChange={ (e) => setPlaceholder(e.target.value) }
                />
            <input type="submit" className="submitinput"></input> 
        </form>
    )
}
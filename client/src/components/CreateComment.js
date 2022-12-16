// external imports
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

// internal imports
import useAuth from '../store/Auth';

// this component allows a logged in user to submit a comment attached to a forum post
export default function CreateComment({ forumId, getComments }) {
    // allows me to use fourm hook
    const { register, handleSubmit } = useForm();
    // gives me access to the logged in user
    const { userProfile } = useAuth();
    // allows me to use navigate to go to a different page
    const navigate = useNavigate();
    // state for placeholder text in comment box
    const [ placeholder, setPlaceholder] = useState("");

    // when the form is submitted, it uses the data in the form to create a new comment in the DB
    const onSubmit = (data) => {
        // set the authorId of data to the userProfile's ID and the forumEntryId of data to the forumId passed in as prop
        data.authorId = userProfile._id;
        data.forumEntryId = forumId;
        // added this so that it will set date to current time rather than when server is booted up
        data.date = Date.now(); 
        // POST to the comment endpoint on our backend the proxy set in package.json precedes the /comment
        fetch("http://localhost:3001/comment", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }) // if the POST above fails then throw an error
        .then(res => {
            if(!res.ok){
                throw new Error();
            } else {
                return res;
            }
        }) // this is to refresh the state in the ForumEntryDetails component causing the page to rerender with the new comment included
        .then(() => getComments())
        .then(() => setPlaceholder(""))
        .catch(() => navigate("/forum")); // if an error is thrown (bad POST response) then navigate back to forum page
    }; 
  
    return (
        // Form for submitting a new comment, most data is pulled from user, time, or prop, from above
        // only the user's input needs to be captured in the form
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
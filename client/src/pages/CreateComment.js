import React from 'react'
import { useForm } from 'react-hook-form';

import useAuth from '../store/Auth';

export default function CreateComment({ forumId }) {
    const { register, handleSubmit } = useForm();
    const { userProfile } = useAuth();

    const onSubmit = (data) => {
        // set the authorId of data to the userProfile's ID
        data.authorId = userProfile._id;
        data.forumEntryId = forumId;
        //console.log(data)
        fetch("http://localhost:3001/comment", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    };
  
    return (
    <form onSubmit={handleSubmit(onSubmit)} className="createcomment">
        <textarea { ...register("commentMessage") } placeholder="Enter comment" className="commentinput" />
        <input type="submit" className="submitinput"></input> 
    </form>
    )
}
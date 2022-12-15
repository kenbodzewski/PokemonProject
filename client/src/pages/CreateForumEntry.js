import React from 'react'
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

import useAuth from '../store/Auth';
import "../styles/CreateForumEntry.css";

export default function CreateForumEntry() {
    const { register, handleSubmit } = useForm();
    const { userProfile } = useAuth();

    const navigate = useNavigate();

    const onSubmit = (data) => {
        data.authorId = userProfile._id;
        // added this so that it will set date to current time rather than when server is booted up
        data.date = Date.now(); 
        fetch("/forumEntry", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).catch(() => navigate("/error"))

        navigate('/Forum');
    };
  
    return (
        <div className='forumwrapper'>
            <Link to="/Forum" className='back'>&lt; Back to Forum</Link>
            <form onSubmit={handleSubmit(onSubmit)} className="createforumentry">
                <input 
                    { ...register("entryTitle") } 
                    placeholder="Title" 
                    required
                    className="titleinput" 
                    />
                <textarea 
                    { ...register("entryMessage") } 
                    placeholder="Message" 
                    required
                    className="textinput" />
                <input type="submit" className="submitinput"></input> 
            </form>
        </div>
  )
}

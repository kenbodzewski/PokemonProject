import React from 'react'
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

import useAuth from '../store/Auth';
import "../styles/CreateForumEntry.css";

export default function CreateForumEntry() {
    const { register, handleSubmit } = useForm();
    const { userProfile, addUser, removeUser } = useAuth();

    const navigate = useNavigate();

    const onSubmit = (data) => {
        data.authorId = userProfile._id;
        fetch("http://localhost:3001/forumEntry", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        navigate('/Forum');
    };
  
    return (
        <div className='contentwrapper'>
            <Link to="/Forum" className='back'>&lt; Back to Forum</Link>
            <form onSubmit={handleSubmit(onSubmit)} className="createforumentry">
                <input { ...register("entryTitle") } placeholder="Title" className="titleinput" />
                <textarea { ...register("entryMessage") } placeholder="Message" className="textinput" />
                <input type="submit" className="submitinput"></input> 
            </form>
        </div>
  )
}

// external imports
import React from 'react'
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

// internal imports
import useAuth from '../store/Auth';
import "../styles/CreateForumEntry.css";

// component for allowing logged in user to create a new forum post
export default function CreateForumEntry() {
    // allows ability to user from hook
    const { register, handleSubmit } = useForm();
    // gives acces to user
    const { userProfile } = useAuth();
    // allows to navigate or error, or back to forum page on succesful post creation
    const navigate = useNavigate();

    // take data from the form
    const onSubmit = (data) => {
        // give the data an authorid of the logged in user
        data.authorId = userProfile._id;
        // added this so that it will set date to current time rather than when server is booted up
        data.date = Date.now(); 
        fetch("/forumEntry", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (!res.ok){
                throw new Error();
            } else {
                return res;
            }
        }) // if the POST fails then navigate to error page
        .catch(() => navigate("/error"))
        // otherwise navigate back to forum page
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

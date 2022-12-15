// external imports
import React from 'react';
import { Link } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';

// internal imports
import "./styles/Navbar.css";
import Pokemon_logo from './images/Pokemon_logo.png';
import { createOrGetUserAndLogin } from './Utilities';
import useAuth from './store/Auth';

// component for the navbar which shows on every page of the website
export default function Navbar() {
  // access to the userProfile as needed for logging in
  const { userProfile, addUser } = useAuth();

  return (
    <nav className='navbar'>
        <div>
            <img src={ Pokemon_logo } alt="Pokemon Logo" className='hero'/>
        </div>
        <ul className='navwrapper'>
            <li><Link to="/" className='navlink'>Home</Link></li>
            <li><Link to="/PokeBalls" className='navlink'>Poke Balls</Link></li>
            <li><Link to="/Forum" className='navlink'>Forum</Link></li>
            <li><Link to="/Search" className='navlink'>Search</Link></li>
            <div>
              {/* conditional rendering of googlelogin button or user profile link based 
              on whether the user is logged in or not */}
              {userProfile ? (
                <Link to="/Profile">
                  <span className='navuser'>{ userProfile.userName }</span>
                </Link>
              ) : (
                // if successful accout creation/login occurs call teh createOrGetUserAndLogin function from Utilities.js
                <GoogleLogin
                  onSuccess={(response) => createOrGetUserAndLogin(response, addUser)}
                  onError={() => console.log('Failed to login')}
                />
              )}
            </div>
        </ul>
    </nav>
  )
}
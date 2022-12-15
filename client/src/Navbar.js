import React from 'react';
import { Link } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';

import "./styles/Navbar.css";
import Pokemon_logo from './images/Pokemon_logo.png';
import { createOrGetUserAndLogin } from './Utilities';
import useAuth from './store/Auth';

export default function Navbar() {
  const { userProfile, addUser, removeUser } = useAuth();

  return (
    <nav className='navbar'>
        <div>
            <img src={ Pokemon_logo } alt="Pokemon Logo" className='hero'/>
        </div>
        <ul className='navwrapper'>
            <li><Link to="/" className='navlink'>Home</Link></li>
            <li><Link to="/PokeBalls" className='navlink'>Poke Balls</Link></li>
            {/* <li><Link to="/Berries" className='navlink'>Berries</Link></li> */}
            <li><Link to="/Forum" className='navlink'>Forum</Link></li>
            <li><Link to="/Search" className='navlink'>Search</Link></li>
            {/* <li><Link to="/Login">Login</Link></li> */}
            <div>
              {userProfile ? (
                <Link to="/Profile">
                  <span className='navuser'>{ userProfile.userName }</span>
                  {/* <button onClick={ removeUser } >Logout</button> */}
                </Link>
              ) : (
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
// external imports
import React from 'react'
import { Link } from 'react-router-dom'

// generic footer giving my information and a link to the Privacy Policy
export default function Footer() {
  return (
    <div className='footercontainer'>
      <div>PokemonProject created by Ken Bodzewski for CS5610 (Web Development) in Fall 2022</div>
      <div> Northeastern University, The Roux Institute</div>
      <div className='privacylink'><Link to="/Privacy" >Privacy Policy</Link></div>
    </div>
  )
}

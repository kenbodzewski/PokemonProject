import React, { useState } from 'react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import Pokemon from '../components/Pokemon';
import '../styles/Search.css';

export default function Search() {
  const { register, handleSubmit } = useForm();
  const [ pokemonName, setPokemonName ] = useState("");
  const [ error, setError ] = useState(true);
  
  const onSubmit = (data) => {
    setPokemonName(data.searchinput);
  };

  useEffect(() => {
    async function fetchData(){
      if(pokemonName){
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
        if (!response.ok){
          // console.log(response.ok);
          setError(true);
        } else {
          setError(false);
        }
      }
    }
    fetchData(); 
  }, [pokemonName])

  return (
    <div className='searchcontainer'>
      <div className="search">
        <div className='instructions'>Enter a Pokemon's name or a number from 1 to 905:</div>
        <form onSubmit={handleSubmit(onSubmit)} className="searchform">
          <input
            type="search"
            placeholder="Search for Pokemon"
            {...register("searchinput")}
            required
            className="searchinput"
          />
          <input 
            value="Search" 
            type="submit" 
            className="searchbutton" 
          />
        </form>
        <div className='searchresults'>
          {error ? ( 
            (pokemonName === "") ? (
              <></>
            ) : (
              <div className='noresults'>No such Pokemon exists...</div>
            )  
          ) : (
            <Pokemon url={ "https://pokeapi.co/api/v2/pokemon/" + pokemonName } ></Pokemon>
          )}
        </div>
      </div>
    </div>
  )
}

// external imports
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

// internal imports
import Pokemon from '../components/Pokemon';
import '../styles/Search.css';

// component for the search function
export default function Search() {
  // access to form hook
  const { register, handleSubmit } = useForm();
  // states for pokemonName and possible error on fetch
  const [ pokemonName, setPokemonName ] = useState("");
  const [ error, setError ] = useState(true);
  
  // on form submit setError to true and the pokemons name to the input data
  const onSubmit = (data) => {
    setError(true);
    setPokemonName(data.searchinput);
  };

  // call on render
  useEffect(() => {
    async function fetchData(){
      // make sure pokemonName isnt null
      if(pokemonName){
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
        // the the fetch above was bad throw an error
        if (!response.ok){
          setError(true);
        } else { // otherwise setError to false because there is no error and the search should continue
          setError(false);
        }
      }
    }
    // call the function that was created above
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
          {/* conditionally render a Pokemon or a user message if the pokemon doesnt exist */}
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

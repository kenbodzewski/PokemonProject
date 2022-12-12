import { BrowserRouter } from "react-router-dom";
import { Route, Routes } from 'react-router-dom';

import Navbar from "./Navbar";
import Home from "./pages/Home";
import Berries from "./pages/Berries";
import Pokeballs from "./pages/Pokeballs";
import Profile from "./pages/Profile";
import CreateComment from "./pages/CreateComment";

import Search from "./pages/Search";
import Login from "./pages/Login";

import Forum from "./pages/Forum";
import { GoogleOAuthProvider } from '@react-oauth/google';
//import useAuth from './store/Auth';

import CreateForumEntry from "./pages/CreateForumEntry";
import Balls from "./components/Balls";
import "./styles/App.css";
import ForumEntryDetails from "./pages/ForumEntryDetails";

function App() {
	//const { userProfile, addUser, removeUser } = useAuth();

	return (
		<GoogleOAuthProvider clientId={ `${process.env.REACT_APP_GOOGLE_API_TOKEN}` }>
			<BrowserRouter>
				<Navbar></Navbar>
				<Routes>
					<Route path="/" element={<Home />}></Route>

					{/* replace berries with pokemon types? not pokemon themselves, just 
					the strengths and weaknesses of types */}
					{/* <Route path="/Berries" element={<Berries />}></Route> */}
					<Route path="/Pokeballs" element={<Pokeballs />}></Route>

					{/* <Route path="/Balls" element={<Balls />}></Route> */}

					<Route path="/Pokeballs/special" element={<Balls url ="https://pokeapi.co/api/v2/item-category/special-balls"  />}></Route>
					<Route path="/Pokeballs/standard" element={<Balls url ="https://pokeapi.co/api/v2/item-category/standard-balls"  />}></Route>
					<Route path="/Pokeballs/apricorn" element={<Balls url ="https://pokeapi.co/api/v2/item-category/apricorn-balls"  />}></Route>

					<Route path="/Search" element={<Search />}></Route>
					<Route path="/Login" element={<Login />}></Route>

					<Route path="/Forum" element={<Forum />}></Route>
					<Route path="/CreateForumEntry" element={<CreateForumEntry />}></Route>

					<Route path="/ForumEntry/:id" element={<ForumEntryDetails />}></Route>

					<Route path="/CreateComment" element={<CreateComment />}></Route>

					<Route path="/Profile" element={<Profile />}></Route>
				</Routes>
			</BrowserRouter>
		</GoogleOAuthProvider>
	);
}

export default App;

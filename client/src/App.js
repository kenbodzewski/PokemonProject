import { BrowserRouter } from "react-router-dom";
import { Route, Routes } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

import Navbar from "./Navbar";
import Home from "./pages/Home";
import Pokeballs from "./pages/Pokeballs";
import Profile from "./pages/Profile";
import CreateForumEntry from "./pages/CreateForumEntry";
import Search from "./pages/Search";
import Forum from "./pages/Forum";
import Balls from "./pages/Balls";
import ForumEntryDetails from "./pages/ForumEntryDetails";
import "./styles/App.css";
import CreateComment from "./components/CreateComment";

function App() {
	//const { userProfile, addUser, removeUser } = useAuth();

	return (
		<GoogleOAuthProvider clientId={ `${process.env.REACT_APP_GOOGLE_API_TOKEN}` }>
			<BrowserRouter>
				<Navbar></Navbar>
				<Routes>
					<Route path="/" element={<Home />}></Route>

					<Route path="/Pokeballs" element={<Pokeballs />}></Route>

					<Route path="/Pokeballs/special" element={<Balls url ="https://pokeapi.co/api/v2/item-category/special-balls"  />}></Route>
					<Route path="/Pokeballs/standard" element={<Balls url ="https://pokeapi.co/api/v2/item-category/standard-balls"  />}></Route>
					<Route path="/Pokeballs/apricorn" element={<Balls url ="https://pokeapi.co/api/v2/item-category/apricorn-balls"  />}></Route>

					<Route path="/Search" element={<Search />}></Route>

					<Route path="/Forum" element={<Forum />}></Route>
					<Route path="/CreateForumEntry" element={<CreateForumEntry />}></Route>
					<Route path="/ForumEntry/:id" element={<ForumEntryDetails />}></Route>
					<Route path="/CreateComment/:forumEntryId" element={<CreateComment />}></Route>

					<Route path="/Profile" element={<Profile />}></Route>
				</Routes>
			</BrowserRouter>
		</GoogleOAuthProvider>
	);
}

export default App;

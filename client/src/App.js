// external imports
import { BrowserRouter } from "react-router-dom";
import { Route, Routes } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

// internal imports, needed for all of the routes
import Navbar from "./Navbar";
import Home from "./pages/Home";
import Pokeballs from "./pages/Pokeballs";
import Profile from "./pages/Profile";
import CreateForumEntry from "./pages/CreateForumEntry";
import Search from "./pages/Search";
import Forum from "./pages/Forum";
import Balls from "./pages/Balls";
import ForumEntryDetails from "./pages/ForumEntryDetails";
import CreateComment from "./components/CreateComment";
import Privacy from "./pages/Privacy";
import Footer from "./pages/Footer";
import Error from "./pages/Error";
import "./styles/App.css";

// top level Component I created
function App() {
	return (
		// allow use of google auth
		<GoogleOAuthProvider clientId={ `${process.env.REACT_APP_GOOGLE_API_TOKEN}` }>
			<BrowserRouter>
				<Navbar></Navbar>
				{/* all the routes needed for website navigation */}
				<Routes>
					<Route path="/" element={<Home />}></Route>

					<Route path="/Pokeballs" element={<Pokeballs />}></Route>
					{/* routes to three different pokeball category pages */}
					<Route path="/Pokeballs/special" element={<Balls url ="https://pokeapi.co/api/v2/item-category/special-balls"  />}></Route>
					<Route path="/Pokeballs/standard" element={<Balls url ="https://pokeapi.co/api/v2/item-category/standard-balls"  />}></Route>
					<Route path="/Pokeballs/apricorn" element={<Balls url ="https://pokeapi.co/api/v2/item-category/apricorn-balls"  />}></Route>

					<Route path="/Search" element={<Search />}></Route>

					<Route path="/Forum" element={<Forum />}></Route>
					<Route path="/CreateForumEntry" element={<CreateForumEntry />}></Route>
					<Route path="/ForumEntry/:id" element={<ForumEntryDetails />}></Route>
					<Route path="/CreateComment/:forumEntryId" element={<CreateComment />}></Route>

					<Route path="/Profile" element={<Profile />}></Route>

					<Route path="/Privacy" element={<Privacy />}></Route>
					
					{/* error page and a catch all for any routes that people try to visit that dont exist */}
					<Route path="/error" element={<Error/>}></Route>
					<Route path="*" element={<Error />}></Route>
				</Routes>
				<Footer></Footer>
			</BrowserRouter>
		</GoogleOAuthProvider>
	);
}

export default App;

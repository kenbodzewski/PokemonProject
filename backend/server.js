// external modules
import express, { request } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

// my modules (that are models for DB documents)
import ForumEntry from './models/forumEntry.js';
import User from './models/user.js';
import Like from './models/likes.js';
import Comment from './models/comments.js';

// allows us to make reference to variables in the .env file
dotenv.config() 

// creating express server
const app = express() 
// sets port to either 3001 or env variable if it exists
const PORT = process.env.PORT || 3001;

// allows for requests to be made from a location other than this server's
app.use(cors());

// this allows the server to take in a json in the body of an http request
app.use(express.json()); 

// gives a landing page for this server, not necessary
app.get('/', (req, res) => { // if there is a get request at home then return the res.send( 'PokemonProject Back End' )
  res.send( 'PokemonProject Back End' ); 
})

/**
 * HTTP requests for Forum
 */
// get request at /forumEntries
app.get('/forumEntries', async (req, res) => {
  try {
    // find all entries in collection
    const forumEntries = await ForumEntry.find(); 
    //console.log(forumEntries); // print entries from collection found above
    res.status(200).json(forumEntries);
  } catch {
      res.status(400).json({message: error.message}); // return a status and error message
  }
})

// post request to /forumEntry
app.post('/forumEntry', async (req, res) => {
  try {
    const entry = new ForumEntry ( req.body )
    await entry.save();
    res.status(201).json(entry);
  } catch (error) {
    res.status(409).json({ message: error.message })
  }
})

// get request to /forumEntry
app.get('/forumEntry/:id', async (req, res) => {
  try {
    const forumEntry = await ForumEntry.findById(req.params.id);
    res.status(200).json(forumEntry);
  } catch (error) {
    res.status(409).json({ message: error.message })
  }
})

// get request to /forumEntryForUser with dynamic author in url
app.get('/forumEntryForUser/:AuthorId', async (req, res) => {
  try {
    const forumEntry = await ForumEntry.find({ authorId: req.params.AuthorId });
    //console.log(forumEntry);
    res.status(200).json(forumEntry);
  } catch (error) {
    res.status(409).json({ message: error.message })
  }
})

/**
 * HTTP requests for comments
 */
// post request to /comment
app.post('/comment', async (req, res) => {
  try {
    const comment = new Comment( req.body )
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(409).json({ message: error.message })
  }
})

// get request to /comments, the ID passed should be for the associated ForumEntry, not the comment
app.get('/comments/:id', async (req, res) => {
  try {
    const comments = await Comment.find({ forumEntryId: req.params.id });
    res.status(200).json(comments);
  } catch (error) {
    res.status(409).json({ message: error.message })
  }
})


/**
 * HTTP requests for users
 */
// post request to /user, creating a user
app.post('/user', async (req, res) => {
  try {
    const user = new User( req.body )
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(409).json({ message: error.message })
  }
})

// check to see if a user exists
app.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(409).json({ message: error.message })
  }
})

// post to update user at /user
app.post('/user/:id', async (req, res) => {
  try {
    // https://mongoosejs.com/docs/tutorials/findoneandupdate.html helpful url for how this mongoose method works
    const filter = {
      _id: req.params.id
    }
    const update = req.body;
    let user = await User.findOneAndUpdate(filter, update, {
      new: true
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(409).json({ message: error.message })
  }
})


/**
 * HTTP request for Like
 */
// post request to /like
app.post('/like', async(req, res) => {
  try {
    const like = new Like( req.body )
    await like.save();
    res.status(201).json(like);
  } catch (error) {
    res.status(409).json({ message: error.message })
  }
});

// delete request to /like
app.delete('/like', async(req, res) => {
  try {
    await Like.findOneAndDelete( req.body );
    res.status(201).json("successful delete");
  }
  catch (error) {
    res.status(409).json({ message: error.message })
  }
})

// get request to /like
app.get('/like', async (req, res) => {
  try {
    let query = {};
    if (req.query.userId != null) {
      query.userId = req.query.userId;
    }
    if (req.query.pokemonName != null) {
      query.pokemonName = req.query.pokemonName;
    }
    const like = await Like.find( query );
    res.status(200).json(like);
  } catch (error) {
    res.status(409).json({ message: error.message })
  }
})

// get request to /likesforuser with dynamic user in url
app.get('/likesforuser/:userId', async (req, res) => {
  try {
    const likes = await Like.find({ userId: req.params.userId });
    //console.log(forumEntry);
    res.status(200).json(likes);
  } catch (error) {
    res.status(409).json({ message: error.message })
  }
})


// get requst to /likes
app.get('/likes', async (req, res) => {
  try {
    // find all entries in collection
    const like = await Like.find(); 
    //console.log(forumEntries); // print entries from collection found above
    res.status(200).json(like);
  } catch {
      res.status(400).json({message: error.message}); // return a status and error message
  }
})

// url of mongo database
const connection_url = process.env.CONNECTION_URL;

// connecting to mongodb and running the server
mongoose.connect(connection_url) 
  .then(() => app.listen(
    PORT, () => console.log(`Server running on port: ${PORT}`)
  ))
  .catch((error) => console.log(error.message));


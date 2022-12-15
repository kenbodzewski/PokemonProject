import mongoose from "mongoose";

const { Schema } = mongoose;
// schema for likes
const likeSchema = new Schema({
    pokemonName: String,
    userId: String
});

const Like = mongoose.model('like', likeSchema);
// export Like for use by server.js
export default Like;
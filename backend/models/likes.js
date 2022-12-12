import mongoose from "mongoose";

const { Schema } = mongoose;

const likeSchema = new Schema({
    pokemonName: String,
    userId: String
});

const Like = mongoose.model('like', likeSchema);

export default Like;
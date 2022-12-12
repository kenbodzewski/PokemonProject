import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
    _id: String,
    _type: String,
    userName: String,
    email: String,
    image: String
});
// a collection called forumentries inside the database specified in the url in the .env file
// it know how to change ForumEntry to forumentries, lowercase and plural
const User = mongoose.model('user', userSchema); 

export default User;
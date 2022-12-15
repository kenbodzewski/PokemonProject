import mongoose from "mongoose";

const { Schema } = mongoose;
// schema for users
const userSchema = new Schema({
    _id: String,
    _type: String,
    userName: String,
    email: String,
    image: String
});

const User = mongoose.model('user', userSchema); 
// export User for use by server.js
export default User;
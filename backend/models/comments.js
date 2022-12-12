import mongoose from "mongoose";
const { Schema } = mongoose;

const commentSchema = new Schema({
    authorId: String,
    forumEntryId: String,
    date: {
        type: Date, 
        default: new Date(),
    },
    commentMessage: String
});
// a collection called forumentries inside the database specified in the url in the .env file
// it know how to change ForumEntry to forumentries, lowercase and plural
const Comment = mongoose.model('Comment', commentSchema); 

export default Comment;
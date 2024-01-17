import mongoose from "mongoose";

const { Schema } = mongoose;
// schema for comment documents
const commentSchema = new Schema({
    authorId: String,
    forumEntryId: String,
    date: {
        type: Date, 
        default: Date.now(),
    },
    commentMessage: String
});


const Comment = mongoose.model('Comment', commentSchema); 
// export the model/schema so it can be used in server.js
export default Comment;
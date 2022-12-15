import mongoose from "mongoose";

const { Schema } = mongoose;
// schema for singular forum entries
const entrySchema = new Schema({
    authorId: String,
    date: {
        type: Date, 
        default: Date.now(),
    },
    entryTitle: String,
    entryMessage: String
});

const ForumEntry = mongoose.model('ForumEntry', entrySchema); 
// export model/schema for ForumEntry for use by server.js
export default ForumEntry;
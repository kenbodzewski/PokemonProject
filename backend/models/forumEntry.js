import mongoose from "mongoose";
const { Schema } = mongoose;

const entrySchema = new Schema({
    authorId: String,
    date: {
        type: Date, 
        default: Date.now(),
    },
    entryTitle: String,
    entryMessage: String
});
// a collection called forumentries inside the database specified in the url in the .env file
// it know how to change ForumEntry to forumentries, lowercase and plural
const ForumEntry = mongoose.model('ForumEntry', entrySchema); 

export default ForumEntry;
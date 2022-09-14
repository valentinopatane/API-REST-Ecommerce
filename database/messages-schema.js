import mongoose from "mongoose";

const messagesSchema = mongoose.Schema({
    date: String,
    name: String,
    text: String,
});

const Messages = mongoose.model("Message", messagesSchema);

export default Messages;

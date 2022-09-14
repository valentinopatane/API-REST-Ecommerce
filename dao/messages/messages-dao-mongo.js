import Messages from "../../database/messages-schema.js";

export default class MessagesDAO {
    constructor() {}
    async saveMessage(msg) {
        const newMessage = new Messages({ ...msg });
        try {
            await newMessage.save();
            return newMessage;
        } catch (error) {
            console.log(error);
            throw new Error("Error saving message.");
        }
    }
    async getMessages() {
        try {
            const messages = Messages.find();
            return messages;
        } catch (error) {
            console.log(error);
            throw new Error("Error in messages.");
        }
    }
}

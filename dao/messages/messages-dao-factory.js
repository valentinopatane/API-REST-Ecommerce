import MessagesDAO from "./messages-dao-mongo.js";

const opcion = process.argv[2] || "Mongo";

let dao;

switch (opcion) {
    default:
        dao = new MessagesDAO();
}

export default class MessagesDaoFactory {
    static getDao() {
        return dao;
    }
}

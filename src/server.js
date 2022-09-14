import http from "http";
import express from "express";
import runDb from "../database/db.js";
import bodyParser from "body-parser";
import cors from "cors";
import { Server as IOServer } from "socket.io";
import { engine } from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";

import chat from "../dao/messages/messages-dao-factory.js";
import {
    productsRoutes,
    usersRoutes,
    cartsRoutes,
    ordersRoutes,
    imagesRoutes,
} from "../routes/index.js";

const app = express();

app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.engine(
    "handlebars",
    engine({
        defaultLayout: "index.html",
    })
);
const httpServer = http.createServer(app);
app.use(express.static("public"));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ----------CHAT---------- */

const io = new IOServer(httpServer);
io.on("connection", async (socket) => {
    const messagesListed = await chat.getDao().getMessages();

    socket.emit("showMessages", messagesListed);

    socket.on("message", async (msg) => {
        const message = { date: new Date().toLocaleString(), ...msg };
        await chat.getDao().saveMessage(message);
        const messagesL = await chat.getDao().getMessages();
        socket.emit("chatResponse", messagesL);
    });
});
/* ----------Routes---------- */

app.get("/", (req, res) => res.sendFile(__dirname + "/../public/index.html"));

app.get("/info", (req, res) => {
    const datos = {
        execArg: process.execArgv,
        platform: process.platform,
        nodeVersion: process.versions.node,
        memory: process.memoryUsage.rss,
        execPath: process.argv[0],
        processID: process.pid,
        projectFolder: process.argv[1],
    };
    res.send(JSON.stringify(datos));
});

/* Images */
app.use("/api/images", imagesRoutes, express.static("images"));

/* Products */
app.use("/api/products", productsRoutes);

/* Users */
app.use("/", usersRoutes);

/* Carts */
app.use("/api/shoppingcartproducts", cartsRoutes);

/* Orders */
app.use("/api/orders", ordersRoutes);

/* ----------Server run---------- */

export function crearServidor(PORT) {
    runDb();
    const server = httpServer.listen(process.env.PORT || PORT, () => {
        console.log(
            `Server running on port: ${process.env.PORT} -- Worker ${process.pid} started`
        );
    });
    server.on("error", (error) => console.log(`Error en servidor: ${error}`));
}

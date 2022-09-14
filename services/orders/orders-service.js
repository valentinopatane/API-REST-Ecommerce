import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
export default class OrdersService {
    #rep;
    #cartsService;

    constructor(repo, cartsService) {
        this.#rep = repo;
        this.#cartsService = cartsService;
    }
    async createOrder(cartId, userEmail) {
        const orderId = uuidv4();
        const orderDate = new Date().toLocaleString();
        const cart = await this.#cartsService.getCartProducts(cartId);

        const order = {
            orderId: orderId,
            date: orderDate,
            userId: cartId,
            products: cart.products,
        };

        const result = await this.#rep.createOrder(order);

        //Check: Si por algún motivo la orden no se emite de manera correcta, se elimina de la base de datos la orden erronea y se muestra un error.
        if (result) {
            await this.#cartsService.clearCart(cartId);
        } else {
            await this.#rep.deleteFailedOrder(order.orderId);
            throw new Error("Order couldn't be processed. Try Again.");
        }

        //Envia mail al admin y al usuario al ser emitida la orden
        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: "markus.huels27@ethereal.email",
                pass: "DsD9W2zYBkvNtFj3w5",
            },
            tls: {
                rejectUnauthorized: false,
            },
        });

        const adminMailOptions = {
            from: "E-Commerce API",
            to: process.env.ADMIN_EMAIL,
            subject: "Nueva orden emitida.",
            text: `¡Has recibido una nueva orden de compra! Usuario: ${userEmail} -- Orden: ${order}`,
        };
        const userMailOptions = {
            from: "E-Commerce API",
            to: userEmail,
            subject: "Nueva orden emitida.",
            text: `¡Has realizado una nueva orden de compra! Usuario: ${userEmail} -- Orden: ${order}`,
        };

        transporter.sendMail(adminMailOptions, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                return true;
            }
        });
        transporter.sendMail(userMailOptions, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                return true;
            }
        });

        return result;
    }
    async getOrders(userId) {
        const result = await this.#rep.getOrders(userId);
        return result;
    }
}

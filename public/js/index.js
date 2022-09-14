const socket = io();
document.addEventListener("DOMContentLoaded", async () => {
    async function templates_fetch(url) {
        let res = await fetch(url);
        return await res.text();
    }

    async function html_buil(url, contexto) {
        const plantilla = await templates_fetch(url);
        const generate = Handlebars.compile(plantilla);
        return generate(contexto);
    }

    socket.on("showMessages", async (mensajes) => {
        let html = await html_buil("templates/chat.handlebars", mensajes);
        document.getElementById("chat").innerHTML = html;
    });

    templates_fetch("templates/input-chat.handlebars").then((res) => {
        document.getElementById("input").innerHTML = res;
        const form = document.getElementById("form");
        document
            .getElementById("form")
            .addEventListener("submit", function (e) {
                e.preventDefault();
                const message = {
                    name: form.name.value,
                    text: form.text.value,
                };

                console.log("submit");
                socket.emit("message", message);
                form.reset();
            });
    });
});

///////////////////////////////////////

// const socket = io();

// const form = document.querySelector("form");
// const author = document.getElementById("author");
// const msg = document.getElementById("msg");
// const messages = document.getElementById("chatBox");

// form.addEventListener("submit", (e) => {
//     e.preventDefault();
//     if (author.value && msg.value) {
//         const message = {
//             name: author.value,
//             text: msg.value,
//         };
//         socket.emit("chat", message);
//         author.value = "";
//         msg.value = "";
//         messages.scrollTop = messages.scrollHeight;
//     }
// });

// socket.on("chatResponse", (msgs) => {
//     let item = document.createElement("li");
//     msgs.map((msg) => {
//         item.innerHTML = `<span class="user">${msg.name}</span>&nbsp:&nbsp<span class="msg">${msg.text}</span>`;
//         messages.appendChild(item);
//     });
// });
// socket.on("showMessages", (msgs) => {
//     for (let i = 0; i < msgs.length; i++) {
//         let item = document.createElement("li");
//         item.innerHTML = `<span class="user">${msgs[i].name}</span>&nbsp:&nbsp<span class="msg">${msgs[i].text}</span>`;
//         messages.appendChild(item);
//     }
// });

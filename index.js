const express = require("express");
const app = express();
const PORT = 5000;
const http = require("http");
const socketio = require("socket.io");

const redis = require("redis");
const client = redis.createClient();

app.set("view engine", "ejs");

const server = http.createServer(app);
const io = socketio(server).listen(server);

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/chat", (req, res) => {
    const username = req.query.username;

    io.emit("join", username);
    res.render("chat", { username });
});

io.on("connection", socket => {
    loadExistingMessages(socket);

    socket.on("message", ({ message, from }) => {
        console.log(message, from);

        // Save the message to Redis
        client.rpush("messages", `${from}:${message}`);
        io.emit("message", { message, from });
    });
});

function loadExistingMessages(socket) {
    client.lrange("messages", "0", "-1", (err, data) => {
        data.map(x => {
            const usernameMessage = x.split(":");
            const redisUsername = usernameMessage[0];
            const redisMessage = usernameMessage[1];

            socket.emit("message", {
                message: redisMessage,
                from: redisUsername
            });
        });
    });
}

server.listen(PORT, () => {
    console.log(`Server at ${PORT}`);
});

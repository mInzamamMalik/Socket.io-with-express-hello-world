import express from 'express';
import { createServer } from "http";
import { Server as socketIo } from 'socket.io';

let app = express()
// app.use(cors())
// app.use(bodyParser.json());

const PORT = process.env.PORT || 4000

app.get("/", (req, res, next) => {
    res.send("ping");
})

// THIS IS THE ACTUAL SERVER WHICH IS RUNNING
const server = createServer(app);

// handing over server access to socket.io
const io = new socketIo(server, { cors: { origin: "*", methods: "*", } });

let connectedUsers = [];

///////////////////////////// serverside connection events /////////////////////////////

io.engine.on("connection_error", (err) => {
    console.log('socket connection error: ', err.req);      // the request object
    console.log('error code: ', err.code);     // the error code, for example 1
    console.log('error message: ', err.message);  // the error message, for example "Session ID unknown"
    console.log('error context', err.context);  // some additional error context

});

io.on("connection", (socket) => {
    console.log("New client connected with id: ", socket.id);
    console.log('total client count: ', io.engine.clientsCount);

    // to emit data to a certain client
    socket.emit("topic 1", "some data")

    // collecting connected users in a array
    // connectedUsers.push(socket)

    socket.on("disconnect", (message) => {
        console.log("Client disconnected with id: ", message);
    });
});
///////////////////////////// serverside connection events /////////////////////////////


// to emit data to a certain client
//  connectedUsers[0].emit("topic 1", "some data")

setInterval(() => {

    // to emit data to all connected client
    // first param is topic name and second is json data
    io.emit("Test topic", { event: "ADDED_ITEM", data: "some data" });
    console.log("emiting data to all client");

}, 2000)

server.listen(PORT, function () {
    console.log("server is running on", PORT);
})
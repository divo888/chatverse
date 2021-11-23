//creating basic express server
//creating static folder to access across servers by using node core modules path joining server to html css
//create a server using built in core node modules http but using express is quit different by crerating a server variable
//define io variable for socket.io server by using previously created server
//create event listner onClientConnect Run when client connect
//we have to setup our front end to use socket.io server
//create a socket variable i frontend main.js we can access io() methhod by declaring script in our html
//we want this variable to to bidireactional communication
//first of all we have to emit our message to the server from server our client can access the message by onMessaage event listner
//emit catch method first emit into server catch from the server side
//in application we gotta lot of messages like user joined user leave the chat ad all that
//we're gonna use socket.broadcast.emit(); difference between this and previos on eis broadcast emit messages except user it self when other than user joined the chat someone joined the chat
//io.emit to emit everyone
//we're gonna create a form event listner 'submit' by accessing from main.js id 'form-chat';
//get message
//emit the message on server socket.emit()
//retrieve the message from cliient side
//we have to create dommanipulation to display message into our application
//he appendChild() method appends a node as the last child of a node.
//it will display the all types of messages
//we have to implement scrolls down # clear the input functionality
//instetad of string type message we want object type message so we have to creae a mesage formatter functiomn
//qs library for fetching url information add html script tag in html
//get username and room from url using qs library
//crete username and room on server side
//capturing from client side

const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const messageFormat = require("./utils/messageFormat");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const botName = "ChatCord Bot";

//set static folder

app.use(express.static(path.join(__dirname, "public")));

//run when client connect

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);
    //welcome current user
    socket.emit("message", messageFormat(botName, "welcome to ChatCord!!"));

    //Broadcast when user connects

    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        messageFormat(botName, `${user.username} has joined chat`)
      );

    //send users and room info

    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  //

  //listen the meassge from server
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", messageFormat(user.username, msg));
  });

  //Runs when client disconnects
  socket.on("disconnect", () => {
    //io.emit emit everyone a message including client
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        messageFormat(botName, `A ${user.username} has left chat`)
      );
    }
  });
});

const Port = 3000 || process.env.Port;

server.listen(Port, () => console.log(`server running on port ${Port}`));

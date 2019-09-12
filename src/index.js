const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const app = express();

//create server
const server = http.createServer(app);
//instance on socketio to config server
const io = socketio(server);
//PORT
const PORT = process.env.PORT || 3000;

//serve static public folder
app.use(express.static(path.join(__dirname,'../public')));

//listen for new client connection
io.on('connection',(socket)=>{
  //use socket object to communicate to the connected client.
  console.log('new connection established');
  //emit welcome event to the newly connected client.
  socket.emit('welcome', "Welcome to the chat group.." );
  //listen for sendMessage
  socket.on('sendMessage',(msgStr)=>{
    //emits receiveMessage to the all connected client.
    io.emit('message', msgStr)
  })

})
//listen for server
server.listen(PORT,(err)=>{
  console.log('Server started on port:: ', PORT);
})
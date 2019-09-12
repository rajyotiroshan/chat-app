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
io.on('connection',()=>{
  console.log('new connection established');
})
//listen for server
server.listen(PORT,(err)=>{
  console.log('Server started on port:: ', PORT);
})
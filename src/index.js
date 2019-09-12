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

let count = 0;
//listen for new client connection
io.on('connection',(socket)=>{
  //use socket object to communicate to the connected client.
  console.log('new connection established');
  //emit is used to send an custom/in-built event to the client
  socket.emit('countUpdated', count);
  //listen for client increment event
  socket.on('increment', ()=>{
    count++;
    //emit the countUpdated event to the clients.
    //socket.emit('countUpdated', count);//Note : only emitting to single connection
    io.emit('countUpdated',count);
  })
})
//listen for server
server.listen(PORT,(err)=>{
  console.log('Server started on port:: ', PORT);
})
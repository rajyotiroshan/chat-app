const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words');
const {generateMessage, generateLocationMessage} =  require('./utils/messages')

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
  socket.emit('message',generateMessage('Welcome'));
  //broadcast an event
  socket.broadcast.emit('message', generateMessage('A new user has joined!'));
  //listen for sendMessage
  socket.on('sendMessage',(msgStr, callback)=>{
    //filter any bad words
    const filter = new Filter();
    if(filter.isProfane(msgStr)){
      return callback('Profanity is not allowed.');
    }
    //emits receiveMessage to the all connected client.
    io.emit('message', generateMessage(msgStr))
    callback();
  })

  //listen for  sendLocation event
  socket.on('sendLocation',(location, acknowledge)=>{
    console.log(location);
    io.emit('locationMessage', generateLocationMessage('https://google.com/maps?q=${location.latitude},${location.longitude}'));
    acknowledge('Location shared');
  })

  //on disconnect
  socket.on('disconnect', ()=>{
    io.emit('message', generateMessage('A user has left!'));
  })

})
//listen for server
server.listen(PORT,(err)=>{
  console.log('Server started on port:: ', PORT);
})
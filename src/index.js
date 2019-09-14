const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words');
const {generateMessage, generateLocationMessage} =  require('./utils/messages')
const { getUser, addUser, removeUser, getUsersInRoom}  = require('./utils/users');

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
  /* //emit welcome event to the newly connected client.
  socket.emit('message',generateMessage('Welcome'));
  //broadcast an event
  socket.broadcast.emit('message', generateMessage('A new user has joined!')); */
  //listener for join
  socket.on('join', ({username, room}, ackCallback)=>{
    //new user unique id: socket.id
    const { error, user} =   addUser({id: socket.id, username, room });
    if(error) {
      return ackCallback(error);
    }
    //only use on server
    socket.join(user.room);//give access to a whole level of event which can be emmited to and listened by onl client in this room.
    socket.emit('message', generateMessage('Admin','Welcome'));
    socket.broadcast.to(user.room).emit('message', generateMessage('Admin',`${user.username} has joined`));
    //socket.emit, io.emit, socekkt.broadcast.emit
    //io.to.emit -->emit event to specific room clients
    //socket.broadcast.to.emit ---> evryone but itself but in a room
   ackCallback();
  })
  
  //listen for sendMessage
  socket.on('sendMessage',(msgStr, callback)=>{
    //filter any bad words
    const filter = new Filter();
    if(filter.isProfane(msgStr)){
      return callback('Profanity is not allowed.');
    }
    //access client id
    let id = socket.id;
    //access the room
    let userObj = getUser(id);
    let room = userObj.room;
    //emits receiveMessage to the all connected client.
    io.to(room).emit('message', generateMessage(userObj.username ,msgStr))
    callback();
  })

  //listen for  sendLocation event
  socket.on('sendLocation',(location, acknowledge)=>{
    let userObj  = getUser(socket.id);
    io.to(userObj.room).emit('locationMessage', generateLocationMessage(userObj.username,`https://google.com/maps?q=${location.latitude},${location.longitude}`));
    acknowledge('Location shared');
  })

  //on disconnect
  socket.on('disconnect', ()=>{
    const user = removeUser(socket.id) ;

    if(user) {
          io.to(user.room).emit('message', generateMessage('Admin',`${user.username} has left!`));
    }
  })

})
//listen for server
server.listen(PORT,(err)=>{
  console.log('Server started on port:: ', PORT);
})
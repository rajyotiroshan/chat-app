
const socket = io();
//listen for the welcome event from server.
socket.on('welcome', (msg)=>{
  console.log(msg);
})

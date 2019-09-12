
const socket = io();
//listen for the welcome event from server.
socket.on('welcome', (msg)=>{
  console.log(msg);
})

document.querySelector('#message-form').addEventListener("submit",(e)=>{
  e.preventDefault();
  let msg = e.target.elements.message.value;
  //emits sendMessage to server
  socket.emit('sendMessage', msg);
})

//listen for msgReceive event from server.
socket.on('message', (msgStr)=>{
  console.log(msgStr);
})
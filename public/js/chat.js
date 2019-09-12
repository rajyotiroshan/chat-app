
const socket = io();

//recieve countUpdated event from server
socket.on('countUpdated', (count)=>{
  console.log('The count is updated::--',count)
})

//click for button
document.querySelector('#increment').addEventListener('click',()=>{
  console.log('clicking');
  //on click emit an event to server.
  socket.emit('increment');
})
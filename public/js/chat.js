
const socket = io();

//recieve countUpdated event from server
socket.on('countUpdated', (count)=>{
  console.log('The count is updated::--',count)
})
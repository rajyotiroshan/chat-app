const socket = io();
//listen for the welcome event from server.
socket.on('welcome', (msg)=>{
  console.log(msg);
})

//listen for message-form submit event
document.querySelector('#message-form').addEventListener("submit",(e)=>{
  e.preventDefault();
  let msg = e.target.elements.message.value;
  //emits sendMessage to server
  socket.emit('sendMessage', msg, (err)=>{
    //call when server listen for sendMessage.
    if(err) {
      return console.log(err);
    }
    console.log('Message deliverede');
  });
})

//listen for message event from server.
socket.on('message', (msgStr)=>{
  console.log(msgStr);
})

//location
document.querySelector('#send-location').addEventListener('click',()=>{
  if(!navigator.geolocation) {
    return alert('Geolocation is not supported by your browser');
  }
  //else
  navigator.geolocation.getCurrentPosition((position)=>{
    //console.log(position);
    socket.emit('sendLocation', {latitude: position.coords.latitude, longitude: position.coords.longitude}, (msg)=>{
      console.log(msg);
    });
  })
})
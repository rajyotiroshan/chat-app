const socket = io();
//Elements.
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = document.querySelector('.msg-input');
const $messageFormButton = document.querySelector('.msg-send');
const $sendLocationButton = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');

//Template
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;

//listen for the welcome event from server.
socket.on('message', msgObj => {
  console.log(msgObj.text);
  //render when message comes in
  const html = Mustache.render(messageTemplate,{
    message: msgObj.text,
    createdAt: moment(msgObj.createdAt).format('h:mm a')
  });
  $messages.insertAdjacentHTML('beforeend', html);
});

//listen for locationMessage event 
socket.on('locationMessage', (location, callback)=>{
  const html = Mustache.render(locationTemplate, {
    locationURL: location
  })
  $messages.insertAdjacentHTML('beforeend', html);
  if(callback){
    callback();
  }
})
//listen for message-form submit event
$messageForm.addEventListener('submit', e => {
  e.preventDefault();
  //disable the form s.t user can not send another
  //just yet
  $messageFormButton.setAttribute('disabled', 'disabled');
  let msg = e.target.elements.message.value;
  //emits sendMessage to server
  socket.emit('sendMessage', msg, err => {
    //enable the form again.
    $messageFormButton.removeAttribute('disabled');
    //clear form input field.
    $messageFormInput.value = '';
    //focus form input
    $messageFormInput.focus();
    //call when server listen for sendMessage.
    if (err) {
      return console.log(err);
    }
    console.log('Message deliverede');
  });
});

//location
document.querySelector('#send-location').addEventListener('click', () => {
  if (!navigator.geolocation) {
    return alert('Geolocation is not supported by your browser');
  }
  //disable send location
  $sendLocationButton.setAttribute('disabled', 'disabled');
  //else
  navigator.geolocation.getCurrentPosition(position => {
    //console.log(position);
    socket.emit(
      'sendLocation',
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      },
      msg => {
        //enalbe the send location button
        $sendLocationButton.removeAttribute('disabled');

        console.log(msg);
      }
    );
  });
});

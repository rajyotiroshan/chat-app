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
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

//Options from query string
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true});

//autoScroll
const autoScroll = ()=>{
    //New message element,
    const $newMsg = $messages.lastElementChild;

    //height of newMsg
    const newMsgStyles = getComputedStyle($newMsg);
    const newMsgMargin = parseInt(newMsgStyles.marginBottom);
    const newMsgHeight = $newMsg.offsetHeight + newMsgMargin;
   //Visible height
   const visibleHeight = $messages.offsetHeight;

  //Heigth og messages conatainer
  const containerHeight = $messages.scrollHeight

  //How far have o scrolled
  const scrollOffset = $messages.scrollTop + visibleHeight

  if(containerHeight - newMsgHeight <= scrollOffset ){
    $messages.scrollTop = $messages.scrollHeight;
  }
}


//listen for the welcome event from server.
socket.on('message', msgObj => {
 // console.log(msgObj.text);
  //render when message comes in
  let username = msgObj.username;
  const html = Mustache.render(messageTemplate,{
    username,
    message: msgObj.text,
    createdAt: moment(msgObj.createdAt).format('h:mm a')
  });
  $messages.insertAdjacentHTML('beforeend', html);
  //autoScroll
  autoScroll();
});

//listen for locationMessage event 
socket.on('locationMessage', (locObj, callback)=>{
  const username = locObj.username;
  const html = Mustache.render(locationTemplate, {
    username,
    locationURL: locObj.url,
    createdAt: moment(locObj.createdAt).format('h:mm a')
  })
  $messages.insertAdjacentHTML('beforeend', html);
  autoScroll();
  if(callback){
    callback();
  }
})

//listen for roomData event from server
socket.on('roomData', ({room, users})=>{
  let html = Mustache.render(sidebarTemplate, {
    room,
    users
  });
  document.querySelector('#sidebar').innerHTML = html;
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

socket.emit('join', {username, room}, (errorMsg)=>{
  if(errorMsg) {
    alert(errorMsg)
    location.href = '/'
  }
});

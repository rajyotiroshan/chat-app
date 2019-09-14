const $menuBars = document.querySelector('.fa-bars');
const $chatSidebar = document.querySelector('.chat__sidebar');
$menuBars.addEventListener('click', (event)=>{
  console.log('clicked');
  $chatSidebar.classList.toggle('chat__sidebar--close');
})
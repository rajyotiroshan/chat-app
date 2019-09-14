const users = []

//addUser, removeUser, getUser, getUsersInRoom

const addUser = ({id, username, room} )=>{
  //clean the data
  username  = username.trim().toLowerCase()
  room = room.trim().toLowerCase();
  //validate the data
  if(!username || !room) {
    return {
      error: 'Username and room are required.'
    }
  }

  //username and room exist
  //Check for existing user
  const existingUser = users.find((user)=>{
    return user.room === room && user.username === username
  })

  //validate usernmae
  if(existingUser){
     return  {error: 'Username is in user'}
  }

  //Store user
  const user = { id, username, room}
  users.push(user);
  return {user}

} 

//removeUser
/**
 * @description remove a user
 * @argument user id
 * @returns removed user object
 */
const removeUser = (id) => {
  const index = users.findIndex(user=>user.id === id)
  
  
  if(index !==-1) {//a user is  found
    return users.splice(index, 1)[0];//return removed user object
  }
}

/* addUser({
  id: 22, username: 'Rajan', room: 'delhi'
})

const res = addUser({
  id: 33,
  username:'Rajan',
  room:'delhi'
})
console.log(users);
console.log(res); */
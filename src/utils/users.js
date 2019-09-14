const users = [/**{id, username, room} */]

/**
 * @description add a new user
 * @param {id, username, room}
 * @returns newly added userObj 
 */

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
  return {user}; //{user: {id, username, room}}

} 


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

/**
 * @description get a user
 * @argument user_id
 * @returns userObj or undefined
 */

 const getUser = user_id => {
   const userObj = users.find(userObj=> userObj.id === user_id);
   if(!user) return undefined;
   return userObj;
 }

 /**
  * @description get all users in a room
  * @argument room
  * @returns users array
  */

  const getUsersInRoom  = room =>{
    room = room.trim().toLowerCase();
    return users.filter(user=> user.room === room);
  }

  //export the functions

  module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
  }
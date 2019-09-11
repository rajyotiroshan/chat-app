const express = require('express')
const path = require('path');
const app = express();

//PORT
const PORT = process.env.PORT || 3000;

//serve static public folder
app.use(express.static(path.join(__dirname,'../public')));

//listen for server
app.listen(PORT,(err)=>{
  console.log('Server started on port:: ', PORT);
})
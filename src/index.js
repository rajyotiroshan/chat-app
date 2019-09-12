const path = require('path');
const http = require('http');
const express = require('express');

const app = express();

//create server
const server = http.createServer(app);

//PORT
const PORT = process.env.PORT || 3000;

//serve static public folder
app.use(express.static(path.join(__dirname,'../public')));

//listen for server
server.listen(PORT,(err)=>{
  console.log('Server started on port:: ', PORT);
})
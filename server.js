const express = require('express');
const app = express();
let server = require('http').createServer(app);
let io = require('socket.io').listen(server);
const path = require('path');
const fs = require('fs');
const mimicStream = require('./mimicStream.js');

//---------------SEND CLIENT FILES-----------------------
app.use(express.static(path.join(__dirname, 'client')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/index.html'));
});


//////////////////////////////SOCKETS///////////////////////////////////

let connections = [];

io.sockets.on('connection', (socket) => {
  connections.push(socket);
  console.log('CONNECTED: %s SOCKETS CONNECTED', connections.length)

  socket.on('disconnect', (data) => {
    connections.splice(connections.indexOf(socket), 1);
    console.log('CONNECTED: %s SOCKETS CONNECTED', connections.length);
  });

  //------------GET DATA FROM API AND SEND IT TO CLIENT --------------------
  // socket.on('ApiData', (data) => {
  //   io.sockets.emit('send data', data);
  // })

  // let data = 'testing from kyle'

  // console.log('function ', mimicStream.createStream());
  let newStream = mimicStream.createStream();

  io.sockets.emit('send data', apiCall())

    function apiCall() {
    return [
      {number: 5, createdAt: 1},
      {number: 7, createdAt: 2},
      {number: 9, createdAt: 3},
      {number: 2, createdAt: 4},
    ]
    }

  // setInterval(() => { io.sockets.emit('send data', newStream) }, 1000);

})






//------------------SERVER ---------------------------------------
server.listen(process.env.port || 3000, () => console.log('SERVER RUNNING ON 3000'));






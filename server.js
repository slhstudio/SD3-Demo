const express = require('express');
const app = express();
let server = require('http').createServer(app);
let io = require('socket.io').listen(server);
const path = require('path');
const fs = require('fs');
const mimicStream = require('./mimicStream.js');
const mimicStream2 = require('./mimicStream2.js');
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
  // console.log(newStream);
  setInterval(() => io.sockets.emit('send data', newStream), 500);
  // io.sockets.emit('send data', apiCall());
  // io.sockets.emit('send data', newStream);
    function apiCall() {
    return [
      {value: 5, createdAt: 1},
      {value: 7, createdAt: 2},
      {value: 9, createdAt: 3},
      {value: 2, createdAt: 4},
    ]
    }

  // setInterval(() => { io.sockets.emit('send data', newStream) }, 1000);

})






//------------------SERVER ---------------------------------------
server.listen(process.env.port || 3000, () => console.log('SERVER RUNNING ON 3000'));






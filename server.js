const express = require('express');
const app = express();
let server = require('http').createServer(app);
let io = require('socket.io').listen(server);
const path = require('path');
const fs = require('fs');
const mimicStream = require('./mimicStream.js');
const mimicStream2 = require('./mimicStream2.js');
var RTM = require("satori-sdk-js");

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

  //----------this socket connection is only if want to get data from graph.js-----
  // socket.on('ApiData', (data) => {
  //   io.sockets.emit('send data', data);
  // })


  // let data = 'testing from kyle'

  // console.log('function ', mimicStream.createStream());
  // let newStream = mimicStream.createStream();
  // // console.log(newStream);
  // setInterval(() => io.sockets.emit('send data', newStream), 500);
  // // io.sockets.emit('send data', apiCall());
  // // io.sockets.emit('send data', newStream);
  //   function apiCall() {
  //   return [
  //     {value: 5, createdAt: 1},
  //     {value: 7, createdAt: 2},
  //     {value: 9, createdAt: 3},
  //     {value: 2, createdAt: 4},
  //   ]
  //   }

  // setInterval(() => { io.sockets.emit('send data', newStream) }, 1000);



  //let newStream = mimicStream.createStream();
  //setInterval(() => io.sockets.emit('send data', newStream), 1000);

//------------------------------------------------------------------------
  // var endpoint = "wss://open-data.api.satori.com";
  // var appKey = "9BABD0370e2030dd5AFA3b1E35A9acBf";
  // var channel = "US-Bike-Sharing-Channel";

  // var rtm = new RTM(endpoint, appKey);
  // rtm.on("enter-connected", function() {
  //   console.log("Connected to RTM!");
  // });

  // var subscription = rtm.subscribe(channel, RTM.SubscriptionMode.SIMPLE);
  // subscription.on('rtm/subscription/data', function (pdu) {
  //   pdu.body.messages.forEach(function (msg) {
  //     //console.log('THIS IS THE MSG FROM SATORI', msg);
  //     var graph = new RT(msg);
  //     graph.line(msg);
  //     //io.sockets.emit('send data', msg);
 
  //   });
  // });

  // rtm.start();
//------------------------------------------------------------------------------


})

////////////GRAPH FUNCTIONS////////////////////////////////////////



class RT {
  constructor(config, url) {
    this.config = config;
    this.url = url;
  }

  line(config, url) {
    //console.log('this is our line graph', config.x, url);

   //console.log(config)
    io.sockets.emit('sendUserData', config );
    

  }


}

module.exports = RT;


//------------------SERVER ---------------------------------------
server.listen(process.env.port || 3000, () => console.log('SERVER RUNNING ON 3000'));





//////////////////////ANOTHER WAY TO CREATE GRAPH FUNCTIONS//////////////
// var RT = function(config) {
//   //return new RT.line(config)
// }

// RT.line = function (config) {
//   this.config = config;
//   console.log('this is our line')
//   //send configurations to socket in graph.js
// }

// RT.scatter = function (config) {
//   this.config = config;
//   console.log('this is our scatter')
//   //send configurations to socket in graph.js
// }
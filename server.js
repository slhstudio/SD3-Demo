const express = require('express');
const app = express();
const server = require('http').createServer(app);
const path = require('path');
const RTM = require("satori-sdk-js");
const streamline = require('../lib/index.js');

//---------------SEND CLIENT FILES-----------------------
app.use(express.static(path.join(__dirname, 'client')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/index.html'));
}, () => {
  console.log('sending js...');
  res.sendFile('../../lib/graphs/line.js')
});


//______________GET DATA____________________________________

let myData = [];
var endpoint = "wss://open-data.api.satori.com";
var appKey = "9BABD0370e2030dd5AFA3b1E35A9acBf";
var channel = "US-Bike-Sharing-Channel";

var rtm = new RTM(endpoint, appKey);
rtm.on("enter-connected", function () {
  console.log("Connected to RTM!");
});

var subscription = rtm.subscribe(channel, RTM.SubscriptionMode.SIMPLE);
subscription.on('rtm/subscription/data', function (pdu) {
  pdu.body.messages.forEach(function (msg) {


    if (msg.station_id < 100) {
      myData.push(msg);
      console.log('incoming data length', myData.length);
    };
  });

  let counter = 0;
  myData.forEach(obj => {
    obj.counter = counter++;
  });

});

rtm.start();


//____________________connect to lib / sockets___________________________________

let bikeStream = new streamline(server);

bikeStream.connect((socket) => {
    bikeStream.line(socket, myData);
});


server.listen(process.env.port || 3000, () => console.log('SERVER RUNNING ON 3000'));


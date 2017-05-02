const express = require('express');
const app = express();
const server = require('http').createServer(app);
const path = require('path');
const RTM = require("satori-sdk-js");
const streamline = require('./lib/index.js');
const dotenv = require('dotenv');

dotenv.load()

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
let counter = 0;

var rtm = new RTM(endpoint, appKey);
rtm.on("enter-connected", function () {
  console.log("Connected to RTM!");
});

var subscription = rtm.subscribe(channel, RTM.SubscriptionMode.SIMPLE);
subscription.on('rtm/subscription/data', function (pdu) {
  pdu.body.messages.forEach(function (msg) {

    if (msg.station_id < 300) {
      msg.counter = counter ++;

      myData.push(msg);

    };
  })

});

rtm.start();


//____________________connect to lib / sockets___________________________________
let config = {
  // setWidth: 10, //number
  // setHeight: 10, //number
  shiftingXAxis: true,
  xdomain: 10, //width of xAxis
  ydomain: 10, //height of yAxis
  xScale: "counter",//data for xAxis
  yScale: 'num_bikes_available',//data for yAxis
  xLabel_text: 'abc',
  yLabel_text: 'abc'
};

let bikeStream = new streamline(server);

bikeStream.connect((socket) => {
  bikeStream.line(socket, myData, config);
});


server.listen(process.env.PORT || 3000, () => console.log('SERVER RUNNING ON 3000'));


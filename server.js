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
  res.sendFile(path.join(__dirname, 'client/home-page.html'));
});


//______________GET DATA____________________________________

//BIKE STREAM
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
      msg.counter = counter++;
      myData.push(msg);

      if (myData.length > 20) {
        myData.shift();
      }
    }

    // if (msg.station_id < 250) {
    //   msg.counter2 = Math.random() * 19;
    //   myData2.push(msg);

    //   if (myData2.length > 20) {
    //     myData2.shift();
    //   }
    // }

  });

});

rtm.start();


//NY TRAFFIC
let myData2 = [
  { Borough: 'Bronx', Lat: 40.8464305, Long: 73.93213, Speed: 20},
  { Borough: 'Staten Island', Lat: 40.6077805, Long: 74.14091, Speed: 20 },
  { Borough: 'Queens', Lat: 40.78795, Long: 73.790191, Speed: 20 },
  { Borough: 'Manhattan', Lat: 40.71141, Long: 73.97866, Speed: 20 },
  { Borough: 'Brooklyn', Lat: 40.61632, Long: 74.0263, Speed: 20 },

];

var endpoint1 = "wss://open-data.api.satori.com";
var appKey1 = "A1FAF4aAb5637a603E53466cD2876778";
var channel1 = "nyc-traffic-speed";

var rtm1 = new RTM(endpoint1, appKey1);
rtm1.on("enter-connected", function () {
  console.log("Connected to RTM!");
});

var subscription = rtm1.subscribe(channel1, RTM.SubscriptionMode.SIMPLE);
subscription.on('rtm/subscription/data', function (pdu) {
  pdu.body.messages.forEach(function (msg) {

    for (let i = 0; i < myData2.length; i += 1) {
      if (myData2[i].Borough === msg.Borough) {
        myData2[i].Speed = (Number(myData2[i].Speed) + Number(msg.Speed)) / 2;
        myData2[i].Speed = msg.Speed;

      }
    }
  });
});

rtm1.start();

//____________________connect to lib / sockets___________________________________

let config = {
  setWidth: 700,
  setHeight: 500,
  shiftXAxis: true,
  xDomainUpper: 20,
  xDomainLower: 0,
  yDomainUpper: 40,
  yDomainLower: 0,
  xTicks: 10,
  yTicks: 10,
  xScale: 'counter',
  yScale: 'num_bikes_available',
  xLabel_text: '',
  yLabel_text: ''
};

let config2 = {
  setWidth: 700,
  setHeight: 500,
  shiftXAxis: true,
  xDomainUpper: 40.85,
  xDomainLower: 40.60,
  yDomainUpper: 74.0,
  yDomainLower: 73.5,
  xTicks: 10,
  yTicks: 10,
  xScale: 'Lat',
  yScale: 'Long',
  volume: 'Speed',
  xLabel_text: '',
  yLabel_text: '',
  circle_text: 'Borough',
};

let config3 = {
  colors: ['#FB3640', '#605F5E', '#1D3461', '#1F487E', '#247BA0'],
  colorDomain: [5, 10, 15, 20, 100],
  font: 'Source Sans Pro',
  fontSize: 40,
  padding: 15,
  rotate: 0,
}

let bikeStream = new streamline(server);

bikeStream.connect((socket) => {
  bikeStream.line(socket, myData, config);
  bikeStream.scatter(socket, myData2, config2);
  bikeStream.wordCloud(socket, config3);
})

server.listen(process.env.PORT || 3000, () => console.log('SERVER RUNNING ON 3000'));
const express = require('express');
const app = express();
// const server = require('http').createServer();
const path = require('path');
const RTM = require("satori-sdk-js");
const streamline = require('./lib/index.js');
const dotenv = require('dotenv');

dotenv.load()

//---------------SEND CLIENT FILES-----------------------


  function sendFiles(app) {
    app.use(express.static(path.join(__dirname, 'client')));

    app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, 'client/home-page.html'));
    });
    console.log('inside function')
  }
  
 


    // app.use(express.static(path.join(__dirname, 'client')));

    // app.get('/', (req, res) => {
    //   res.sendFile(path.join(__dirname, 'client/home-page.html'));
    // });

//______________GET DATA____________________________________

//BIKE STREAM
let myData = [];
<<<<<<< HEAD
let myData2 = [];
let myData3 = [];
let myData5 = [];
let myData6 = [];
let cacheTV = {};
var endpoint = "wss://open-data.api.satori.com";
var appKey = "9BABD0370e2030dd5AFA3b1E35A9acBf";
var channel = "US-Bike-Sharing-Channel";
var channelTraffic = "nyc-traffic-speed";
var channelTV = "tv-commercial-airings";
=======

var endpoint = "wss://open-data.api.satori.com";
var appKey = "9BABD0370e2030dd5AFA3b1E35A9acBf";
var channel = "US-Bike-Sharing-Channel";
>>>>>>> refacCloud
let counter = 0;
let counterBubble = 0;

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

<<<<<<< HEAD
    if (msg.station_id < 250) {
      msg.counter2 = Math.random() * 19;
      myData2.push(msg);

      if (myData2.length > 20) {
        myData2.shift();
      }
    }

    if (msg.station_id < 300) {
      msg.counter = counterBubble++;
      let idExists = false;
      
      for (let i = 0; i < myData5.length; i += 1) {
        if (myData5[i].station_id === msg.station_id) {
          myData5[i] = msg;
          idExists = true;
        }
      }

      if (!idExists) myData5.push(msg);
      if (myData5.length > 30) myData5.shift();
    };
  });
});

var subscriptionBar = rtm.subscribe(channelTraffic, RTM.SubscriptionMode.SIMPLE);
subscriptionBar.on('rtm/subscription/data', function (pdu) {
  pdu.body.messages.forEach(function (msg) {
    let found = false;
    for (let i = 0; i < myData3.length; i += 1) {
      if (myData3[i].Borough === msg.Borough) {
        myData3[i].Speed = (Number(myData3[i].Speed) + Number(msg.Speed)) / 2;
        found = true;
      }
    }
=======
    // if (msg.station_id < 250) {
    //   msg.counter2 = Math.random() * 19;
    //   myData2.push(msg);
>>>>>>> refacCloud

    //   if (myData2.length > 20) {
    //     myData2.shift();
    //   }
    // }

  });

});

var subscriptionTV = rtm.subscribe(channelTV, RTM.SubscriptionMode.SIMPLE);
subscriptionTV.on('rtm/subscription/data', function (pdu) {
  pdu.body.messages.forEach(function (msg) {
     let newMsg = JSON.parse(msg);
      
      if (!cacheTV[newMsg.genre]) {
        cacheTV[newMsg.genre] = 1;
        newMsg.count = cacheTV[newMsg.genre];
      } else  {
          cacheTV[newMsg.genre] = cacheTV[newMsg.genre] + 1;
          newMsg.count = cacheTV[newMsg.genre];
       }

      if (myData6.length === 0) myData6.push(newMsg);

      let found = false;
      for (let i = 0; i < myData6.length; i++) {
        if (myData6[i].genre === newMsg.genre) {
          myData6[i] = newMsg;
          found = true;
          break;
        }
      }
      if (!found)  myData6.push(newMsg);
    
  })
  
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

<<<<<<< HEAD
let config4 = {
  setWidth: 500,
  setHeight: 300,
  shiftYAxis: true,
  xDomainUpper: 20,
  xDomainLower: 0,
  yDomainUpper: 40,
  yDomainLower: 0,
  xTicks: 10,
  yTicks: 10,
  xScale: 'Borough',
  volume: 'Speed',
  xLabel_text: 'x axis label',
  yLabel_text: 'y axis label',
  color: ['#DAF7A6', '#FFC300', '#FF5733', '#C70039', '#900C3F', '#581845'],
};

let config5 = {
  setWidth: 700,
  setHeight: 500,
  text: 'id',
  volume: 'randNum',
};

let config6 = {
  setWidth: 700,
  setHeight: 500,
  text: 'station_id',
  volume: 'num_bikes_available',
};

let config7 = {
  setWidth: 700,                   
  setHeight: 700,                  
  category: 'genre',//category to be show in pie slices
  count: 'count'
};

let bikeStream = new streamline(sendFiles, 3000);

bikeStream.connect((socket) => {
  
  bikeStream.line(socket, myData, config);
  bikeStream.scatter(socket, myData2, config2);
  bikeStream.wordCloud(socket, config3);
  bikeStream.bar(socket, myData3, config4);
  //bikeStream.bubbleGraph(socket, myData4, config5);
  bikeStream.bubbleGraph(socket, myData5, config6);
  bikeStream.pie(socket, myData6, config7);
});

//server.listen(process.env.PORT || 4000, () => console.log('SERVER RUNNING ON 3000'));

// server.listen(process.env.PORT || 3000, () => console.log('SERVER RUNNING ON 3000'));
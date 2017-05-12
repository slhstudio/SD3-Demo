const express = require('express');
const app = express();
// const server = require('http').createServer();
const path = require('path');
const RTM = require("satori-sdk-js");
const streamline = require('./lib/index.js');
//var chai = require('chai');
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

let myData = [];
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

    msg.Speed = Number(msg.Speed);
    if (!found) myData3.push(msg);

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

//------------------

function createStream() {
  function ranNum() {
    return Math.floor(Math.random() * 10);;
  }
  function newArray() {
    for (let i = 0; i < array.length; i += 1) {
      array[i].randNum = ranNum();
    }
  }

  let array = [
    { id: 0, randNum: 7 },
    { id: 1, randNum: 6 },
    { id: 2, randNum: 3 },
    { id: 3, randNum: 9 },
    { id: 4, randNum: 9 },
    { id: 5, randNum: 5 },
    { id: 6, randNum: 7 }];

  setInterval(newArray, 1000);

  return array;
}

let myData4 = createStream();



//____________________connect to lib / sockets___________________________________

let config = {
  setWidth: 500,
  setHeight: 300,
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
  xDomainUpper: 20,
  xDomainLower: 0,
  yDomainUpper: 40,
  yDomainLower: 0,
  xTicks: 10,
  yTicks: 10,
  xScale: 'counter2',
  yScale: 'num_bikes_available',
  xLabel_text: '',
  yLabel_text: ''
};

let config3 = {
  colors: ['#FB3640', '#605F5E', '#1D3461', '#1F487E', '#247BA0'],
  colorDomain: [5, 10, 15, 20, 100],
  font: 'Source Sans Pro',
  fontSize: 40,
  padding: 15,
  rotate: 0,
}

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


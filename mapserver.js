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
//let check = [];
let myData = [];
let cache = {};
var endpoint = "wss://open-data.api.satori.com";
var appKey = "34DF1ecf6B793beA053a60aa1cdDdC2C";
var channel = "METAR-AWC-US";
let counter = 0;

var rtm = new RTM(endpoint, appKey);
rtm.on("enter-connected", function () {
  console.log("Connected to RTM!");
});

var subscription = rtm.subscribe(channel, RTM.SubscriptionMode.SIMPLE);
subscription.on('rtm/subscription/data', function (pdu) {
  pdu.body.messages.forEach(function (msg) {
    // let newMsg = JSON.parse(msg);
      
    //  console.log(msg);
   
  
      // if (myData.length === 0) 
      myData.push(msg);

      // let found = false;
      // for (let i = 0; i < myData.length; i++) {
      //   if (myData[i].genre === newMsg.genre) {
      //     myData[i] = newMsg;
      //     found = true;
      //     break;
      //   }
      // }
      // if (!found)  myData.push(newMsg);
      // console.log('myData', myData);
    
  })
  
});

rtm.start();


//____________________connect to lib / sockets___________________________________

let config = {
  setWidth: 900,                   
  setHeight: 700,                  
  latitude: 'latitude',
  longitude: 'longitude',
  propOne: 'temp_c',
  propTwo: 'wind_speed_kt'
};

let aviationData = new streamline(server);

aviationData.connect((socket) => {
  //  setInterval (() => {console.log('myData', myData[0])}, 1000);
  aviationData.map(socket, myData, config);
});


server.listen(process.env.PORT || 3000, () => console.log('SERVER RUNNING ON 3000'));


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
var channel = "satellites";
let counter = 0;

var rtm = new RTM(endpoint, appKey);
rtm.on("enter-connected", function () {
  console.log("Connected to RTM!");
});

var subscription = rtm.subscribe(channel, RTM.SubscriptionMode.SIMPLE);
subscription.on('rtm/subscription/data', function (pdu) {
  pdu.body.messages.forEach(function (msg) {

    let usLat;
    let usLon;

    function decDegrees (string, lat) {
      let result = string.split(':');
      let degrees = Number(result[0]);
      let minutes = Number(result[1]);
      let seconds = Number(result[2]);
  
      let minSec =  minutes + seconds/60;
      let decimalDegrees = (degrees + minSec/60).toFixed(3);
      
      //return latitude if in US
      if (lat) {
        if (degrees > 18 && degrees < 71) return decimalDegrees;
      }
      //returns longitude if in US
      if (degrees > -162 && degrees < -65) return decimalDegrees;
    }
   // console.log('lat', decDegrees(msg.latitude));
   // console.log('lon', decDegrees(msg.longitude));

    usLat = decDegrees(msg.latitude, true);
    usLon = decDegrees(msg.longitude, false);

    if (usLat && usLon) {
       //replace the properties in msg object
       msg.latitude = usLat;
       msg.longitude = usLon;
       myData.push(msg);
    }
    
   // console.log('usLat', usLat);
   // console.log('usLon', usLon);

   console.log(myData);
    
  })
  
});

rtm.start();


//____________________connect to lib / sockets___________________________________

let config = {
  setWidth: 900,                   
  setHeight: 700,                  
  latitude: 'latitude',
  longitude: 'longitude',
  propOne: 'speed',
  propTwo: 'elevation'
};

let satellites = new streamline(server);

satellites.connect((socket) => {
  //  setInterval (() => {console.log('myData', myData[0])}, 1000);
  satellites.map(socket, myData, config);
});


server.listen(process.env.PORT || 3000, () => console.log('SERVER RUNNING ON 3000'));


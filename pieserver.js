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
});


//______________GET DATA____________________________________
//let check = [];
let myData = [];
let cache = {};
var endpoint = "wss://open-data.api.satori.com";
var appKey = "34DF1ecf6B793beA053a60aa1cdDdC2C";
var channel = "tv-commercial-airings";
let counter = 0;

var rtm = new RTM(endpoint, appKey);
rtm.on("enter-connected", function () {
  console.log("Connected to RTM!");
});

var subscription = rtm.subscribe(channel, RTM.SubscriptionMode.SIMPLE);
subscription.on('rtm/subscription/data', function (pdu) {
  pdu.body.messages.forEach(function (msg) {
     let newMsg = JSON.parse(msg);
      
      if (!cache[newMsg.genre]) {
        cache[newMsg.genre] = 1;
        newMsg.count = cache[newMsg.genre];
      } else  {
          cache[newMsg.genre] = cache[newMsg.genre] + 1;
          newMsg.count = cache[newMsg.genre];
       }
   
    //  if (!check.includes(newMsg.genre))
    //    check.push(newMsg.genre);
    //    console.log(check);
      //console.log(check);
//only push message into my data whose genre is not already there.
// if it is there, replace it

//check.includes(newMsg.genre)
      if (myData.length === 0) myData.push(newMsg);
//cache[newMsg.genre]
      let found = false;
      for (let i = 0; i < myData.length; i++) {
        if (myData[i].genre === newMsg.genre) {
          myData[i] = newMsg;
          found = true;
          break;
        }
      }
      if (!found)  myData.push(newMsg);
      console.log('myData', myData);
    
  })
  
});

rtm.start();


//____________________connect to lib / sockets___________________________________

let config = {
  setWidth: 700,                   
  setHeight: 500,                  
  category: 'genre',//category to be show in pie slices
  count: 'count'
};

let tvAdAirings = new streamline(server);

tvAdAirings.connect((socket) => {
 // setInterval (() => {console.log('myData', myData)}, 1000);
  tvAdAirings.pie(socket, myData, config);
});


server.listen(process.env.PORT || 3000, () => console.log('SERVER RUNNING ON 3000'));


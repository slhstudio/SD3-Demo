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
  res.sendFile('../../lib/graphs/pie.js')
});


//______________GET DATA____________________________________

let myData = [];
var endpoint = "wss://open-data.api.satori.com";
var appKey = "34DF1ecf6B793beA053a60aa1cdDdC2C";
var channel = "nyc-traffic-speed";
let counter = 0;

var rtm = new RTM(endpoint, appKey);
rtm.on("enter-connected", function () {
  console.log("Connected to RTM!");
});

var subscription = rtm.subscribe(channel, RTM.SubscriptionMode.SIMPLE);
subscription.on('rtm/subscription/data', function (pdu) {
  pdu.body.messages.forEach(function (msg) {

    // if (msg.station_id < 300) {
    //   msg.counter = counter ++;

      myData.push(msg);
      if(myData.length > 20) {
        myData.shift();
      };
   // };
  })

});

rtm.start();


//____________________connect to lib / sockets___________________________________

let config = {
  setWidth: 700,                   
  setHeight: 500,                  
  category_name: 'Borough',//category to be show in pie slices
  category_value: 'Speed' //value of data to be shown in pie slices
};

let bikeStream = new streamline(server);

bikeStream.connect((socket) => {
  //console.log('myData', myData);
  bikeStream.pie(socket, myData, config);
});


server.listen(process.env.PORT || 3000, () => console.log('SERVER RUNNING ON 3000'));


const RT = require('./server.js');
var RTM = require("satori-sdk-js");

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

  var graph = new RT(myData);
  console.log('myData', myData);
  graph.line(myData);

});

rtm.start();


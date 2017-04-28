const RT = require('./server.js');
var RTM = require("satori-sdk-js");

var endpoint = "wss://open-data.api.satori.com";
var appKey = "9BABD0370e2030dd5AFA3b1E35A9acBf";
var channel = "US-Bike-Sharing-Channel";

var rtm = new RTM(endpoint, appKey);
rtm.on("enter-connected", function() {
  console.log("Connected to RTM!");
});

var subscription = rtm.subscribe(channel, RTM.SubscriptionMode.SIMPLE);
subscription.on('rtm/subscription/data', function (pdu) {
  pdu.body.messages.forEach(function (msg) {
    // console.log('THIS IS THE MSG FROM SATORI', msg);
    var graph = new RT(msg);
    graph.line(msg);
  });
});

rtm.start();

//observable stream
//throttling with or without observables 
//functional reactive programming 
//RXJS; 

/////////////////////////////////
// let config = {
//   x: 10,
//   y: 15, 
// }

// let url = 'www.google.com'

// var graph = new RT(config, url);

// graph.line(config, url);

//temp.scatter(config);
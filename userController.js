const RT = require('./server.js');
var RTM = require("satori-sdk-js");

let myData = [];
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
<<<<<<< HEAD
    // console.log('THIS IS THE MSG FROM SATORI', msg);
    var graph = new RT(msg);
    graph.line(msg);
=======
    
    if (msg.station_id < 100) {
      myData.push(msg);
      console.log('incoming data length', myData.length);
    };
>>>>>>> 4de3b4f292c2624eec2bcf101d70ce10c6b9a9fc
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

//observable stream
//throttling with or without observables 
//functional reactive programming 
//RXJS; 

/////////////////////////////////
// let config = {
//   width:  
//   height:  
//   xdomain:  //width of xAxis
//   ydomain:  //height of yAxis
//   xticks:
//   yticks: 
//   xScale:   //data for xAxis
//   yScale:   //data for yAxis
 //  xLabel_text: 
//   yLabel_text:

// }

// let url = 'www.google.com'

// var graph = new RT(config, url);

// graph.line(config, url);

//temp.scatter(config);
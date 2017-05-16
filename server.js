const express = require('express');
const app = express();
// const server = require('http').createServer();
const path = require('path');
const RTM = require("satori-sdk-js");
const streamline = require('./lib/index.js');
const dotenv = require('dotenv');

dotenv.load()


//______________GET DATA____________________________________

// var endpoint1 = "wss://open-data.api.satori.com";
// var appKey = "A1FAF4aAb5637a603E53466cD2876778";
// var channel1 = "nyc-traffic-speed";
var endpoint = "wss://open-data.api.satori.com";
var appKey = "9BABD0370e2030dd5AFA3b1E35A9acBf";
var channelBike = "US-Bike-Sharing-Channel";
var channelTraffic = "nyc-traffic-speed";
var channelTV = "tv-commercial-airings";
var channelNASA = 'satellites';
var channelTwitter = "Twitter-statuses-sample";

let scatterData = [];
let lineData = [];
let barData = [];
let bubbleData = [];
let pieData = [];
let cacheTV = {};
let counterLine = 0;
let counterBubble = 0;
let mapData = [];

//-------------------------------------

var rtm = new RTM(endpoint, appKey);
rtm.on("enter-connected", function () {
  console.log("Connected to RTM!");
});

var subscriptionBike = rtm.subscribe(channelBike, RTM.SubscriptionMode.SIMPLE);
subscriptionBike.on('rtm/subscription/data', function (pdu) {
  pdu.body.messages.forEach(function (msg) {

    //line chart data
    if (msg.station_id < 300) {
      msg.counter = counterLine++;
      lineData.push(msg);

      if (lineData.length > 20) {
        lineData.shift();
      }
    }

    // bubble chart data 
    if (msg.station_id < 300) {
      msg.counter = counterBubble++;
      let idExists = false;

      for (let i = 0; i < bubbleData.length; i += 1) {
        if (bubbleData[i].station_id === msg.station_id) {
          bubbleData[i] = msg;
          idExists = true;
        }
      }

      if (!idExists) bubbleData.push(msg);
      if (bubbleData.length > 30) bubbleData.shift();
    };
  });
});

var subscriptionTraffic = rtm.subscribe(channelTraffic, RTM.SubscriptionMode.SIMPLE);
subscriptionTraffic.on('rtm/subscription/data', function (pdu) {
  pdu.body.messages.forEach(function (msg) {

    //bar data 
    let found = false;
    for (let i = 0; i < barData.length; i += 1) {
      if (barData[i].Borough === msg.Borough) {
        barData[i].Speed = (Number(barData[i].Speed) + Number(msg.Speed)) / 2;
        found = true;
      }
    }

    msg.Speed = Number(msg.Speed);
    if (!found) barData.push(msg);

  });
});

var subscriptionTV = rtm.subscribe(channelTV, RTM.SubscriptionMode.SIMPLE);
subscriptionTV.on('rtm/subscription/data', function (pdu) {
  pdu.body.messages.forEach(function (msg) {

    if (!cacheTV[msg.genre]) {
      cacheTV[msg.genre] = 1;
      msg.count = cacheTV[msg.genre];
    } else {
      cacheTV[msg.genre] = cacheTV[msg.genre] + 1;
      msg.count = cacheTV[msg.genre];
    }

    if (pieData.length === 0) pieData.push(msg);

    let found = false;
    for (let i = 0; i < pieData.length; i++) {
      if (pieData[i].genre === msg.genre) {
        pieData[i] = msg;
        found = true;
        break;
      }
    }
    if (!found) pieData.push(msg);
  })
});

var subscriptionNASA = rtm.subscribe(channelNASA, RTM.SubscriptionMode.SIMPLE);
subscriptionNASA.on('rtm/subscription/data', function (pdu) {
  pdu.body.messages.forEach(function (msg) {

    function decDegrees(string) {
      let result = string.split(':');
      let degrees = Number(result[0]);
      let minutes = Number(result[1]);
      let seconds = Number(result[2]);

      let minSec = minutes + seconds / 60;
      let decimalDegrees = (degrees + minSec / 60).toFixed(3);

      return decimalDegrees;
    }

    let lat = decDegrees(msg.latitude);
    let lon = decDegrees(msg.longitude);

    msg.latitude = lat;
    msg.longitude = lon;
    if (mapData.length < 200) {
      mapData.push(msg);
    } else {
      mapData.shift();
      mapData.push(msg);
    }

  })

});

rtm.start();




//SCATTER DATA -- TWITTER
var subscriptionTwitter = rtm.subscribe(channelTwitter, RTM.SubscriptionMode.SIMPLE);
subscriptionTwitter.on('rtm/subscription/data', function (pdu) {
  pdu.body.messages.forEach(function (msg) {

    if (msg.created_at && msg.user.time_zone === 'Pacific Time (US & Canada)' && msg.lang === 'en') {
      let obj = {
        followers_count: msg.user.followers_count,
        favourites_count: msg.user.favourites_count,
        statuses_count: msg.user.statuses_count,
        time_zone: msg.user.time_zone,
        text: msg.text,
        created_at: msg.created_at,
        id: msg.id,
        screen_name: msg.user.screen_name
      }
      scatterData.push(obj);

      if (scatterData.length > 100) {
        scatterData.shift()
          ;
      }
    }
  });
});


//____________________CONFIGURATION FILES___________________________________

let lineConfig = {
  setWidth: 700,
  setHeight: 500,
  shiftXAxis: true,
  xDomainUpper: 50,
  xDomainLower: 0,
  yDomainUpper: 40,
  yDomainLower: 0,
  xTicks: 10,
  yTicks: 10,
  xScale: 'counter',
  yScale: 'num_bikes_available',
  xLabel_text: 'at the currently reporting station',
  yLabel_text: 'number of available bikes'
};

let scatterConfig = {
  setWidth: 700,
  setHeight: 500,
  //axis
  xDomainUpper: 1500,
  xDomainLower: 0,
  yDomainUpper: 20000,
  yDomainLower: 0,
  xTicks: 10,
  yTicks: 10,
  xLabel_text: 'Number of Followers',
  yLabel_text: 'Number of Tweets',
  label_font_size: 20,
  xScale: 'followers_count',
  yScale: 'statuses_count',
  volume: 'favourites_count',
  circle_text: '',
  transition_speed: 5000,
};

let wordCloudConfig = {
  colors: ['#FB3640', '#605F5E', '#1D3461', '#1F487E', '#247BA0'],
  colorDomain: [5, 20, 40, 60, 100],
  font: 'Source Sans Pro',
  fontSize: 40,
  padding: 10,
  rotate: 0,
  height: 600,
  width: 2000,
}

let barConfig = {
  setWidth: 800,
  setHeight: 400,
  shiftYAxis: true,
  xDomainUpper: 20,
  xDomainLower: 0,
  yDomainUpper: 50,
  yDomainLower: 0,
  xTicks: 10,
  yTicks: 50,
  xScale: 'Borough',
  volume: 'Speed',
  yLabel_text: 'Miles Per Hour',
  label_text_size: 20,
  transition_speed: 1000,
  color: ['#DAF7A6', '#FFC300', '#FF5733', '#C70039', '#900C3F', '#581845'],
};

let bubbleConfig2 = {
  setWidth: 700,
  setHeight: 500,
  text: 'id',
  volume: 'randNum',
};

let bubbleConfig = {
  setWidth: 700,
  setHeight: 500,
  text: 'station_id',
  volume: 'num_bikes_available',
};

let pieConfig = {
  setWidth: 400,
  setHeight: 400,
  category: 'genre',//category to be show in pie slices
  count: 'count'
};

let mapConfig = {
  setWidth: 1300,
  setHeight: 800,
  latitude: 'latitude',
  longitude: 'longitude',
  propOne: 'satellite',
  propTwo: ''
};

//---------------SEND CLIENT FILES-----------------------


function sendFiles(app) {
  app.use(express.static(path.join(__dirname, 'client')));

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/home-page.html'));
  });
  // console.log('inside function')
}


//---------------------------------CALL STREAMLINE FUNCTION------------------------------------

let myStream = new streamline(sendFiles, 3000);

myStream.connect((socket) => {
  myStream.line(socket, lineData, lineConfig);
  myStream.scatter(socket, scatterData, scatterConfig);
  myStream.wordCloud(socket, wordCloudConfig);
  myStream.bar(socket, barData, barConfig);
  myStream.bubbleGraph(socket, bubbleData, bubbleConfig);
  myStream.pie(socket, pieData, pieConfig);
  myStream.map(socket, mapData, mapConfig);
});


// server.listen(process.env.PORT || 3000, () => console.log('SERVER RUNNING ON 3000'));
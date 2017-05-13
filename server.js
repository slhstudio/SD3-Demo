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
// var appKey1 = "A1FAF4aAb5637a603E53466cD2876778";
// var channel1 = "nyc-traffic-speed";
var endpoint = "wss://open-data.api.satori.com";
var appKey = "9BABD0370e2030dd5AFA3b1E35A9acBf";
var channelBike = "US-Bike-Sharing-Channel";
var channelTraffic = "nyc-traffic-speed";
var channelTV = "tv-commercial-airings";
var channelTwitter = "Twitter-statuses-sample";

let scatterData = [];
let lineData = [];
let barData = [];
let bubbleData = [];
let pieData = [];
let cacheTV = {};
let counterLine = 0;
let counterBubble = 0;

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
    if(!found) barData.push(msg);
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

      if (pieData.length === 0) pieData.push(newMsg);

      let found = false;
      for (let i = 0; i < pieData.length; i++) {
        if (pieData[i].genre === newMsg.genre) {
          pieData[i] = newMsg;
          found = true;
          break;
        }
      }
      if (!found)  pieData.push(newMsg);
    
  })
  
});

rtm.start();


//SCATTER DATA -- TWITTER
var subscriptionTwitter = rtm.subscribe(channelTwitter, RTM.SubscriptionMode.SIMPLE);
subscriptionTwitter.on('rtm/subscription/data', function (pdu) {
  pdu.body.messages.forEach(function (msg) {
    // console.log(msg);

    if(msg.created_at && msg.user.time_zone === 'Pacific Time (US & Canada)' && msg.lang === 'en') {
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

      if(scatterData.length > 100) scatterData.shift();
    }



  });
});

//____________________CONFIGURATION FILES___________________________________

let lineConfig = {
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

let scatterConfig = {
  setWidth: 700,
  setHeight: 500,
  shiftXAxis: true,
  xDomainUpper: 1500,
  xDomainLower: 0,
  yDomainUpper: 20000,
  yDomainLower: 0,
  // circle_r_domain: 1500, 
  xTicks: 10,
  yTicks: 10,
  xScale: 'followers_count',
  yScale: 'statuses_count',
  volume: 'favourites_count',
  xLabel_text: '',
  yLabel_text: '',
  circle_text: '',
};

let wordCloudConfig = {
  colors: ['#FB3640', '#605F5E', '#1D3461', '#1F487E', '#247BA0'],
  colorDomain: [5, 10, 15, 20, 100],
  font: 'Source Sans Pro',
  fontSize: 40,
  padding: 10,
  rotate: 0,
}

let barConfig = {
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
  setWidth: 700,                   
  setHeight: 700,                  
  category: 'genre',//category to be show in pie slices
  count: 'count'
};

//---------------SEND CLIENT FILES-----------------------


  function sendFiles(app) {
    app.use(express.static(path.join(__dirname, 'client')));

    app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, 'client/home-page.html'));
    });
    console.log('inside function')
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
});


// server.listen(process.env.PORT || 3000, () => console.log('SERVER RUNNING ON 3000'));
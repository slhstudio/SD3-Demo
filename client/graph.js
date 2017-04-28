

var socket = io.connect();

socket.on('send userData', (data) => {
  //console.log('DATA FROM USER', data);
})

//////////if want to call API here would need line below////////////////
// socket.emit('ApiData', apiCall() )

let que = [];
let allData = [];
let counter = 0;

/////////////USE SOCKET DATA TO BUILD D3 GRAPH//////////////////////////////////

var margin = { top: 10, right: 20, bottom: 30, left: 30 };
var width = 900 - margin.left - margin.right;
var height = 565 - margin.top - margin.bottom;

var svg = d3.select('.chart')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  

socket.on('sendUserData', (data) => {
  console.log('this is the data ______ ', data);
  if (data.num_docks_available && data.num_bikes_available && allData.length < 60) {
    que.push(data);
  }
  
  if (data.length >= 20) {
    console.log('more than 20')
    data = data.slice(data.length - 21);
  }

  var xScale = d3.scaleLinear()
    .domain([0, 20])
    // .domain([
    //   data.length <= 20 ? 0 : d3.min(data, d => d.num_bikes_available),
    //   Math.max(20, d3.max(data, d => d.num_bikes_available))
    // ])
    .range([0, width]);
  svg
    .append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(xScale).ticks(10));

  var yScale = d3.scaleLinear()
    .domain([0, 20])
    .range([height, 0]);
  svg
    .append('g')
    .call(d3.axisLeft(yScale).ticks(10));

  var line = d3.line()
    .x(d => xScale(d.num_bikes_available))
    .y(d => yScale(d.num_docks_available))
    .curve(d3.curveCatmullRom.alpha(0.5));

  d3.selectAll("path.line").remove();

  svg
    .selectAll('.line')
    .data(allData)
    .enter()
    .append('path')
    .attr('class', 'line')
    .attr('d', d => line(allData))
    .style('stroke', '#FF9900')
    .style('stroke-width', 2)
    .style('fill', 'none');


})


//////////RENDER DATA EVERY 1 SECOND////////////////////////////////////////

  setInterval(() => {
      allData.push(que[counter]);
      counter++;
      console.log('INSIDE INTERVAL', counter)
    }, 1000)


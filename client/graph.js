
var socket = io.connect();  

function apiCall() {
  return [
    {number: 5, createdAt: 1},
    {number: 7, createdAt: 2},
    {number: 9, createdAt: 3},
    {number: 2, createdAt: 4},
  ]
}


//////////GET API DATA HERE////////////////
socket.emit('ApiData', apiCall() )


/////////////USE API DATA TO BUILD D3 GRAPH//////////////////////////////////
socket.on('send data', (data) => {
  console.log('DATA FROM SOCKET', data);
  

  //add d3 graph here

  var margin = { top: 10, right: 20, bottom: 30, left: 30 };
  var width = 900 - margin.left - margin.right;
  var height = 565 - margin.top - margin.bottom;

  var svg = d3.select('.chart')
    .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
    .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');


  var xScale = d3.scaleLinear()
    .domain([0, 10])
    .range([0, width]);
  svg
    .append('g')
      .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(xScale).ticks(10));

  var yScale = d3.scaleLinear()
    .domain([0,10])
    .range([height, 0]);
  svg
    .append('g')
    .call(d3.axisLeft(yScale).ticks(10));

  var line = d3.line()
    .x(d => xScale(d.createdAt))
    .y(d => yScale(d.number))
    .curve(d3.curveCatmullRom.alpha(0.5));

  svg
    .selectAll('.line')
    .data(data)
    .enter()
    .append('path')
    .attr('class', 'line')
    .attr('d', d => line(data))
    .style('stroke', '#FF9900')
    .style('stroke-width', 2)
    .style('fill', 'none');




})



var socket = io.connect();  

var margin = { top: 10, right: 20, bottom: 30, left: 30 };
var width = 900 - margin.left - margin.right;
var height = 565 - margin.top - margin.bottom;

var svg = d3.select('.chart')
    .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
    .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

socket.on('send data', (data) => {

  if(data.length >= 20) {
    console.log('more than 20')
    data = data.slice(data.length-21);
  }

  var xScale = d3.scaleLinear()
    .domain([
        data.length <= 20 ? 0 : d3.min(data, d => d.createdAt),
        Math.max(20, d3.max(data, d => d.createdAt))
    ])
    .range([0, width]);
  
  svg
    .append('g')
      .attr('transform', `translate(0, ${height})`)
    
  svg.select('g')
    .call(d3.axisBottom(xScale).ticks(10));

  var yScale = d3.scaleLinear()
    .domain([0,10])
    .range([height, 0]);

  svg
    .append('g')
    .call(d3.axisLeft(yScale).ticks(10));

  var line = d3.line()
    .x(d => xScale(d.createdAt))
    .y(d => yScale(d.value))
    .curve(d3.curveCatmullRom.alpha(0.5));

    d3.selectAll("path.line").remove();

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


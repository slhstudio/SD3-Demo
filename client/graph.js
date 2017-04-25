var socket = io.connect();  

function apiCall() {
  return [
    {value: 56, time: 7},
    {value: 76, time: 8},
    {value: 96, time: 9},
    {value: 26, time: 10},
  ]
}


//////////GET API DATA HERE////////////////
socket.emit('ApiData', apiCall() )


/////////////USE API DATA TO BUILD D3 GRAPH//////////////////////////////////
socket.on('send data', (data) => {
  console.log('DATA FROM SOCKET', data);
  
  //parse data
  let times = data.map(obj => obj.time)
  let values = data.map(obj => obj.value)
  console.log('VALUES', values);
  console.log('TIMES', times);

  //add d3 graph here


  // d3.selectAll("path.line").remove();
  // svg.append("path")
  //   .datum(data)
  //   .attr("class", "line")
  //   .attr("d", line);

  // var margin = {top: 20, right: 20, bottom: 30, left: 50},
  //   width = 960 - margin.left - margin.right,
  //   height = 500 - margin.top - margin.bottom;

  // var x = d3.scale.linear()
  //   .range([0, width]);

  // var y = d3.scale.linear()
  //   .range([height, 0]);

  // var xAxis = d3.svg.axis()
  //   .scale(x)
  //   .orient("bottom");

  // var yAxis = d3.svg.axis()
  //   .scale(y)
  //   .orient("left");

  // var line = d3.svg.line()
  //   .x(function (d) { return x(d.time); })
  //   .y(function (d) { return y(d.value); });

  // var svg = d3.select("body").append("svg")
  //   .attr("width", width + margin.left + margin.right)
  //   .attr("height", height + margin.top + margin.bottom)
  //   .append("g")
  //   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // y.domain([0, 100]);
  // x.domain([0, 20]);

  // svg.append("g")
  //   .attr("class", "x axis")
  //   .attr("transform", "translate(0," + height + ")")
  //   .call(xAxis)
  //   .append("text")
  //   .attr("x", width - margin.right)
  //   .text("Period");

  // svg.append("g")
  //   .attr("class", "y axis")
  //   .call(yAxis)
  //   .append("text")
  //   .attr("transform", "rotate(-90)")
  //   .attr("y", 6)
  //   .attr("dy", ".71em")
  //   .style("text-anchor", "end")
  //   .text("Count");

})
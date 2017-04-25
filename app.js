var socket = io.connect();




//////////GET API DATA HERE////////////////
// socket.emit('ApiData', apiCall() )


/////////////USE API DATA TO BUILD D3 GRAPH//////////////////////////////////
socket.on('send data', (data) => {
  console.log('DATA FROM SOCKET', data);

  //parse data
  // let times = data.map(obj => obj.time)
  // let values = data.map(obj => obj.value)
  // console.log('VALUES', values);
  // console.log('TIMES', times);

  //add d3 graph here

  var margin = { top: 10, right: 20, bottom: 30, left: 30 };
  var width = 900 - margin.left - margin.right;
  var height = 565 - margin.top - margin.bottom;

// d3.json(data, (err, data) => {



    console.log('data: ', data);


    var svg = d3.select('.chart')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .call(responsivefy)
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
      .domain([0, 100])
      .range([height, 0]);
    svg
      .append('g')
      .call(d3.axisLeft(yScale).ticks(10));

    var line = d3.line()
      .x(d => {console.log('INSIDE LINE: ',d);xScale(d.createdAt)})
      .y(d => yScale(d.value))
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

// })

//__________________________________________Responsify__________________________________________
  function responsivefy(svg) {

    var container = d3.select(svg.node().parentNode),
      width = parseInt(svg.style("width")),
      height = parseInt(svg.style("height")),
      aspect = width / height;

    svg.attr("viewBox", "0 0 " + width + " " + height)
      .attr("preserveAspectRatio", "xMinYMid")
      .call(resize);

    d3.select(window).on("resize." + container.attr("id"), resize);

    function resize() {
      var targetWidth = parseInt(container.style("width"));
      svg.attr("width", targetWidth);
      svg.attr("height", Math.round(targetWidth / aspect));
    }

  }


})
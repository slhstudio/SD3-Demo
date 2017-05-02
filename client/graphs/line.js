
let socket = io.connect();

let margin = { top: 20, right: 20, bottom: 20, left: 20 };
let width = 700 - margin.left - margin.right;
let height = 500 - margin.top - margin.bottom;

let currData = [];
let svg = d3.select('.chart')
    .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
    .append('g')
      .attr('class', 'mount')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

socket.on('sendStreamData', (allData) => {
  
  if( allData.length > 0 || (currData.length > 0 && allData[allData.length-1].xScale !== currData[currData.length-1].xScale)) {
    currData = allData;
  if (allData.length >= 50) allData = allData.slice(-49);
    drawViz(allData)
  };
})

function drawViz(allData) {
  console.log('ALL DATA:  ', allData);
  d3.select('svg').remove();

  svg = d3.select('.chart')
    .append('svg')
      .attr('width', allData[0].setWidth + margin.left + margin.right)
      .attr('height', allData[0].setHeight + margin.top + margin.bottom)
    .append('g')
      .attr('class', 'mount')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');


  let xScale;

  if (allData[0].shiftXAxis) {
    xScale = d3.scaleLinear()
      .domain([
        d3.min(allData, d => d.xScale),
        Math.max(50, d3.max(allData, d => d.xScale))
      ])
      .range([0, allData[0].setWidth]);

  } else {
    xScale = d3.scaleLinear()
      .domain([0, allData[0].xDomain])
      .range([0, allData[0].setWidth]);
  }
  
  let yScale = d3.scaleLinear()
    .domain([0, 35])
    .range([height, 0]);

  let line = d3.line()
    .x(d => xScale(d.xScale))
    .y(d => yScale(d.yScale))

  svg
    .append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(xScale).ticks(allData[0].xTicks));

  // Add the text label for the x axis
  svg.append("text")
    .attr('transform', 'translate(' + (width) + ' ,' + (height + margin.bottom) + ')')
    .style('text-anchor', 'end')
    .style('font-family', 'sans-serif')
    .style('font-size', '13px')
    .text('');

  svg
    .append('g')
    .attr('class', 'yAxis')
    .call(d3.axisLeft(yScale).ticks(allData[0].yTicks));

  svg.append("text")
    .attr("transform", "rotate(90)")
    .attr("y", -10)
    .attr("x", -40)
    .attr("dy", "1em")
    .style("text-anchor", "end")
    .style('font-family', 'sans-serif')
    .style('font-size', '13px')
    .text('what');

  // d3.selectAll('path.line').remove();
  // d3.selectAll('.dot').remove();

  svg
    .selectAll('.line')
    .data(allData)
    .enter()
    .append('path')
    .attr('class', 'line')
    .attr('d', d => line(allData))
    .style('stroke', '#5176B6')
    .style('stroke-width', 1)
    .style('fill', 'none')
    .style('stroke-linejoin', 'round');

  svg.selectAll('.dot')
    .data(allData)
    .enter()
    .append('circle')
    .attr('class', 'dot')
    .attr('cx', line.x())
    .attr('cy', line.y())
    .attr('r', 3)
    .style('fill', 'white')
    .style('stroke-width', 1.5)
    .style('stroke', 'DodgerBlue');
}
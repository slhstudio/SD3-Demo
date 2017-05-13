(() => {

  let socket = io.connect();

  let margin = { top: 25, right: 20, bottom: 25, left: 50 };
  let width = 700 - margin.left - margin.right;
  let height = 500 - margin.top - margin.bottom;

  //array to compare incoming data >> if data is the same, do not rerender

  let dataCache = {};
  let settings;

  socket.on('sendScatterData', (data) => {
    if (data.length > 0) {
      // console.log('DATA FROM CLIENT: ', data)
      if (!settings) settings = drawGrid(data);

      let needsChange = false;

      for (let i = 0; i < data.length; i += 1) {
        if (data[i].yScale !== dataCache[data[i].id]) {
          needsChange = true;
          dataCache[data[i].id] = data[i].yScale;
        }
      }
      if (needsChange) drawContent(settings, data);
    }

  });

  function drawGrid(data) {
    d3.select('#scatterSVG').remove();

    let svg = d3.select('#scatter-plot')
      .append('svg')
      .attr('id', 'scatterSVG')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

    let yScale = d3.scaleLinear()
      .domain([data[0].yDomainLower, data[0].yDomainUpper])
      .range([height, 0])
      //make axis end on round numbers b/c pulling non-round #s from our data 
      .nice()
    let yAxis = d3.axisLeft(yScale)
    svg.call(yAxis);

    let xScale = d3.scaleLinear()
      .domain([data[0].xDomainLower, data[0].xDomainUpper])
      .range([0, width])
      .nice();
    let xAxis = d3.axisBottom(xScale).ticks(10);

    svg
      .append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis);

    let settings = {
      svg,
      yScale,
      yAxis,
      xScale,
      xAxis,
    }

    return settings;
  }

  function drawContent(settings, data) {

    

    let svg = settings.svg;
    let yScale = settings.yScale;
    let yAxis = settings.yAxis;
    let xScale = settings.xScale;
    let xAxis = settings.xAxis;

    width = data[0].setWidth - margin.left - margin.right;
    height = data[0].setHeight - margin.top - margin.bottom;

    let rScale = d3.scaleSqrt()
      .domain([0, d3.max(data, d => d.volume)])
      .range([10, 50]);

    //create circles but group them in svg container so work better with text when animating 
    let circles = svg
      .selectAll('.ball')
      .data(data);

console.log('drawing content...', circles.exit());
    //EXIT.
    // var exitTransition = d3.transition().duration(750).each(function () {
    //   circles.exit()
    //     .style("background", "red")
    //     .transition()
    //     .style("opacity", 0)
    //     .remove();
    // });
    //ENTER.
    let newCircles = circles
      .enter()
      .append('g')
      .attr('class', 'ball')
      //instead of .attr('cx', d => xScale(d.cost)) we use transform b/c we are creating circles inside a g tag instead of 'circle' in selectAll and append
      .attr('transform', d => {
        return `translate(${xScale(d.xScale)}, ${yScale(d.yScale)})`
      })

    newCircles.append('circle')
      .transition()
      .duration(300)
      .attr("opacity", 1)
      .attr('class', 'circle')
      //where to place circles on graph
      .attr('cx', 0)
      .attr('cy', 0)
      //how big circle should be 
      .attr('r', d => rScale(d.volume))
      .style('fill', 'steelblue')
      .style('fill-opacity', 0.5)

    //UPDATE.

    circles
      // .transition()
      // .duration(300)
      // .attr("opacity", 1)
      .attr('transform', d => {
        return `translate(${xScale(d.xScale)}, ${yScale(d.yScale)})`
      })

    circles.select('.circle')
      // .transition()
      // .duration(300)
      .attr("opacity", 1)
      //where to place circles on graph
      .attr('cx', 0)
      .attr('cy', 0)
      //how big circle should be 
      .attr('r', d => rScale(d.volume))


    //IF WANT TEXT INSIDE CIRCLES UNCOMMENT THIS SECTION BELOW 
    // circles
    //   .append('text')
    //   //put text in middle of element
    //   .style('text-anchor', 'middle')
    //   .style('fill', 'black')
    //   //adjust y position by 4px
    //   .attr('y', 4)
    //   //set text to the country code
    //   .text(d => d.xLabel_text)
  }
})()





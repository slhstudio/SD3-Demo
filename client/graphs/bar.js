(function () {
  let socket = io.connect();

  //set initial SVG params
  let margin, width, height;


  //array to compare incoming data >> if data is the same, do not rerender
  let dataCache = {};

  //function that draws setup
  //on socket, function that draws elements

  function drawGrid(data) {
    console.log(data); 
    margin = { top: 20, right: 20, bottom: 25, left: 20 };
    width = data[0].setWidth - margin.left - margin.right;
    height = data[0].setHeight - margin.top - margin.bottom;

    // d3.select('#bar-graph').selectAll('svg').remove();
    let svg = d3.select('#bar-graph')
      .append('svg')
      .attr('id', 'barSVG')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

    let yScale = d3.scaleLinear()
      .domain([0, data[0].yTicks])
      .range([height, 0]);

    let yAxis = d3.axisLeft(yScale);

    svg.call(yAxis);

    let settings = {
      data,
      svg,
      yScale,
      yAxis,
    }

    return settings;
  }

  function drawChart(settings, data) {

    let xScale = d3.scaleBand()
      .paddingOuter(.5)
      .paddingInner(0.1)
      .domain(data.map(d => d.xScale))
      .range([0, width]);

    let xAxis = d3.axisBottom(xScale)
      .ticks(5)
      .tickSize(10)
      .tickPadding(5);

    d3.select('#xAxis').remove();
    settings.svg
      .append('g')
      .attr('id', 'xAxis')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis)
      .selectAll('text')

    //ENTER.
    let column = settings.svg.selectAll('g.column-container')
      .data(data);

    let newColumn = column
      .enter()
      .append('g')
      .attr('class', 'column-container')


    newColumn.append('rect').transition()
      .duration(300)
      .attr("opacity", 1)
      .attr('class', 'column')
      .attr('x', d => xScale(d.xScale))
      .attr('y', d => settings.yScale(d.volume))
      .attr('width', d => xScale.bandwidth())
      .attr('height', d => height - settings.yScale(d.volume))
      .attr('id', d => d.id)
      .attr('fill', (d, i) => d.color[i]);

    //UPDATE.
    let updateNodes = column.select('.column');

    if (Object.keys(dataCache).length === data.length) {
      updateNodes._groups[0] = column.select('.column')._groups[0].filter(d => d.__data__.volume === dataCache[d.__data__.id]);
    }

    updateNodes.transition()
      .duration(1000)
      .attr("opacity", 1)
      .attr('width', d => xScale.bandwidth())
      .attr('height', d => height - settings.yScale(d.volume))
      .attr('x', d => xScale(d.xScale))
      .attr('y', d => settings.yScale(d.volume))
  }

  let settings;

  socket.on('sendBarData', (data) => {

    $("#json-viewer").replaceWith("<div id='json-viewer'></div>")

    if (data.length > 0) {
      if (!settings) {
        settings = drawGrid(data)
      };
      drawChart(settings, data);

      for (let i = 0; i < data.length; i += 1) {
        dataCache[data[i].id] = data[i].volume;



        $("#json-viewer").prepend( "<span class='json-stats'>" + data[i].xScale + ": " + Math.round(data[i].volume) + "<span>")
      }
    }
  })

})();

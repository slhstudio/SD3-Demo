(function () {
  let socket = io.connect();

  //set initial SVG params
  let margin, width, height;


  //array to compare incoming data >> if data is the same, do not rerender
  let dataCache = {};

  //function that draws setup
  //on socket, function that draws elements

  function drawGrid(data) {
    margin = { top: 20, right: 20, bottom: 25, left: 20 };
    width = 500 - margin.left - margin.right;
    height = 300 - margin.top - margin.bottom;

    // d3.select('#bar-graph').selectAll('svg').remove();
    let svg = d3.select('#bar-graph')
      .append('svg')
      .attr('id', 'barSVG')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

    let yScale = d3.scaleLinear()
      .domain([0, 70])
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
      .data(data, d => d.xScale);

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
    if (data.length > 0) {
      if (!settings) {
        console.log('filling settings');
        settings = drawGrid(data)
      };
      drawChart(settings, data);

      for (let i = 0; i < data.length; i += 1) {
        dataCache[data[i].id] = data[i].volume;
      }
    }
  })







  // socket.on('sendBarData', (allData) => {
  //   let incomingData = isNewData(currData, allData);
  //   if (incomingData === 'NEW_OBJ') {
  //     currData = allData;
  //     drawViz(allData);
  //   }
})();

// function drawViz(allData) {
//   d3.select('svg').remove();

//   svg = d3.select('#bar-graph')
//     .append('svg')
//     .attr('id', 'barSVG')
//     .attr('width', width + margin.left + margin.right)
//     .attr('height', height + margin.top + margin.bottom)
//     .append('g')
//     .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

//   let yScale = d3.scaleLinear()
//     .domain([0, 70])
//     .range([height, 0]);

//   let yAxis = d3.axisLeft(yScale);

//   svg.call(yAxis);

//   let xScale = d3.scaleBand()
//     .paddingOuter(.5)
//     .paddingInner(0.1)
//     .domain(allData.map(d => d.xScale))
//     .range([0, width]);

//   let xAxis = d3.axisBottom(xScale)
//     .ticks(5)
//     .tickSize(10)
//     .tickPadding(5);

//   svg
//     .append('g')
//     .attr('transform', `translate(0, ${height})`)
//     .call(xAxis)
//     .selectAll('text')

//   svg
//     .selectAll('rect')
//     .data(allData)
//     .enter()
//     .append('rect')
//     .attr('x', d => xScale(d.xScale))
//     .attr('y', d => yScale(d.volume))
//     .attr('width', d => xScale.bandwidth())
//     .attr('height', d => height - yScale(d.volume))
//     .attr('id', d => d.id)
//     .attr('fill', (d, i) => d.color[i]);
// }

// function isNewData(a, b) {
//   if (a.length !== b.length) { return 'NEW_OBJ' };

//   let yScale = d3.scaleLinear()
//     .domain([0, 70])
//     .range([height, 0]);


//   for (let i = 0; i < a.length; i += 1) {
//     if (a[i].xScale === b[i].xScale && a[i].volume !== b[i].volume) {

//       reRenderNode(b[i]);

//     } else if (a[i].xScale !== b[i].xScale) {
//       return 'NEW_OBJ';
//     };
//   }
//   return 'OLD_DATA';
// }

// function reRenderNode(changedObj) {
//   let yScale = d3.scaleLinear()
//     .domain([0, 70])
//     .range([height, 0]);

//   let node = d3.select('#' + changedObj.id);

//   node
//     .attr('y', yScale(changedObj.volume))
//     .attr('height', height - yScale(changedObj.volume))
// }
// })();
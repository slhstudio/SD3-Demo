
var margin = { top: 10, right: 20, bottom: 30, left: 30 };
var width = 400 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;

/////////////////MAKE BG///////////////////////////////////////
var svg = d3.select('.chart')
  .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    // .call(responsivefy)
  .append('g')
    .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');


////////////GET DATA/////////////////////////////////////
d3.json('./data2.json', (err, data) => {
  //---------------create scales---------------------
  var yScale = d3.scaleLinear()
    .domain(d3.extent(data, d => d.expectancy))
    .range([height, 0])
    //make axis end on round numbers b/c pulling non-round #s from our data 
    .nice()
  var yAxis = d3.axisLeft(yScale)
  svg.call(yAxis);

  var xScale = d3.scaleLinear()
    .domain(d3.extent(data, d => d.cost))
    .range([0, width])
    .nice();
  var xAxis = d3.axisBottom(xScale).ticks(5)
  svg
    .append('g')
      .attr('transform', `translate(0, ${height})`)
    .call(xAxis);  

  //circles scale
  var rScale = d3.scaleSqrt()
    .domain([0, d3.max(data, d => d.population)])
    .range([0, 40])

  //create circles but group them in svg container so work better with text when animating 
  var circles = svg
    .selectAll('.ball')
    .data(data) 
    .enter()
    .append('g')
    .attr('class', 'ball')
    //instead of .attr('cx', d => xScale(d.cost)) we use transform b/c we are creating circles inside a g tag instead of 'circle' in selectAll and append
    .attr('transform', d => {
      return `translate(${xScale(d.cost)}, ${yScale(d.expectancy)})`
    })

  circles
    .append('circle')
    //where to place circles on graph
    .attr('cx', 0)
    .attr('cy', 0)
    //how big circle should be 
    .attr('r', d => rScale(d.population))
    .style('fill', 'steelblue')
    .style('fill-opacity', 0.5)

  circles
    .append('text')
    //put text in middle of element
    .style('text-anchor', 'middle')
    .style('fill', 'black')
    //adjust y position by 4px
    .attr('y', 4)
    //set text to the country code
    .text(d => d.code)
   
});







/////////////BOILERPLATE FUNC TO MAKE GRAPH RESPONSIVE /////////////////////
function responsivefy(svg) {
  // get container + svg aspect ratio
  var container = d3.select(svg.node().parentNode),
      width = parseInt(svg.style("width")),
      height = parseInt(svg.style("height")),
      aspect = width / height;

  // add viewBox and preserveAspectRatio properties,
  // and call resize so that svg resizes on inital page load
  svg.attr("viewBox", "0 0 " + width + " " + height)
      .attr("preserveAspectRatio", "xMinYMid")
      .call(resize);

  // to register multiple listeners for same event type,
  // you need to add namespace, i.e., 'click.foo'
  // necessary if you call invoke this function for multiple svgs
  // api docs: https://github.com/mbostock/d3/wiki/Selections#on
  d3.select(window).on("resize." + container.attr("id"), resize);
  // get width of container and resize svg to fit it
  function resize() {
      var targetWidth = parseInt(container.style("width"));
      svg.attr("width", targetWidth);
      svg.attr("height", Math.round(targetWidth / aspect));
  }
}





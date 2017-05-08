
let socket = io.connect();

//set initial SVG params
let margin = { top: 10, right: 10, bottom: 10, left: 10 };
let width = 500 - margin.left - margin.right;
let height = 500 - margin.top - margin.bottom;
let radius = width / 2;


socket.on('sendPieData', (allData) => {

 // if (error) throw error;
console.log('allData', allData);
d3.select('svg').remove();

//color range
var color = d3.scaleOrdinal()
.range(['#BBDEF8', '#98CAF9', '#64B5F6', '#42A5F5', '#2196F3']);

// arc generator for pie
var arc = d3.arc()
  .outerRadius(radius - 10)
  .innerRadius(0);

//
var labelArc = d3.arc()
  .outerRadius(radius - 50)
  .innerRadius(radius - 50)

//pie generator
var pie = d3.pie()
  .sort(null)
  .value(5);

//define svg for pie
var svg = d3.select('.chart')
  .append('svg')
  .attr('width', width)
  .attr('height', height)
  .append('g')
  .attr('transform', 'translate(' + width/2 + ', ' + height/2 + ')');

  //parse the data
  // allData.forEach(d => {
  //   d.category_name = d.category_name;
  //   d.category_value = +d.category_value;
  // });

 //pie:
  //append g elements (arc)
  var g = svg.selectAll('.arc')
    .data(pie(allData))
    .enter()
    .append('g')
    .attr('class', 'arc');

console.log('category', allData[0].category);

  //append the path of the arc
  g.append('path')
    .attr('d', arc)
    .style('fill', d => color(d.allData.category))
    // .transition()
    // .ease(d3.easeLinear)
    // .duration(2000)
    // .attrTween('d', pieTween);
  
  //append the text (labels)
  g.append('text')
    .transition()
    .ease(d3.easeLinear)
    .duration(2000)
    .attr('transform', d => ('translate(' + labelArc.centroid(d) + ')'))
    .attr('dy', '.35em')
    .text(allData.category);


//  function pieTween(b) {
//   b.innerRadius = 0;
//   var i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
//   return (t => arc(i(t)));
// }

});
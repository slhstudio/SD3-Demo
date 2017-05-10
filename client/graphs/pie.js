(function() {
let socket = io.connect();

//set initial SVG params
let margin = { top: 10, right: 10, bottom: 10, left: 10 };
let width = 600 - margin.left - margin.right;
let height = 600 - margin.top - margin.bottom;
let radius = width / 2;

// let currData = [];
// let svg;

socket.on('sendPieData', (allData) => {


drawViz(allData);

function drawViz(allData) {
//d3.select('svg').remove();

// var color = d3.scaleOrdinal()//
// .range(['#BBDEF8', '#98CAF9', '#64B5F6', '#42A5F5', '#2196F3']);

var color = d3.scaleSequential(d3.interpolateSpectral)
   .domain([0, 25]);

// arc generator for pie
var arc = d3.arc()
  .outerRadius(radius - 10)
  .innerRadius(20);

//
var labelArc = d3.arc()
  .outerRadius(radius + 15)
  .innerRadius(radius - 5)

//pie generator
var pie = d3.pie()
  .sort(null)
  .value(d => d.count); 

//define svg for pie
var svg = d3.select('.chart')
  .append('svg')
  .attr('width', width)
  .attr('height', height)
  .append('g')
  .attr('transform', 'translate(' + width/2 + ', ' + height/2 + ')');

 //pie:
  //append g elements (arc)
  var g = svg.selectAll('.arc')
    .data(pie(allData))
    .enter()
    .append('g')
    .attr('class', 'arc');

  //append the path of the arc
  g.append('path')
    .attr('d', arc)
    .style('fill', (d, i) => {
      console.log(d); 
      return color(d.index);
    })
    .style('stroke', '#fff');
    // .transition()
    // .ease(d3.easeLinear)
    // .duration(2000)
    // .attrTween('d', pieTween);
  
  //append the text (labels)
  g.append('text')
    // .transition()
    // .ease(d3.easeLinear)
    // .duration(2000)
    // .attr('transform', d => ('translate('  + labelArc.centroid(d) + ')')) //('translate(' + labelArc.centroid(d) + ')'))
    // .attr('dy', '.2em')
    // .text(d => d.data.category)

    //	pie.append("text")
	  .attr("transform", d => {
    let midAngle = d.endAngle < Math.PI ? d.startAngle/2 + d.endAngle/2 : d.startAngle/2  + d.endAngle/2 + Math.PI ;
      //let midAngle =  d.startAngle/2  + d.endAngle/2 + Math.PI ;

	  	return "translate(" + labelArc.centroid(d)[0] + "," + labelArc.centroid(d)[1] + ") rotate(-90) rotate(" + (midAngle * 180/Math.PI) + ")"; })
	  .attr("dy", ".35em")
    .attr('font-size', '14px')
	  .attr('text-anchor','middle')
	  .text(d =>  d.data.category);


//  function pieTween(b) {
//   b.innerRadius = 0;
//   var i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
//   return (t => arc(i(t)));
// }

}

 
  })
})();






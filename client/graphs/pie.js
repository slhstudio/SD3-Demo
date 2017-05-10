(function() {
let socket = io.connect();

//set initial SVG params
let margin = { top: 10, right: 10, bottom: 10, left: 10 };
let width = 600 - margin.left - margin.right;
let height = 600 - margin.top - margin.bottom;
let radius = width / 2;

let currData = [];
//let svg;

socket.on('sendPieData', (newData) => {
  if (currData != newData) {
    currData = newData;
    drawViz(currData);
  }

  function drawViz(data) {
    console.log('data', data);
   
    //console.log('width', data[0].setWidth);

    width = data[0].setWidth - margin.left - margin.right;
    height = data[0].setHeight - margin.top - margin.bottom;

    d3.select('svg').remove();

  //var color = d3.scaleOrdinal()//
  //.range(['#BBDEF8', '#98CAF9', '#64B5F6', '#42A5F5', '#2196F3']);

    let color = d3.scaleSequential(d3.interpolateSpectral)
      .domain([0, 25]);

    // arc generator for pie
    let arc = d3.arc()
      .outerRadius(radius - 10)
      .innerRadius(20);

  // arc generator for labels
    let labelArc = d3.arc()
      .outerRadius(radius + 30)
      .innerRadius(radius + 10)

    //pie generator
    let pie = d3.pie()
      .sort(null)
      .value(d => d.count); 

  //define svg for pie
    let svg = d3.select('#piechart')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(' + width/2 + ', ' + height/2 + ')');

  //pie:
    //append g elements (arc)
    let g = svg.selectAll('.arc')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc');

    //append the path of the arc
    g.append('path')
      .attr('d', arc)
      .style('fill', (d, i) => color(d.index))
      .style('stroke', '#fff')
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

    //pie.append("text")
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






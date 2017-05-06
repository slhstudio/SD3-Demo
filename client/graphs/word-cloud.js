
//get data from socket and store it in freq

var freq = [{"text":"study","size": 34},{"text":"motion","size": 22},{"text":"horse","size": 54}];

function includes(word){
  return freq.some(obj => {
    return obj.text === word;
  })
}

socket.on('send audioData', (data) => {
  console.log('WORD CLOUD AUDIO DATA', data);
  //if word is in freq arr, then add 1; if not add it
	data.split(' ').forEach(word => {
    freq.forEach(obj => {
      if (obj.text === word) {
        obj.size += 10;
      }
      if (!includes(word)) {
        freq.push(
          {text: word, size: 10}
        )
      }
    })
	});



//--------------------CREATE GRAPH----------------------------------
  //d3 version 3 way of adding color;
  //let fillColor = d3.scale.category20b();
  
  let fillColor = d3.scaleOrdinal(d3.schemeCategory20);
  let w = 1200;
  let h = 500;

  cloud()
    .size([w, h])
    .words(freq) 
    .padding(25)
    .rotate(0)      
    .font("Impact")
    .fontSize(function(d) { return d.size; })
    .on("end", drawCloud)
    .start();

  function drawCloud(words) {
    //remove so doesn't make multiple word clouds
		d3.select("svg").remove()
		
    d3.select("#word-cloud").append("svg")
        .attr("width", w)
        .attr("height", h)
      .append("g")
      .attr("transform", "translate(" + w/2 + "," + h/2 + ")")
      .selectAll("text")
        .data(words)
        .enter().append("text")
        .style("font-size", function(d) { return (d.size) + "px"; })
        .style("font-family", "Impact")
        .style("fill", function(d, i) { return fillColor(i); })
        .attr("text-anchor", "middle")
        .attr("transform", function(d,i) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
      .text(function(d) { return d.text; });
  }

})

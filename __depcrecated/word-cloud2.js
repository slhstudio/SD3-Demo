
//get data from socket and store it in freq

var freq = [{"text":"study","size": 34},{"text":"motion","size": 22},{"text":"horse","size": 54}];

function includes(word){
  return freq.some(obj => {
    return obj.text === word;
  })
}

socket.on('send audioData', (data) => {
  console.log('WORD CLOUD AUDIO DATA', data);
  //if word is in freq arr, then add 10; if not add it
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
  
  // let fillColor = d3.scaleOrdinal(d3.schemeCategory20);
  // let w = 1200;
  // let h = 500;

  // cloud().size([w, h])
  //   .words(freq) 
  //   .padding(25)
  //   .rotate(0)      
  //   .font("Impact")
  //   .fontSize(function(d) { return d.size; })
  //   .on("end", drawCloud)
  //   .start();

  // function drawCloud(words) {
  //   //remove so doesn't make multiple word clouds
	// 	//d3.select("svg").remove();
		
  //   d3.select("#word-cloud").append("svg")
  //       .attr("width", w)
  //       .attr("height", h)
  //     .append("g")
  //     .attr("transform", "translate(" + w/2 + "," + h/2 + ")")
  //     .selectAll("text")
  //       .data(words)
  //       .enter().append("text")
  //       .style("font-size", function(d) { return (d.size) + "px"; })
  //       .style("font-family", "Impact")
  //       .style("fill", function(d, i) { return fillColor(i); })
  //       .attr("text-anchor", "middle")
  //       .attr("transform", function(d,i) {
  //         return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
  //       })
  //     .text(function(d) { return d.text; });
  // }

  //-----------------------------------------------------

  function wordCloud(selector) {

    var fill = d3.scale.category20();

    //Construct the word cloud's SVG element
    var svg = d3.select(selector).append("svg")
        .attr("width", 1200)
        .attr("height", 500)
        .append("g")
        .attr("transform", "translate(250,250)");


    //Draw the word cloud
    function draw(words) {
        var cloud = svg.selectAll("g text")
                        .data(words, function(d) { return d.text; })

        //Entering words
        cloud.enter()
            .append("text")
            .style("font-family", "Impact")
            .style("fill", function(d, i) { return fill(i); })
            .attr("text-anchor", "middle")
            .attr('font-size', 1)
            .text(function(d) { return d.text; });

        //Entering and existing words
        cloud
            .transition()
                .duration(600)
                .style("font-size", function(d) { return d.size + "px"; })
                .attr("transform", function(d) {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })
                .style("fill-opacity", 1);

        //Exiting words
        cloud.exit()
            .transition()
                .duration(200)
                .style('fill-opacity', 1e-6)
                .attr('font-size', 1)
                .remove();
    }

  return {
        update: function(words) {
            cloud().size([1200, 500])
                .words(words)
                .padding(5)
                .rotate(function() { return ~~(Math.random() * 2) * 90; })
                .font("Impact")
                .fontSize(function(d) { return d.size; })
                .on("end", draw)
                .start();
        }
    }
  }

  function showNewWords(vis) {
    vis.update(freq);
  }
  
  var myWordCloud = wordCloud('#word-cloud');

  //Start cycling through the demo data
  showNewWords(myWordCloud);


})

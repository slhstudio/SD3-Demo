(function() {
let socket = io.connect();

//set initial SVG params
let margin = { top: 25, right: 20, bottom: 25, left: 20 };
let width = 700 - margin.left - margin.right;
let height = 500 - margin.top - margin.bottom;


socket.on('sendMapData', (allData) => {
   console.log('allData', allData);
	 width = allData[0].setWidth - margin.left - margin.right;
   height = allData[0].setHeight - margin.top - margin.bottom;
  
	 d3.select('svg').remove();
			//Define map projection
			var projection = d3.geoMercator()
                   .translate([width/2, height/1.5])
                   .scale((width - 1) / 2 / Math.PI);

			//Define path generator
			var path = d3.geoPath()
          .projection(projection);

			// Create a variable to hold the main svg element
			var svg = d3.select('#map')
						.append('svg')
						.attr("width", width)
						.attr("height", height);

      // Group to hold the maps and borders
      var g = svg.append('g')
           .attr('id', 'world-map');

      // Group to hold all of the satellites
      var satellites = svg.append('g')
                 .attr('id', 'all-satellites');

			//Load in GeoJSON data
		d3.json('https://s3-us-west-2.amazonaws.com/s.cdpn.io/25240/world-110m.json', function(error, world) {
    if(error) throw error;
				
				//Bind data and create one path per GeoJSON feature
			 // Append the World Map
    var worldMap = g.append('path')
    // .attr('clip-path', 'url(#clip-path)') // attaches the clip path to not draw the map underneath the x axis
     .datum(topojson.merge(world, world.objects.countries.geometries)) // draws a single land object for the entire map
     .attr('class', 'land')
     .attr('d', path)
     .style('fill', 'steelblue');

	// Append the World Map Country Borders
    g.append('path')
     .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
     .attr('class', 'boundry')
     .attr('d', path)
     .style('fill', 'none')
     .style('stroke', 'white');

		satellites.selectAll('g')
           .data(allData)
           .enter()
           .append('g')
          //  .attr('id', function(d) {
          //        return d.id;
          //  })
           .attr('class', 'sat-group');

    // Create the satellite circle 
        satellites.selectAll('.sat-group')
          .append('circle')
            .attr('cx', function(d) {
              console.log(d);
              console.log('lon', d.longitude);
                 return projection([d.longitude, d.latitude])[0];
           })
          .attr('cy', function(d) {
                 return projection([d.longitude, d.latitude])[1];
           })
          .attr('r', '3px')
          .attr('class', 'circle quake-circle')
          .style('fill', 'red')
          .style('opacity', 0.75)
        
          });

				// svg.append("g")
				//    	.attr("class", "bubble")
				// 	.selectAll("circle")
				// 	.data(allData)
				// 		//.sort(function(a,b) {return b.Fatalities - a.Fatalities; }))
				// 	.enter()
				// 	.append("circle")
				// 	.attr("cx", (d) => {
				// 		console.log('d', d);
				// 		console.log('d.lon', d.longitude);
				// 		return projection([d.longitude, d.latitude])[0];
				// 	})
				// 	.attr("cy", d => projection([d.longitude, d.latitude])[1])
				// 	.attr("r", '5px')
				// 	.attr("fill", "red");
			})
	
})();		
	
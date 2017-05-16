(function() {
let socket = io.connect();

//set initial SVG params
let margin = { top: 25, right: 20, bottom: 25, left: 20 };
let width = 700 - margin.left - margin.right;
let height = 500 - margin.top - margin.bottom;

let dataCache = {};
let settings;

socket.on('sendMapData', (data) => {
 
	  if (data.length > 0) {
     //  console.log('data', data)
      if (!settings) settings = drawMap(data);

      // let needsChange = false;

      // for (let i = 0; i < data.length; i += 1) {
      //   if (data[i].latitude !== dataCache[data[i].propOne]) {
      //       needsChange = true;
      //       dataCache[data[i].propOne] = data[i].latitude;
          
      //     console.log('dataCache', dataCache);
      //   }
      // }
     // if (needsChange) drawContent(settings, data);
      else drawContent(settings, data);
    }

   });

  function drawMap (data) { 
      width = data[0].setWidth - margin.left - margin.right;
      height = data[0].setHeight - margin.top - margin.bottom;
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

    //  var satellites = svg.append('g')
    //       .attr('id', 'all-satellites');

			//Load in GeoJSON data
		d3.json('https://s3-us-west-2.amazonaws.com/s.cdpn.io/25240/world-110m.json', function(error, world) {
    if(error) throw error;
			d3.select('svg').remove();	
				//Bind data and create one path per GeoJSON feature
			 // Append the World Map
    var worldMap = g.append('path')
    // .attr('clip-path', 'url(#clip-path)') // attaches the clip path to not draw the map underneath the x axis
     .datum(topojson.merge(world, world.objects.countries.geometries)) // draws a single land object for the entire map
     .attr('class', 'land')
     .attr('d', path)
     .style('fill', '	#B0C4DE');

	// Append the World Map Country Borders
    g.append('path')
     .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
     .attr('class', 'boundry')
     .attr('d', path)
     .style('fill', 'none')
     .style('stroke', 'white');

    });

    let settings = {
      projection,
      path,
      svg,
    }
    return settings;
  }

  function drawContent (settings, data) {
	  d3.select('#all-satellites').remove();
    let color = d3.scaleSequential(d3.interpolateSpectral)
     .domain([0, 500]);

    // Group to hold all of the satellites
    var satellites = settings.svg.append('g')
          .attr('id', 'all-satellites');

		satellites.selectAll('g')
           .data(data)
           .enter()
           .append('g')
           .attr('class', 'sat-group');

    // Create the satellite circle 
       satellites.selectAll('.sat-group')
          .append('circle')
            .attr('cx', d => settings.projection([d.longitude, d.latitude])[0])
          .attr('cy', d => settings.projection([d.longitude, d.latitude])[1])
          .attr('r', '5px')
          .attr('class', 'circle sat-dot')
          .style('fill', d => color(d.latitude))
          .style('opacity', 0.5)
        };
})();

			
			
	

	
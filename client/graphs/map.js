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
			var projection = d3.geoAlbersUsa()
								   .translate([width/2, height/2])
								   .scale([1200]);

			//Define path generator
			var path = d3.geoPath()
							 .projection(projection);

			//Create SVG element
			var svg = d3.select('#map')
						.append('svg')
						.attr("width", width)
						.attr("height", height);

			//Load in GeoJSON data
			d3.json('graphs/us-states.json', function(json) {
				
				//Bind data and create one path per GeoJSON feature
				svg.selectAll("path")
				   	.data(json.features)
					.enter()
				   	.append("path")
				   	.attr("d", path)
						.style('fill', 'lightBlue')
						.style('stroke', '#fff');
			});

		//	d3.csv("US-Mass-Shootings_1982-2015.csv", function(data) {
				// aa = [-122.490402, 37.786453];
				// bb = [-122.389809, 37.72728];

				svg.append("g")
				   	.attr("class", "bubble")
					.selectAll("circle")
					.data(allData)
						//.sort(function(a,b) {return b.Fatalities - a.Fatalities; }))
					.enter()
					.append("circle")
					.attr("cx", d => {
						console.log('d', d);
						console.log('d.lon', d.longitude);
						return projection([d.longitude, d.latitude])[0];
					})
					.attr("cy", d => projection([d.longitude, d.latitude])[1])
					.attr("r", '5px')
					.attr("fill", "red");
			})
	
})();		
	
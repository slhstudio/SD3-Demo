(function () {

	let socket = io.connect();

	//set initial SVG params
	let margin = { top: 20, right: 20, bottom: 40, left: 60 };
	let width = 700 - margin.left - margin.right;
	let height = 500 - margin.top - margin.bottom;

	//trump trends bubble

	socket.on('sendBubbleData', (data) => {
		//check if data is the same
		



		d3.select('svg').remove();		
		console.log('received bubble data');
		var svg = d3.select('.chart')
			.append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.append('g')
			.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

		var radiusScale = d3.scaleSqrt().domain([0, 10]).range([0, 50])

		var simulation = d3.forceSimulation()
			.force('x', d3.forceX(0).strength(.1))
			.force('Y', d3.forceY(0).strength(.1))
			.force('collide', d3.forceCollide(d => radiusScale(d.volume)))

			var circles = svg
				.selectAll('.word')
				.data(data)
				.enter()
				.append('g')
				.attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

			circles.append('circle')
				.attr('class', 'word')
				.attr('r', d => radiusScale(d.volume))
				.attr('fill', 'yellow')
				.attr('fill-opacity', .8)
				.attr('cx', width / 2)
				.attr('cy', height / 2)


			circles.append('text')
				.style('text-anchor', 'middle')
				.style('fill', 'black')
				.style('font-size', '16px')
				.attr('y', 4)
				.text(d => d.text)
				.append('text')
				.text(d => d.text);

			circles
				.on('click', d => console.log(d))

			simulation.nodes(data)
				.on('tick', ticked)

			function ticked() {
				svg.selectAll('circle')
					.attr('cx', d => d.x)
					.attr('cy', d => d.y);

				svg.selectAll('text')
					.attr('dx', d => d.x)
					.attr('dy', d => d.y);
			}

	});
	console.log('creating circles!');

})();
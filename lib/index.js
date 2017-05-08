class Streamline {
	constructor(server) {
		this.io = require('socket.io').listen(server);
		this.connections = [];
	}

	connect(func) {
		this.io.sockets.on('connection', (socket) => {
			let newSocket = socket;
			this.connections.push(socket);
			console.log('CONNECTED: %s SOCKETS CONNECTED', this.connections.length)

			socket.on('disconnect', (data) => {
				this.connections.splice(this.connections.indexOf(socket), 1);
				console.log('CONNECTED: %s SOCKETS CONNECTED', this.connections.length);
			});

			// socket.on('send audioText', (data) => {
			// 	this.io.sockets.emit('send audioData', data);
			// });

			return func(socket);

		})
	}

	line(socket, data, config) {

		let emitData = [];
		let emitConfig = {};

		let refConfig = {
			setWidth: 700,
			setHeight: 500,
			shiftXAxis: true,
			xDomainUpper: 20,
			xDomainLower: 0,
			yDomainUpper: 40,
			yDomainLower: 0,
			xTicks: 10,
			yTicks: 10,
			xScale: '',
			yScale: '',
			xLabel_text: '',
			yLabel_text: ''
		};

		for (let key in config) {
			refConfig[key] = config[key];
		}

		setInterval(() => {
			for (let i = 0; i < data.length; i += 1) {
				emitConfig = Object.assign({}, refConfig);

				emitConfig.xScale = data[i][emitConfig.xScale];
				emitConfig.yScale = data[i][emitConfig.yScale];

				emitData.push(emitConfig);
			}
			if (emitData.length >= emitConfig.xDomainUpper) {
				emitData = emitData.slice(-(emitConfig.xDomainUpper));
			}

			socket.emit('sendLineData', emitData);
			emitData = [];
		}, 1000);
	}

	scatter(socket, data, config) {

		let emitData = [];
		let emitConfig = {};

		let refConfig = {
			setWidth: 700,
			setHeight: 500,
			shiftXAxis: false,
			xDomainUpper: 20,
			xDomainLower: 0,
			yDomainUpper: 40,
			yDomainLower: 0,
			xTicks: 10,
			yTicks: 10,
			xScale: '',
			yScale: '',
			xLabel_text: '',
			yLabel_text: ''
		};

		for (let key in config) {
			refConfig[key] = config[key];
		}

		setInterval(() => {
			for (let i = 0; i < data.length; i += 1) {
				emitConfig = Object.assign({}, refConfig);

				emitConfig.xScale = data[i][emitConfig.xScale];
				emitConfig.yScale = data[i][emitConfig.yScale];

				emitData.push(emitConfig);
			}
			if (emitData.length >= emitConfig.xDomainUpper) {
				emitData = emitData.slice(-(emitConfig.xDomainUpper));
			}

			socket.emit('sendScatterData', emitData);
			emitData = [];
		}, 1000);
	}

	wordCloud(socket) {
		socket.on('send audioText', (data) => {
			socket.emit('send audioData', data);
		});
	}


}

module.exports = Streamline;
class Streamline {
	constructor(server) {
		this.io = require('socket.io').listen(server);
		this.cluster = require('cluster');
		this.numCPUs = require('os').cpus().length;
		this.connections = [];
		this.server = server;
		this.sticky = require('sticky-session');
	}

	connect(func) {

		//load balance server with clustering
		if (this.cluster.isMaster) {  

			var redis = require('socket.io-redis');
			this.io.adapter(redis({ host: 'localhost', port: 6379 }));

			setInterval(function() {
				// all workers will receive this in Redis, and emit
				this.io.emit('data', 'payload');
			}, 1000);

			 //each cpu is given a task/socket
			for (var i = 0; i < this.numCPUs; i++) {
					// Create a worker
					this.cluster.fork();
			}

			this.cluster.on('exit', function(worker, code, signal) {  
				console.log('Worker %d died with code/signal %s. Restarting worker...', worker.process.pid, signal || code);
				this.cluster.fork();
			});

		}  else {

			let io = require('socket.io').listen(this.server);
			let redis = require('socket.io-redis');

			io.adapter(redis({ host: 'localhost', port: 6379 }));

			io.on('connection', function(socket) {
				socket.emit('data', 'connected to worker: ' + cluster.worker.id);
			});
      

			io.sockets.on('connection', (socket) => {
				let newSocket = socket;
				this.connections.push(socket);
				console.log('CONNECTED: %s SOCKETS CONNECTED', this.connections.length)

				socket.on('disconnect', (data) => {
					this.connections.splice(this.connections.indexOf(socket), 1);
					console.log('CONNECTED: %s SOCKETS CONNECTED', this.connections.length);
				});

				return func(socket);

			});

			this.server.listen(process.env.PORT || 3000, () => console.log('SERVER RUNNING ON 3000'));
		}

	}

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
            return func(socket);
        })
    }

    line(socket, data, config) {
        let xScale;
        let yScale;
        let emitData = [];

        let refConfig = {
            shiftingXAxis: true,
            xdomain: 10, //width of xAxis
            ydomain: 10, //height of yAxis
            xTicks: 10,
            yTicks: 10,
            xScale: '',//data for xAxis
            yScale: '',//data for yAxis
            xLabel_text: 'abc',
            yLabel_text: 'abc'
        }

        for (let key in config) {
            refConfig[key] = config[key];
        }

        setInterval(() => {
            for (let i = 0; i < data.length; i += 1) {
                let emitConfig = Object.assign({}, refConfig);

                emitConfig.xScale = data[i][emitConfig.xScale];
                emitConfig.yScale = data[i][emitConfig.yScale];

                emitData.push(emitConfig);
            }
            console.log(emitData);

            socket.emit('sendStreamData', emitData);
            emitData = [];
        }, 1000);
    }
}

module.exports = Streamline;
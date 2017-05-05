const express = require('express');
const app = express();
let server = require('http').createServer(app);
let io = require('socket.io').listen(server);
const path = require('path');
const fs = require('fs'); 

//---------------SEND CLIENT FILES-----------------------
app.use(express.static(path.join(__dirname, 'client')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/audio.html'));
});


//////////////////////////////SOCKETS///////////////////////////////////

let connections = [];

io.sockets.on('connection', (socket) => {
  connections.push(socket);
  console.log('CONNECTED: %s SOCKETS CONNECTED', connections.length);

  socket.on('send audioText', (data) => {
    io.sockets.emit('send data', data);
  })
})


// app.post('/receive', function (request, respond) {
//   var body = '';
//   filePath = __dirname + '/results.json';
//   request.on('data', function (data) {
//     body += data;
//   });

//   //-----------WRITE TO RESULTS.JSON----------------
//   request.on('end', function () {
//     // fs.appendFile(filePath, body, function () {
//     //   console.log('WRITTEN TO FILE', body)
//     //   respond.end();
//     fs.readFile(filePath, 'utf8', function (err, data){
//       if (err){
//         console.log('FILE WRITING ERROR', err);
//       } else {
//         obj = JSON.parse(data); //now it is an object
//         obj.push(body); //add some data
//         //obj.table.push(body); //add some data
//         json = JSON.stringify(obj); //convert it back to json
//         fs.writeFile(filePath, json, 'utf8', function() {
//           console.log('WRITTEN TO FILE', body)
//           respond.end();
//         }); 
//       }
//     });
//   });
// });

//{"table":[{"test":"first message"}]}

//------------------SERVER ---------------------------------------
server.listen(process.env.PORT || 5000, ()=> console.log('SERVER RUNNING ON 5000'));






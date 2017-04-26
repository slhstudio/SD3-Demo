const RT = require('./server.js')

let config = {
  x: 10,
  y: 15, 

}


// var realTime = new RT(config);


RT.line(config);
RT.scatter(config);
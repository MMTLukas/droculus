var net = require('net');
var readline = require('readline');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var server = net.createServer(function (c) {
  console.log('client connected');

  c.on('end', function () {
    console.log('client disconnected');
  });

  c.write("START");

  var newValue = function(){
    rl.question("X should be?", function (answer) {
      c.write("TX=" + answer + "&TY=" + 0 + "&TZ=" + 0 + "&RY=" + 0);
      newValue();
    });
  }
  newValue();

});



server.listen(8124, function () { //'listening' listener
  console.log('server bound');
});
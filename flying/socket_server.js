var net = require('net');

var shouldSwitch = true;

var server = net.createServer(function (c) {
  console.log('client connected');

  c.on('end', function () {
    console.log('client disconnected');
  });

  c.write("START");

  setInterval(function () {
    if (shouldSwitch) {
      c.write("TX=" + 0 + "&TY=" + 0 + "&TZ=" + 0 + "&RY=" + 180);
      shouldSwitch = false;
    } else {
      c.write("TX=" + 0 + "&TY=" + 0 + "&TZ=" + 0 + "&RY=" + 90);
      shouldSwitch = true;
    }
  }, 1000);
});

server.listen(8124, function () { //'listening' listener
  console.log('server bound');
});
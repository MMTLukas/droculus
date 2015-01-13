var http = require('http');
var drone = require('./drone');

var stream = null;

var server = http.createServer(function (req, res) {
  if (!stream) {
    stream = drone.getPngStream();
    stream.on('error', function (err) {
      console.error('png stream ERROR: ' + err);
    });
  }

  res.writeHead(200, {'Content-Type': 'multipart/x-mixed-replace; boundary=--daboundary'});

  stream.on('data', function(buffer) {
    console.log(buffer.length);
    res.write('--daboundary\nContent-Type: image/png\nContent-length: ' + buffer.length + '\n\n');
    res.write(buffer);
  });

}).listen(8000);

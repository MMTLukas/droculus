var net = require('net');
var drone = require('./drone');

var HOST = "localhost";
var PORT = 3333;

var client = new net.Socket();
client.connect(PORT, HOST, function(){
  console.log("Connected to " + HOST + ":" + PORT);
});

client.on("data", function(data){
  console.log(getCurrentTime() + " DATA: " + data);

  var params = parseData(data);
  drone.flyAutonomous(params);
});

client.on("close", function(){
  console.log("Connection closed");
});

client.on("error", function(error){
  console.log("ERROR: " + error);
});

function parseData(data){
    var params = {};
    return params;
}

function getCurrentTime(){
  var date = new Date();
  return date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + ":" + date.getMilliseconds();
}
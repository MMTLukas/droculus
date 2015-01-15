var net = require('net');
var drone = require('./drone');

var HOST = "localhost";
var PORT = 3333;

var client = new net.Socket();
client.connect(PORT, HOST, function () {
  console.log("Connected to " + HOST + ":" + PORT);
});

client.on("data", function (data) {
  console.log(getCurrentTime() + ": " + data);
  data = JSON.stringify(data);

  console.log(typeof data, data.length);

  if(data === "START"){
    drone.takeoff();
  }
  else if(data === "STOP"){
    drone.land();
  } else{
    var params = parseData(data);
    if (params != null) {
      drone.flyAutonomous(params.coordinates, params.rotation);
    }
  }
});

client.on("close", function () {
  console.log("Connection closed");
});

client.on("error", function (error) {
  console.log("ERROR: " + error);
});

function parseData(data) {
  data = data.split("&") || [];

  if (data.length === 7) {
    var params = {
      "coordinates": {
        "x": Math.round(data[0].split("=")[1]),
        "y": Math.round(data[1].split("=")[1]),
        "z": Math.round(data[2].split("=")[1])
      },
      "rotation": {
        "x": Math.round(data[3].split("=")[1]),
        "y": Math.round(data[4].split("=")[1]),
        "z": Math.round(data[5].split("=")[1])
      },
      "rotationAngle": {
        "rotateY": Math.round(data[6].split("=")[1])
      }
    }
    return params;
  }
  else {
    return null;
  }
}

function getCurrentTime() {
  var date = new Date();
  return date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + ":" + date.getMilliseconds();
}
var net = require('net');
var drone = require('./drone');

var HOST = "localhost";
var PORT = 3333;

var client = new net.Socket();
client.connect(PORT, HOST, function(){
  console.log("Connected to " + HOST + ":" + PORT);
  client.write("Das hier schreib ich zum Server");
});

client.on("data", function(data){
  console.log("DATA: " + data);

  //TO something with the data
});

client.on("close", function(){
  console.log("Connection closed");
});

client.on("error", function(error){
  console.log("ERROR: " + error);
});
var arDrone = require('ar-drone');
var autonomyDrone = require('ardrone-autonomy');
var mission = autonomyDrone.createMission();

var options = 71368705; //Masked 0,16,22,26 from arDroneConstants
mission.client().config('general:navdata_demo', true);
mission.client().config('general:navdata_options', options);
mission.client().config('video:video_channel', 0);
mission.client().config('detect:detect_type', 12);

var flagExecuting = false;
var isExecuting = function () {
  if (flagExecuting) {
    return flagExecuting;
  } else {
    flagExecuting = true;
    return false;
  }
};

var wantedDistance = {
  x: 1.5,
  y: 0,
  z: 0
}

2

var getMovement = function (value, type) {
  switch(type){
    case "x":

      if(value > wantedDistance.x){
        value = Math.max(wantedDistance.x-value,
      }

      if (value <= 0.5 && value >= -0.5) {
        value = value-wantedDistance.x;
      }
      else if (value < -0.5) {
        value = Math.max(value, -1);
      }
      else if (value > 0.5) {
        value = Math.min(value, 1);
      }

      break;
    case "y":
      break;
    case "z":
      break;
    default:
      break;
  }
  if (value <= 0.5 && value >= -0.5) {
    value = value;
  }
  else if (value < -0.5) {
    value = Math.max(value, -1);
  }
  else if (value > 0.5) {
    value = Math.min(value, 1);
  }

  return value;
};

module.exports = {
  flyAutonomous: function (coords, rotationY, timestamp) {
    if (isExecuting()) {
      return;
    }

    var newPosition = {
      x: getMovement(coords.x),
      y: getMovement(coords.y),
      z: getMovement(coords.z)
    };

    console.log(JSON.stringify(newPosition));
    return;

    mission.go({x: newPosition.x, y: newPosition.y, z: newPosition.z, yaw: rotationY})
    mission.zero();
    mission.run(missionCallback);
  },
  takeoff: function () {
    if (isExecuting()) {
      return;
    }
    mission.takeoff().run(missionCallback);
    console.log("Drone taking off");
  }
  ,
  land: function () {
    if (isExecuting()) {
      return;
    }
    mission.land();
    mission.run(missionCallback);
    console.log("Drone landing");
  }
}
;

function missionCallback(err, result) {
  if (err) {
    console.log("Oops, something bad happened: %s", err.message);
    mission.client().stop();
    mission.client().land();
  } else {
    console.log("Flying mission success!");
    flagExecuting = false;
  }
}

// Land on ctrl-c
var exiting = false;
process.on('SIGINT', function () {
  if (exiting) {
    process.exit(0);
  } else {
    console.log('Pressed STRG+C. Landing, press STRG+C again to force exit.');
    exiting = true;
    mission.control().disable();
    mission.client().land(function () {
      process.exit(0);
    });
  }
});
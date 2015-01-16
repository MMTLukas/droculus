var arDrone = require('ar-drone');
var autonomyDrone = require('ardrone-autonomy');

var mission = autonomyDrone.createMission();

var options = 71368705; //Masked 0,16,22,26 from arDroneConstants
mission.client().config('general:navdata_demo', true);
mission.client().config('general:navdata_options', options);
mission.client().config('video:video_channel', 0);
mission.client().config('detect:detect_type', 12);

var lastPosition = {
  "coordinates": {
    "x": 0,
    "y": 0,
    "z": 0
  },
  "rotation": {
    "y": 0
  },
  "timestamp": new Date().getTime()
};

var configs = {
  updateFrequencyInMs: 1000,
  minMovementUpdateInCm: 10,
  minRotationUpdateInDegree: 10
}

module.exports = {
  flyAutonomous: function (coords, rotationY, timestamp) {
    console.log(coordinates, rotationY, timestamp);
    var tx, ty, tz, ry;

    //Only create max every seconds a new fly mission
    if(lastPosition.timestamp + configs.updateFrequencyInMs < timestamp){
      //Only change coords, when there has been a movement over a defined value
      tx = Math.abs(coords.x-lastPosition.coordinates.x) > configs.minMovementUpdateInCm ? coords.x : lastPosition.coordinates.x;
      ty = Math.abs(coords.y-lastPosition.coordinates.y) > configs.minMovementUpdateInCm ? coords.y : lastPosition.coordinates.y;
      tz = Math.abs(coords.z-lastPosition.coordinates.z) > configs.minMovementUpdateInCm ? coords.z : lastPosition.coordinates.z;
      ry = Math.abs(rotationY-lastPosition.rotation.y) > 10 ? rotationY : lastPosition.rotation.y;
    }

    mission.go({x:tx, y:ty, z:tz, yaw:ry})
    mission.run(missionCallback);
  },
  takeoff: function () {
    console.log("Drone take off");
    mission.takeoff().zero();
    mission.run(missionCallback);
  },
  land: function () {
    mission.land();
    mission.run(missionCallback);
  }
};

function missionCallback(err, result) {
  if (err) {
    console.log("Oops, something bad happened: %s", err.message);
    mission.client().stop();
    mission.client().land();
  } else {
    console.log("Autonomy flying mission success!");
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
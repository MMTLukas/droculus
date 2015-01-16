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
  "timestamp": 0
};

var configs = {
  updateFrequencyInMs: 15000,
  minMovementUpdateInCm: 10,
  minRotationUpdateInDegree: 10
}

module.exports = {
  flyAutonomous: function (coords, rotationY, timestamp) {

    //Only create max every seconds a new fly mission
    if(lastPosition.timestamp + configs.updateFrequencyInMs < timestamp){
      console.log(coords.y, rotationY, timestamp);

      //Only change coords, when there has been a movement over a defined value
      lastPosition.coordinates.x = Math.abs(coords.x-lastPosition.coordinates.x) > configs.minMovementUpdateInCm ? coords.x : lastPosition.coordinates.x;
      //lastPosition.coordinates.y = Math.abs(coords.y-lastPosition.coordinates.y) > configs.minMovementUpdateInCm ? coords.y : lastPosition.coordinates.y;
      //lastPosition.coordinates.z = Math.abs(coords.z-lastPosition.coordinates.z) > configs.minMovementUpdateInCm ? coords.z : lastPosition.coordinates.z;
      //lastPosition.rotation.y = Math.abs(rotationY-lastPosition.rotation.y) > 10 ? rotationY : lastPosition.rotation.y;
      lastPosition.timestamp = timestamp;

      mission.go({x:lastPosition.coordinates.x, y:lastPosition.coordinates.y, z:lastPosition.coordinates.z, yaw:lastPosition.rotation.y})
      mission.run(missionCallback);
    }
  },
  takeoff: function () {
    mission.takeoff().zero();
    mission.run(missionCallback);
    console.log("Drone taking off");
  },
  land: function () {
    mission.land();
    mission.run(missionCallback);
    console.log("Drone landing");
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
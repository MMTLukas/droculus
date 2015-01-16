var arDrone = require('ar-drone');
var autonomyDrone = require('ardrone-autonomy');
var arDroneConstants = require('ar-drone/lib/constants');

var mission = autonomyDrone.createMission();

var options = 71368705; //Masked 0,16,22,26 from arDroneConstants
mission.client().config('general:navdata_demo', true);
mission.client().config('general:navdata_options', options);
mission.client().config('video:video_channel', 0);
mission.client().config('detect:detect_type', 12);

module.exports = {
  flyAutonomous: function (coordinates, rotationAngleYAxis) {
    console.log(coordinates);
    return;

    mission.takeoff()
      .zero()
      .go({x:0, y:0, z:1})
      .go({x:0, y:0, z:0, yaw:315})
      .land();

    /*var rotateInYDirection;

    // rotate clockwise when rotationAngleYAxis > 0 or stay when rotationAngleYAxis = 0
    if(rotationAngleYAxis >= 0) {
      rotateInYDirection = rotationAngleYAxis;
    }
    // rotate counterclockwise 
    else {
      rotateInYDirection = (360 - (rotationAngleYAxis * (-1)));
    }*/

    mission.go({x:coordinates.x, y:coordinates.y, z:coordinates.z, yaw:rotateInYDirection})
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
    console.log('Got SIGINT. Landing, press Strg-C again to force exit.');
    exiting = true;
    mission.control().disable();
    mission.client().land(function () {
      process.exit(0);
    });
  }
});
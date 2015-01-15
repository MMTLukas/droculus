var arDrone = require('ar-drone');
var autonomyDrone = require('ardrone-autonomy');

var mission = autonomyDrone.createMission();
var options = 71368705; //Masked 0,16,22,26 from arDroneConstants

mission.client().config('general:navdata_demo', true);
mission.client().config('general:navdata_options', options);
mission.client().config('video:video_channel', 0);
mission.client().config('detect:detect_type', 12);

mission.log("mission-" + new Date().getTime() + ".txt");

module.exports = {
  flyAutonomous: function (coordinates, rotation) {
    mission.takeoff().land();
    mission.run(missionCallback);
  },
  takeOff: function () {
    var mission = autonomyDrone.createMission();
    mission.takeoff().run(missionCallback)
  },
  land: function () {
    var mission = autonomyDrone.createMission();
    mission.land().run(missionCallback)
  }
};

function missionCallback(err, result) {
  if (err) {
    console.log("Oops, something bad happened: %s", err.message);
    mission.client().stop();
    mission.client().land();
  } else {
    console.log("Mission success!");
    process.exit(0);
  }
}

//Land on ctrl-c
var exiting = false;
process.on('SIGINT', function () {
  if (exiting) {
    process.exit(0);
  } else {
    console.log('Got SIGINT. Landing, press Control-C again to force exit.');
    exiting = true;
    mission.control().disable();
    mission.client().land(function () {
      process.exit(0);
    });
  }
});
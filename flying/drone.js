var arDrone = require('ar-drone');
var autonomyDrone = require('ardrone-autonomy');
var arDroneConstants = require('ar-drone/lib/constants');

var client = arDrone.createClient();
var controller = new autonomyDrone.Controller(client, {debug: false});

var init = (function () {
  var navdataOptionMask = function (c) {
    return 1 << c;
  }

  var navdataOptions = (
  navdataOptionMask(arDroneConstants.options.DEMO)
  | navdataOptionMask(arDroneConstants.options.VISION_DETECT)
  | navdataOptionMask(arDroneConstants.options.MAGNETO)
  | navdataOptionMask(arDroneConstants.options.WIFI)
  );

  client.config('general:navdata_demo', true);
  client.config('general:navdata_options', navdataOptions);
  client.config('video:video_channel', 0);
  client.config('detect:detect_type', 12);
})();

var flagExecuting = false;
var isExecuting = function () {
  if (flagExecuting) {
    return flagExecuting;
  } else {
    flagExecuting = true;
    return false;
    }
  };

var maxMovement = 1;
var tolerance = 0.5;
var wantedDistance = {
  x: 2,
  y: 0,
  z: 0
};

var limitMovement = function (value) {
  if (value > maxMovement) {
    value = maxMovement;
  } else if (value < -maxMovement) {
    value = -maxMovement;
  }
  return value;
};

module.exports = {
  flyAutonomous: function (coords, rotationY, timestamp) {
    /*if (isExecuting()) {
      return;
    }*/

    //forward backward
    if (!(coords.x > wantedDistance.x + tolerance && coords.x < wantedDistance.x - tolerance)) {
      coords.x =  coords.x - wantedDistance.x;
      coords.x = limitMovement(coords.x);
    }

    //left/right
    if (!(coords.y > wantedDistance.y + tolerance && coords.y < wantedDistance.y - tolerance)) {
      coords.y = coords.y - wantedDistance.z;
      coords.y = limitMovement(coords.y);
    }

    /* Höhe - optional
    if (!(coords.z > wantedDistance.z + tolerance / 2 && coords.z < wantedDistance.z - tolerance / 2)) {
      coords.z = coords.z - wantedDistance.z;
      coords.z = limitMovement(coords.z);
    }
    */
    coords.z = 0;

    console.log(JSON.stringify(coords), rotationY);
    /*controller.zero();
    controller.go({
      x: coords.x,
      y: coords.y,
      z: coords.z,
      yaw: rotationY
    }, callback);*/
  },
  takeoff: function () {
    /*if (isExecuting()) {
      return;
    }*/
    client.takeoff(callback);
    console.log("Drone taking off");
  }
  ,
  land: function () {
    if (isExecuting()) {
      return;
    }
    client.land(callback);
    console.log("Drone landing");
  }
};

function callback(err, result) {
  if (err) {
    console.log("Oops, something bad happened: %s", err.message);
    client.stop();
    client.land();
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
    controller.disable();
    client.land(function () {
      process.exit(0);
    });
  }
});
/**
 * Created by enthusiasm on 13.01.15.
 */

var arDrone = require('ar-drone');
var drone = arDrone.createClient();

// Streaming front-camera
drone.config('video:video_channel', 0);

<<<<<<< HEAD
// Streaming bottom-camera
drone.config('video:video_channel', 3);

module.exports = drone;
=======
module.exports = {
  flyAutonomous: function(params){

  }
};
>>>>>>> 9a6bcc10594b568a86e6f6dc51991def65994209


// starting the drone
drone.takeoff();


// flying on a fixed altitude
drone
 .after(1000, function() {
 	this.up(1);
 });


// landing the drone
drone
 .after(1000, function() {
 	this.stop();
 	this.land();
 });


/* Drone Commands

takeoff() 					- has the drone takeoff and hover above the ground

land() 						- has the drone land

up(speed) 					- has the drone gain altitude at a speed between 1 (max speed) and 0 (still).

down(speed) 				- makes the drone reduce altitude

clockwise(speed) 			- drone spins clockwise

counterClockwise(speed) 	- drone spins counter-clockwise

front(speed)/back(speed)	- changes the pitch causing horizontal movement

left(speed)/right(speed) 	- changes the roll causing horizontal movement

stop() 						- keeps the drone hovering in place
*/

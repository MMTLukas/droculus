/**
 * Created by enthusiasm on 13.01.15.
 */

var arDrone          = require('ar-drone');
var df               = require('dateformat');
var autonomy         = require('ardrone-autonomy');
var arDroneConstants = require('ar-drone/lib/constants');
var mission          = autonomy.createMission();


module.exports = {
  flyAutonomous: function(params){

  }
};

// Land on ctrl-c
var exiting = false;
process.on('SIGINT', function() {
    if (exiting) {
        process.exit(0);
    } else {
        console.log('Got SIGINT. Landing, press Strg-C again to force exit.');
        exiting = true;
        mission.control().disable();
        mission.client().land(function() {
            process.exit(0);
        });
    }
});

// Log mission-data for debugging purposes
mission.log("mission-Flight" + df(new Date(), "yyyy-mm-dd_hh-MM-ss") + ".txt");

mission.takeoff()
       .zero()
       .go({x:0, y:0, z:0, yaw:90})
       .hover(500)
       .land();

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

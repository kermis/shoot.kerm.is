var motionD;

$(function() {

	console.log('motiondata');

	if(window.DeviceOrientationEvent) {
		window.addEventListener('deviceorientation', devOrientHandler, false);
	}
});


function devOrientHandler(eventData) {
	 motionD = {
        gamma: event.gamma,
        beta: event.beta,
        alpha: event.alpha,
       
    }
}


setInterval(function() {

	var id = room.getID();

	console.log('setInterval', id);

	motionD

	socket.emit('motiondata', motionD );
}, 200);
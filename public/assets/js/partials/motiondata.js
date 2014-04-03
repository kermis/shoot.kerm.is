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
        beta: event.beta     
    }

    //socket.emit('motiondata', motionD );
}


setInterval(function() {
	socket.emit('motiondata', motionD );
}, 200);
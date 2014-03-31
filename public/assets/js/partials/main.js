$(function() {
	$('#room').html(room.id);
});


url.check();

room.setID();

console.log(room.id);

/*
|------------------------------------------------------------------------------------
| Connect to socket.io
|------------------------------------------------------------------------------------
*/

	var socket = io.connect(url.currentURL);
	socket.on('connect', function() {
		console.log('main.js connect', room.id);
		socket.emit('message', {msg : 'you are connected to the room ' + room.id})
	});


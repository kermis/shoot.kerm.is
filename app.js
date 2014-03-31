/*
|------------------------------------------------------------------------------------
| Import some modules
|------------------------------------------------------------------------------------
*/
	var express  = require('express'),
		path 	 = require('path'),
		http 	 = require('http'),
		socketio = require('socket.io');
		//game	 = require('./game');

/*
|------------------------------------------------------------------------------------
| Create new instance of Express
|------------------------------------------------------------------------------------
*/
	var app = express();

/*
|------------------------------------------------------------------------------------
| Create a simple Express application
|------------------------------------------------------------------------------------
*/
	app.configure(function() {
		// turn down  the loggin activity
		app.use(express.logger('dev'));

		// serve static html, js, css and image files from the 'public' directory
		app.use(express.static(path.join(__dirname, 'public')));
	});

	app.get('/', function(req, res) { // request, response
		alert('running')
	});

/*
|------------------------------------------------------------------------------------
| Set connection port and create a http server
|------------------------------------------------------------------------------------
*/
	var port = process.env.PORT || 1337;
	var server = http.createServer(app).listen(port);

/*
|------------------------------------------------------------------------------------
| Create socket.io server and listen to the http server
| Also reduce the logging output of socket.io
|------------------------------------------------------------------------------------
*/
	var io = socketio.listen(server);
	io.set('log level', 1);


/*
|------------------------------------------------------------------------------------
| Listen to socket.io messages 
|------------------------------------------------------------------------------------
*/
	io.sockets.on('connection', function(socket) {
		
		socket.on('message', function(data) {
			console.log('MESSAGE', data);
		});

		socket.on('room', function(room) {
			roomID = room;

			checkRoom(socket, roomID);	
		});

	});


/*
|------------------------------------------------------------------------------------
| Check if room exists
|------------------------------------------------------------------------------------
*/
	function checkRoom(socket, roomID) {
		var rooms = io.sockets.manager.rooms

		if(io.sockets.manager.rooms['/' + roomID])
		{
			socket.emit('checkroom', 'this room ('+ roomID + ') is occupied');
		} else {
			socket.join(roomID);
			socket.emit('checkroom', 'this room (' + roomID + ') is yours');
		}
	}

	
/*
|------------------------------------------------------------------------------------
| Import some modules
|------------------------------------------------------------------------------------
*/
var
express = require('express'),
      path = require('path'),
      http = require('http'),
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
      res.send('app is running');
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
var roomID, roomio;


io.sockets.on('connection', function(socket) {

      socket.on('message', function(data) {
            //console.log('MESSAGE', data);
      });

      socket.on('room', function(room, type) {
            roomID = room;
            roomio = room;
            checkRoom(socket, roomio, type);
      });

      socket.on('connected_user', function(data) {
            //console.log('connected_user', data);
            io.sockets.emit('connected_person', data);
      });

      socket.on('motiondata', function(data) {
            console.log('motiondata', roomio, data);
            io.sockets. in (data.room).emit('motiondatas', data);
      });

      socket.on('shoot', function(data) {
            console.log('user is shooting', data);
            io.sockets. in (data.message).emit('shooting', data);
      })

      socket.on('power', function(data) {
            console.log('power');
            //console.log('user is shooting', data);
            io.sockets. in (data.message).emit('user_power', data);
      })

      socket.on('disconnect', function() {
            socket.broadcast.to(roomio).emit('mobile_disconnect', {
                  room: roomio
            });
      });

});


/*
|------------------------------------------------------------------------------------
| Check if room exists
|------------------------------------------------------------------------------------
*/
function checkRoom(socket, roomID, type) {
      var rooms = io.sockets.manager.rooms;

      console.log('type', type);

      if (rooms['/' + roomID]) {
            console.log('if');
            socket.join(roomID);
            roomdata = rooms['/' + roomID];
            io.sockets. in (roomID).emit('roomJoined', roomdata);
            io.sockets. in (roomID).emit('checkroom', "Connected");
      } else {
            if (type == 'browser') {
                  socket.join(roomID);
            } else {
                  console.log('else');
                  socket.emit('checkroom', "Something went wrong I guess.");
            }

      }
}
// function of main.js
url.check();

var room_id = room.getID();
var allowed = false;




var socket = io.connect(url.currentURL);

var power = 0;
var way = 'up';
var powerCheck;

$(function() {
      console.log = function() {};

      socket.on('connect', function() {
            socket.emit('room', room_id, 'smartphone');
            socket.emit('message', {
                  message: 'Controller joined to the room : ' + room_id
            });

            socket.on('checkroom', function(data) {
                  console.log(data);
                  $('#controller_message').text(data);

                  socket.emit('connected_user', room_id);
            });

            socket.on('connected_person', function() {
                  //console.log('connected person controller.js');
            });


      });

      $('.shoot').on('touchstart', function() {
            socket.emit('shoot', {
                  message: room_id
            });
      })

      socket.on('roomJoined', function(roomdata) {
            if (roomdata.length < 3) {
                  allowed = true;
                  console.log('allowed');
            } else {
                  console.log('not allowed');
            }
            if (!allowed) {
                  $('#controller_message').text('You can not connect to this room');
            }
      })
});
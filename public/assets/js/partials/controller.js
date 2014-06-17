// function of main.js
url.check();

var room_id = room.getID();

// var motion;

var socket = io.connect(url.currentURL);

var power = 0;
var way = 'up';
var powerCheck;

$(function() {

      socket.on('connect', function() {
            socket.emit('room', room_id);
            socket.emit('message', {
                  message: 'Controller joined to the room : ' + room_id
            });

            socket.on('checkroom', function(data) {
                  $('#controller_message').text(data);

                  socket.emit('connected_user', room_id);
            });

            socket.on('connected_person', function() {
                  //console.log('connected person controller.js');
            });


      });

      $('.shoot').on('click', function() {
            socket.emit('shoot', {
                  message: room_id
            });
      })
});
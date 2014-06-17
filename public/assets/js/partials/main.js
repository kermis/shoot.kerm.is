$(function() {

      /**
       *
       * Set the connect page + room number so the user knows where he has to go to connect
       *
       */

      $('.browser').html(url.currentURL + '/connect.html');
      $('.room_id').html(room.id);
});

url.check();
room.setID();

/*
|------------------------------------------------------------------------------------
| Connect to socket.io
|------------------------------------------------------------------------------------
*/

var socket = io.connect(url.currentURL);

/**
 *
 * Connect to a room
 *
 */

socket.on('connect', function() {
      socket.emit('message', {
            msg: 'you are connected to the room ' + room.id
      })
      socket.emit('room', room.id);
});

/**
 *
 * Do stuff when user is connected
 *
 */

socket.on('connected_person', function(data) {
      console.log('A new user (mobile) is connected');
      if (room.id == data) {
            shoot.start = true;
            $('.info').fadeOut();
            $('.info-score').addClass('active');
      }
});

socket.on('shooting', function(data) {
      look.theUserIsShooting(mobile.position.gamma, mobile.position.beta);
});

socket.on('motiondatas', function(data) {
      mobile.position = data;
      look.AtTheObjectsMove(data.gamma, data.beta);
});


socket.on('user_power', function(data) {
      if (data.power <= 5) {
            data.color = 'orange';
      }

      if (data.power == 6) {
            data.color = 'green';
      }

      if (data.power >= 7) {
            data.color = 'red';
      }

      $('.power').css({
            'height': (10 * data.power),
            'background-color': data.color
      });
})
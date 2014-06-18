$(function() {

      /**
       *
       * Set the connect page + room number so the user knows where he has to go to connect
       *
       */

      $('.browser').html(url.currentURL + '/connect.html');
      $('.room_id').html(room.id);
});

var mobile = {};

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
      socket.emit('room', room.id, 'browser');
});

/**
 *
 * Do stuff when user is connected
 *
 */

socket.on('connected_person', function(data) {
      if (room.id == data) {
            $('.chose_socket .play').removeClass('hide');
            shoot.controller = "mobile";
            shoot.showNotification('Smartphone Connection');
      }
});

socket.on('shooting', function(data) {
      look.theUserIsShooting(mobile.position.gamma, mobile.position.beta);
});

socket.on('motiondatas', function(data) {
      if (shoot.start) {
            mobile.position = data;
            look.AtTheObjectsMove(data.gamma, data.beta);
      }
});

socket.on('mobile_disconnect', function() {
      if (shoot.controller == 'mobile') {
            shoot.showNotification('Smartphone Connection lost')

            if (shoot.start && !shoot.infoVisible) {
                  shoot.pause();
            } else {
                  $('.chose_socket .play').removeClass('hide');
            }
      }
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
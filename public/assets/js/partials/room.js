var socket = io.connect(url.currentURL);
var text = '';
var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

var room = {

      setID: function() {

            /**
             *
             * Get room ID
             *
             */


            this.id = this.generateRoomID();
            this.id.toUpperCase();
      },

      generateRoomID: function() {
            /**
             *
             * Generate a Room ID of 3 chars
             *
             */

            for (var i = 0; i < 3; i++) {
                  // generate a random id with 3 characthers
                  text += possible.charAt(Math.floor(Math.random() * possible.length));
            }

            return text;
      },

      getID: function() {
            var id;
            id = room.queryParam('roomNumber');

            if (!id) {
                  id = window.location.hash;
                  id = id.replace('#', '');
            }

            if (!id) {
                  id = false;
            } else {
                  id = id.toUpperCase();
            }

            return id;
      },

      queryParam: function(name) {
            name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
            var regexS = "[\\?&]" + name + "=([^&#]*)";
            var regex = new RegExp(regexS);
            var results = regex.exec(window.location.href);

            if (results == null) {
                  return '';
            } else {
                  return results[1];
            }
      }
}
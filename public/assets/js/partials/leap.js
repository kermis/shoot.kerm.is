var leap = {
      init: function() {
            this.controller = new Leap.Controller({
                  enableGestures: true
            });
            this.controller.on('frame', this.onFrame);
            this.controller.on('streamingStarted', this.onConnect);
            this.controller.on('streamingStopped', this.onDisconnect);
            this.controller.connect();
      },

      onConnect: function() {
            $('.chose_leap .play').removeClass('hide');
            shoot.controller = 'leap';
            shoot.showNotification('Leap Connected');

            if (shoot.start && !shoot.infoVisible) {
                  shoot.pause();
            }
      },

      onDisconnect: function() {
            $('.chose_leap .play').addClass('hide');
            shoot.controller = 'mouse';
            shoot.showNotification('Leap Disconnected');

            if (shoot.start && !shoot.infoVisible) {
                  shoot.pause();
            }
      },

      onFrame: function(frame) {
            try {
                  if (shoot.start) {
                        if (!bullet.shot) {
                              this.hands = frame.hands;

                              shoot.rifle.position.x = Math.ceil(this.hands[0].stabilizedPalmPosition[0] * 1.4);
                              shoot.rifle.position.y = Math.ceil(this.hands[0].stabilizedPalmPosition[1] * 1.4);
                              bullet.position.x = shoot.rifle.position.x + 0.6;
                              bullet.position.y = shoot.rifle.position.y + 7.9

                              bullet.__dirtyPosition = true;
                              shoot.rifle.__dirtyPosition = true;
                        }
                  }
            } catch (e) {}
      }
}
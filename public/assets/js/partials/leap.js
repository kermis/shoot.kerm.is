var leap = {
    init : function() {
        this.controller = new Leap.Controller({ enableGestures : true });
        this.controller.on('frame' , this.onFrame);
        this.controller.on('streamingStarted', this.onConnect);
        this.controller.on('streamingStopped', this.onDisconnect);
        this.controller.connect();


    },

    onConnect : function() {
        console.log('Leap Succesfully Connected ;)')

        $('.play').removeClass('hide');

        shoot.controller = 'leap';
    },

    onDisconnect : function() {
        console.log('Leap Succesfully disconnected ;)')
        $('.play').addClass('hide');

        shoot.controller = 'mouse';
    },

    onFrame : function(frame) {

         try {

                            if(shoot.start)
                            {
                                    if(!ball.shot)
                                    {
                                            this.hands = frame.hands;

                                            ball.position.x = Math.ceil(this.hands[0].stabilizedPalmPosition[0] * 1.4);
                                            ball.position.y = Math.ceil(this.hands[0].stabilizedPalmPosition[1] * 1.4);
                                            shoot.rifle.position.x = Math.ceil(this.hands[0].stabilizedPalmPosition[0] * 1.4);
                                            shoot.rifle.position.y = Math.ceil(this.hands[0].stabilizedPalmPosition[1] * 1.4);


                                            ball.__dirtyPosition = true;
                                            shoot.rifle.__dirtyPosition = true;
                                    }
                            }

        } catch(e) { }
      }
}
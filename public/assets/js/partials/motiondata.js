var motionD;

/**
 *
 * DEVICE ORIENTATION V2
 *
 */

// buffer object to track recent values
var ValueBuffer = function(numSamples) {
      console.log('create value buffer of', numSamples);
      this.numSamples = numSamples;
      this.initBuffer();
}

// create an array of values, defaulted to zero
ValueBuffer.prototype.initBuffer = function() {
      console.log('create array of', this.numSamples);
      this.sampleIndex = 0;
      this.buffer = [];
      for (var i = 0; i < this.numSamples; i++) this.buffer.push(0);
}

// replace the oldest value in the buffer with the current value
ValueBuffer.prototype.update = function(value) {
      this.sampleIndex++;
      if (this.sampleIndex == this.numSamples) this.sampleIndex = 0;
      this.buffer[this.sampleIndex] = value;
}

// return the sum of the buffer's value
ValueBuffer.prototype.sum = function() {
      var sum = 0;
      for (var i = 0; i < this.numSamples; i++) sum += this.buffer[i];

      return sum;
}

var tiltZAxis = tiltXAxis = compass = 0;

var updateOrientation = function(e) {
      // store accelerometer values
      tiltZAxis = parseFloat(e.gamma); // left right
      tiltXAxis = parseFloat(e.beta); // up down
      compass = parseFloat(e.alpha);

      // update the gesture buffer
      updateRollGesture(tiltZAxis);
}

var tiltBuffer = new ValueBuffer(10);
var lastTiltValue = 0;

var updateRollGesture = function(tilt) {
      var tiltDelta = tilt - lastTiltValue;
      tiltBuffer.update(tiltDelta);
      lastTiltValue = tilt;

      console.log('update gesture', tilt.toFixed(0));


      if (tilt.toFixed(0) == 0 || tilt.toFixed(0) == -1 || tilt.toFixed(0) == 1)
            tilt = 0;

      motionD = {
            gamma: tilt.toFixed(0),
            beta: tilt,
            room: room.getID()
      }

      socket.emit('motiondata', motionD);
}



// let the user know if there's no accelerometer data available after 1 second of listening
// (for desktops and non-capable mobile devices).
// This would be a good place to conditionally fall back to touch-based controls
setTimeout(function() {
      if ((isNaN(tiltZAxis) && isNaN(tiltXAxis)) || (tiltZAxis == 0 && tiltXAxis == 0)) {
            alert('You don\'t seem to have an accelerometer, which is required for this demo.');
      }
}, 1000);
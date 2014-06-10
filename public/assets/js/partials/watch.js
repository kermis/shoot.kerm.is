var look = {

      /**
       *
       * Update THREE objects on resize
       *
       */

      theWindowIsResizing: function() {
            console.log('resize');

            /**
             *
             * store scene dimensions
             *
             */

            sceneW = container.offsetWidth;
            sceneH = container.offsetHeight;

            /**
             *
             * Update Camera
             *
             */

            yeswecan.get_theSceneCam.aspect = sceneW / sceneH;
            yeswecan.get_theSceneCam.updateProjectionMatrix();

            /**
             *
             * Set renderer size
             *
             */

            renderer.setSize(sceneW, sceneH);
      },


      /**
       *
       * Shoot a ball after getting p ower
       *
       */

      theUserIsShooting: function(event) {



            if (shoot.start) {

                  //  capturer.start();

                  var x, y, z;

                  if (shoot.controller == 'mobile') {
                        x = (event.x - sceneW) + sceneW / 2;
                        y = 0;
                        z = -1400;
                  } else if (shoot.controller == 'mouse') {
                        x = 0; //(event.x - sceneW)+ sceneW /2;
                        y = 0; //100 * shoot.power;
                        z = -1400;
                  } else if (shoot.controller == 'leap') {

                  }

                  // #TODO delay on direct shooten

                  /**
                   *
                   * Check if current ball is alreay thrown
                   *
                   */

                  if (!ball.shot) {

                        shoot.totalMissed++;
                        ball.setAngularFactor(new THREE.Vector3(1, 1, 1));
                        ball.setLinearFactor(new THREE.Vector3(1, 1, 1));
                        ball.setLinearVelocity(new THREE.Vector3(x, y, z));
                        ball.setAngularVelocity(new THREE.Vector3(-10, 0, 0));
                        ball.shot = true;
                        shoot.reload = true;

                        firedBullets.push(ball);



                        /**
                         *
                         * Play sound when user shot
                         *
                         */

                        //createjs.Sound.play("shoot", {volume:.3}); // #PLAY SOUND

                        /**
                         *
                         * Check if we have to reload a new ball
                         *
                         */

                        if (shoot.reload) {

                              shoot.totalBalls--; // update total balls

                              setTimeout(function() {

                                    /**
                                     *
                                     * Check if we have balls left
                                     *
                                     */


                                    if (shoot.totalBalls == 0) { // no balls left so stop the game

                                          shoot.start = false;

                                          // $('.the_level span').text(shoot.level + 1);
                                          // $('.the_points span').text(shoot.totalPoints);
                                          // $('.next_level span').text(shoot.level + 2);

                                          $('.totall').addClass('score');
                                    } else { // create new ball

                                          /**
                                           *
                                           * Play sound to reload
                                           *
                                           */

                                          createjs.Sound.play("reload", {
                                                volume: .3
                                          }); // #PLAY SOUND

                                          setTimeout(function(){ // set a timeout of 0 so we don't halt execution
                                                yeswecan.build_theball();
                                          },0)
                                          shoot.reload = false;
                                    }

                                    /**
                                     *
                                     * Remove a ball
                                     *
                                     */

                                    setTimeout(function() {
                                          shoot.removeABall();
                                    }, 5000);
                              }, 100);
                        }
                  }
            }
      },

      theMouseIsMoving: function(event) {

            if (shoot.start) {
                  if (shoot.controller == 'mouse') { // check if controller is mouse

                        shoot.movementX = event.movementX ||
                              event.mozMovementX ||
                              event.webkitMovementX ||
                              0,

                        shoot.movementY = event.movementY ||
                              event.mozMovementY ||
                              event.webkitMovementY ||
                              0;
                        /**
                         *
                         * Update ball position
                         *
                         */

                        look.AtTheObjectsMove(shoot.movementX, shoot.movementY);
                  }
            }

      },

      AtTheObjectsMove: function(x, y) {

            /**
             *
             * Check if ball is thrown
             *
             */

            if (!ball.shot) {
                  if (shoot.controller == 'mobile') {
                        ball.position.x += x * 0.6;
                        shoot.rifle.position.x += x * 0.6;

                        // ball.position.y = y * 0.6;
                        // shoot.rifle.position.y = y * 0.6;
                  } else if (shoot.controller == 'mouse') {
                        ball.position.x += x * 0.9;
                        ball.position.y -= y * 0.9;

                        shoot.rifle.position.x += x * 0.9;
                        shoot.rifle.position.y -= y * 0.9;

                  }

                  ball.__dirtyPosition = true;
                  shoot.rifle.__dirtyPosition = true;
            } else {
                  ball.__dirtyPosition = false;

            }

      },

      theScreenIsGoingFullscreen: function() {
            console.log('fullscreen');
            if (document.webkitFullscreenElement === elem ||
                  document.mozFullscreenElement === elem ||
                  document.mozFullScreenElement === elem) { // Older API upper case 'S'.

                  // Element is fullscreen, now we can request pointer lock
                  elem.requestPointerLock = elem.requestPointerLock ||
                        elem.mozRequestPointerLock ||
                        elem.webkitRequestPointerLock;
                  elem.requestPointerLock();
            }

      },

      thePointerIsBeingLocked: function() {

            console.log('locked');

            if (document.mozPointerLockElement === elem ||
                  document.webkitPointerLockElement === elem) {} else {
                  console.log("Pointer Lock was lost."); // #TODO SHOW ERROR MESSAGE
            }

      },

      thePointerLockHasGoneWrong: function() {

            console.log("Error while locking pointer."); // #TODO ERROR MESSAGE

      },

      theUserIsLockingThePointer: function() {


            elem = document.getElementById("container");

            // Start by going fullscreen with the element. Current implementations
            // require the element to be in fullscreen before requesting pointer
            // lock--something that will likely change in the future.
            elem.requestFullscreen = elem.requestFullscreen ||
                  elem.mozRequestFullscreen ||
                  elem.mozRequestFullScreen || // Older API upper case 'S'.
            elem.webkitRequestFullscreen;

            elem.requestFullscreen();

      },

      theKeyIsGoingDown: function(event) {

            if (shoot.start) {
                  switch (event.keyCode) {

                        case 40: // down
                              yeswecan.get_theSceneCam.position.z += 10;
                              break;
                        case 37: // links
                              yeswecan.get_theSceneCam.rotation.y -= 0.1;
                              break;
                        case 39: // rechts
                              yeswecan.get_theSceneCam.rotation.y += 0.1;
                              break;
                        case 38: // up
                              yeswecan.get_theSceneCam.position.z -= 10;
                              break;
                        case 32: // spatie
                              if (yeswecan.get_thecurrentCam < yeswecan.get_AllTheCameras.length - 1) {
                                    yeswecan.get_thecurrentCam++;
                              } else {
                                    yeswecan.get_thecurrentCam = 0;
                              }

                              yeswecan.get_theSceneCam = yeswecan.get_AllTheCameras[yeswecan.get_thecurrentCam];
                              break;
                  }
            }

      },

      // theBallIsBouncing : function( other_object, relative_velocity, relative_rotation, contact_normal ) {
      //     // `this` has collided with `other_object` with an impact speed of `relative_velocity` and a rotational force of `relative_rotation` and at normal `contact_normal`

      //     if(other_object.name == 'basket' || other_object.name == 'ring')
      //     {
      //         //console.log('collide', other_object);
      //     }
      // }
}
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
       * Shoot a bullet
       *
       */

      theUserIsShooting: function(event) {

            if (shoot.start) {

                  var x, y, z;

                  if (shoot.controller == 'mobile') {
                        x = (event.x - sceneW) + sceneW / 2;
                        y = 0;
                        z = -1400;
                  } else if (shoot.controller == 'mouse') {
                        x = 0; //(event.x - sceneW)+ sceneW /2;
                        y = -2; //100 * shoot.power;
                        z = -1400;
                  } else if (shoot.controller == 'leap') {

                  }

                  // #TODO delay on direct shooten

                  /**
                   *
                   * Check if current bullet is alreay shot
                   *
                   */

                  if (!bullet.shot) {

                        shoot.totalMissed++;
                        bullet.setAngularFactor(new THREE.Vector3(1, 1, 1));
                        bullet.setLinearFactor(new THREE.Vector3(1, 1, 1));
                        bullet.setLinearVelocity(new THREE.Vector3(x, y, z));
                        bullet.setAngularVelocity(new THREE.Vector3(-10, 0, 0));
                        bullet.shot = true;
                        shoot.reload = true;

                        firedBullets.push(bullet);

                        /**
                         *
                         * Play sound when user shot
                         *
                         */

                        createjs.Sound.play("shoot", {
                              volume: .3
                        }); // #PLAY SOUND

                        /**
                         *
                         * Check if we have to reload a new ball
                         *
                         */

                        if (shoot.reload) {

                              shoot.totalBullets--; // update total balls

                              setTimeout(function() {

                                    /**
                                     *
                                     * Check if we have balls left
                                     *
                                     */


                                    if (shoot.totalBullets == 0) { // no balls left so stop the game

                                          setTimeout(function() {
                                                shoot.endGame();
                                          }, 1000);


                                          // $('.the_level span').text(shoot.level + 1);
                                          // $('.the_points span').text(shoot.totalPoints);
                                          // $('.next_level span').text(shoot.level + 2);

                                          // $('.totall').addClass('score');
                                    } else { // create new ball

                                          /**
                                           *
                                           * Play sound to reload
                                           *
                                           */

                                          createjs.Sound.play("reload", {
                                                volume: .3
                                          }); // #PLAY SOUND

                                          setTimeout(function() { // set a timeout of 0 so we don't halt execution
                                                yeswecan.build_thebullet();
                                          }, 0)
                                          shoot.reload = false;
                                    }

                                    /**
                                     *
                                     * Remove a bullet
                                     *
                                     */

                                    setTimeout(function() {
                                          shoot.removeABullet();
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
                         * Update bullet position
                         *
                         */

                        look.AtTheObjectsMove(shoot.movementX, shoot.movementY);
                  }
            }

      },

      AtTheObjectsMove: function(x, y) {

            /**
             *
             * Check if a bullet is shot
             *
             */

            if (!bullet.shot) {
                  if (shoot.controller == 'mobile') {
                        bullet.position.x += x * 0.6;
                        shoot.rifle.position.x += x * 0.6;

                        // ball.position.y = y * 0.6;
                        // shoot.rifle.position.y = y * 0.6;
                  } else if (shoot.controller == 'mouse') {
                        bullet.position.x += x * 0.9;
                        bullet.position.y -= y * 0.9;

                        shoot.rifle.position.x += x * 0.9;
                        shoot.rifle.position.y -= y * 0.9;

                  }

                  bullet.__dirtyPosition = true;
                  shoot.rifle.__dirtyPosition = true;
            } else {
                  bullet.__dirtyPosition = false;

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
            } else {
                  if (shoot.isNextLevel) {
                        switch (event.keyCode) {
                              case 32: // spatie
                                    if (!shoot.gameOver) {
                                          shoot.nextLevel(shoot.level);
                                    }
                                    break;
                              case 82: // R
                                    if (!shoot.gameOver) {
                                          shoot.replayLevel(shoot.level);
                                    }
                                    break;

                        }
                  }
            }

            if (event.keyCode == 27 && !shoot.infoVisible) { // esc
                  //event.preventDefault();
                  shoot.pause()

            }


      }
}
var shoot = {

      /**
       *
       * Set some game variables
       *
       */

      level: 0,
      reload: false,
      start: false,
      controller: 'mouse',
      totalPoints: 0,
      totalScored: 0,
      totalMissed: 0,
      globalPoints: 0,
      allBullets: [],
      currentBullet: 0,
      rendering: true,
      infoVisible: true,
      isNextLevel: false,

      /**
       *
       * Initialize the game
       *
       */

      init: function() {

            /**
             *
             * Set totalBullets and show the level
             *
             */

            shoot.totalBullets = levels[shoot.level].totalBullets;
            $('.level').text(shoot.level);
            timeRemaining = levels[shoot.level].time;

            /**
             *
             * Store the scene dimensions
             *
             */

            sceneW = container.offsetWidth;
            sceneH = container.offsetHeight;

            /**
             *
             * Build our 3D World and Create the stats
             *
             */

            physics.build_scene();
            shoot.createStats();

            /**
             *
             * Call functions in canwebuildit.js
             *
             */
            yeswecan.build_everything();

            /**
             *
             * Leap motion
             *
             */

            leap.init();

      },

      /**
       *
       * Update the physics engine and render every frame
       *
       */

      animate: function() {

            requestAnimationFrame(shoot.animate); // continue animating

            shoot.render();
            shoot.moveTargets();
            scene.simulate();

            counter++;

            if (counter == 60) {
                  setTimeout(function() {
                        if (shoot.start) {
                              requestAnimationFrame(shoot.addTargets);
                              // scoreTick();
                              // shoot.timeLeft('animate');
                        }
                  }, levels[shoot.level].speed / 60);
                  counter = 0;
            }
      },

      render: function() {

            renderer.render(scene, yeswecan.get_theSceneCam); // render the scene
            stats.update(); // update the stats

            /**
             *
             * Check if the user has scored
             *
             */

            shoot.checkCollision();

            /**
             *
             * Update the game info in the ticket
             *
             */

            shoot.updateInfo();

            /**
             *
             * Rotate clouds
             *
             */
            if (shoot.clouds) {
                  if (shoot.start) {
                        shoot.clouds.rotation.y += helpMe.calculate('rad', 0.05);
                  }
            }
      },

      /**
       *
       * Create some render stats
       *
       */

      createStats: function() {
            stats = new Stats();
            stats.domElement.style.position = 'absolute';
            stats.domElement.style.top = '0px';
            stats.domElement.style.zIndex = 100;
            container.appendChild(stats.domElement);
      },

      checkCollision: function() {
            /**
             *
             * Double check to be 100% sure a bullet  hit a target
             *
             */

            shoot.checkRotationTargets();
            setTimeout(function() {
                  shoot.checkRotationTargets();
            }, 8);

      },

      checkRotationTargets: function() {
            for (var i = 0; i < targets.length; i++) {
                  if (!targets[i].hit && !targets[i].removed) {
                        if ((targets[i].target.rotation.x).toFixed(1) <= helpMe.calculate('rad', 10)) { //!= 1.6
                              targets[i].hit = true;
                              shoot.score(targets[i].target.number);
                        }
                  }
            }
      },

      score: function(ringnumber) {
            /**
             *
             * Update total scored, missed and points
             *
             */

            shoot.totalScored++;
            shoot.totalMissed--;
            shoot.totalPoints += targets[ringnumber].target.points;

            /**
             *
             * Show points in 3D
             *
             */

            createTextOptions(targets[ringnumber].target.material.color, 0xFFFFFF);
            var textGeom = new THREE.TextGeometry(targets[ringnumber].target.points, setOptions(8));
            var textMaterial = new THREE.MeshFaceMaterial(materialArray);
            var textMesh = new THREE.Mesh(textGeom, textMaterial);
            textGeom.computeBoundingBox();
            var textWidth = textGeom.boundingBox.max.x - textGeom.boundingBox.min.x;
            textMesh.position.set(targets[ringnumber].target.position.x, targets[ringnumber].target.position.y + 20, targets[ringnumber].target.position.z + 30);
            textMesh.name = 'points';
            scene.add(textMesh);

            /**
             *
             * Animate the 3D score up and fadeit after a couple of seconds
             * when it is totally faded remove it from the scene
             *
             */

            var animateUp = setInterval(function() {
                  textMesh.position.y += 2;
            }, 100);

            setTimeout(function() {
                  var fadeOut = setInterval(function() {
                        textMesh.material.materials[0].opacity -= .1;
                        textMesh.material.materials[1].opacity -= .1;

                        if (textMesh.material.materials[0].opacity == 0 && textMesh.material.materials[1].opacity == 0) {
                              clearInterval(animateUp);
                              clearInterval(fadeOut);
                              scene.remove(textMesh);
                        }
                  }, 100)
            }, 1000);
      },

      /**
       *
       * Remove bullets
       *
       */

      removeABullet: function() {
            var i = 0;
            $.each(bullets, function(index, bullet) {
                  if (i == 0) {
                        if (bullet.shot) {
                              if (bullet.position.z < 100 && bullet.position.y < 50 && bullet.position.x > -250 && bullet.position.x < 250) {
                                    scene.remove(bullet);
                                    bullets.splice(index, 1);
                                    i++
                              }
                        }
                  }
            });
      },

      updateInfo: function() {
            $('.level').text(shoot.level + 1);
            $('.count').text(shoot.totalBullets);
            $('.score').text(shoot.totalPoints);
            $('.timeLeft').text(timeRemaining);
      },

      moveTargets: function() {
            for (var i = 0; i < targets.length; i++) {

                  if (!targets[i].removed) {
                        targets[i].stand.position.x -= targets[i].speed;
                        targets[i].stand.__dirtyPosition = true;
                        if (targets[i].target.position.x < -175) {
                              scene.remove(targets[i].constraint);
                              scene.remove(targets[i].target);
                              scene.remove(targets[i].stand);
                              scene.remove(targets[i].speed);
                              //targets.splice(i, 1);
                              targets[i] = {
                                    removed: true
                              };
                        }
                  }
            }
      },

      endGame: function() {
            shoot.start = false;

            var newTicket = $('.info-score').clone();
            newTicket.removeClass('active');

            $('.info-score').addClass('ripping');

            setTimeout(function() {
                  $('.info-score').removeClass('ripping').addClass('big');
                  setTimeout(function() {
                        shoot.isNextLevel = true;
                        $('.level-button').fadeIn();
                        $('.ticket-holder').append(newTicket)
                  }, 2500)
            }, 1000)
      },

      resetGame: function(type, i) {
            $('.big').css({
                  right: '500%'
            });

            shoot.start = false;

            //only do this after the big ticket is gone from the screen
            setTimeout(function() {
                  $('.big').remove();

                  if (type == 'replay') {

                        shoot.level = i;
                  }

                  if (type == 'next') {
                        shoot.globalPoints += shoot.totalPoints;
                        shoot.level++;
                  }

                  console.log(type, i);

                  if (shoot.level <= levels.length - 1) {

                        setTimeout(function() {



                              console.log(shoot.level)
                              $('.info-score').addClass('active');
                              shoot.totalBullets = levels[shoot.level].totalBullets;
                              shoot.totalPoints = 0;
                              reloadScene();
                              shoot.start = true;
                              shoot.isNextLevel = false;
                              timeRemaining = levels[shoot.level].time;
                              shoot.timeLeft('reset Game');
                        }, 500);


                  } else {
                        shoot.globalPoints += shoot.totalPoints;
                        shoot.gameOver = true;

                        $('.game-over').addClass('slide-up');
                        $('.totalScoreGame').html(shoot.globalPoints);
                        $('.totalScoredGame').html(shoot.totalScored);
                        $('.totalMissedGame').html(shoot.totalMissed);
                  }
            }, 500)

      },

      replayLevel: function(i) {
            shoot.resetGame('replay', i);
      },

      nextLevel: function(i) {
            shoot.resetGame('next', i);
      },

      addTargets: function() {
            if (shoot.start) {
                  var random = Math.ceil(Math.random() * 3);
                  var place = Math.ceil(Math.random() * 3);

                  switch (place) {
                        case 1:
                              yeswecan.addTarget(t, 0, 0, .7 * (levels[shoot.level].speed / 1000), random);
                              break;
                        case 2:
                              yeswecan.addTarget(t, 38, 30, .6 * (levels[shoot.level].speed / 1000), random);
                              break;
                        case 3:
                              yeswecan.addTarget(t, 96, 50, .8 * (levels[shoot.level].speed / 1000), random);
                              break;
                  }

                  t++;
            }
      },

      timeLeft: function(where) {
            console.log('where', where);

            //ticks once a second for the score, checks for remaining time
            if (timeRemaining == 0) {
                  shoot.endGame();
            }

            if (shoot.start && timeRemaining > 0) {

                  timeRemaining -= 1;

                  setTimeout(function() {
                        if (shoot.start) {
                              shoot.timeLeft('timeLeft');
                        }
                  }, 1000)
            }
      },

      getRandomColor: function() {
            var letters = '0123456789ABCDEF'.split('');
            var color = '#';
            for (var i = 0; i < 6; i++) {
                  color += letters[Math.floor(Math.random() * 16)];
            }

            return color;
      },

      pause: function() {
            if (!shoot.start || !shoot.infoVisible) {
                  $('.pause').fadeOut(100);
                  shoot.start = true;
                  shoot.timeLeft('pause fadeout'); //#REMOVE
            } else {
                  $('.pause').fadeIn(100);
                  shoot.start = false;
                  shoot.timeLeft('pause fadein');
            }
      },

      showNotification: function(text) {
            $('.notification').html(text);

            $('.notification').addClass('active');
            setTimeout(function() {
                  $('.notification').removeClass('active');
            }, 1500)
      }
}









/**
 *
 * Get the container element
 *
 */
// var container = document.getElementById('container');

// /**
//  *
//  * Some THREE objects
//  *
//  */

// var /* camera, */ scene, renderer;
// var sceneW, sceneH;
// var physicsMaterial;

// var throwing = false;

// var ball, basketRing;
// var basketRings = [];
// var firedBullets = [];
// var balls = [];

// var t = 0;
// var stats;


// // The element we'll make fullscreen and pointer locked.
// var fullscreenElement;


// // var capturer = new CCapture( { // FOR CAPTURING A REPLAY
// //     framerate: 24
// // } );
// var counter = 0;
// var timeRemaining;
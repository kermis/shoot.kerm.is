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
             * Set totalBalls and show the level
             *
             */

            shoot.totalBalls = levels[shoot.level].totalBalls;
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

            yeswecan.build_therenderer();
            yeswecan.build_thecamera();
            yeswecan.build_thebasketstand();
            yeswecan.build_thelights();
            //yeswecan.build_thebasket();
            yeswecan.build_theball();



            yeswecan.buildTooth();
            yeswecan.build_theRifle();






            // var head = new THREE.ObjectLoader();

            // head.load('assets/js/models/head.js', function (mesh) {

            //     mesh.scale.set(10, 10, 10);
            //     mesh.position.set(-40, 0, 500);
            //     mesh.name = 'basketstand';
            //     scene.add(mesh);

            // });

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
            //scene.simulate(); // run physics

            requestAnimationFrame(shoot.animate); // continue animating
            //capturer.capture( renderer.domElement );

            // if (shoot.rendering) {
            //       shoot.render();
            // }

            shoot.render();
            shoot.moveTargets();
            scene.simulate();



            counter++;

            if (counter == 60) {
                  setTimeout(function() {
                        if (shoot.start) {
                              // console.log('add target', t);
                              //    t++;
                              requestAnimationFrame(shoot.addTargets);
                              console.log('add target');
                              scoreTick();
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


            // /**
            //  *
            //  * Check if we have to animate the basketrings during a level
            //  *
            //  */

            // if(shoot.start) {
            //       if(levels[shoot.level].animate) {

            //             shoot.animateRings();

            //       }
            // }

            // if(shoot.start)
            // {

            // }



            // if(shoot.start) {
            // setTimeout(function() {
            //       random = Math.ceil(Math.random() * 3);
            //       yeswecan.addTooth(0, 0, 0, .7, random);
            // }, 2000)
            // }

            //shoot.moveTargets();
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
             * Double check to be 100% sure a ball went through
             *
             */

            shoot.checkDistanceTo(15, 25); // posY, distanceTo
            shoot.checkDistanceTo(20, 30); // posY, distanceTo

      },

      checkDistanceTo: function(posY, distanceTo) {

            // var ballPos = new THREE.Vector3(
            //     ball.position.x,
            //     ball.position.y,
            //     ball.position.z
            // );

            // var basketRingPos;


            // if(counter== 0){
            // console.log('basketrings', basketRings, basketRings.length);
            //       counter++;
            // }


            for (var i = 0; i < basketRings.length; i++) {

                  // basketRingPos = new THREE.Vector3(
                  //       basketRings[i].position.x,
                  //       basketRings[i].position.y - posY,
                  //       basketRings[i].position.z
                  // );

                  // if(ballPos.distanceTo(basketRingPos) < distanceTo) {

                  //       if(!ball.score) {
                  //             ball.score = true;
                  //             shoot.score(basketRings[i].number);
                  //       }

                  // }

                  //console.log('basketRings[i].rotation.x', basketRings[i].rotation.x, 'rad', helpMe.calculate('rad', -45));
                  //console.log('ball.shot', ball.shot);
                  if (!basketRings[i].hit) {

                        if (basketRings[i].target.rotation.x < helpMe.calculate('rad', -45)) {

                              // ball.shot = true;
                              basketRings[i].hit = true;
                              shoot.score(basketRings[i].target.number);
                              // console.log('ball rotation shot after', ball.shot)
                        }
                  }
            }

      },

      score: function(ringnumber) {
            // setTimeout(function() {
            //   var videoURL = capturer.save();
            //   capturer.stop();
            //   console.log(videoURL);
            // }, 2000);

            console.log('score');
            /**
             *
             * Update total scored, missed and points
             *
             */

            shoot.totalScored++;
            shoot.totalMissed--;
            shoot.totalPoints += levels[shoot.level].pointsPerGoal;


            /**
             *
             * Show points in 3D
             *
             */

            var materialFront = new THREE.MeshBasicMaterial({
                  color: 0xCC0030,
                  transparent: true,
                  opacity: 1
            });
            var materialSide = new THREE.MeshBasicMaterial({
                  color: 0x00ff00,
                  transparent: true,
                  opacity: 1
            });
            var materialArray = [materialFront, materialSide];
            var textGeom = new THREE.TextGeometry(basketRings[ringnumber].target.points, {
                  size: 10,
                  height: 10,
                  curveSegments: 3,
                  font: "helvetiker",
                  weight: "bold",
                  style: "normal",
                  bevelThickness: 0,
                  bevelSize: 0,
                  bevelEnabled: false,
                  material: 0,
                  extrudeMaterial: 1
            });

            var textMaterial = new THREE.MeshFaceMaterial(materialArray);
            var textMesh = new THREE.Mesh(textGeom, textMaterial);

            textGeom.computeBoundingBox();
            var textWidth = textGeom.boundingBox.max.x - textGeom.boundingBox.min.x;


            //textMesh.position.set(basketRings[ringnumber].target.position.x, basketRings[ringnumber].target.position.y + 20, basketRings[ringnumber].target.position.z);
            textMesh.position.set(0, 80, 300);
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
       * Remove balls when the are inside the basketstand otherwise keep them visible
       *
       */


      removeABall: function() {

            var i = 0;

            $.each(balls, function(index, basketball) {

                  if (i == 0) {

                        if (basketball.shot) {
                              if (basketball.position.z < 100 && basketball.position.y < 50 && basketball.position.x > -250 && basketball.position.x < 250) {

                                    scene.remove(basketball);
                                    balls.splice(index, 1);
                                    i++

                              }
                        }

                  }

            });
      },

      updateInfo: function() {
            $('.level').text(shoot.level + 1);
            $('.count').text(shoot.totalBalls);
            $('.score').text(shoot.totalPoints);
            $('.timeLeft').text(timeRemaining);


            // if(shoot.totalScored == levels[shoot.level].totalBalls)
            // {
            //   $('.the_bonus span').text(levels[shoot.level].bonusPoints);
            // }
            //$('.level').text('Level ' + (shoot.level + 1));
            // $('.scored span').text(shoot.totalScored);
            // $('.missed span').text(shoot.totalMissed);

      },

      animateRings: function() {
            if (levels[shoot.level].animate.position == 'up') {
                  if (basketRings[levels[shoot.level].animate.ring].position.y < 200) {
                        basketRings[levels[shoot.level].animate.ring].position.y += 0.5;
                  } else {
                        basketRings[levels[shoot.level].animate.ring].position.y -= 0.5;
                        levels[shoot.level].animate.position = 'down';
                  }
            }

            if (levels[shoot.level].animate.position == 'down') {
                  if (basketRings[levels[shoot.level].animate.ring].position.y > levels[shoot.level].animate.length) {
                        basketRings[levels[shoot.level].animate.ring].position.y -= 0.5;
                  } else {
                        basketRings[levels[shoot.level].animate.ring].position.y += 0.5;
                        levels[shoot.level].animate.position = 'up';
                  }
            }

            basketRings[levels[shoot.level].animate.ring].__dirtyPosition = true;
      },

      moveTargets: function() {


            for (var i = 0; i < basketRings.length; i++) {
                  basketRings[i].stand.position.x -= basketRings[i].speed;
                  basketRings[i].stand.__dirtyPosition = true;

                  if (basketRings[i].target.position.x < -175) {
                        scene.remove(basketRings[i].target);
                        scene.remove(basketRings[i].stand);
                        scene.remove(basketRings[i].constraint);
                        basketRings.splice(i, 1);
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
            console.log('type', type);
            $('.big').css({
                  right: '500%'
            });

            //only do this after the big ticket is gone from the screen
            setTimeout(function() {
                  $('.big').remove();

                  if (shoot.level < levels.length - 1) {

                        if (type == 'next') {
                              shoot.globalPoints += shoot.totalPoints;
                              shoot.level++;
                        } else {
                              shoot.level = i;
                        }

                        $('.info-score').addClass('active');
                        timeRemaining = levels[shoot.level].time;
                        shoot.totalBalls = levels[shoot.level].totalBalls;
                        shoot.totalPoints = 0;
                        // shoot.totalScored = 0;
                        // shoot.totalMissed = 0;

                        reloadScene();

                        shoot.start = true;
                        shoot.isNextLevel = false;

                        shoot.timeLeft('reset Game');

                        console.log('level', shoot.level);
                  } else {
                        shoot.globalPoints += shoot.totalPoints;
                        console.log('game over', shoot.globalPoints);
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


                  // timeRemaining -= 1;
                  //game.updateScoreInfo();

                  var random = Math.ceil(Math.random() * 3);
                  var place = Math.ceil(Math.random() * 3);
                  console.log('random', random, t);

                  switch (place) {
                        case 1:
                              yeswecan.addTooth(t, 0, 0, .7, random);
                              break;
                        case 2:
                              yeswecan.addTooth(t, 38, 30, .6, random);
                              break;
                        case 3:
                              yeswecan.addTooth(t, 96, 50, .8, random);
                              break;
                  }


                  t++;
            }

            // setTimeout(function() {
            //       if (shoot.start) {
            //             shoot.addTargets();
            //       }
            // }, 1000)
      },

      timeLeft: function(where) {
            console.log('where timeleft?', where);
            //ticks once a second for the score, checks for remaining time
            if (timeRemaining == 0) {
                  shoot.endGame();
            }

            if (shoot.start && timeRemaining > 0) {

                  timeRemaining -= 1;
                  //game.updateScoreInfo();

                  setTimeout(function() {
                        if (shoot.start) {
                              shoot.timeLeft('timeLeft');
                        }
                  }, 1000)
            }
      },

      pause: function() {

            if (!shoot.start) {
                  $('.pause').fadeOut(100);
                  shoot.start = true;
                  shoot.timeLeft('pause fadeout'); //#REMOVE
                  console.log('fadeout');
            } else {
                  $('.pause').fadeIn(100);
                  shoot.start = false;
                  shoot.timeLeft('pause fadein');
                  console.log('fadein');
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

var container = document.getElementById('container');

/**
 *
 * Some THREE objects
 *
 */

var /* camera, */ scene, renderer;
var sceneW, sceneH;
var physicsMaterial;

var throwing = false;

var ball, basketRing;
var basketRings = [];
var firedBullets = [];
var balls = [];

var t = 0;
var stats;


// The element we'll make fullscreen and pointer locked.
var fullscreenElement;


// var capturer = new CCapture( { // FOR CAPTURING A REPLAY
//     framerate: 24
// } );
var counter = 0;
var timeRemaining;
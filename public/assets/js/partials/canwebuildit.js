/**
 *
 * canwebuiltit.js #YESWECAN
 *
 */

var yeswecan = {

      /**
       *
       * Build the WebGL renderer
       *
       */

      build_therenderer : function() {

            renderer = new THREE.WebGLRenderer({ antialias : true });
            renderer.setSize(sceneW, sceneH)
            renderer.setClearColor(0x66ccff); // background color
            renderer.shadowMapEnabled = true;
            renderer.shadowMapSoft = true;
            renderer.shadowMapType = THREE.PCFShadowMap;
            renderer.shadowMapAutoUpdate = true;
            container.appendChild(renderer.domElement);

      },

      /**
       *
       * Build the THREE camera's
       *
       */

      build_thecamera : function() {

            var mainCamera = new THREE.PerspectiveCamera(50, sceneW / sceneH, 1, 10000);
            mainCamera.position.z =  750; // move back
            mainCamera.position.y = 100; // move up
            mainCamera.name = "main";
            mainCamera.lookAt(new THREE.Vector3(0, 150,0)); // point it down at the center of the 3D scene

            // var backCamera = new THREE.PerspectiveCamera(50, sceneW / sceneH, 1, 10000);
            // backCamera.position.z = -63; // move back
            // backCamera.position.y =210; // move up
            // backCamera.position.x = 0;
            // backCamera.rotation.y = helpMe.calculate('rad', 180);
            // backCamera.rotation.x = helpMe.calculate('rad', 20);
            // backCamera.name = "back";

            this.get_thecurrentCam = 0;
            this.get_AllTheCameras = [mainCamera];

            yeswecan.get_theSceneCam = yeswecan.get_AllTheCameras[yeswecan.get_thecurrentCam];

      },

      /**
       *
       * Build the groud, basketstand
       *
       */

      build_thebasketstand : function() {

            /**
             *
             * Build the ground
             *
             */


            yeswecan_setSomeArguments = {
              'type' : 'plane', 'width' : 1000,
              'height' : 1000, 'wSegments' : 10,
              'hSegments' : 10, 'color' : 0x00C51F,
              'transparent' : false, 'opacity' : 1,
              'friction' : .1, 'restitution' : .3,
              'posZ' : 100, 'rotX' : -90, 'name' : 'ground'
            }
            this.build_thelowpolystand(yeswecan_setSomeArguments);

            /**
            *
            * Load basket stand
            *
            */

            var landscape = new THREE.ObjectLoader();

            landscape.load('assets/js/models/schietkraam.js', function (mesh) {

                mesh.scale.set(0.25, 0.25, 0.25);
                mesh.position.set(0, 0, 260);
                mesh.rotation.y = helpMe.calculate('rad', -89);
                mesh.name = 'schietkraam';
                scene.add(mesh);

            });

            /**
             *
             * Create all the hitboxes
             *
             */

            //hitboxes.create();

            yeswecan_setSomeArguments = {
              'type' : 'cube', 'width' : 300,
              'height' : 4, 'depth' : 38,
              'wSegments' : 10, 'hSegments' : 10,
              'color' : 0x00FFFF, 'transparent' : true,
              'opacity' : 0, 'friction' : .4,
              'restitution' : .4, 'posY' :40,
              'posZ' : 400, 'name' : 'row1'
            }
            this.build_thelowpolystand(yeswecan_setSomeArguments);

            yeswecan_setSomeArguments = {
              'type' : 'cube', 'width' : 350,
              'height' : 4, 'depth' : 38,
              'wSegments' : 10, 'hSegments' : 10,
              'color' : 0x00FFFF, 'transparent' : true,
              'opacity' : 0, 'friction' : .4,
              'restitution' : .4, 'posY' : 68,
              'posZ' : 370, 'name' : 'row2'
            }
            this.build_thelowpolystand(yeswecan_setSomeArguments);

            yeswecan_setSomeArguments = {
              'type' : 'cube', 'width' : 350,
              'height' : 4, 'depth' : 38,
              'wSegments' : 10, 'hSegments' : 10,
              'color' : 0x00FFFF, 'transparent' : true,
              'opacity' : 0, 'friction' : .4,
              'restitution' : .4, 'posY' : 113,
              'posZ' : 346, 'name' : 'row3'
            }
            this.build_thelowpolystand(yeswecan_setSomeArguments);

            yeswecan_setSomeArguments = {
              'type' : 'cube', 'width' : 20,
              'height' : 233, 'depth' : 20,
              'wSegments' : 10, 'hSegments' : 10,
              'color' : 0x00FFFF, 'transparent' : true,
              'opacity' : 0, 'friction' : .4,
              'restitution' : .4, 'posX' : -140, 'posY' : 116,
              'posZ' : 453, 'rotY' : -5, 'name' : 'leftSideFront'
            }
            this.build_thelowpolystand(yeswecan_setSomeArguments);

            yeswecan_setSomeArguments = {
              'type' : 'cube', 'width' : 20,
              'height' : 233, 'depth' : 20,
              'wSegments' : 10, 'hSegments' : 10,
              'color' : 0x00FFFF, 'transparent' : true,
              'opacity' : 0, 'friction' : .4,
              'restitution' : .4, 'posX' : 140, 'posY' : 116,
              'posZ' : 450, 'rotY' : 5, 'name' : 'rightSideFront'
            }
            this.build_thelowpolystand(yeswecan_setSomeArguments);

            yeswecan_setSomeArguments = {
              'type' : 'cube', 'width' : 20,
              'height' : 300, 'depth' : 20,
              'wSegments' : 10, 'hSegments' : 10,
              'color' : 0x00FFFF, 'transparent' : true,
              'opacity' : 0, 'friction' : .4,
              'restitution' : .4, 'posX' : 0, 'posY' : 220,
              'posZ' : 450, 'rotX' : 90, 'rotZ' : 90,  'name' : 'topSideFront'
            }
            this.build_thelowpolystand(yeswecan_setSomeArguments);

            yeswecan_setSomeArguments = {
              'type' : 'plane', 'width' : 300,
              'height' : 200,
              'wSegments' : 10, 'hSegments' : 10,
              'color' : 0x00FFFF, 'transparent' : true,
              'opacity' : 0, 'friction' : .4,
              'restitution' : .4, 'posX' : 0, 'posY' : 100,
              'posZ' : 200, 'name' : 'backside'
            }
            this.build_thelowpolystand(yeswecan_setSomeArguments);

            // yeswecan_setSomeArguments = {
            //   'type' : 'plane', 'width' : 300,
            //   'height' : 200,
            //   'wSegments' : 10, 'hSegments' : 10,
            //   'color' : 0x00FFFF, 'transparent' : true,
            //   'opacity' : .6, 'friction' : .4,
            //   'restitution' : .4, 'posX' : -133, 'posY' : 100,
            //   'posZ' : 300, 'rotY' : 90, 'name' : 'leftside'
            // }
            // this.build_thelowpolystand(yeswecan_setSomeArguments);

            // yeswecan_setSomeArguments = {
            //   'type' : 'plane', 'width' : 300,
            //   'height' : 200,
            //   'wSegments' : 10, 'hSegments' : 10,
            //   'color' : 0x00FFFF, 'transparent' : true,
            //   'opacity' : .6, 'friction' : .4,
            //   'restitution' : .4, 'posX' : 133, 'posY' : 100,
            //   'posZ' : 300, 'rotY' : -90, 'name' : 'rightside'
            // }
            // this.build_thelowpolystand(yeswecan_setSomeArguments);
      },

      build_thelowpolystand : function(args) {
            if(args.type == 'plane')
            {
                var geometry = new THREE.PlaneGeometry(args.width, args.height, args.wSegments, args.hSegments); // width, height, widhtSegments, heightSegments
            }

            if(args.type == 'cube') {
                var geometry = new THREE.BoxGeometry(args.width, args.height, args.depth, args.wSegments, args.hSegments); // width, height, widhtSegments, heightSegments
            }

            geometry.computeFaceNormals();
            geometry.computeVertexNormals();

            var material = Physijs.createMaterial (
                new THREE.MeshLambertMaterial( {  color : args.color, transparent : args.transparent, opacity : args.opacity }),
                args.friction,
                args.restitution
            );

            if(args.type == 'plane')
            {
                var mesh = new Physijs.HeightfieldMesh(geometry, material, 0); // matches a regular grid of height values given in the z-coordinates
            }
            if(args.type == 'cube')
            {
                var mesh = new Physijs.BoxMesh(geometry, material, 0); // matches a regular grid of height values given in the z-coordinates
            }

            if(args.posX) mesh.position.x = args.posX;
            if(args.posY) mesh.position.y = args.posY;
            if(args.posZ) mesh.position.z = args.posZ;
            if(args.rotX)  mesh.rotation.x = helpMe.calculate('rad', args.rotX);
            if(args.rotY)  mesh.rotation.y = helpMe.calculate('rad', args.rotY);
            if(args.rotZ)  mesh.rotation.z = helpMe.calculate('rad', args.rotZ);
            mesh.name = args.name;

            scene.add( mesh );
      },

      /**
       *
       * Create an ambient light and a spot light
       *
       */

      build_thelights : function() {

            var light = new THREE.HemisphereLight(0xffffff, 0x000000, 1)
            light.name = 'light';
            scene.add(light)

      },


































      /**
       *
       * Create my 6 teeth
       *
       */

      buildTooth :  function() {

        var random;

        i = 0;
        setInterval(function() {
          if(shoot.start)
          {
            random = Math.ceil(Math.random() * 3);
            yeswecan.addTooth(i, 0, 0, .7, random);
            i++;
          }
        }, 1300);


        setInterval(function() {
          if(shoot.start)
          {
            random = Math.ceil(Math.random() * 3);
            yeswecan.addTooth(i, 30, 30, .6, random);
            i++;
          }
        }, 1500);


        setInterval(function() {
          if(shoot.start)
          {
            random = Math.ceil(Math.random() * 3);
            yeswecan.addTooth(i, 75, 50, .8, random);
            i++;
          }
        }, 1700);


      },


              /**
               *
               * Function to create a tooth
               *
               */

            addTooth : function(i, y, z, speed, random) {


                var tooth_stand = new Physijs.BoxMesh(
                  new THREE.CubeGeometry( 35, 5, 2, 3, 3, 3),
                  new THREE.MeshBasicMaterial({ color : 0x0000FF, transparent : true, opacity : .1}),
                  0
                );

                tooth_stand.position.set( 140, 40 + y, 403 - z); // 35 - (35 * i)
                scene.add(tooth_stand);



                 var toothTexure = THREE.ImageUtils.loadTexture( 'assets/img/target.jpg' );
                  toothTexure.wrapS =toothTexure.wrapT = THREE.RepeatWrapping;
                  toothTexure.repeat.set( 0, 1);

                  var tooth;

                  switch(random){
                    case 1 :
                      tooth   = new Physijs.CylinderMesh(
                              new THREE.CylinderGeometry( 13, 13, 2, 50, 50) ,
                              new THREE.MeshPhongMaterial({ map: toothTexure, friction : 1, restitution : 1 })
                      );
                      tooth.rotation.x = helpMe.calculate('rad', 90);
                      break
                    case 2:
                      tooth   = new Physijs.BoxMesh(
                              new THREE.CubeGeometry( 20, 25, 2, 50, 50) ,
                              new THREE.MeshPhongMaterial({ map: toothTexure, friction : 1, restitution : 1 })
                      );
                      break
                    case 3:
                      tooth   = new Physijs.CylinderMesh(
                              new THREE.CylinderGeometry( 15, 15, 2, 3, 3),
                              new THREE.MeshPhongMaterial({ map: toothTexure, friction : 1, restitution : 1 })
                      );
                      tooth.rotation.x = helpMe.calculate('rad', 90);
                      break
                  }


                tooth.position.set( 140 , 55 + y, 400 - z); // 35 - (35 * i)
                tooth.category = 'tooth';
                tooth.name = 'tooth';

                tooth.hit = false;
                tooth.number = i;
                scene.add(tooth);


                var constraint = new Physijs.HingeConstraint(
                    tooth, // First object to be constrained
                    tooth_stand, // OPTIONAL second object - if omitted then physijs_mesh_1 will be constrained to the scene
                    new THREE.Vector3( tooth_stand.position.x, tooth_stand.position.y + 3, tooth_stand.position.z - 3), // point in the scene to apply the constraint
                    new THREE.Vector3( 1, 0, 0 ) // Axis along which the hinge lies - in this case it is the X axis
                );



              scene.addConstraint( constraint );

                constraint.setLimits(
                    0, // minimum angle of motion, in radians
                    -(Math.PI / 2)  // maximum angle of motion, in radians
                );



                var teeth = {
                  'stand' : tooth_stand,
                  'tooth' : tooth,
                  'speed' : speed,
                  'constraint' : constraint
                }

                basketRings.push(teeth);



                // tooth.addEventListener( 'collision', function( other_object, relative_velocity, relative_rotation, contact_normal ) {
                //     if(other_object.name == 'ball')
                //       {
                //         console.log('collide tooth');
                //         shoot.score(basketRings[0].number);
                //       }

                //       if(other_object.name == 'ground')
                //       {
                //         console.log('ground');
                //       }
                // });
        },



























      /**
       *
       * Build the ball and draw its texture with a 2D canvas
       *
       */

      build_theball : function() {

            $('.powerIndicator').css({ 'bottom' : 0});
            shoot.power = 0;
            shoot.way = 'up';


            var ballTexture = THREE.ImageUtils.loadTexture( 'assets/img/basket.png' );
            ballTexture.wrapS =ballTexture.wrapT = THREE.RepeatWrapping;
            ballTexture.repeat.set( 1, 0 );



            var ballMaterial = Physijs.createMaterial (
                new THREE.MeshBasicMaterial( { map : ballTexture, color: 0xff8000 }),
                1,
                0
            );

            ball = new Physijs.SphereMesh(
                  new THREE.SphereGeometry( 3, 10, 7),
                  ballMaterial
            );

            ball.position.set(0, 50, 600);
            ball.receiveShadow = true;
            ball.rotation.x = helpMe.calculate('rad', -85);
            ball.name = "ball";
            ball.shot = false;
            ball.castShadow = true;

            scene.add(ball);

            balls.push(ball);

            ball.setAngularFactor(new THREE.Vector3( 0, 0, 0 ));
            ball.setLinearFactor(new THREE.Vector3( 0, 0, 0 ));
            ball.setLinearVelocity(new THREE.Vector3( 0, 0, 0 ));
            ball.setAngularVelocity(new THREE.Vector3( 0, 0, 0 ));

            //console.log('ball shot buid', ball.shot);

            //ball.addEventListener( 'collision', look.theBallIsBouncing);

            // Enable CCD if the object moves more than 1 meter in one simulation frame
            ball.setCcdMotionThreshold(1);

            // Set the radius of the embedded sphere such that it is smaller than the object
            ball.setCcdSweptSphereRadius(0.2);

            // ball.addEventListener( 'collision', function( other_object, relative_velocity, relative_rotation, contact_normal ) {
            //         if(other_object.name == 'tooth')
            //           {
            //             console.log('collide ball');
            //             shoot.score(basketRings[0].number);
            //           }
            //     });

      }

}
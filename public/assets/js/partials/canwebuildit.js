/**
 *
 * canwebuiltit.js #YESWECAN
 *
 */

var yeswecan = {
      /**
       *
       * Build everything
       *
       */
      build_everything: function() {

            /**
             *
             * Call functions in canwebuildit.js
             *
             */
            yeswecan.build_therenderer();
            yeswecan.build_thecamera();
            yeswecan.build_theshootstand();
            yeswecan.build_thelights();
            yeswecan.build_thebullet();
            yeswecan.build_therifle();
            yeswecan.build_thecloud();
      },

      /**
       *
       * Build the WebGL renderer
       *
       */

      build_therenderer: function() {

            renderer = new THREE.WebGLRenderer({
                  antialias: true
            });
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

      build_thecamera: function() {
            var mainCamera = new THREE.PerspectiveCamera(45, sceneW / sceneH, 1, 10000);
            mainCamera.position.z = 750; // move back
            mainCamera.position.y = 150; // move up
            mainCamera.name = "main";
            this.get_thecurrentCam = 0;
            this.get_AllTheCameras = [mainCamera];
            yeswecan.get_theSceneCam = yeswecan.get_AllTheCameras[yeswecan.get_thecurrentCam];
      },

      /**
       *
       * Build the groud, shootstand
       *
       */

      build_theshootstand: function() {

            /**
             *
             * Build the ground
             *
             */

            yeswecan_setSomeArguments = {
                  'type': 'plane',
                  'width': 1000,
                  'height': 1000,
                  'wSegments': 10,
                  'hSegments': 10,
                  'color': 0x00C51F,
                  'transparent': false,
                  'opacity': 0,
                  'friction': .1,
                  'restitution': .3,
                  'posZ': 100,
                  'rotX': -90,
                  'name': 'ground'
            }
            this.build_thelowpolystand(yeswecan_setSomeArguments);

            /**
             *
             * Load basket stand
             *
             */

            loader.load('assets/js/models/schietkraam.js', function(mesh) {
                  mesh.scale.set(0.32, 0.32, 0.32);
                  mesh.position.set(0, 0, 60); // z = 260
                  mesh.rotation.y = helpMe.calculate('rad', -89);
                  mesh.name = 'schietkraam';
                  scene.add(mesh);
            });

            /**
             *
             * Create all the hitboxes
             *
             */

            hitboxes.create();
      },

      build_thelowpolystand: function(args) {

            var material = Physijs.createMaterial(
                  new THREE.MeshLambertMaterial({
                        color: args.color,
                        transparent: args.transparent,
                        opacity: args.opacity
                  }),
                  args.friction,
                  args.restitution
            );

            if (args.type == 'plane') {
                  var geometry = new THREE.PlaneGeometry(args.width, args.height, args.wSegments, args.hSegments); // width, height, widhtSegments, heightSegments
                  var mesh = new Physijs.HeightfieldMesh(geometry, material, 0); // matches a regular grid of height values given in the z-coordinates
            }
            if (args.type == 'cube') {
                  var geometry = new THREE.BoxGeometry(args.width, args.height, args.depth, args.wSegments, args.hSegments); // width, height, widhtSegments, heightSegments
                  var mesh = new Physijs.BoxMesh(geometry, material, 0); // matches a regular grid of height values given in the z-coordinates
            }

            geometry.computeFaceNormals();
            geometry.computeVertexNormals();

            if (args.posX) mesh.position.x = args.posX;
            if (args.posY) mesh.position.y = args.posY;
            if (args.posZ) mesh.position.z = args.posZ;
            if (args.rotX) mesh.rotation.x = helpMe.calculate('rad', args.rotX);
            if (args.rotY) mesh.rotation.y = helpMe.calculate('rad', args.rotY);
            if (args.rotZ) mesh.rotation.z = helpMe.calculate('rad', args.rotZ);
            mesh.name = args.name;

            scene.add(mesh);
      },

      /**
       *
       * Create an ambient light and a spot light
       *
       */

      build_thelights: function() {
            var light = new THREE.HemisphereLight(0xffffff, 0x000000, 1)
            light.name = 'light';
            scene.add(light)
      },



      build_therifle: function() {
            loader.load('assets/js/models/rifle.js', function(mesh) {
                  mesh.scale.set(20, 20, 20);
                  mesh.position.set(0, 50, 600);
                  shoot.rifle = mesh;
                  mesh.rotation.x = helpMe.calculate('rad', -8);
                  scene.add(mesh);
            });
      },

      /**
       *
       * Function to create a tooth
       *
       */

      addTarget: function(i, y, z, speed, random) {

            var target_stand = new Physijs.BoxMesh(
                  targetStandGeom,
                  targetStandMaterial,
                  0
            );

            target_stand.position.set(180, 49 + y, 233 - z); // 35 - (35 * i)
            scene.add(target_stand);

            switch (random) {
                  case 1:
                        target = new Physijs.CylinderMesh(
                              new THREE.CylinderGeometry(13, 13, 3, 50, 50),
                              new THREE.MeshLambertMaterial({
                                    friction: 1,
                                    restitution: 1
                              })
                        );
                        target.points = 25;
                        break
                  case 2:
                        target = new Physijs.BoxMesh(
                              new THREE.CubeGeometry(20, 3, 25, 50, 50),
                              new THREE.MeshLambertMaterial({
                                    friction: 1,
                                    restitution: 1
                              })
                        );
                        target.points = 10;
                        break
                  case 3:
                        target = new Physijs.CylinderMesh(
                              new THREE.CylinderGeometry(15, 15, 3, 3, 3),
                              new THREE.MeshLambertMaterial({
                                    friction: 1,
                                    restitution: 1
                              })
                        );
                        target.points = 40;
                        break
            }

            target.material.color.setStyle(shoot.getRandomColor()).offsetHSL(0, 0.5, 0.1);
            target.rotation.x = helpMe.calculate('rad', 90);
            target.position.set(180, 65 + y, 230 - z); // 35 - (35 * i)

            if (random == 3) {
                  target.position.y += 3;
            }

            target.category = 'target';
            target.name = 'target';
            target.hit = false;
            target.number = i;
            scene.add(target);

            constraint = new Physijs.HingeConstraint(
                  target, // First object to be constrained
                  target_stand, // OPTIONAL second object - if omitted then physijs_mesh_1 will be constrained to the scene
                  new THREE.Vector3(target_stand.position.x, target_stand.position.y + 3, target_stand.position.z - 3), // point in the scene to apply the constraint
                  new THREE.Vector3(1, 0, 0) // Axis along which the hinge lies - in this case it is the X axis
            );

            constraint.name = 'constraint';
            scene.addConstraint(constraint);
            constraint.setLimits(
                  0, // minimum angle of motion, in radians
                  -(Math.PI / 2) // maximum angle of motion, in radians
            );

            targetInfo = {
                  'stand': target_stand,
                  'target': target,
                  'speed': speed,
                  'constraint': constraint
            }
            targets.push(targetInfo);
      },

      /**
       *
       * Build the bullet
       *
       */

      build_thebullet: function() {

            $('.powerIndicator').css({
                  'bottom': 0
            });

            shoot.power = 0;
            shoot.way = 'up';

            bullet = new Physijs.SphereMesh(
                  new THREE.SphereGeometry(2.5, 10, 7),
                  bulletMaterial
            );

            if (shoot.rifle) {
                  bullet.position.set(shoot.rifle.position.x + 0.6, shoot.rifle.position.y + 7.9, shoot.rifle.position.z - 175);
            } else {
                  bullet.position.set(0.6, 57.9, 425); // bullet.position.set(0, 50, 600 );
            }

            bullet.receiveShadow = true;
            bullet.rotation.x = helpMe.calculate('rad', -85);
            bullet.name = "bullet";
            bullet.shot = false;
            bullet.castShadow = true;
            scene.add(bullet);
            bullets.push(bullet);

            bullet.setAngularFactor(new THREE.Vector3(0, 0, 0));
            bullet.setLinearFactor(new THREE.Vector3(0, 0, 0));
            bullet.setLinearVelocity(new THREE.Vector3(0, 0, 0));
            bullet.setAngularVelocity(new THREE.Vector3(0, 0, 0));

            // Enable CCD if the object moves more than 1 meter in one simulation frame
            bullet.setCcdMotionThreshold(1);

            // Set the radius of the embedded sphere such that it is smaller than the object
            bullet.setCcdSweptSphereRadius(0.2);
      },

      build_thecloud: function() {
            loader.load('assets/js/models/wolk.js', function(mesh) {
                  mesh.scale.set(2, 2, 2);
                  mesh.position.set(-500, -400, -500);
                  mesh.name = 'cloud';
                  scene.add(mesh);
                  shoot.clouds = mesh;
            });
      }
}
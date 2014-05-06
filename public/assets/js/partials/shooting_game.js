/**
 *
 * GLOBAL VARS
 *
 */

var sphereShape, sphereBody, world, physicsMaterial, bullets=[], bulletMeshes = [], teeth=[], teethMeshes=[];
var camera, scene, renderer;
var geometry, material, mesh;
var controls,time = Date.now();
var blocker = document.getElementById( 'blocker' );
var instructions = document.getElementById( 'instructions' );


/**
 *
 * Load Functions
 *
 */

initPointerLock();
initCannon();
init();
animate();


/**
 *
 * All the functions
 *
 */

function initCannon() {

    /**
     *
     * CANNON.World : The physics world
     *
     */

    world = new CANNON.World();

    /**
     *
     * How often to normalize quaternions.
     * Set to 0 for every step, 1 for every second etc..
     * A larger value increases performance.
     * If bodies tend to explode, set to a smaller value (zero to be sure nothing can go wrong).
     *
     */

    world.quatNormalizeSkip = 0;

    /**
     *
     * Set to true to use fast quaternion normalization.
     * It is often enough accurate to use.
     * If bodies tend to explode, set to false.
     *
     */

    world.quatNormalizeFast = false;

    /**
     *
     * CANNON.Solver : Constraint equation solver base class.
     *
     */

     var solver = new CANNON.Solver(); // #TODO GSSolver ?

     /**
      *
      * defaultContactMaterial : This contact material is used if no suitable contactmaterial is found for a contact.
      *
      */
     world.defaultContactMaterial.contactEquationStiffness = 1e9;
     world.defaultContactMaterial.contactEquationRegularizationTime = 4;

     solver.iteration = 7;
     solver.tolerance = .1;

     var split = true;
     if(split)
        world.solver = new CANNON.SplitSolver(solver);
    else
        world.solver = solver;

    world.gravity.set(0,-20,0); // x, y, z

    /**
     *
     * CANNON.NaiveBroadphase : Naive broadphase implementation, used in lack of better ones.
     *
     */
    world.broadphase = new CANNON.NaiveBroadphase();

    /**
     *
     * CANNON.Material : Defines a physics material.
     * Create a slippery material (friction coefficient = .0);
     * CANNON.ContactMaterial : Defines what happens when two materials meet.
     * Add the contact materials to the world
     */

     physicsMaterial = new CANNON.Material('slipperyMaterial');
     var physicsContactMaterial = new CANNON.ContactMaterial(
                                                                                                    physicsMaterial,
                                                                                                    physicsMaterial,
                                                                                                    .0, // friction coefficient
                                                                                                    .3 //restitution
                                                                                                 );
     world.addContactMaterial(physicsContactMaterial);

     /**
      *
      * CANNON.Sphere() : Spherical rigid body
      * CANNON.RigidBody() : Rigid body base class
      */

      var mass = 5, radius = 1.3;
      sphereShape = new CANNON.Sphere(radius);
      sphereBody = new CANNON.RigidBody(mass, sphereShape, physicsMaterial);
      sphereBody.position.set(0,5,0);
      sphereBody.linearDamping = 0.9;
      world.add(sphereBody);

      /**
       *
       * CANNON.Plane() : A plane, facing in the Z direction.
       * CANNON.RigidBody() : Rigid body base class
       * quaternion : Orientation of the body
       * setFromAxisAngle ( CANNON.Vec3 axis , float angle )
       * CANNON.Vec3 : 3-dimensional vector (x, y, z)
       *
       */

       groundShape = new CANNON.Plane();
       groundBody = new CANNON.RigidBody(0,groundShape,physicsMaterial);
       groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0), -Math.PI/2);
       world.add(groundBody);

}

function init() {

    /**
     *
     * THREE.PerspectiveCamera : Camera with perspective projection.
     * fov — Camera frustum vertical field of view, from bottom to top of view, in degrees.
     * aspect — Camera frustum aspect ratio, window width divided by window height.
     * near — Camera frustum near plane.
     * far — Camera frustum far plane.
     *
     */

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);

    /**
     *
     * THREE.Scene : Scenes allow you to set up what and where is to be rendered by three.js.
     * This is where you place objects, lights and cameras.
     *
     * THREE.Fog :  This class contains the parameters that define linear fog, i.e., that grows linearly denser with the distance.
     * hex - Fog color. Example: If set to black, far away objects will be rendered black.
     * near - The minimum distance to start applying fog. Objects that are less than 'near' units from the active camera won't be affected by fog.
     * far - The maximum distance at which fog stops being calculated and applied. Objects that are more than 'far' units away from the active camera won't be affected by fog.
     *
     */

     scene = new THREE.Scene();
     scene.fog = new THREE.Fog(0x000000, 0, 500);

     /**
      *
      * THREE.AmbientLight : This light's color gets applied to all the objects in the scene globally.
      * hex - Numeric value of the RGB component of the color.
      *
      */

     var ambient = new THREE.AmbientLight(0x111111);
     scene.add(ambient);

     /**
      *
      * THREE.SpotLight : A point light that can cast shadow in one direction.
      *  hex - Numeric value of the RGB component of the color.
      *
      */

     light = new THREE.SpotLight(0xffffff);
     light.position.set(10, 30, 20); // x, y, z
     light.target.position.set(0, 0, 0);
     // #TODO shadow
     scene.add(light);


    controls = new PointerLockControls( camera , sphereBody );
    scene.add( controls.getObject() );



     /**
      *
      * new THREE.PlaneGeometry : A class for generating plane geometries
      *
      */

      geometry = new THREE.PlaneGeometry(300, 300, 50, 50);
      geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );

      /**
       *
       * new THREE.MeshLambertMaterial : A material for non-shiny (Lambertian) surfaces, evaluated per vertex.
       *
       */

       material = new THREE.MeshLambertMaterial({ color : 0xdddddd });
       // #TODO adjustHSV

       /**
        *
        * THREE.Mesh : Base class for Mesh objects
        * geometry — An instance of Geometry, defining the object's structure.
        * material — An instance of Material (optional), defining the object's appearance
        *
        */

        mesh = new THREE.Mesh( geometry, material );
        // #TODO shadow
        scene.add(mesh);

        /**
         *
         * new THREE.WebGLRenderer : The WebGL renderer displays your beautifully crafted scenes using WebGL, if your device supports it.
         *
         *
         */

         renderer = new THREE.WebGLRenderer();
         // #TODO shadow
         renderer.setSize(window.innerWidth, window.innerHeight); // Resizes the output canvas to (width, height), and also sets the viewport to fit that size, starting in (0, 0).
         renderer.setClearColor(scene.fog.color, 1);

         document.body.appendChild(renderer.domElement);

         /**
          *
          * Window resize event
          *
          */

          window.addEventListener('resize', onWindowResize, false);

          addTeeth();

          addGun();
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

}

var dt = 1/60;
function animate() {
    requestAnimationFrame(animate);

    world.step(dt);


    renderer.render(scene, camera);
}


function addTeeth() {

    /**
     *
     * CANNON.Vec3 : a 3-dimensional vector
     * CANNON.Box : a 3d box shape.
     *
     */

     var halfExtents = new CANNON.Vec3(.5,1, .1);
     var toothShape = new CANNON.Box(halfExtents);
     var toothGeometry = new THREE.CubeGeometry(halfExtents.x*2, halfExtents.y*2, halfExtents.z*2);

     /**
      *
      * Create 7 teeth
      *
      */

    for(var i = 0; i < 7; i++)
    {

        var x = -4 + i * 1.2;
        var y = 1;
        var z = -5;

        var toothBody = new CANNON.RigidBody(5, toothShape);
        var toothMesh = new THREE.Mesh(toothGeometry, material);
        world.add(toothBody);
        scene.add(toothMesh);
        toothBody.position.set(x, y, z);
        toothMesh.position.set(x, y, z);
        teeth.push(toothBody);
        teethMeshes.push(toothMesh);

      }

}

function addGun() {
        var gun = new THREE.ObjectLoader();
        gun.load('assets/js/models/gun.js', function(mesh) {

            // setup.loaded_gun = mesh;
            mesh.position.set(1, -22, 10);
            mesh.rotation.set(1, 0, 0);
            mesh.scale.set(.2, .5, .2);
            mesh.castShadow = mesh.receiveShadow = true;
            scene.add(mesh);

        });
}

function initPointerLock() {

            var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

            if ( havePointerLock ) {

                var element = document.body;

                var pointerlockchange = function ( event ) {

                    if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {

                        controls.enabled = true;

                        blocker.style.display = 'none';

                    } else {

                        controls.enabled = false;

                        blocker.style.display = '-webkit-box';
                        blocker.style.display = '-moz-box';
                        blocker.style.display = 'box';

                        instructions.style.display = '';

                    }

                }

                var pointerlockerror = function ( event ) {
                    instructions.style.display = '';
                }

                // Hook pointer lock state change events
                document.addEventListener( 'pointerlockchange', pointerlockchange, false );
                document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
                document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

                document.addEventListener( 'pointerlockerror', pointerlockerror, false );
                document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
                document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

                instructions.addEventListener( 'click', function ( event ) {
                    instructions.style.display = 'none';

                    // Ask the browser to lock the pointer
                    element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

                    if ( /Firefox/i.test( navigator.userAgent ) ) {

                        var fullscreenchange = function ( event ) {

                            if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {

                                document.removeEventListener( 'fullscreenchange', fullscreenchange );
                                document.removeEventListener( 'mozfullscreenchange', fullscreenchange );

                                element.requestPointerLock();
                            }

                        }

                        document.addEventListener( 'fullscreenchange', fullscreenchange, false );
                        document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );

                        element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;

                        element.requestFullscreen();

                    } else {

                        element.requestPointerLock();

                    }

                }, false );

            } else {

                instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';

            }
}

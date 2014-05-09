var setup = {

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

var camera, scene, renderer;
var sceneW, sceneH;
var physicsMaterial;

var start = false;

var tooth, toothPivot;
var teeth = new Array();

var throwing = false;

var stats;


// The element we'll make fullscreen and pointer locked.
var fullscreenElement;

/**
 *
 * Initialize the game
 *
 */

function init() {

  /**
   *
   * Store the scene dimensions
   *
   */

  sceneW = container.offsetWidth;
  sceneH = container.offsetHeight;

  /**
   *
   * Build our 3D World
   *
   */

  createStats();
  buildPhysicsScene();
  buildRenderer();
  buildCamera();
  buildGround();
  // buildBall();
  buildTooth();
  buildLights();
  buildGun();



  /**
   *
   * Create after random seconds a new tooth
   *
   */

   console.log();

if(start) {
  setInterval(function() {

    if(teeth.length < 5) addTooth();
    // else console.log(teeth);

  }, ((Math.floor(Math.random() * 10)) + 1) * 1000);

}
}

/**
 *
 * Update the physics engine and render every frame
 *
 */

var animate = function() {

  if(!throwing) {
   //ball.__dirtyPosition = true;
  }


  scene.simulate(); // run physics
  renderer.render(scene, camera); // render the scene

  stats.update();

  requestAnimationFrame(animate); // continue animating

};



// /**
//  *
//  * Check if we can access the pointer lock
//  *
//  */

// var checkPointerLock = function() {
//   var havePointerLock  =   'pointerLockElement' in document ||
//                                         'mozPointerLockElement' in document ||
//                                         'webkitPointerLockElement' in document;

//   if(havePointerLock)
//   {
//       document.addEventListener('pointerlockchange', changeCallback, false);
//         document.addEventListener('mozpointerlockchange', changeCallback, false);
//         document.addEventListener('webkitpointerlockchange', changeCallback, false);

//     //check for errors
//     document.addEventListener('pointerlockerror', errorCallback, false);
//     document.addEventListener('mozpointerlockerror', errorCallback, false);
//     document.addEventListener('webkitpointerlockerror', errorCallback, false);
//   }

// }


// function errorCallback(e) {
//     alert("There was an error", e);
// }

// function changeCallback(e) {
//   alert('changed');
// }

/**
 *
 * Create some render stats
 *
 */

var createStats = function() {

   stats = new Stats();
   stats.domElement.style.position = 'absolute';
   stats.domElement.style.top = '0px';
   stats.domElement.style.zIndex = 100;
   container.appendChild(stats.domElement);

 };


/**
 *
 * Initialize Physi.js
 * Build a Physi.js scene, which takes the place of a THREE scene
 *
 */

var buildPhysicsScene = function() {

  /**
   *
   * Set the path of the web worker javascripts
   *
   */

  Physijs.scripts.worker = '../assets/js/libs/physijs_worker.js';
  Physijs.scripts.ammo = 'ammo.js'; // The must be relative to the physijs_worker.js

  /**
   *
   * Init the scene
   *
   */

  scene = new Physijs.Scene({ reportsize : 50, fixedTimeStep : 1/60 });
  scene.setGravity(new THREE.Vector3(0, -800, 0)); // x, y , z

  scene.addEventListener(
      'update',
      function() {
        scene.simulate( undefined, 2 );



        //physics_stats.update();
      }
    );

}

/**
 *
 * Build the WebGL renderer
 *
 */

var buildRenderer = function() {

  renderer = new THREE.WebGLRenderer({ antialias : true });
  renderer.setSize(sceneW, sceneH);
  renderer.setClearColor(0x66ccff); // background color
  renderer.shadowMapEnabled = true;
  renderer.shadowMapSoft = true;
  renderer.shadowMapType = THREE.PCFShadowMap;
  renderer.shadowMapAutoUpdate = true;

  container.appendChild(renderer.domElement);

}

/**
 *
 * Build the THREE camera
 *
 */

var buildCamera = function() {

  camera = new THREE.PerspectiveCamera(50, sceneW / sceneH, 1, 10000);
  camera.position.z = 600; // move back
  camera.position.y = 200; // move up
  camera.lookAt(new THREE.Vector3(0,0,0)); // point it down at the center of the 3D scene

}

/**
 *
 * Build the ground plane and rotate it to be flat
 *
 */

var buildGround = function() {

  var groundGeometry = new THREE.PlaneGeometry(10000, 1000, 10, 10); // width, height, widhtSegments, heightSegments
  groundGeometry.computeFaceNormals();
  groundGeometry.computeVertexNormals();

  var groundMaterial = Physijs.createMaterial(

    new THREE.MeshPhongMaterial({ // A material for shiny surfaces, evaluated per pixel.
      color: 0x999999,
      wireframe : false, // Whether the triangles' edges are displayed instead of surfaces.
      shininess : 10,
      color:0xdddddd,
      emissive : 0x111111
    }),
    .8, // friction
    .8 // restitution
  );

      var ground = new Physijs.HeightfieldMesh(groundGeometry, groundMaterial, 0); // matches a regular grid of height values given in the z-coordinates
      ground.rotation.x = -Math.PI / 2;
      ground.receiveShadow = true;
      ground.castShadow = true;
      ground.name = "ground";

      scene.add( ground );

}

/**
 *
 * Build the ball and draw its texture with a 2D canvas
 *
 */

var buildBall = function() {

  /**
   *
   * Create a canvas to draw the ball's texture
   *
   */

   throwing = false;

  var ballCanvas = document.createElement('canvas');
  ballCanvas.width = 64;
  ballCanvas.height = 64;
  var ballContext = ballCanvas.getContext('2d');

  /**
   *
   * Draw 2 colored halves of the 2D canvas
   *
   */

  ballContext.fillStyle = "#ff0080";
  ballContext.fillRect(0, 0, ballCanvas.width, ballCanvas.height/2);
  ballContext.fillStyle = "#ffda4e";
  ballContext.fillRect(0, ballCanvas.height/2,  ballCanvas.width, ballCanvas.height/2);

  /**
   *
   * Create the THREE texture object with our canvas
   *
   */

  var ballTexture = new THREE.Texture( ballCanvas );
  ballTexture.needsUpdate = true;

  /**
   *
   * Create the physijs-enabled material with some decent friction & bounce properties
   *
   */

   var ballMaterial = Physijs.createMaterial(

    new THREE.MeshLambertMaterial({

      map : ballTexture,
      shininess : 10,
      color : 0xdddddd,
      emissive : 0x111111,
      side : THREE.FrontSide

    }),
    .5, // friction
    .5 // restitution

  );

   ballMaterial.map.wrapS = ballMaterial.map.wrapT = THREE.RepeatWrapping;
   ballMaterial.map.repeat.set(1, 1);

   ball = new Physijs.SphereMesh(
      new THREE.SphereGeometry( 3, 10, 3), // radius, widthSegments, heightSegments
      ballMaterial
   );

    ball.setAngularFactor(new THREE.Vector3( 0, 0, 0 ));
    ball.setLinearFactor(new THREE.Vector3( 0, 0, 0 ));
    ball.setLinearVelocity(new THREE.Vector3( 0, 0, 0 ));
    ball.setAngularVelocity(new THREE.Vector3( 0, 0, 0 ));
   // ball.position.y = 35;
   // ball.position.z = 350;


   ball.position.y = setup.rifle.position.y;
   ball.position.z = setup.rifle.position.z - 300;
   ball.position.x = setup.rifle.position.x;

   ball.receiveShadow = true;
   ball.name = 'bullet';
   ball.castShadow = true;
  //  // Enable CCD if the object moves more than 1 meter in one simulation frame
  //  ball.setCcdMotionThreshold(40);
  //  // Set the radius of the embedded sphere such that it is smaller than the object
  // ball.setCcdSweptSphereRadius(0.2);

   scene.add(ball);


   ball.setAngularFactor(new THREE.Vector3( 0, 0, 0 ));
    ball.setLinearFactor(new THREE.Vector3( 0, 0, 0 ));
    ball.setLinearVelocity(new THREE.Vector3( 0, 0, 0 ));
    ball.setAngularVelocity(new THREE.Vector3( 0, 0, 0 ));

}

/**
 *
 * Create my 6 teeth
 *
 */

var buildTooth = function() {


  // toothPivot = new THREE.Object3D();
  // toothPivot.position.set(0, 100, 40);
  // toothPivot.visible = true;
  // scene.add(toothPivot);


  // // setInterval(function() {
  // //   console.log('interval');
  // //   toothPivot.rotation.x += deg2rad(-10);
  // // }, 100)



  // makeCrossAndSetPosition(toothPivot, 0, 0, 0);


  for(var i = 0; i < 2; i++)
  {
    addTooth();
  }
}


/**
 *
 * Function to create a tooth
 *
 */

var addTooth = function() {
  tooth = new Physijs.BoxMesh(
    new THREE.CubeGeometry( 100, 150, 20 ),
    new THREE.MeshNormalMaterial()
   );

  //tooth.position.set(0, 80, 5);
  var x = (Math.random()-0.5)*700;
 // var y = 1 + (Math.random()-0.5)*1;
  var z = ((Math.random()-.7)*400)+ Math.random(1,10);

  tooth.position.set(x, 75, z);
  tooth.receiveShadow = true;
  tooth.name = "tooth" + (teeth.length + 1);
  tooth.castShadow = true;
  scene.add(tooth);
  teeth.push(tooth);

  //toothPivot.add(tooth);






  tooth.addEventListener( 'collision', function( other_object, relative_velocity, relative_rotation, contact_normal ) {
      // // `this` has collided with `other_object` with an impact speed of `relative_velocity` and a rotational force of `relative_rotation` and at normal `contact_normal`
      // console.log('relative_velocity', relative_velocity);
      // console.log('relative_rotation', relative_rotation);
      // console.log('contact_normal', contact_normal);

      // var iamshot = this.name;
      // // tooth.rotation.x = 8;
      //console.log('col', other_object.name, contact_normal);


      if(other_object.name == 'bullet') {
        //console.log('collision', this);
        // setInterval(function(){ if(tooth.rotation.x >= -1.6) { tooth.rotation.x -= .1;  }} , 10);
        this.material.wireframe = true;

      }
  });
}

/**
 *
 * Create an ambient light and a spot light
 *
 */

var buildLights = function() {

  scene.add(new THREE.AmbientLight(0x666666));

  var light = new THREE.SpotLight(0xcccccc);
  light.position.set(0, 1000, 0);
  light.target.position.copy(scene.position);
  light.shadowCameraTop = -700;
  light.shadowCameraLeft = -700;
  light.shadowCameraRight = 700;
  light.shadowCameraBottom = 700;
  light.shadowCameraNear = 20;
  light.shadowCameraFar = 1400;
  light.shadowBias = -.0001;
  light.shadowMapWidth = light.shadowMapHeight = 1024;
  light.shadowDarkness = .25;
  light.castShadow = true;
  light.shadowCameraVisible = false;
  scene.add(light);

}

/**
 *
 * Shoot ball  in to the deep
 *
 */

var shoot = function(e) {
  if(start){
  throwing = true;

  buildBall();

  ball.setAngularFactor(new THREE.Vector3( 1, 1, 1 ));
  ball.setLinearFactor(new THREE.Vector3( 1, 1, 1 ));
  ball.setLinearVelocity(new THREE.Vector3(0, 100, -1000));
  ball.setAngularVelocity(new THREE.Vector3(-10, 0, 0));
}
}


/**
 *
 * Update THREE objects on resize
 *
 */

var onWindowResize = function() {
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

    camera.aspect = sceneW / sceneH;
    camera.updateProjectionMatrix();

    /**
     *
     * Set renderer size
     *
     */

    renderer.setSize( sceneW, sceneH );
}




var  makeCrossAndSetPosition = function(objectToAddTo, x,y,z){
    var geometry = new THREE.CubeGeometry(1, 100, 1)
    var material = new THREE.MeshBasicMaterial()
    var stick = new THREE.Mesh(geometry, material)
    stick.position = new THREE.Vector3( x, y, z );

    var stick2 = stick.clone();
    stick2.rotation.x = deg2rad(90);

    var stick3 = stick.clone();
    stick3.rotation.z = deg2rad(90);

    objectToAddTo.add(stick);objectToAddTo.add(stick2);objectToAddTo.add(stick3);

}


var deg2rad = function(angle) {

    return angle * .017453292519943295; // (angle / 180) * Math.PI;
}

var rad2deg = function(angle) {

    return angle * 57.29577951308232; // angle / Math.PI * 180
}



 var mousemove = function ( event ) {

  if(start){
    var movementX = event.movementX       ||
                  event.mozMovementX    ||
                  event.webkitMovementX ||
                  0,
      movementY = event.movementY       ||
                  event.mozMovementY    ||
                  event.webkitMovementY ||
                  0;


  // Print the mouse movement delta values
  //console.log("movementX=" + movementX, "movementY=" + movementY);

    if(!throwing)
    {
      //ball.position.x +=  movementX;
      //setup.rifle.rotation.y += .003;
    }

    if(setup.rifle)
      setup.rifle.position.x += movementX;
  }
}


var fullscreenChange = function() {
  if (document.webkitFullscreenElement === elem ||
      document.mozFullscreenElement === elem ||
      document.mozFullScreenElement === elem) { // Older API upper case 'S'.
    // Element is fullscreen, now we can request pointer lock
    elem.requestPointerLock = elem.requestPointerLock    ||
                              elem.mozRequestPointerLock ||
                              elem.webkitRequestPointerLock;
    elem.requestPointerLock();
  }
}

var pointerLockChange = function() {
  if (document.mozPointerLockElement === elem ||
      document.webkitPointerLockElement === elem) {
    console.log("Pointer Lock was successful.");
  } else {
    console.log("Pointer Lock was lost.");
  }
}

var pointerLockError = function() {
  console.log("Error while locking pointer.");
}



var lockPointer = function() {
  console.log('click');

  elem = document.getElementById("container");
  // Start by going fullscreen with the element. Current implementations
  // require the element to be in fullscreen before requesting pointer
  // lock--something that will likely change in the future.
  elem.requestFullscreen = elem.requestFullscreen    ||
                           elem.mozRequestFullscreen ||
                           elem.mozRequestFullScreen || // Older API upper case 'S'.
                           elem.webkitRequestFullscreen;
  elem.requestFullscreen();
}

var onKeyDown = function ( event ) {

        switch ( event.keyCode ) {

            case 82: // R
                buildBall();
                break;
        }

};


var buildGun = function() {
   var loader = new THREE.JSONLoader();
    loader.load('assets/js/models/rifle.js', function (geometry, mat) {
            mesh = new THREE.Mesh(geometry, mat[0]);



            mesh.scale.x = 30;
            mesh.scale.y = 30;
            mesh.scale.z = 30;
            mesh.name = 'rifle';

            mesh.position.set(0, 40, 430);
            mesh.rotation.x = deg2rad(-10);


            setup.rifle = mesh;

            scene.add(mesh);

        });
}
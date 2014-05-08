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

var tooth, toothPivot;

var throwing = false;

var stats;

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
  buildBall();
  buildTooth();
  buildLights();

}

/**
 *
 * Update the physics engine and render every frame
 *
 */

var animate = function() {

  if(!throwing) {
   ball.__dirtyPosition = true;
  }


  scene.simulate(); // run physics
  renderer.render(scene, camera); // render the scene

  stats.update();

  requestAnimationFrame(animate); // continue animating

};


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
  renderer.setClearColor(0x000000); // background color
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

  var groundGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10); // width, height, widhtSegments, heightSegments
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
    .8, // friction
    .8 // restitution

  );

   ballMaterial.map.wrapS = ballMaterial.map.wrapT = THREE.RepeatWrapping;
   ballMaterial.map.repeat.set(1, 1);

   ball = new Physijs.SphereMesh(
      new THREE.SphereGeometry( 15, 10, 3), // radius, widthSegments, heightSegments
      ballMaterial
   );

    ball.setAngularFactor(new THREE.Vector3( 0, 0, 0 ));
    ball.setLinearFactor(new THREE.Vector3( 0, 0, 0 ));
    ball.setLinearVelocity(new THREE.Vector3( 0, 0, 0 ));
    ball.setAngularVelocity(new THREE.Vector3( 0, 0, 0 ));
   ball.position.y = 35;
   ball.position.z = 350;
   ball.receiveShadow = true;
   ball.name = 'bullet';
   ball.castShadow = true;
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


  for(var i = 0; i < 6; i++)
  {
    addTooth((105*i));
  }
}


/**
 *
 * Function to create a tooth
 *
 */

var addTooth = function(x) {
  tooth = new Physijs.BoxMesh(
    new THREE.CubeGeometry( 100, 150, 40 ),
    new THREE.MeshNormalMaterial()
   );

  //tooth.position.set(0, 80, 5);
  tooth.position.set(-255+x, 80 , 5);
  tooth.receiveShadow = true;
  tooth.name = "tooth";
  tooth.castShadow = true;
  scene.add(tooth);

  //toothPivot.add(tooth);


    tooth.setAngularFactor(new THREE.Vector3( 0, 0, 0 ));
    tooth.setLinearFactor(new THREE.Vector3( 0, 0, 0 ));
    tooth.setLinearVelocity(new THREE.Vector3( 0, 0, 0 ));
    tooth.setAngularVelocity(new THREE.Vector3( 0, 0, 0 ));



  tooth.addEventListener( 'collision', function( other_object, relative_velocity, relative_rotation, contact_normal ) {
      // // `this` has collided with `other_object` with an impact speed of `relative_velocity` and a rotational force of `relative_rotation` and at normal `contact_normal`
      // console.log('relative_velocity', relative_velocity);
      // console.log('relative_rotation', relative_rotation);
      // console.log('contact_normal', contact_normal);


      // // tooth.rotation.x = 8;

      if(other_object.name == 'bullet') {
        console.log('collision');
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
  throwing = true;

  ball.setAngularFactor(new THREE.Vector3( 1, 1, 1 ));
   ball.setLinearFactor(new THREE.Vector3( 1, 1, 1 ));
  ball.setLinearVelocity(new THREE.Vector3(0, 700 - e.clientY, -500));
  ball.setAngularVelocity(new THREE.Vector3(-10, 0, 0));

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



 var updateBullet = function ( event ) {


    if(!throwing)
    {
      ball.position.x +=  event.webkitMovementX;
    }
}




var onKeyDown = function ( event ) {

        switch ( event.keyCode ) {

            case 82: // R
                buildBall();
                break;
        }

};
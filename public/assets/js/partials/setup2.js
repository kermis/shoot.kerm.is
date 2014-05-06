// var setup = {
// 	phoneObj : {},

// 	createCannon : function() {

// 		setup.timeStep = 1/60;

// 		setup.world = new CANNON.World();
// 		setup.world.gravity.set(0,0,0);
// 		setup.world.broadphase = new CANNON.NaiveBroadphase();
// 		setup.world.solver.iterations = 10;

// 		setup.shape = new CANNON.Box(new CANNON.Vec3(1,1,1));
// 		setup.mass = 1;
// 		setup.body = new CANNON.RigidBody(setup.mass, setup.shape);
// 		setup.body.angularVelocity.set(0,10,0);
// 		setup.body.angularDamping = 0.5;
// 		setup.world.add(setup.body);
// 	},

// 	init : function() {

// 		// Physijs.scripts.worker = 'assets/js/libs/physijs_worker.js';
// 		// Physijs.scripts.ammo = 'ammo.js'


// 		this.createRenderer();

// 		this.container = document.getElementById('container');
// 		this.container.appendChild(this.renderer.domElement);

// 		this.createStats();

// 		this.createScene();


// 		this.createCannon();

// 		this.createCamera();

// 		this.createLights();

// 		this.loadGun();

// 		this.createTooth(-50);
// 		this.createTooth(-100);
// 		this.createTooth(-150);
// 		this.createTooth(0);
// 		this.createTooth(50);
// 		this.createTooth(100);
// 		this.createTooth(150);

// 		requestAnimationFrame(setup.animate);
// 		window.addEventListener('resize', this.onWindowResize, false);

// 	},

// 	createGUI : function() {

// 		this.gui = new dat.GUI();

// 		var gui_gun = this.gui.addFolder('gun');
// 		gui_gun.add(this.loaded_gun.rotation, 'x').onChange(function(value) {
// 			setup.loaded_gun.rotation.x = value;
// 			setup.render();
// 		});

// 		gui_gun.add(this.loaded_gun.rotation, 'y').onChange(function(value) {
// 			setup.loaded_gun.rotation.y = value;
// 			setup.render();
// 		});

// 		gui_gun.add(this.loaded_gun.rotation, 'z').onChange(function(value) {
// 			setup.loaded_gun.rotation.z = value;
// 			setup.render();
// 		});

// 		gui_gun.add(this.loaded_gun.position, 'x').onChange(function(value) {
// 			setup.loaded_gun.position.x = value;
// 			setup.render();
// 		});

// 		gui_gun.add(this.loaded_gun.position, 'y').onChange(function(value) {
// 			setup.loaded_gun.position.y = value;
// 			setup.render();
// 		});

// 		gui_gun.add(this.loaded_gun.position, 'z').onChange(function(value) {
// 			setup.loaded_gun.position.z = value;
// 			setup.render();
// 		});


// 		var tooth = setup.gui.addFolder('tooth');
// 		tooth.add(setup.tooth.scale, 'x').onChange(function(value) {
// 			setup.tooth.scale.x = value;
// 			setup.render();
// 		});

// 		tooth.add(setup.tooth.scale, 'y').onChange(function(value) {
// 			setup.tooth.scale.y = value;
// 			setup.render();
// 		});

// 		tooth.add(setup.tooth.scale, 'z').onChange(function(value) {
// 			setup.tooth.scale.z = value;
// 			setup.render();
// 		});

// 		tooth.add(setup.tooth.position, 'x').onChange(function(value) {
// 			setup.tooth.position.x = value;
// 			setup.render();
// 		});

// 		tooth.add(setup.tooth.position, 'y').onChange(function(value) {
// 			setup.tooth.position.y = value;
// 			setup.render();
// 		});

// 		tooth.add(setup.tooth.position, 'z').onChange(function(value) {
// 			setup.tooth.position.z = value;
// 			setup.render();
// 		});

// 		tooth.open();


// 	},

// 	createRenderer : function() {

// 		this.renderer = new THREE.WebGLRenderer({ antialias : true, alpha : true });
// 		this.renderer.setSize(window.innerWidth, window.innerHeight);
// 		this.renderer.shadowMapEnabled = true;
// 		this.renderer.shadowMapSoft = true;

// 	},

// 	createStats : function() {

// 		this.stats = new Stats();
// 		this.stats.domElement.style.position = 'absolute';
// 		this.stats.domElement.style.top = '0px';
// 		this.stats.domElement.style.zIndex = 100;
// 		this.container.appendChild(this.stats.domElement);

// 	},

// 	createScene : function() {

// 		this.scene = new THREE.Scene();

// 	},

// 	createCamera : function() {

// 		this.camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 1000);
// 		this.camera.position.x = 4;
// 		this.camera.position.y = 50;
// 		this.camera.position.z = 60;
// 		this.camera.rotation.x = 12;
// 		this.scene.add(this.camera);

// 	},

// 	createLights : function() {

// 		this.light = new THREE.HemisphereLight(0xFFE7B3, 1.2);
// 		this.scene.add(this.light);

// 		this.dir_light = new THREE.DirectionalLight(0xFFFFFF);
// 		this.dir_light.position.set(90,90,90);
// 		this.dir_light.target.position.copy(setup.scene.position);
// 		this.dir_light.castShadow = true;
// 		this.dir_light.shadowCameraLeft = -30;
// 		this.dir_light.shadowCameraTop = -30;
// 		this.dir_light.shadowCameraRight = 30;
// 		this.dir_light.shadowCameraBottom = 30;
// 		this.dir_light.shadowCameraNear = 20;
// 		this.dir_light.shadowCameraFar = 200;
// 		this.dir_light.shadowBias = -.001;
// 		this.dir_light.shadowMapWidth = this.dir_light.shadowMapHeight = 2048;
// 		this.dir_light.shadowDarkness = .5;
// 		//this.dir_light.shadowCameraVisible = true;
// 		this.scene.add(this.dir_light);

// 	},

// 	loadGun : function() {

		// this.gun = new THREE.ObjectLoader();
		// this.gun.load('assets/js/models/gun.js', function(mesh) {

		// 	setup.loaded_gun = mesh;
		// 	mesh.position.set(1, -22, 10);
		// 	mesh.rotation.set(1, 0, 0);
		// 	mesh.scale.set(.2, .5, .2);
		// 	mesh.castShadow = mesh.receiveShadow = true;
		// 	setup.scene.add(mesh);

		// });

// 	},

// 	onWindowResize : function() {

// 		this.camera.aspect = window.innerWidth / window.innerHeight;
// 		this.camera.updateProjectionMatrix();
// 		this.renderer.setSize(window.innerWidth / window.innerHeight);
// 		this.render();

// 	},

// 	render : function() {

// 		this.renderer.render(this.scene, this.camera);
// 		this.stats.update();
// 		// this.scene.simulate();

// 	},

// 	updatePhysics : function() {
// 		setup.world.step(setup.timeStep);

// 		setup.body.position.copy(setup.tooth.position);
// 		setup.body.quaternion.copy(setup.tooth.quaternion);

// 	},

// 	animate : function() {

// 		setup.render();
// 		requestAnimationFrame(setup.animate);

// 		setup.updatePhysics();


// 		if(setup.sphere)
// 		{
// 			//setup.sphere.position.x++;
// 			setup.sphere.position.y -= 4;
// 			setup.sphere.position.z -= 6;

// 			// setup.sphere.scale.x -= 0.003;
// 			// setup.sphere.scale.y -= 0.003;
// 			// setup.sphere.scale.z -= 0.003;

// 			// console.log(setup.sphere.position.y);

// 			if(setup.sphere.position.y <= -600)
// 			{
// 				setup.sphere = null;
// 				console.log('no more sphere');
// 			}
// 		}


// 	},

// 	createBullet : function() {

// 		if(!setup.sphere)
// 		{
// 			console.log('gun pos', setup.loaded_gun.position, setup.loaded_gun.rotation);

// 			console.log('bullet');
// 			setup.sphere = new THREE.Mesh(new THREE.SphereGeometry(150, 100, 100), new THREE.MeshNormalMaterial());
// 	      		setup.sphere.position.set(setup.loaded_gun.position.x, setup.loaded_gun.position.y, setup.loaded_gun.position.y);
// 			setup.sphere.scale.set(.03, .03, .03);
// 	      		setup.scene.add(setup.sphere);
//       		}
// 	},

// 	createTooth : function(x) {
// 		// setup.tooth = new Physijs.BoxMesh(
// 		// 	new THREE.CubeGeometry( 100, 100, 100 ),
// 		// 	new THREE.MeshNormalMaterial(),
// 		// 	0
// 		// );

// 		setup.tooth = new THREE.Mesh(new THREE.CubeGeometry(100,100,100), new THREE.MeshNormalMaterial());

// 		setup.tooth.position.set(1.1 + x,-400,-600);
// 		// setup.tooth.scale.set( 0.4, 1 , 0.8);
// 		setup.tooth.scale.set( 0.01, 0.1 , 0.04);
// 		setup.tooth.rotation.x = 1;
// 		setup.scene.add(setup.tooth);
// 	}

// }
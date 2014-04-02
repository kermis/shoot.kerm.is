var setup = {
	phoneObj : {},
	init : function() {
	
		this.createRenderer();
		
		this.container = document.getElementById('container');
		this.container.appendChild(this.renderer.domElement);

		this.createStats();

		this.createScene();

		this.createCamera();

		this.createLights();

		this.loadGun();

		requestAnimationFrame(setup.animate);
		window.addEventListener('resize', this.onWindowResize, false);

	},

	createGUI : function() {

		this.gui = new dat.GUI();

		var gui_gun = this.gui.addFolder('gun');
		gui_gun.add(this.loaded_gun.rotation, 'x').onChange(function(value) {
			setup.loaded_gun.rotation.x = value;
			setup.render();
		});

		gui_gun.add(this.loaded_gun.rotation, 'y').onChange(function(value) {
			setup.loaded_gun.rotation.y = value;
			setup.render();
		});

		gui_gun.add(this.loaded_gun.rotation, 'z').onChange(function(value) {
			setup.loaded_gun.rotation.z = value;
			setup.render();
		});

		gui_gun.add(this.loaded_gun.position, 'x').onChange(function(value) {
			setup.loaded_gun.position.x = value;
			setup.render();
		});

		gui_gun.add(this.loaded_gun.position, 'y').onChange(function(value) {
			setup.loaded_gun.position.y = value;
			setup.render();
		});

		gui_gun.add(this.loaded_gun.position, 'z').onChange(function(value) {
			setup.loaded_gun.position.z = value;
			setup.render();
		});

		gui_gun.open();
		
	},

	createRenderer : function() {

		this.renderer = new THREE.WebGLRenderer({ antialias : true, alpha : true });
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.shadowMapEnabled = true;
		this.renderer.shadowMapSoft = true;

	},

	createStats : function() {

		this.stats = new Stats();
		this.stats.domElement.style.position = 'absolute';
		this.stats.domElement.style.top = '0px';
		this.stats.domElement.style.zIndex = 100;
		this.container.appendChild(this.stats.domElement);

	},

	createScene : function() {

		this.scene = new THREE.Scene();

	},

	createCamera : function() {

		this.camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 1000);
		this.camera.position.x = 4;
		this.camera.position.y = 50;
		this.camera.position.z = 60;
		this.camera.rotation.x = 12;
		this.scene.add(this.camera);

	},

	createLights : function() {

		this.light = new THREE.HemisphereLight(0xFFE7B3, 1.2);
		this.scene.add(this.light);

		this.dir_light = new THREE.DirectionalLight(0xFFFFFF);
		this.dir_light.position.set(90,90,90);
		this.dir_light.target.position.copy(setup.scene.position);
		this.dir_light.castShadow = true;
		this.dir_light.shadowCameraLeft = -30;
		this.dir_light.shadowCameraTop = -30;
		this.dir_light.shadowCameraRight = 30;
		this.dir_light.shadowCameraBottom = 30;
		this.dir_light.shadowCameraNear = 20;
		this.dir_light.shadowCameraFar = 200;
		this.dir_light.shadowBias = -.001;
		this.dir_light.shadowMapWidth = this.dir_light.shadowMapHeight = 2048;
		this.dir_light.shadowDarkness = .5;
		//this.dir_light.shadowCameraVisible = true;
		this.scene.add(this.dir_light);

	},

	loadGun : function() {

		this.gun = new THREE.ObjectLoader();
		this.gun.load('assets/js/models/gun.js', function(mesh) {

			setup.loaded_gun = mesh;
			mesh.position.set(1, -22, 10);
			mesh.rotation.set(1, 0, 0);
			mesh.scale.set(.2, .5, .2);
			mesh.castShadow = mesh.receiveShadow = true;
			setup.scene.add(mesh);

		});

	},

	onWindowResize : function() {

		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth / window.innerHeight);
		this.render();

	},

	render : function() {

		this.renderer.render(this.scene, this.camera);
		this.stats.update();

	},

	animate : function() {

		setup.render();
		requestAnimationFrame(setup.animate);

	}

}
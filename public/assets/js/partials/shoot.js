if (!Detector.webgl) Detector.addGetWebGLMessage();

setup.init();
setup.animate();

// setTimeout(function() {
// 	setup.createGUI();
// }, 1000);

THREEx.WindowResize(setup.renderer, setup.camera);
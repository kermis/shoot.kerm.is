/**
 *
 * Preload all the models and sounds
 *
 */


$(function() {
    var queue = new createjs.LoadQueue();
    queue.installPlugin(createjs.Sound);
    queue.on("complete", handleComplete, this);
    queue.on("progress", handleProgress, this);
    queue.loadManifest([
        {
            id: "ammo",
            src: "/assets/js/libs/ammo.js"
        }, {
            id: "schietkraam",
            src: "/assets/js/models/schietkraam.js"
        }, {
            id: "shoot",
            src: "/assets/sounds/shoot.mp3"
        },  {
            id: "reload",
            src: "/assets/sounds/reload.mp3"
        }
    ]);


})


/**
 *
 * Start game and start animation loop
 *
 */



function handleComplete() {
    $('.preload').delay(10).fadeOut('slow');
    shoot.init();
    shoot.animate();

    setInterval(function() {
        scene.simulate();

        shoot.moveTargets();
    }, 1000 / 60);

}

/**
 *
 * Show loading progress
 *
 */



function handleProgress(e) {
    var percentLoaded = Math.round(e.loaded * 100);
    $('.percentLoaded').html(percentLoaded + ' %');
    $('.progress').css('width', percentLoaded + '%')
}

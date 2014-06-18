$(function() {


      // override the console log
      console.log = function() {};


      //redirect if on mobile
      if (Modernizr.touch) {
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                  window.location.replace("http://shoot.kerm.is/connect");
            }
      }

      createQRcode();

      $('.choose_button').on('click', showInfo);
      $('.back-button').on('click', goBack);
      $('.play').on('click', startGame);
      $('.score-submit').on('click', addHighscore);
});

var createQRcode = function() {
      // add qrcode
      var qrcode = new QRCode("qrcode", {
            text: url.currentURL + "/mobile/#" + room.id,
            width: 200,
            height: 200,
            colorDark: "#094a69",
            correctLevel: QRCode.CorrectLevel.H
      });
}

var showInfo = function() {
      var id = $(this).attr('id');
      $('.info .title').html('How do you play the game?')
      $('.back-button').show();
      switch (id) {
            case 'socket':
                  shoot.controller = 'mobile';
                  $('.buttons').hide();
                  $('.chose_socket').removeClass('hide').show();
                  break;
            case 'leap':
                  shoot.controller = 'leap';
                  $('.buttons').hide();
                  $('.chose_leap').removeClass('hide').show();
                  break;
            case 'computer':
                  shoot.controller = 'mouse';
                  $('.buttons').hide();
                  $('.chose_computer').removeClass('hide').show();
                  break;
      }
}

var goBack = function() {
      $('.info .title').html('Which controller do you want to use?');
      $('.chose').addClass('hide');
      $('.chose_socket').hide();
      $('.chose_leap').hide();
      $('.chose_computer').hide();
      $('.buttons').show();
      $('.back-button').hide()
}

var startGame = function() {
      $('.info').removeClass('slide_down');
      //look.theUserIsLockingThePointer();
      $('.info-score').addClass('active');
      shoot.infoVisible = false;

      setTimeout(function() {
            shoot.start = true;
            shoot.timeLeft('play clicked');
      }, 500);

      this.blur();

}

var addHighscore = function() {
      $('.score-submit').hide();
      $('.game-over').append('<span class="score-message">Sharing Score</span>');

      var name = $('.user-name').val();
      var score = shoot.globalPoints;
      var level = shoot.level + 1;
      var scored = shoot.totalScored;
      var missed = shoot.totalMissed;

      $.post("http://kermisdatabasevanbartenrobbert.herokuapp.com/addhighscore/shoot", {
            name: name,
            score: score,
            level: level,
            scored: scored,
            missed: missed
      }).done(function() {
            $('.score-submit').hide();
            $('.score-message').html('score succesully shared.')

      }).fail(function() {
            $('.score-message').html('something went wrong, please try again');
            $('.score-submit').show();
      });
}



var reloadScene = function() {

      $.each(scene.children, function(index, child) {
            if (child != undefined) {
                  if (child.name == 'target' || child.name == 'constraint' || child.name == 'bullet') {
                        //     console.log('remove');
                        // scene.remove(child);
                        removeObject.push(child);
                  }
            }
      });
      for (var i = 0; i < removeObject.length; i++) {
            scene.remove(removeObject[i]);
      }
      bullets = [];

      targets = [];
      t = 0;

      yeswecan.build_thebullet();

}

/**
 *
 * Global Vars
 *
 */
var removeObject = [];
var container = document.getElementById('container');

var /* camera, */ scene, renderer;
var sceneW, sceneH;
var physicsMaterial;
var throwing = false;
var t = 0;
var stats;
// The element we'll make fullscreen and pointer locked.
var fullscreenElement;
var counter = 0;
var timeRemaining;

var loader = new THREE.ObjectLoader();



// bullet material
var bullet;
var bullets = [],
      firedBullets = [];
var bulletMaterial = Physijs.createMaterial(
      new THREE.MeshLambertMaterial({
            color: 0xff8000
      }),
      1,
      0
);

var target, constraint, targetInfo;
var targets = [];
// target stand (for the constraint);
var targetStandGeom = new THREE.CubeGeometry(35, 4, 2, 3, 3, 3);
var targetStandMaterial = new THREE.MeshBasicMaterial({
      color: 0x0000FF,
      transparent: true,
      opacity: .2
});

/**
 *
 * Text material
 *
 */
var textOptions, materialFront, materialSide, materialArray, textMaterial;

var createTextOptions = function(colorFront, colorSide) {
      materialFront = new THREE.MeshBasicMaterial({
            color: colorFront,
            transparent: true,
            opacity: 1
      });
      materialSide = new THREE.MeshBasicMaterial({
            color: colorSide,
            transparent: true,
            opacity: .5
      });
      materialArray = [materialFront, materialSide];
      textMaterial = new THREE.MeshFaceMaterial(materialArray);
}

var setOptions = function(size) {
      var textOptions = {
            size: size,
            height: 5,
            curveSegments: 3,
            font: "helvetiker",
            weight: "bold",
            style: "normal",
            bevelThickness: 0,
            bevelSize: 0,
            bevelEnabled: false,
            material: 0,
            extrudeMaterial: 1
      }

      return textOptions;
}
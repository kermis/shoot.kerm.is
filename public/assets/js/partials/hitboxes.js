var hitboxes = {
      create: function() {
            hitboxes.setPoints = [{
                  'from': 2,
                  'to': 2
            }, {
                  'from': 2,
                  'to': 6
            }, {
                  'from': -1,
                  'to': 12
            }, {
                  'from': 0,
                  'to': 18
            }, {
                  'from': -2,
                  'to': 20
            }, {
                  'from': -2,
                  'to': 22
            }, {
                  'from': 0,
                  'to': 25
            }, {
                  'from': 1,
                  'to': 26
            }, {
                  'from': 3,
                  'to': 27
            }, {
                  'from': 4,
                  'to': 27
            }, {
                  'from': 5.8,
                  'to': 30.3
            }, {
                  'from': 7.3,
                  'to': 31.3
            }, {
                  'from': 10,
                  'to': 30.6
            }, {
                  'from': 10.4,
                  'to': 29.9
            }, {
                  'from': 10,
                  'to': 28
            }, {
                  'from': 8,
                  'to': 24.6
            }, {
                  'from': 8.5,
                  'to': 24
            }, {
                  'from': 9,
                  'to': 22
            }, {
                  'from': 8.8,
                  'to': 20.7
            }, {
                  'from': 14,
                  'to': 19.4
            }, {
                  'from': 18.5,
                  'to': 16.3
            }, {
                  'from': 19.7,
                  'to': 14
            }, {
                  'from': 21,
                  'to': 10
            }, {
                  'from': 21,
                  'to': 6
            }, {
                  'from': 23,
                  'to': 6
            }, {
                  'from': 22,
                  'to': 2
            }, {
                  'from': 19.8,
                  'to': 0
            }];

            hitboxes.build(hitboxes.setPoints, 0xff0000, true, .5, -8, 53, 231, 0, 0, false);
      },

      build: function(points, color, transparent, opacity, posX, posY, posZ, rotX, rotY, rotZ) {

            var rectShape = new THREE.Shape();
            rectShape.moveTo(0, 0);
            for (var i = 0; i < points.length; i++) {
                  rectShape.lineTo(points[i].from, points[i].to);
            }
            rectShape.lineTo(0, 0);

            var rectGeom = new THREE.ShapeGeometry(rectShape);
            var rectMesh = new Physijs.ConvexMesh(rectGeom, new THREE.MeshBasicMaterial({
                  color: color,
                  transparent: transparent,
                  opacity: opacity
            }));

            rectMesh.name = 'hitbox';

            if (posX) rectMesh.position.x = posX;
            if (posY) rectMesh.position.y = posY;
            if (posZ) rectMesh.position.z = posZ;
            if (rotX) rectMesh.rotation.x = helpMe.calculate('rad', rotX);
            if (rotY) rectMesh.rotation.y = helpMe.calculate('rad', rotY);
            if (rotZ) rectMesh.rotation.z = helpMe.calculate('rad', rotZ);

            scene.add(rectMesh);

      }
}
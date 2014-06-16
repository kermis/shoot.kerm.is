var hitboxes = {
      create: function() {
            yeswecan_setSomeArguments = {
                  'type': 'cube',
                  'width': 350,
                  'height': 4,
                  'depth': 40,
                  'wSegments': 10,
                  'hSegments': 10,
                  'color': 0x00FFFF,
                  'transparent': true,
                  'opacity': 0,
                  'friction': .4,
                  'restitution': .4,
                  'posY': 50,
                  'posZ': 235,
                  'name': 'row1'
            }
            yeswecan.build_thelowpolystand(yeswecan_setSomeArguments);

            yeswecan_setSomeArguments = {
                  'type': 'cube',
                  'width': 400,
                  'height': 4,
                  'depth': 40,
                  'wSegments': 10,
                  'hSegments': 10,
                  'color': 0x00FFFF,
                  'transparent': true,
                  'opacity': 0,
                  'friction': .4,
                  'restitution': .4,
                  'posY': 88,
                  'posZ': 205,
                  'name': 'row2'
            }
            yeswecan.build_thelowpolystand(yeswecan_setSomeArguments);

            yeswecan_setSomeArguments = {
                  'type': 'cube',
                  'width': 400,
                  'height': 4,
                  'depth': 40,
                  'wSegments': 10,
                  'hSegments': 10,
                  'color': 0x00FFFF,
                  'transparent': true,
                  'opacity': 0,
                  'friction': .4,
                  'restitution': .4,
                  'posY': 145,
                  'posZ': 180,
                  'name': 'row3'
            }
            yeswecan.build_thelowpolystand(yeswecan_setSomeArguments);

            yeswecan_setSomeArguments = {
                  'type': 'cube',
                  'width': 30,
                  'height': 300,
                  'depth': 30,
                  'wSegments': 10,
                  'hSegments': 10,
                  'color': 0x00FFFF,
                  'transparent': true,
                  'opacity': 0,
                  'friction': .4,
                  'restitution': .4,
                  'posX': -175,
                  'posY': 147,
                  'posZ': 310,
                  'rotY': -5,
                  'name': 'leftSideFront'
            }
            yeswecan.build_thelowpolystand(yeswecan_setSomeArguments);

            yeswecan_setSomeArguments = {
                  'type': 'cube',
                  'width': 30,
                  'height': 300,
                  'depth': 30,
                  'wSegments': 10,
                  'hSegments': 10,
                  'color': 0x00FFFF,
                  'transparent': true,
                  'opacity': 0,
                  'friction': .4,
                  'restitution': .4,
                  'posX': 175,
                  'posY': 147,
                  'posZ': 310,
                  'rotY': 5,
                  'name': 'rightSideFront'
            }
            yeswecan.build_thelowpolystand(yeswecan_setSomeArguments);

            yeswecan_setSomeArguments = {
                  'type': 'cube',
                  'width': 30,
                  'height': 350,
                  'depth': 30,
                  'wSegments': 10,
                  'hSegments': 10,
                  'color': 0x00FFFF,
                  'transparent': true,
                  'opacity': 0,
                  'friction': .4,
                  'restitution': .4,
                  'posX': 0,
                  'posY': 280,
                  'posZ': 310,
                  'rotX': 90,
                  'rotZ': 90,
                  'name': 'topSideFront'
            }
            yeswecan.build_thelowpolystand(yeswecan_setSomeArguments);

            yeswecan_setSomeArguments = {
                  'type': 'plane',
                  'width': 400,
                  'height': 300,
                  'wSegments': 10,
                  'hSegments': 10,
                  'color': 0x00FFFF,
                  'transparent': true,
                  'opacity': 0,
                  'friction': .4,
                  'restitution': .4,
                  'posX': 0,
                  'posY': 100,
                  'posZ': 0,
                  'name': 'backside'
            }
            yeswecan.build_thelowpolystand(yeswecan_setSomeArguments);

            yeswecan_setSomeArguments = {
                  'type': 'plane',
                  'width': 300,
                  'height': 30,
                  'wSegments': 10,
                  'hSegments': 10,
                  'color': 0x00FFFF,
                  'transparent': true,
                  'opacity': 0,
                  'friction': .4,
                  'restitution': .4,
                  'posX': -160,
                  'posY': 15,
                  'posZ': 170,
                  'rotY': 89,
                  'name': 'leftside'
            }
            yeswecan.build_thelowpolystand(yeswecan_setSomeArguments);

            yeswecan_setSomeArguments = {
                  'type': 'plane',
                  'width': 300,
                  'height': 30,
                  'wSegments': 10,
                  'hSegments': 10,
                  'color': 0x00FFFF,
                  'transparent': true,
                  'opacity': 0,
                  'friction': .4,
                  'restitution': .4,
                  'posX': 160,
                  'posY': 15,
                  'posZ': 170,
                  'rotY': -89,
                  'name': 'rightside'
            }
            yeswecan.build_thelowpolystand(yeswecan_setSomeArguments);
      }
}
$(function() {
    $('.browser').html(url.currentURL + '/connect.html');
    $('.code').html(room.id);
});


url.check();

room.setID();



/*
|------------------------------------------------------------------------------------
| Connect to socket.io
|------------------------------------------------------------------------------------
*/

	var socket = io.connect(url.currentURL);

	socket.on('connect', function() {
		console.log('main.js connect', room.id);
		socket.emit('message', {msg : 'you are connected to the room ' + room.id})
	 socket.emit('room', room.id);
  });


            socket.on('connected_person', function(data)
            {
                   if(room.id == data)
                   {
                        $('.step').each(function() {
                            $(this).css({'display' : 'none'});
                            $('.final').fadeIn(500);
                        });

                        $('.introduction').fadeOut(400);
                   }
            });







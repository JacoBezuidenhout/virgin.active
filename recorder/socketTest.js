var socket = require('socket.io-client')('http://localhost:8080');

socket.on('connect', function(){
	console.log("CONNECTED");
	socket.emit("person",{test:true});
});

socket.on('person', function(data){
	console.log(data);
});

socket.on('disconnect', function(){
	console.log("DISCONNECTED");
});
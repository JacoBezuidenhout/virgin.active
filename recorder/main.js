var io =  require('socket.io');
var settings = require('./settings');
var workerFarm = require('worker-farm')
  , workers    = workerFarm(require.resolve('./child'))
  , ret        = 0
var net = require('net');

var server = net.createServer(function(socket) {
	socket.on('data', function(data) {
		console.log('Received: ' + data);
		socket.destroy();
	});
});

server.listen(8080, '10.0.0.199');

// for (var i = 0; i < settings.cams.length; i++) {
// 	settings.cams[i].username = settings.username;
// 	settings.cams[i].password = settings.password;
// 	workers(settings.cams[i], function (err, outp) {
// 	    console.log(outp)
// 	    if (++ret == settings.cams.length)
// 	      workerFarm.end(workers)
//   	})
// }


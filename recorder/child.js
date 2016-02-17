var Recorder = require('rtsp-recorder');
var sys = require('sys')
var exec = require('child_process').exec;
var jsonfile = require('jsonfile')
var stack = [];
var results = [];
var busy = false;
var file = ''

var extract = function(cb)
{
	busy = true;
	if (stack.length)
	{	
		var obj = stack.pop();
		console.log(obj.filename, ' changed.');
		var motion = exec("python ./features/motionDetectVideo.py " + obj.filename.replace(" ","\\ "), function (error, motionRes, stderr) {
			obj.features.motion = {avg:motionRes};
			var person = exec("python ./features/personDetectVideo.py " + obj.filename.replace(" ","\\ "), function (error, personRes, stderr) {
				obj.features.person = {res:personRes};
				results.push(obj);
				jsonfile.writeFileSync(file, results, {spaces: 2});
				if (stack.length)
					extract(cb);
				else
					cb();
			});
		});
	}
	else
	{
		cb();
	}
}

var queue = function(obj)
{
	stack.push(obj);
	if (!busy)
	{
		extract(function(){
			console.log("QUEUE EMPTY")
			busy=false;
		});
	}
	console.log("STACK",stack.length);
	console.log("RESULTS",results.length);
}

module.exports = function (inp, callback) 
{
	file = 'results/' + inp.name + '.json';

	var rec = new Recorder({
	    url: 'rtsp://' + inp.username + ':' + inp.password + '@' + inp.ip + '/path', //url to rtsp stream 
	    timeLimit: inp.timeLimit, //length of one video file (seconds) 
	    folder: 'videos/' + inp.name + '/', //path to video folder 
	    prefix: inp.name + '-', //prefix for video files 
	    movieWidth: 1280, //width of video 
	    movieHeight: 720, //height of video 
	    maxDirSize: 1024*50, //max size of folder with videos (MB), when size of folder more than limit folder will be cleared 
	    maxTryReconnect: 15, //max count for reconnects 
	 	success: function(filename)
	 	{
			var obj = {
				filename:filename,
				features:{
					camera: inp.id
				}
			}

			queue(obj);
				 		
	 	}
	});

	jsonfile.readFile(file, function(err, f) {
		if (f)
		{
			results = f;
		}

	//start recording 
		rec.initialize();
	})
	 
	// //start stream to websocket, port 8001 
	// rec.wsStream(8000 + inp.id);	
	// callback(null, inp.name + ' started recording - PID: (' + process.pid + ')')
}

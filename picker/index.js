var ffmpeg = require('ffmpeg');

try {
	var process = new ffmpeg('../Videos/CAM1/CAM_1-11-11-2015 16-45-30.mp4');
	process.then(function (video) {
		// Callback mode
		video.fnExtractFrameToJPG('frames/', {
			frame_rate : 1,
			number : 5,
			file_name : 'my_frame_%t_%s'
		}, function (error, files) {
			// if (!error)
				console.log('Frames: ' + files);
		});
	}, function (err) {
		console.log('Error: ' + err);
	});
} catch (e) {
	console.log(e.code);
	console.log(e.msg);
}

/*
	1. Pick #k random video's from random [cameras]
	2. Analize clips
		2.1. Faces
		2.2. Bodies
		2.2. Motion
	3. Choose #j clips to replace. 
	4. WHILE #j > 0. Start at 1. Pick #j random clips
	5. Bind all clips
	6. Play movie
*/

var fs = require('fs');
var clipPool = [];
var clipPoolTrash = [];

function getFiles (dir, files_){
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files){
        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()){
            getFiles(name, files_);
        } else {
            files_.push(name);
        }
    }
    return files_;
}

function log(msg)
{
	console.log(msg);
}

var updatePool = function(folder)
{
	log("Finding all videos in " + folder)
		clipPool = getFiles(folder);
	log("### Done ###")
	
	log("Removing clips in TRASH")
		for (var i = 0; i < clipPoolTrash.length; i++) {
			if (clipPool.indexOf(clipPoolTrash[i]) >= 0)
				clipPool.splice(clipPool.indexOf(clipPoolTrash[i]),1);
		};
	log("### Done ###")
}

var getClips = function(k,pool,cb)
{
	var clips = [];
	for (var i = 0; i < k; i++) {
		var clip = clipPool[Math.floor(Math.random()*clipPool.length)];
		clips.push("CLIP: " + clip);
	};
	cb(clips);
}

var anClips = function(clips,cb)
{
	var results = [];
	for (var i = 0; i < clips.length; i++) {
		results.push(clips[i]);
	};
}

// updatePool('../Videos/');

var ffmpeg = require("fluent-ffmpeg");

var mergedVideo = ffmpeg();
var videoNames = [
	"/home/user/Videos/CAM_6-11-11-2015\ 16-33-9.mp4",
	"/home/user/Videos/CAM_9-11-11-2015\ 15-55-41.mp4",
	"/home/user/Videos/CAM_4-11-11-2015\ 16-53-0.mp4",
	"/home/user/Videos/CAM_3-11-11-2015\ 16-43-51.mp4",
	"/home/user/Videos/CAM_2-11-11-2015\ 16-7-22.mp4",
	"/home/user/Videos/CAM_1-11-11-2015\ 16-50-30.mp4"
];

videoNames.forEach(function(videoName){

    // mergedVideo = mergedVideo.input(videoName)
	ffmpeg(videoName)
		.duration('0:5')
		.videoFilters('fade=in:0:5')
		.output(videoName.replace("/home/user/Videos","tmp").replace(" ","2"))
		.on('end', function() {
			console.log('Finished processing');
		})
		.run();
	ffmpeg(videoName)
		.videoFilters('fade=in:0:5')
		.seek('0:5')
		.output(videoName.replace("/home/user/Videos","tmp").replace(" ","1"))
		.on('end', function() {
			console.log('Finished processing');
		})
		.run();
});

// mergedVideo.mergeToFile('./mergedVideo.mp4', './tmp/')
// .on('error', function(err) {
//     console.log('Error ' + err.message);
// })
// .on('end', function() {
//     console.log('Finished!');
// });
var fs = require("fs");

var imgData = '';
process.stdin.resume();
process.stdin.setEncoding('utf8');

var lingeringLine = "";

process.stdin.on('data', function(chunk) {
    imgData += chunk;
});

process.stdin.on('end', function() {
	//过滤data:URL
	var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
	var dataBuffer = new Buffer(base64Data, 'base64');
	fs.writeFile("render.png", dataBuffer, function(err) {
		console.log(dataBuffer.length);
	});
});


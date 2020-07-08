var express = require('express');
var fs = require("fs");
var app = express();
var arguments = process.argv.splice(2);
//配置
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({    
    extended: true,
    limit: '50mb'
}));
//app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

//保存base64图片POST方法
app.post('/upload', function(req, res){
	//接收前台POST过来的base64
	var imgData = req.body.imgData;
	//过滤data:URL
	var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
	var dataBuffer = new Buffer(base64Data, 'base64');
	fs.writeFile("h2c.png", dataBuffer, function(err) {
		if(err){
		    res.send(err);
		}else{
		    res.send("保存成功！");
            console.log(dataBuffer.length);
		}
	});
});

var port = arguments[0] || 8000;
app.listen(port);
console.log('Express started on port '+port);

function RongCloudQcode(callback){
	var logo = "http://www.rongcloud.cn/favicon-32x32.png";

	var link = location.href;

	var sizes = [256,60,2];

	var node = document.createElement("div");
	var canvas = document.createElement("canvas");
		canvas.width = sizes[0] + sizes[2]*2;
		canvas.height = sizes[0] + sizes[2]*2;
	var context = canvas.getContext("2d");

	var loadLogo = new Image();
		loadLogo.src = logo;

	loadLogo.onload = function(){
		new QRCode(node, link.toString());
		setTimeout(draw,100);
	}

	function draw(){
		var qcodeOrg = node.getElementsByTagName("img")[0].src;

		var logoLength = sizes[1];
		var logoX = sizes[0]/2 - logoLength/2 + sizes[2];

		fillrect(0,sizes[0]*2);
		drawImg(qcodeOrg,{x:sizes[2],y:sizes[2]},sizes[0]);
		fillrect(logoX,logoLength);
		drawImg(logo,{x:logoX,y:logoX},logoLength);
		callback(canvas)
	}

	function drawImg(path,pos,length){
		var img = new Image();
		img.src  = path;
		context.drawImage(img, pos.x, pos.y,length,length);
	}

	function fillrect(logoX,logoLength){
		var _l = logoLength + 6;
		var _pos = logoX - 3;
		context.fillStyle = "#ffffff";
		context.fillRect(_pos,_pos,_l,_l);
	}
}
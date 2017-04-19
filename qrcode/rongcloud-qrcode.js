function RongCloudQcode(callback){
	// var logo = "favicon-32x32.png";
	var logo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADh0lEQVRYR+3WTYiVZRQH8N9z5yNTayxtRIzKhQQhJEbLiGwRmYWFSJQuhMBwnDFr0XfMoozKEmfGZCqIgqRMijQ0V65qE9GiooxAgkrFNIuQnK8Tz3vvjNfROzPXhtx4lu97zv/8n/OdXGBJF9i/iwQmLwK90WLQTOES9Gt0wiEndKaBsdI8OQS64w7Jc8I1aEZ2egzfCfsM2mdDOnQuIudHIKJsl1LojalO2SW5vcZLB/Ettmj2gTXpZLVe/QQ2x3UatCuZYcib+FryMe4cp6NO4R3hGR3p6LBufQQ6o2SW14U15Qj4Qr+7lNyg5CmhRfIXpuNazEVjFbGQbFfSbm36owxRLTuiwVHzDLlJuLoopgY/GvRVwbo3mvT5CEsrZj8Jt+lIv3g7pvhdg8v1IevNrqTlYWFRla8hvGS2Z61Ig6cJbItWg9YLD1I4b6g4OSVVctjkff2WCq9gmqRLq5czUM3wd0XG2igVuKWK3nFDlluf9pcJbI45GmyT3HNWVE4jnxRecNwms8wxYIoTDupM+cVjS0/k9sz1cm+V4nbHrE5FWPttEjrGw6HI7yrtadcEdM9U6YlFQrbLdZHlN8ndSVfcItmJ1sqPfsln2IsZwgNYMIKW7DbNCqvTP3WRyAV8pV7JQxW7nLYNSXdsxJNVDt4zZK2OlF/L1lhoyA7Mr+gcVrJYW/q+LgJZuTtWFq04XAvhrUwgV/VwbnLB3Wdd2nMGeFf0SNpGirJkmbaUo1SfdMWtkow9tTBMdmcCeYgsGwHPZNpTDv9p6Y4utFc+BFZqT9vr844aBF7EE1Vg7ypp05b+Lr5tiQUa7BSuH9EJT+tIOXX1yTlTUGb1Ia6qoOW2+hR7JC3CKiwc5WmvZstHz/Ux2dQsws5oNtNmrB0FkENda1TnAr3/rFSNxaBmG2ajbTHXgDewZAyMPEKHJ1lW+7yYbuvSz+PmYcxBNGydp2GTDZW+n1PlrE/yjfAJVmNelcNcrI9qTz/UJDGhUTxsnZfREfMlNxf7YEifkgMGfOmRdERPtAmvUlw9ZUkOCL0G7dHkV43y2j2PZTRuHPFaXKrR81IxtqvXbE7PYRzEn+e/jidCYmtMFx6n2JyXTcSkojMJB8mwt/ICy2v5MYp05TuwlkzySVbtplzdiyVLhBsrs+R/OEpHvzUPmVYtuOLCnOV1FMJo1fqO0v/gqJbpRQL/Ak5LQ6Qje6F2AAAAAElFTkSuQmCC";

	var link = location.href;

	var sizes = [140,32,2];

	var node = document.createElement("div");
	var canvas = document.createElement("canvas");
		canvas.width = sizes[0] + sizes[2]*2;
		canvas.height = sizes[0] + sizes[2]*2;
	var context = canvas.getContext("2d");

	// var loadLogo = new Image();
	// 	loadLogo.src = logo;

	// loadLogo.onload = function(){
		new QRCode(node, link.toString());
		setTimeout(draw,10);
	// }

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

	function getBase64Data(img, width, height){
		var canvas = document.createElement("canvas");
			canvas.width = width;
			canvas.height = height;

		var context = canvas.getContext('2d');
			context.drawImage(img, 0, 0, width, height);

		var newImageData = canvas.toDataURL("image/png");
		return newImageData;
	}
}
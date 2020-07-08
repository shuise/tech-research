/**
 * @author weixin
 * exif:orientation[图片旋转系数]
 * http://blog.csdn.net/happy08god/article/details/11528479
 */
(function(){
	
	var file = "test1.jpg";
	//以顺时针旋转角度，复原对照表
	var orientationParam={
		1:"0",
		3:"180",
		6:"90",
		8:"270"
	};
	//测试Imageinfo 库	
	ImageInfo.loadInfo(file, _callback);
	//本地浏图片矫正
	getElem("#imagefile").addEventListener("change",readImageAsBinaryString,false);

	function getBlobUrl(file){
	  var url = "";
	  if(window.createObjectURL){
	    url = window.createObjectURL(file);
	  }else if(window.createBlobURL){
	    url = window.createBlobURL(file);
	  }else if(window.URL && window.URL.createObjectURL){
	    url = window.URL.createObjectURL(file);     //chrome,firefox
	  }else if(window.webkitURL && window.webkitURL.createObjectURL){
	    url = window.webkitURL.createObjectURL(file);   //safari
	  } 
	  return url;
	}

	function testBlob(evt){
 		//Retrieve the first (and only!) File from the FileList object
 		for(var i=0;i<evt.target.files.length;i++){
	    	var f = evt.target.files[i]; 
		    if (f&&f.type.match('image.*')) {
				var url = getBlobUrl(f);
				var img = new Image();
				img.src = url;
				img.onload = function(){
					var canvas = document.createElement("canvas");
					var ctx = canvas.getContext("2d");
					var maxwidth = 200;
					var _w = img.width;
					var _h = img.height;
					var width = _w>maxwidth?maxwidth:_w;
					var height =width==maxwidth? (_h*maxwidth/_w):_h;					
					document.body.appendChild(canvas);
					canvas.setAttribute('width',width);
					canvas.setAttribute('height',height);				
					ctx.drawImage(img, 0,0, width, height);									
				}				
		    } else {
		      console.log("file type not image or not exist");
		    } 			
 		}		
	}

	/**
	 *  @data: BinaryFile
	 *   读取图片信息
	 * 	  支持png，gif，jpeg，bmp,jpeg可以返回exif信息
	 */
	function readInfoFromData(data) {

		var offset = 0;

		if (data.getByteAt(0) == 0xFF && data.getByteAt(1) == 0xD8) {
			return readJPEGInfo(data);
		}
		if (data.getByteAt(0) == 0x89 && data.getStringAt(1, 3) == "PNG") {
			return readPNGInfo(data);
		}
		if (data.getStringAt(0,3) == "GIF") {
			return readGIFInfo(data);
		}
		if (data.getByteAt(0) == 0x42 && data.getByteAt(1) == 0x4D) {
			return readBMPInfo(data);
		}
		if (data.getByteAt(0) == 0x00 && data.getByteAt(1) == 0x00) {
			return readICOInfo(data);
		}

		return {
			format : "UNKNOWN"
		};
	}

	function readPNGInfo(data) {
		var w = data.getLongAt(16,true);
		var h = data.getLongAt(20,true);

		var bpc = data.getByteAt(24);
		var ct = data.getByteAt(25);

		var bpp = bpc;
		if (ct == 4) bpp *= 2;
		if (ct == 2) bpp *= 3;
		if (ct == 6) bpp *= 4;

		var alpha = data.getByteAt(25) >= 4;

		return {
			format : "PNG",
			version : "",
			width : w,
			height : h,
			bpp : bpp,
			alpha : alpha,
			exif : {}
		}
	}

	function readGIFInfo(data) {
		var version = data.getStringAt(3,3);
		var w = data.getShortAt(6);
		var h = data.getShortAt(8);

		var bpp = ((data.getByteAt(10) >> 4) & 7) + 1;

		return {
			format : "GIF",
			version : version,
			width : w,
			height : h,
			bpp : bpp,
			alpha : false,
			exif : {}
		}
	}

	function readJPEGInfo(data) {

		var w = 0;
		var h = 0;
		var comps = 0;
		var len = data.getLength();
		var offset = 2;
		while (offset < len) {
			var marker = data.getShortAt(offset, true);
			offset += 2;
			if (marker == 0xFFC0) {
				h = data.getShortAt(offset + 3, true);
				w = data.getShortAt(offset + 5, true);
				comps = data.getByteAt(offset + 7, true)
				break;
			} else {
				offset += data.getShortAt(offset, true)
			}
		}

		var exif = {};

		if (typeof EXIF != "undefined" && EXIF.readFromBinaryFile) {
			exif = EXIF.readFromBinaryFile(data);
		}

		return {
			format : "JPEG",
			version : "",
			width : w,
			height : h,
			bpp : comps * 8,
			alpha : false,
			exif : exif
		}
	}

	function readBMPInfo(data) {
		var w = data.getLongAt(18);
		var h = data.getLongAt(22);
		var bpp = data.getShortAt(28);
		return {
			format : "BMP",
			version : "",
			width : w,
			height : h,
			bpp : bpp,
			alpha : false,
			exif : {}
		}
	}
	
	function readImageAsBinaryString(evt){
 		//Retrieve the first (and only!) File from the FileList object
 		for(var i=0;i<evt.target.files.length;i++){
	    	var f = evt.target.files[i]; 
		    if (f&&f.type.match('image.*')) {
		      var r = new FileReader();
		      r.onloadend = function(e){
		      	var binaryArr = new BinaryFile(this.result, 0, 0);
				var tags = readInfoFromData(binaryArr);
				onLoadEndCall&&onLoadEndCall(f,tags);
		      }	      
		      r.readAsBinaryString(f);
		    } else {
		      console.log("file type not image or not exist");
		    } 			
 		}
		
	}

	function onLoadEndCall(f,tags){
		var cnt = getElem("#loadImageContent");
		var div = document.createElement("div");
		div.className = "img_item";
		var img = document.createElement("img");
		var r = new FileReader();
		r.onloadend = function(){
			img.src = this.result;
			img.height="300";
			div.appendChild(img);
			cnt.appendChild(div);
			var canvas = rotateImage(img,tags);
			div.appendChild(canvas);	
			//creatImage(canvas.toDataURL("image/jpeg"));					
		}
		r.readAsDataURL(f);
	}
	
	function creatImage(img){
		//var img = document.createElement(img);
	}	
	function _callback(){
		var tags = ImageInfo.getAllFields(file);
		showInfo(tags);
	}		
	function showInfo(json){
		getElem("#show").innerHTML = '<code class="prettyprint">'+JSON.stringify(json)+'</code>';
	}
	
	function rotateImage(img,tags){
		var canvas = document.createElement("canvas");
		var ctx = canvas.getContext("2d");
		var width = img.offsetWidth;
		var height = img.offsetHeight;	
		var x = width / 2;
		var y = height / 2;				
		if(tags.exif && typeof orientationParam[tags.exif.Orientation]!="undefined"){				
			if(orientationParam[tags.exif.Orientation]%180!=0){
				canvas.width	= height;
				canvas.height = width;					
				x = height / 2;
				y = width / 2;
				ctx.translate(x, y);	
				ctx.rotate(orientationParam[tags.exif.Orientation]*Math.PI/180);					
				ctx.translate(-y,-x);
				ctx.drawImage(img, 0,0, width, height);								
			}else{
				canvas.width	= width;
				canvas.height = height;					
				ctx.translate(x, y);	
				ctx.rotate(orientationParam[tags.exif.Orientation]*Math.PI/180);					
				ctx.translate(-x,-y);
				ctx.drawImage(img, 0,0, width, height);					
			}										
		}				
		return canvas;
	}

	function getElem(s){
		return document.querySelector(s);
	}			
})();







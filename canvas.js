var Images = (function(){
		 
	function getResizeRatio(imageInfo,config){
		//hasOwnProperty?

		var ratio = 1;

		var oWidth = imageInfo.width;
		var maxWidth = config.maxWidth || 0;
		if(maxWidth > 0 &&  oWidth > maxWidth){
			ratio = maxWidth/oWidth;
		}

		var oHeight = imageInfo.height;
		var maxHeight = config.maxHeight || 0;
		if(maxHeight > 0 && oHeight > maxHeight){
			var ratioHeight = maxHeight/oHeight;
			ratio = Math.min(ratio,ratioHeight);
		}


		var maxSize = config.maxSize || 0;
		var oSize = Math.ceil(imageInfo.size/1000); //K，Math.ceil(0.3) = 1;
		if(oSize > maxSize){
			ratioSize = maxSize/oSize;
			ratio = Math.min(ratio,ratioSize);
		}

		return ratio;
	}

	function resize(file,config,callback){
		//file对象没有高宽
		var type = file.type; //image format
		var canvas = document.createElement("canvas");

		var reader = new FileReader();

    	reader.readAsDataURL(file);
		reader.onload = function(evt){
			var imageData = evt.target.result;
			var img = new Image();
			img.src  = imageData;
			var width = img.width;
			var height = img.height;
			var imageInfo = {
				width : width,
				height : height,
				size : evt.total
			}
			var ratio = getResizeRatio(imageInfo,config);

			compress(img, width*ratio, height*ratio);
		}

		function compress(img, width, height){
				canvas.width = width;
				canvas.height = height;

			var context = canvas.getContext('2d');
				context.drawImage(img, 0, 0, width, height);

			/*
			If the height or width of the canvas is 0, the string "data:," is returned.
			If the requested type is not image/png, but the returned value starts with data:image/png, then the requested type is not supported.
			Chrome also supports the image/webp type.
			*/ 

			var supportTypes = {
				"image/jpeg" : true,
				"image/png" : true,
				"image/webp" : supportWebP()
			};
			var exportType = "image/png";
			if(supportTypes[type]){
				exportType = type;
			} 
			var newImageData = canvas.toDataURL(exportType);
			callback(newImageData);
		}

		function supportWebP(){
			try{
        		return (canvas.toDataURL('image/webp').indexOf('data:image/webp') == 0);
    		}catch(err) {
		        return  false;
		    }
		}
	}

	return {
		resize : resize,
		getFile : function(str){
			context.font = "20pt Arial";    
			context.textBaseline = 'top';	
			context.fillStyle = "red"; 
			context.fillText(str, 5, 5);

			return canvas.toDataURL("image/png");
		}
	}
})();
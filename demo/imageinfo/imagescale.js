!!function(){
	//目前测试上限在0.8 对于超限图片，压缩在0.8；
	//这个和超限图片的大小有关
	window.imageScale = function(src,scale,callback){
		var inc = 100;
		var width = null;
		var height = null;
		var hIncs = null;
		var wIncs = null;		
		var imageSourceArr = [];
		
		var img = new Image();
		img.src = src;		
		img.onload = function(){
			width = img.width;
			height = img.height;
			wIncs  = Math.ceil(width/inc);
			hIncs = Math.ceil(height/inc);			
			for(var j=0;j<=hIncs;j++){
				for(var i=0;i<=wIncs;i++){			
					var _w = width<i*inc?width-(i-1)*inc : inc;
					var _h = height<j*inc?height-(j-1)*inc : inc;					
					var canvas = document.createElement("canvas");
					var ctx = canvas.getContext("2d");
					canvas.setAttribute("width",_w*scale);
					canvas.setAttribute("height",_h*scale);					
					ctx.scale(scale,scale);
					ctx.drawImage(img,i*inc,j*inc,_w,_h,0,0,_w,_h);
					imageSourceArr.push({
						source : ctx.getImageData(0,0,_w*scale,_h*scale),
						x : i*inc*scale*1.0,
						y : j*inc*scale*1.0,
						w : _w*scale*1.0,
						h : _h*scale*1.0
					});
				}
			}			
			callback&&callback(drawWholeCanvas(imageSourceArr,width,height,scale));		
		};
		function drawWholeCanvas(arr,width,height,scale){
			var canvas = document.createElement("canvas");
			var ctx =  canvas.getContext("2d");
			canvas.setAttribute("width",width*scale);
			canvas.setAttribute("height",height*scale);	
			for(var i=0;i<arr.length;i++)	{
				ctx.putImageData(arr[i].source,arr[i].x,arr[i].y);
			}
			return canvas;				
		}			
	};	
}();

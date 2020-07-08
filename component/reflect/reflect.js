function reflect(imgs,config){	
	var refH = config.refH || 40;
	var len = imgs.length;
	for (var i=0;i<len;i++){
		_ref(imgs[i]);
	}

	function _ref(img){
		var cas = img.parentNode.getElementsByTagName("canvas")[0];
		if(!cas){
			cas = document.createElement("canvas");
			NE.dom.after(cas,img); 
		}	
		var context = cas.getContext("2d");
		var gradient;

		var reflectH = parseInt(refH);
		var reflectW = 100;

		if(window.getComputedStyle) {
			reflectW = parseInt(window.getComputedStyle(img , null)['width']);
		}
		
		cas.height = reflectH;
		cas.width = reflectW;	
		context.drawImage(img, 0, 0, reflectW, reflectH);

		context.save();
		context.translate(0,reflectH-1);
		context.scale(1,-1);
		context.drawImage(img, 0, 0, reflectW, reflectH);
		context.restore();
		context.globalCompositeOperation = "linear";
		
		gradient = context.createLinearGradient(0, 0, 0, reflectH);
		gradient.addColorStop(1, "rgba(255, 255, 255, 1.0)");
		gradient.addColorStop(0, "rgba(255, 255, 255, 0.1)");

		context.fillStyle = gradient;
		context.rect(0, 0, reflectW, reflectH*2);
		context.fill();

		if(config.ani_bg && config.ani_end){
			cas.className = config.ani_bg;
			cas.className = config.ani_end;
		}
	}
}
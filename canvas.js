var Images = (function(){
	var canvas = document.createElement("canvas");
	var context = canvas.getContext('2d');
		 
	return {
		getFile : function(str){
			context.font = "20pt Arial";    
			context.textBaseline = 'top';	
			context.fillStyle = "red"; 
			context.fillText(str, 5, 5);

			return canvas.toDataURL("image/png");
		}
	}
})();
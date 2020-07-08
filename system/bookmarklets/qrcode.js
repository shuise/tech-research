(function(){
	var script = document.createElement('script');  
	script.src = 'http://qa.developer.163.com/component/qrcode/qrcode.js';  
	script.onload = function(){    
		var div = document.createElement('div');    
		document.body.appendChild(div);
		div.style.border = "2px solid #fff";    
		div.style.position = 'fixed';    
		div.style.top = '100px';    
		div.style.right = '100px';    
		div.style.zIndex='1000000';    
		new QRCode(div, location.href.toString()); 
		div.onclick = function(){
			document.body.removeChild(div);
		} 
	};  
	document.head.appendChild(script);
})();
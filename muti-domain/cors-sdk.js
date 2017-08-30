//为了解决站点不同域名下子页面本地存储同步的问题

;(function(RongIM){
	var ifr = document.createElement("iframe");
	document.body.appendChild(ifr);
	ifr.src = "./sdk.html";
	
	RongIM.ready = function(callback){

		ifr.onload = function(){
			callback(ifr.contentWindow);
		}
	}
	RongIM.init = function(params,callbacks){
		ifr.contentWindow.init(params,callbacks);
	}
})(window.RongIM = {});
//首页访问统计


/*
http://web.stat.ws.126.net/front/?project=index_www&ref=NTES_FE_LOGGER&type=start&module=page&message=222&screen=1357/425&scroll=0/0&time=1379999610656

http://web.stat.ws.126.net/front/?project=index_www&ref=NTES_FE_LOGGER&type=ready&module=page&message=4217&screen=1357/425&scroll=0/0&time=1379999614651

http://web.stat.ws.126.net/front/?project=index_www&ref=NTES_FE_LOGGER&type=load&module=page&message=13609&screen=1357/425&scroll=0/0&time=1379999624043

http://web.stat.ws.126.net/front/?project=index_www&ref=NTES_FE_LOGGER&type=pageShow10s&module=app&message=null&screen=1357/425&scroll=0/0&time=1379999632109

http://web.stat.ws.126.net/front/?project=index_www&ref=NTES_FE_LOGGER&type=viewFocus&module=page&message=viewHeight=425/currentView=1/pageHeight=7466&screen=1357/425&scroll=0/0&time=1379999634609

http://web.stat.ws.126.net/front/?project=index_www&ref=NTES_FE_LOGGER&type=tabSwitch&module=c_news1&message=2&screen=1357/425&scroll=0/0&time=1379999774017
*/

/*
http://web.stat.ws.126.net/front/?project=news_index_all&ref=NTES_FE_LOGGER&type=start&module=page&message=3285&screen=1357/425&scroll=0/0&time=1379999980843
*/

;(function(){
	var node = document.getElementsByTagName("body")[0];
	node.onclick = function(event){
		var e = event || window.event;
		var target = e.target || e.srcElement;
		
	}

	function getDiffTime(){
		var bg = window.NTES_logger_start_time.getTime();
		var end = new Date().getTime();
		return end - bg;
	}
})();
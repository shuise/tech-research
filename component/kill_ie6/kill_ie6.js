(function(){
	var ua = navigator.userAgent.toLowerCase();
	var html = '<div style="width:960px;margin:1px auto;border-bottom:1px solid #A95401;text-align:left;"><p style="border-bottom:1px solid #FB9B2A;background:#FC6;font-size:14px;line-height:25px;padding:0 15px;color:#343432;padding-top:5px;"><span style="color:#c00;margin-right:10px;">※</span>做个有态度的人，别再让这个又破又慢的浏览器哄弄你了，<a style="color:#c00;" href="http://g.msn.com/1me10IE9ZHCN/102">赶紧升级赶紧爽吧</a></p></div>';
	if(ua.indexOf("msie 6.0")>-1 || ua.indexOf("msie 7.0")>-1){
		var node = document.createElement("div");
			node.innerHTML = html;
		var parent = document.getElementsByTagName("body")[0];
		parent.insertBefore(node,parent.firstChild);
	}
})();
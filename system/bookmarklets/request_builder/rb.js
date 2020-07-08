;(function(){
	var csses = "/system/bookmarklets/request_builder/rb.css";
	var _dm = "http://dev.f2e.163.com";

	var tpl = ['<div class="rb_wrap">',
				'	<table>',
				'		<caption class="btn-inverse">Reuqest builder</caption>',
				'		<tr>',
				'			<th>url</th>',
				'			<td><select name="method" id="method"><option value="get">get</option><option value="post">post</option></select><input type="text" name="url" id="url" value="http://api.163.com/useradd"></td>',
				'		</tr>',
				'		<tr>',
				'			<th>params</th>',
				'			<td><textarea name="params" id="params" cols="30" rows="10">{\n"name":"name"\n}</textarea></td>',
				'		</tr>',
				'		<tr>',
				'			<th>headers</th>',
				'			<td><textarea name="headers" id="headers" cols="30" rows="10">{\n\n}</textarea></td>',
				'		</tr>',
				'		<tr>',
				'			<th>&#160;</th>',
				'			<td><input type="button" class="btn btn-inverse" value="send" id="send"></td>',
				'		</tr>',
				'	</table>',
				'	<div id="show"></div>',
				'</div>'].join("");

	var step = 0;
	var d = document;

	insertCSS(_dm + csses,run);

	function run(){
		var node = d.createElement("div");
		node.style.cssText = "position:fixed;right:10px;top:10px;";
		node.innerHTML = tpl;
		d.body.appendChild(node);

		var btn = d.getElementById("send");
			btn.onclick = send;
	}

	function send(){
		var result = d.getElementById("show");

		var url = d.getElementById("url").value;
		var method = d.getElementById("method").value;
		var params = d.getElementById("params").value;
		var headers = d.getElementById("headers").value;

		var proxyUrl = "http://*****";
		var rUrl = proxyUrl + "?url=" + encodeURIComponent(url) 
							+ "&method=" + method 
							+ "&params=" + encodeURIComponent(params)
							+ "&headers" + encodeURIComponent(headers);

		loadJsonP(rUrl,function(data){
			result.innerHTML = data;
		});
	}

	function loadJsonP(url, callback){
		var callbackName = 'ne' + (Math.random() * (1 << 30)).toString(16).replace('.', '');
		window[callbackName] = callback;
		url += "&callback=" + callbackName;
		var node = document.createElement('script');
			node.src = url;
		document.getElementsByTagName('head')[0].appendChild(node);                                  
	}

	function ready(node,callback){
		if(!callback){return false;}
		if (navigator.userAgent.toLowerCase().indexOf('msie')>-1){ 
			node.onreadystatechange = function(){
				if(this.readyState == 'complete' || this.readyState == 'loaded'){
					callback();
				}
			}
		} else {
			node.onload = function(){callback()};
		}
	}

	function insertCSS(link,callback){
		var nodeHide;
		if (navigator.userAgent.toLowerCase().indexOf('msie')>-1){ 
			nodeHide = document.createElement('script');
			nodeHide.type = 'text/css_js';
		}else{
			nodeHide = document.createElement('iframe');
			nodeHide.style.display = 'none';
		}
		nodeHide.src = link;  
		document.getElementsByTagName('body')[0].appendChild(nodeHide); 
		ready(nodeHide,function(){
			var node = document.createElement("link");
				node.href = link;
				node.type = "text/css";
				node.rel = "stylesheet";
				document.getElementsByTagName('head')[0].appendChild(node);
				callback();
		}); 
	}
})();
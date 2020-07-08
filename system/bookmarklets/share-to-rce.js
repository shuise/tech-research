(function(){
	var title = document.title || document.getElementsByTagName("h1")[0].innerHTML;
	var content = document.getElementsByTagName('meta')['description'].content;

	var imageUri = "http://f2e.cn.ronghub.com/web-site-dev/favicon-32x32.png";
	var links = document.getElementsByTagName("link");
	for(var i=0; i< links.length; i++){
		if(links[i].rel.indexOf("icon") > -1){
			imageUri = links[i].href;
		}
	}

	var content = {
		"title": encodeURIComponent(title),
		"content": encodeURIComponent(content),
		"imageUri": encodeURIComponent(imageUri),
		"url": encodeURIComponent(location.href)
	};

	var url = "RCE://?share=" + JSON.stringify(content);
	
	/*
	RCE://?share={share}
	RCE://?start={params}
	*/


	var iframe = document.createElement("iframe");
		iframe.style.cssText = "display:none";
		iframe.src = url;
	document.body.appendChild(iframe);

	console.log(url);
})();
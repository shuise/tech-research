_f2e_seo_check();

function _f2e_seo_check(){
	/*
	（Head部分） 
	1.包含Title、Description、Keywords
	 
	(Body部分) 
	1.标题使用H1、H2、H3字体，内容标题使用H1、副标题H2
	2.关键词字体尺寸（使用黑体、粗体、斜体......） 
	3.图形中的Alt属性需要添加
	4.链接中的title属性需要添加
	*/

	var d = document;
	var h1s = d.getElementsByTagName("h1");

	var warnings = [];

	if(h1s.length == 0){
		warnings.push("没有h1");
	}
	if(h1s.length > 1){
		warnings.push("h1多于一个");
	}

	var imgs = d.getElementsByTagName("image");
	for(var i=0,len=imgs.length;i<len;i++){
		if(trim(imgs[i].alt) == ""){
			warnings.push("图片 \"" + imgs[i].src + "\" 没有加alt");
		}
		if(imgs[i].parentNode.tagName.toLowerCase() == "a" && trim(imgs[i].title) == ""){
			warnings.push("链接图片 \"" + imgs[i].src + "\" 没有加title");
		}
	}

	var as = d.getElementsByTagName("a");
	for(var i=0,len=as.length;i<len;i++){
		if(trim(as[i].title) == ""){
			warnings.push("链接 \"" + as[i].innerHTML + "\" 没有加title");
		}
	}

	var h2s = d.getElementsByTagName("h2");
	var h3s = d.getElementsByTagName("h3");

	if(h2s.length == 0 && h3s.length > 0){
		warnings.push("没有h2却使用了h3");
	}

	if(warnings.length > 0){
		alert(warnings.join("\n"));
		log(warnings.join("\n"));
	}else{
		alert("页面的seo做的不错");
		log("页面的seo做的不错");
	}

	function trim(str,type){
		var models = {
			"left" : /^\s*/,
			"right" : /(\s*$)/g,
			"both" : /^\s+|\s+$/g,
			"all" : /\s+/g
		};
		type = type || "all";
		if(models[type]){
			return str.replace(models[type],"");
		}else{
			return str;
		}
	}
	function log(variable){
		if(typeof(console)!="undefined" && console.log){
			console.log(variable);
		}
	};
}
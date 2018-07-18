(function(){
	document.title = HE.$("h1")[0].innerHTML;
	var as = HE.$("#menu a");
	HE.array.forEach(as,function(item){
		var obj = HE.$("#" + item.href.split("#")[1]);
		if(obj){
			var node = document.createElement("h2");
				node.innerHTML = item.innerHTML;
			HE.insertBefore(node,obj.firstChild);
		}
	});
})();	

(function(){
	var imgs = HE.$("div.sections img");
	HE.array.forEach(imgs,function(item){
		var datas = [];
		if(item.lang){
			datas = item.lang.split(",");
			
			var index = 0;
			
			item.onclick = function(){
				index = (index + 1)%datas.length;
				this.src = datas[index];
			}
		}
	});
})();
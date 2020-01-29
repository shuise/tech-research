(function(){
	var names = document.querySelectorAll(".subject-item .info h2 a");
	var url1 = "http://cn.epubee.com/books/?s=";
	var url2 = "http://www.ireadweek.com/index.php?g=portal&m=search&a=index&keyword=";
	var url3 = "http://www.duokan.com/search/{keyword}/1"
	for(var i=0;i<names.length;i++){
		var keyword = names[i].innerText;
			keyword = keyword.split("，")[0].split(" ")[0];
		// window.open(url1 + keyword);
		window.open(url2 + keyword);
		window.open(url3.replace('{keyword}',keyword));
		window.open('https://www.amazon.cn/s?k=' + keyword)
	}
})();


(function(){
	var names = document.querySelectorAll(".item .title a");
	// var url = "http://cn.epubee.com/books/?s=";
	// var url = "http://www.ireadweek.com/index.php/Index/bookList.html?keyword=";
	var url = "http://www.ireadweek.com/index.php?g=portal&m=search&a=index&keyword="
	for(var i=0;i<names.length;i++){
		var keyword = names[i].innerText;
			keyword = keyword.split("，")[0].split(" ")[0];
		window.open(url + keyword);
	}
})();

/*
火鸟
宫本武藏
幽游白书
海盗路飞
灌篮高手
*/


var btns = document.querySelectorAll(".btn-sm");
btns.forEach(function(item){item.classList.remove('ng-hide');item.classList.add('ng-show')});

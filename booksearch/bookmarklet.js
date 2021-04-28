(function(){
	var names = document.querySelectorAll(".item-show .title a");
	// var url3 = "http://www.duokan.com/search/{keyword}/1";
	var url4 = 'https://www.amazon.cn/s?k=';
	var url5 = 'https://blah.me/search?q=';
	for(var i=0;i<14;i++){
		var keyword = names[i].innerText;
		console.log(keyword);
			// keyword = keyword.split("，")[0].split(" ")[0];
		// window.open(url1 + keyword);
		window.open(url4 + keyword);
		window.open(url5 + keyword);
		// window.open(url3.replace('{keyword}',keyword));
	}

	function u(name){
		console.log(name)
		setTimeout(function(){
			window.open('https://www.amazon.cn/s?k=' + name)
		}, 10);
	}
})();

(function(){
	//https://my.clippings.io/#/
	var btns = document.getElementsByTagName("button");
	for(var i=0;i<btns.length;i++){
	    if(btns[i].getAttribute('ng-click') == 'DeleteBook(book)'){
	        btns[i].click();
	    }
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

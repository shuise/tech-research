(function(){
	$(".js_tabcge").each(function(){
		var obj = this;
		var tabs = $(".tabs li",obj);
		var panels = $(".panel",obj);
		var tabswitch = new tabSwitch(tabs,panels,"touchend","current");
		//设置滚动标识
		window._scrollFlag = false;
		tabs.bind("touchmove",function(e){
			window._scrollFlag = true;
		});
		tabs.bind("touchend",function(e){
			window._scrollFlag = false;
		});			
	})


	var tabNode = $(".js_tabcge .tabs");
	var touchflag = false;
	var x0 = 0, x1 = 0, x2 = 0;
	tabNode.bind("touchstart",function(e){
		touchflag = true;
		x0 = e.originalEvent.pageX;
	}).bind("touchmove",function(e){
		if(touchflag){
			var scrollbody = $("ul",this);
			x1 = e.originalEvent.pageX;
			if(x1-x0 <0){
				tabNode[0].scrollLeft++;
			}else if(x1-x0 >0){
				tabNode[0].scrollLeft--;
				// x2 = x0++;
			}

			// scrollbody.css({"-webkit-transition":.5+"s","transition":.5+"s","-webkit-transform":"translate3d("+x2+"px, 0, 0)"});
		}
	}).bind("touchend",function(e){
		touchflag = false;
	})
})();
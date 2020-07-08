function tabSwitch(tabs,panels,mevent,curClass){
	var curIndex = 0, 
		preIndex = 0,
		tabs_len = tabs.length;

	init();

	function init(){
		curIndex = getCurIndex();

		tabs.bind(mevent,function(e){
			if($(this).hasClass(curClass)||window._scrollFlag==true){
				return;
			}
			preIndex = curIndex;
			$(this).addClass(curClass);
			$(tabs[preIndex]).removeClass(curClass);
			curIndex = getCurIndex();
			$(panels[curIndex]).addClass(curClass);
			$(panels[preIndex]).removeClass(curClass);
		});
	}

	function getCurIndex(){
		for(var i = 0 ; i < tabs_len; i++){
			if($(tabs[i]).hasClass(curClass)){
				curIndex = i;
				return curIndex;
			}
		}
	}
	
}
NE = window.NE ||{};
NE.scrolls = function(option,direct){
	var obj = {
		'list' : option['list'],
		'prev' : option['prev'],
		'next' : option['next']
	}	
	var cont = {
		'slide' : option['slide'] || 300,
		'stay' : option['stay'] || 1000,
		'isAuto' : option['isAuto'] || false
	} 
	var direct = direct || 'vertical';
	var cName =  option['cName'] || {};
		cName = {
			'prev' : cName['prev'] || 'btn_prev',
			'prev_gray' : cName['prev_gray'] || 'btn_prev_gray',
			'next' : cName['next'] || 'btn_next',
			'next_gray' : cName['next_gray'] || 'btn_next_gray'		
		}
	var prev,next;
	if(direct == 'vertical'){
		prev = 'top';
		next = 'down';
	}else{
		prev = 'left';
		next = 'right';
	}
	var as,_hc,_hs,_wc,_ws;
	
	checkBtn();
	checkPos();
	
	if(cont['isAuto']){autoStart();}
	
	obj['prev'].onclick = function(){
		clearInterval(as);
		if(hasClass(this,cName['prev_gray'])){return false;}
		slide(obj['list'],prev,cont['slide']);
	}
	obj['next'].onclick = function(){
		clearInterval(as);
		if(hasClass(this,cName['next_gray'])){return false;}
		slide(obj['list'],next,cont['slide']);
	}
	
	function checkBtn(){
		_hc = obj['list'].clientHeight;
		_hs = obj['list'].scrollHeight;
		_wc = obj['list'].clientWidth;
		_ws = obj['list'].scrollWidth;
		if(direct == 'vertical'){
			if(_hc == _hs){
				hide(obj['prev']);
				hide(obj['next']);
			}
		}else if(_wc == _ws){
			hide(obj['prev']);
			hide(obj['next']);
		}		
	}
	function autoStart(){
		setTimeout(function(){
			as = setInterval(function(){slide(obj['list'],next,cont['slide']);},cont['stay']);
		},cont['stay']);
	}
	function slide(_obj,_direct,_time){
		var _slide = _obj.clientWidth;
		if(direct == 'vertical'){
			_slide = _obj.clientHeight;
		}
		var _slideWidth = _slide/_time;
		var _t = _time/_slide;
		var _pct = 0;
		var _pb;
		
		if(direct == 'vertical'){
			_pb = setInterval(function(){
				sliding(1);
			},_t);	
		}else{
			_pb = setInterval(function(){
				sliding(_slideWidth);
			},1);
		}
		
		function sliding(perWidth){
			if (_direct == "left"){
				_obj.scrollLeft -= perWidth;
			}else if(_direct == "right"){
				_obj.scrollLeft += perWidth;
			}else if(_direct == "down"){
				_obj.scrollTop += perWidth;
			}else{
				_obj.scrollTop -= perWidth;
			}
			_pct += perWidth;
			if (_pct >= _slide){
				clearInterval(_pb);
				checkPos();
			}
		}
	}
	function checkPos(){
		if(direct == 'vertical'){
			if(obj['list'].scrollTop == 0){
				addClass(obj['prev'],cName['prev_gray']);
				removeClass(obj['next'],cName['next_gray']);
			}else if(obj['list'].scrollTop >= _hs-_hc){
				removeClass(obj['prev'],cName['prev_gray']);
				addClass(obj['next'],cName['next_gray']);
				clearInterval(as);		
			}else{
				removeClass(obj['prev'],cName['prev_gray']);
				removeClass(obj['next'],cName['next_gray']);
			}
		}else{
			if(obj['list'].scrollLeft == 0){
				addClass(obj['prev'],cName['prev_gray']);
				removeClass(obj['next'],cName['next_gray']);
			}else if(obj['list'].scrollLeft >= (_ws-_wc)){
				removeClass(obj['prev'],cName['prev_gray']);
				addClass(obj['next'],cName['next_gray']);
				clearInterval(as);		
			}else{
				removeClass(obj['prev'],cName['prev_gray']);
				removeClass(obj['next'],cName['next_gray']);
			}	
		}
	}	
	
	function hasClass(node,cls){
		return (" " + node.className + " ").indexOf(" " + cls + " "," ") > -1;
	}
	function addClass(node,cls){
		if(!hasClass(node,cls)) node.className +=  " " + cls;
	}
	function removeClass(node,cls){
		node.className = (" " + node.className + " ").replace(" " + cls + " "," ");
	}	
	function hide(node){
		node.style.display = "none";
	}
	function show(node){
		node.style.display = "block";
	}
}
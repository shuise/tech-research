function carRelations(obj,data,params,times,temp){
	var tempPaddding = {
		arc : '<div class="cars_item_wrapper"></div><div class="car_canvas_wrapper"><canvas class="car_canvas"></canvas></div>',
		cars : ['<div class="cars_item cars_item_{type}" _re_type="{re_type}">',
				 '	<img src="{thumb}" class="cars_item_thumb">',
				 '	<span class="cars_item_name">{name}</span>',
				 '	<div class="cars_item_detail">{cars_pop}</div>',
				 '</div>'].join(''),
		cars_pop : '<a href="{link}">{text}</a>'		 
		};	
	var paramsPaddding = {
		x : 400,
		y : 250
		};
	var timesPadding = {
		radiation : 100,
		scale : 200,
		slideUp	: 100
		};
	var dataPadding = {
		main : {},
		relations : [],
		colors : []
		};	
	var times = HE.copy((times || {}),timesPadding);
	if(HE.browser().indexOf('chrome/')>-1){
		HE.array.forEach(times,function(item,key){
			times[key] = item*2;
		}) 
	}
	this.times = times;	
	this.data = data;
	this.obj = obj;
	this.temp = HE.copy((temp || {}),tempPaddding);
	this.params = HE.copy((params || {}),paramsPaddding);
	this.times = times;
	this.classes = {
		obj : 'cars_relations'
	};
}
carRelations.prototype.getObjs = function(){
	return {
		main : HE.$('div.cars_item_main',this.obj)[0],
		wrapper : HE.$('div.cars_item_wrapper',this.obj)[0],
		relations : HE.$('div.cars_item_relations',this.obj),
		canvas : HE.$('canvas.car_canvas',this.obj)[0],
		canvasWrapper : HE.$('div.car_canvas_wrapper',this.obj)[0]
	};
}
carRelations.prototype.createUI = function(){
	var obj = this.obj;
	var temp = this.temp;
		obj.innerHTML = this.temp.arc;
	var data = this.data;
		data.main.type = 'main';
		HE.array.forEach(data.relations,function(item){
			item.type = 'relations';
			item.cars_pop = HE.substitute(temp.cars_pop,item.cars_pop);
		});
	var objs = this.getObjs();	
		objs.wrapper.innerHTML = HE.substitute(temp.cars,data.main) +  HE.substitute(temp.cars,data.relations);
	this.drawLine(objs.canvas);	
}	
carRelations.prototype.getPosition = function(index,len,params){
	var mX = 1,mY = 1;
	var coef = 1;
	var deg = index/len;
	if(0 <= deg && deg <= 0.25){
		mX = 1;
		mY = 1;
	}else if(0.25 < deg && deg < 0.5){
		mX = -1;
		mY = 1;
	}else if(0.5 < deg && deg < 0.75){
		mX = -1;
		mY = -1;
	}else if(0.75 < deg && deg < 1){
		mX = 1;
		mY = -1;
	}
	var a = params.x,b = params.y;
	var d = 2*Math.PI*index/len;
	//var coef = Math.abs(Math.cos(0.7*d))*1.0;
	//	d = coef*d;
	var x = a/Math.sqrt(Math.pow(Math.tan(d)*a/b,2)+1);
	var y = Math.abs(Math.tan(d)*x);

	return {
		left : Math.floor(x)*mX,
		top : Math.floor(y)*mY
	};
}
carRelations.prototype.drawLine = function(canvas){
	var _this = this;
	var params = _this.params;
	var relations = _this.getObjs().relations;
	var canvasWrapper = _this.getObjs().canvasWrapper;
	var len = relations.length;
	var time = _this.times.radiation;
	var colors = _this.data.colors;
		canvas.height = parseInt(_this.obj.style.height);
		canvas.width = parseInt(_this.obj.style.width);
		canvas.style.height = _this.obj.style.height;
		canvas.style.width = _this.obj.style.width;
	
		canvasWrapper.style.width = "0";
		canvasWrapper.style.height = "0";
		canvasWrapper.style.overflow = "hidden";
		canvasWrapper.style.position = "absolute";
		canvasWrapper.style.top = params.y + 'px';
		canvasWrapper.style.left = params.x + 'px';
		
	var pt = 0;
	var dt = setInterval(function(){
		var step = params.y/time;
		var slope = params.x/params.y;
		canvasWrapper.style.width = step*2*pt*slope + 'px';
		canvasWrapper.style.height = step*pt*2 + 'px';
		canvasWrapper.style.top = params.y - step*pt + 'px';
		canvasWrapper.style.left = params.x - step*pt*slope + 'px';
		pt += 1;
		if(pt >= time){
			clearInterval(dt);
		}
	},1);
	
	if(HE.browser().indexOf('msie')>-1 && HE.browser() != 'msie/9.0'){
		canvas = window.G_vmlCanvasManager.initElement(canvas);
	}
	var context = canvas.getContext('2d');
		context.translate(params.x, params.y); 
		context.lineWidth = 3;
	for(var i=0;i<len;i++){
		var pos = _this.getPosition(i,len,params);
		var re_type = HE.getProp(relations[i],'_re_type');
		
		var color = colors[re_type] || '#cd0000';
		context.beginPath();
		context.moveTo(0, 0); 
		context.lineTo(pos.left, pos.top);
		context.strokeStyle = color; 
		context.stroke();
		context.closePath();	
	}
}
carRelations.prototype.animaLoad = function(){
	var params = this.params;
	var relations = this.getObjs().relations;
	var len = relations.length;
	var _this = this;
	HE.array.forEach(relations,function(item,index){
		var pos = _this.getPosition(index,len,params);
		_this.animaOffset(item,pos,_this.times.radiation);
	});
}
carRelations.prototype.animaOffset = function(node,pos,time){
	var timer = 0,step = {},diff = {}, slope, t,top1,left1,top2,left2,coef = {};
	var str = "atrue";
	top1 = parseInt(node.style.left) || 0;
	left1 = parseInt(node.style.left) || 0;
	top2 = pos.top;
	left2 = pos.left;
	
	diff.top = Math.abs(top2 - top1);
	diff.left = Math.abs(left2 - left1);
	
	coef.top = str.indexOf((top2 > top1) + '');
	coef.left = str.indexOf((left2 > left1) + '');
	
	if(diff.top == 0 && diff.left == 0){
		return false;
	}
	if(diff.top == 0){
		step.top = 0;
		if(time > diff.left){
			step.time = time/diff.left;
			step.left = 1;
		}else{
			step.time = 1;
			step.left = diff.left/time;
		}
	}
	if(diff.left == 0){
		step.left = 0;
		if(time > diff.top){
			step.time = time/diff.top;
			step.top = 1;
		}else{
			step.time = 1;
			step.top = diff.top/time;
		}
	}
	if(diff.top > 0 && diff.left > 0){
		if(diff.top > diff.left){
			slope = diff.top/diff.left;
			if(time > diff.left){
				step.time = time/diff.left;
				step.left = 1;
			}else{
				step.time = 1;
				step.left = diff.left/time;
			}
			step.top = slope*step.left;
		}else{
			slope = diff.left/diff.top;
			if(time > diff.top){
				step.time = time/diff.top;
				step.top = 1;
			}else{
				step.time = 1;
				step.top = diff.top/time;
			}
			step.left = slope*step.top;
		}
	}
	
	t = setInterval(function(){
		top1 += step.top*coef.top;
		left1 += step.left*coef.left;
		timer += step.time;
		node.style.top = top1 + 'px';
		node.style.left = left1 + 'px';
		if(timer >= time){
			clearInterval(t);
			node.style.top = top2 + 'px';
			node.style.left = left2 + 'px';
		}
	},step.time);
	
	/*
	var time = time/1000 + 's';
		node.style.left = left2 + 'px';
		node.style.top = top2 + 'px';
		node.style['-webkit-transition-property'] = 'left top';
		node.style['-webkit-transition-duration'] = time;
		node.style['-webkit-transition-timing-function'] = 'ease-out';
	*/	
}
carRelations.prototype.animaHover = function(){
	var objs = this.getObjs();
	var relations = objs.relations;
	var time = this.times.slideUp;

	HE.array.forEach(relations,function(item){
		var pop = HE.$('div.cars_item_detail',item)[0];
		var mTop = parseInt(HE.getStyle(pop,'marginTop'));
		item.onmouseover = function(){
			if(HE.getProp(this,'_is_hovered') == 'yes'){
				return false;
			}
			HE.setProp(this,'_is_hovered','yes');
			var pt = 0;
			var step = mTop/time;
			var t = setInterval(function(){
				pt += 1;
				pop.style.marginTop = mTop - step*pt + 'px';
				if(pt >= time){
					clearInterval(t);
				}
			},1);
		}
	});
}
carRelations.prototype.setWrapperSize = function(){
	HE.addClass(this.obj,this.classes.obj);
	this.obj.style.position = 'relative';
	this.obj.style.width = this.params.x * 2 + 'px';
	this.obj.style.height = this.params.y * 2 + 'px';
}
carRelations.prototype.init = function(){
	this.setWrapperSize();
	this.createUI();
	this.animaLoad();
	this.animaHover();
}
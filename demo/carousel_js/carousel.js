"use strict";
function main(){
	
}

function Carousel(dom, _option){
	var $dom;
	var $itemList;
	var $$itemList;
	var itemNum;
	var curIndex;
	var ready;

	var option = _option || {};
	var gap;
	var cycle; //0为不循环;1为向前跳回第一张;2为循环且连续
	var period;	//动画时间
	var wait; //动画播放过程中按钮失效
	var offset; //left偏移

	var init = function(){
		$dom = $(dom);
		$itemList = $dom.children('.carousel-line').children();
		itemNum = $itemList.length;
		$$itemList = new Array(itemNum);
		for (var i = 0; i < itemNum; i++) {
			$$itemList[i] = $($itemList[i]);
		};

		ready = true;

		curIndex = option.start || 0;
		gap = option.gap !== undefined ? option.gap : 100;
		cycle = option.cycle || 0;
		period = option.period !== undefined ? option.period : 500;
		wait = option.wait || false;
		offset = option.offset !== undefined ? option.offset : ($dom.width() - gap) / 2;

		$dom.children('.carousel-control.left').unbind('click').click(prev)
		.end().children('.carousel-control.right').unbind('click').click(next);
	}
	
	//跳转到某一页direction,1为next,2为prex
	var slideTo = function(index, direction, _period){
		if(!ready) return;
		
		index = index%itemNum || 0;
		_period !== undefined ? _period : period;
		$itemList.stop(true,false);
		
		if(cycle == 2){
			if(direction == 1){
				var resetIndex = (index+parseInt(itemNum/2)) % itemNum;  //循环移动的页
				$$itemList[resetIndex].css('left', parseFloat($$itemList[resetIndex].css('left'))+(gap*itemNum)+'px');
			}else if(direction == 2){
				var resetIndex = (index+parseInt(itemNum/2) + 1) % itemNum;  //循环移动的页
				$$itemList[resetIndex].css('left', parseFloat($$itemList[resetIndex].css('left'))-(gap*(itemNum))+"px");
			}
		}

		var leftList = calcLeft(index,itemNum);
		if(wait){ //动画过程中阻塞
			ready = false;
			$$itemList[0].animate({left:offset + leftList[0]+"px"},_period,function(){
				ready = true;
			});
			for (var i = 1; i < itemNum; i++) {
				$$itemList[i].animate({left:offset + leftList[i]+"px"},_period);
			};
		}else{ //不阻塞
			for (var i = 0; i < itemNum; i++) {
				$$itemList[i].animate({left:offset + leftList[i]+"px"},_period);
			};
		}

		$itemList.removeClass('active');
		$$itemList[index].addClass('active');
		
		curIndex = index;
	}

	//根据index和length计算位置
	var calcLeft = function (index, length){
		var leftList = new Array(length);

		if(cycle != 2){  //普通状态下计算位置
			for (var i = 0; i < length; i++) {
				leftList[i] = (i - index) * gap;
			};
		}else{  //循环状态下计算位置
			var indexStart = (index+parseInt(length/2)+1) % length; //起始的图片index
			var leftStart = parseInt((length -1) / 2);	//起始的偏移量
			for (var i = 0; i < length; i++) {
				leftList[(i+indexStart)%length] = (i-leftStart) * gap;
			};
		}
		return leftList
	}

	//跳转到下一页
	var prev = function(){
		var index = 0;
		if(curIndex == 0){
			if(cycle == 0){
				return;
			}else{
				index = itemNum - 1;
			}
		}else{
			index = curIndex - 1;
		}
		slideTo(index, 2);
	}

	//跳转到上一页
	var next = function(){
		var index = 0;
		if(curIndex == itemNum - 1){
			if(cycle == 0){
				return;
			}else{
				index = 0;
			}
		}else{
			index = curIndex + 1;
		}
		slideTo(index,1);
	}


	init();
	return {
		slideTo: slideTo,
		prev: prev,
		next: next
	};
}

/*
 * jquery.dragdrop-1.1.js - 拖拽布局，支持排序
 * Need : jquery.drag.js
 * By Jacky.Wei
*/
;(function($){
	
	if(typeof($.fn.dragdrop) != "undefined"){
		return;
	};
	
	if(typeof($.fn.drag) == "undefined"){
		return;
	};
	

	var getposx = function(el){
		var ret = 0;
		while(el !== null){
			ret += el.offsetLeft;
			el = el.offsetParent;
		};
		return  ret;
	},
	getposy = function(el){
		var ret = 0;
		while(el !== null){
			ret += el.offsetTop;
			el = el.offsetParent;
		};
		return  ret;
	},
	ce = function(tag){
        return document.createElement(tag);
	},
	ie6 = (function(ua){
		return /msie 6/.test(ua);
	})(navigator.userAgent.toLowerCase());
	
	//数组升序
	function array_sort_asc(list){
		return list.sort(function(a, b){
			return a.left - b.left;	
		});
	};
	
 	
	function bug(text){
		$("#bug").text(text);
	};

	var geteleposx = function(ele){
		var ret = 0;
		while(ele !== null){
			ret += ele.offsetLeft;
			ele = ele.offsetParent;
		};
		return ret;
	},
	geteleposy = function(ele){
		var ret = 0;
		while(ele !== null){
			ret += ele.offsetTop;
			ele = ele.offsetParent;
		};
		return ret;
	},
	getopacitynode = function(ele){
		var node = ce("div");
		$(node).attr({id : "opacitynode"});
		var _nodeheight = ie6 ? ele.offsetHeight - 2 : ele.offsetHeight;  
		$(node).css({height : ele.offsetHeight +"px",lineHeight : ele.offsetHeight+"px"});
		return node;
	};

	$.fn.dragdrop = function(options){
		var set = $.extend({
			//设置该列内可以拖拽的dom选择器
			connectWith : ".box-item",
			onLayoutUpdated : function(layout_list){

			}		
		}, options);
		
		//拖拽对象列表
		var items = [];
		//将每一列的left, top坐标和id属性放入数组
		var colums_postion = [];
		
		//遍历所有列，更新 items, colums_postion_left, colums_postion_top三个变量
		this.each(function(){
			$(this).find(set.connectWith).each(function(){
				items.push(this);	
				//$(this).css({left : geteleposx(this) + "px", top : geteleposy(this) + "px"});
			});
			$(this).find(".pos").text(getposx(this));
			var postion_item = {};
			postion_item.left = getposx(this);
			postion_item.top = getposy(this);
			postion_item.columnId = $(this).attr("id");
			colums_postion.push(postion_item);
		});
		
		//升序排列
		colums_postion = array_sort_asc(colums_postion);
		
		function getColumnIdOnDragging(dragObj){
			var id = null;
			var drag_left = getposx(dragObj);
			var i = 0, l = colums_postion.length;
			for(; i < l; i++){
				var _item = colums_postion[i]; 
				var column = $("#" + colums_postion[i].columnId);
				var column_width = column[0].offsetWidth;
				var column_left = colums_postion[i].left;
				var left1 = drag_left + (dragObj.offsetWidth / 2);
				if(left1 >= column_left){
					id = colums_postion[i].columnId;
				};
			};
			return id;
		};
		
		function getConnectItemByDrag(dragObj, items){
			var target = null;
			var drag_top = geteleposy(dragObj);
			var drag_height = dragObj.offsetHeight;
			var top = drag_top + (drag_height / 2);
			var _items = [];
			
			items.each(function(){
				_items.push(this);
			});
			
			for(var i = 0, l = _items.length; i < l; i++){
				var _item = _items[i];
				var item_top = geteleposy(_item);
				if(drag_top >= item_top && _item !== dragObj){
					target = _item;
				};
			};
			
			return target;
		};
		
		function getLayoutList(){
			var layout = [];
			$.each(colums_postion, function(){
				var column = $("#" + this.columnId);
				var tempLayoutItem = [];
				column.find(set.connectWith).each(function(){
					tempLayoutItem.push($(this).attr("mod"));
				});
				layout.push(tempLayoutItem.join(","));
			});
			layout = layout.join("|");
			return layout;
		};
		//console.log(getLayoutList());
		 
		var pos = {x : 0, y : 0};
		var flag = true;
		var currentDrag = null;
		$(items).drag({
			handle : ".mod_tt",
			beforedrag : function(pos,self){
				currentDrag = self;
				flag = false;
				$("#opacitynode").remove();
				var ele = self[0];
				//bug(getposx(ele));
				pos.x = geteleposx(ele) + 10;
				pos.y = geteleposy(ele);
				self.before(getopacitynode(ele)).css({position : "absolute", left : pos.x  + "px", top : pos.y + "px"});
			},
			ondraging : function(pos,self){
				var ele = self[0];
				var id = getColumnIdOnDragging(ele);
				if(id == null){
					id = colums_postion[0].columnId;
				};
				var items = $("#" + id).find(set.connectWith);
				
				var targetNode = getConnectItemByDrag(ele, items);
				if(targetNode != null){
					//bug(id + "," + getposy(targetNode) + "," + (targetNode === ele) );
					if(targetNode !== ele){
						var $target = $(targetNode);
						$("#opacitynode").remove();
						$target.after(getopacitynode(targetNode));	
					};
				}else{
					 
					$("#opacitynode").remove();
					$("#" + id).prepend(getopacitynode(ele));
				};
			},
			enddrag : function(pos,self){
				var ele = self[0];
				var opacity = $("#opacitynode");
				self.css({position : ""});
				var _cache = document.createDocumentFragment();
				_cache.appendChild(ele);
				opacity.before(_cache);
				_cache = null;
				opacity.hide();
				flag = true;
				 
			},
			unselectClass : "unselect",
			xdrag : true,//容器left是否改变
			ydrag : true//容器top是否改变	
		}).find(".mod_tt").css({
				cursor : "move"	
		});
			
		$(document).mouseup(function(e){
			setTimeout(function(){
				if(!flag){
					$("#opacitynode").hide();
					currentDrag.css({position : ""});
					flag = true;
				};
				set.onLayoutUpdated(getLayoutList());
			}, 100);
		});
			
	 
		set.onLayoutUpdated(getLayoutList());
		return this;
	};
})(jQuery);
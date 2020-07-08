(function(){
var elem,
draginit,
drag,
dragend,
enable,
dragElems,
dropElems,
dropstart,
drop,
dropend,
moving;

/**
 * 使DOM元素可拖拽
 * @global
 * @class
 * @param {object} arg
 *
 * @requires getData
 * @requires addEvent
 * @requires removeEvent
 */
function Drag(arg) {
	elem = arg.elem;
	draginit = arg.draginit || noop;
	drag = arg.drag || noop;
	dragend = arg.dragend || noop;
	dropElems = arg.dropTarget;
	dropstart = arg.dropstart || noop;
	drop = arg.drop || noop;
	dropend = arg.dropend || noop;

	var a = elem.length ? elem : [elem];
	for(var i = 0, length = a.length; i < length; i++) {
		addEvent(a[i], "mousedown", downHandle);
	}
	addEvent(document, "mousemove", moveHandle);
	addEvent(document, "mouseup", upHandle);
};

Drag.prototype.destroy = function() {
	var a = elem.length ? elem : [elem];
	for(var i = 0, length = a.length; i < length; i++) {
		removeEvent(a[i], "mousedown", downHandle);
	}
	removeEvent(document, "mousemove", moveHandle);
	removeEvent(document, "mouseup", upHandle);
}

function downHandle(e) {
	if(0 != e.button) {
		enable = false;
		return;
	}
	getData(this).dd = {};
	dragElems = draginit.call(this, e, getData(this).dd);
	if(false !== dragElems) {
		var a = [];
		each(dragElems, function(item){
			a.push(item);
		});
		dragElems = a.length > 0 ? a : [this];
		each(dragElems, function(elem){
			var data = getData(elem),
			pos = getPosition(elem);

			/**
			 * @mixin drag_dd
			 * @property {int} startX - mousedown触发时，鼠标相对于文档的x坐标
			 * @property {int} startY - mousedown触发时，鼠标相对于文档的y坐标
			 * @property {int} deltaX - 相对于startX移动的水平距离
			 * @property {int} deltaY - 相对于startY移动的垂直距离
			 * @property {int} left - 拖拽元素相对父元素的水平偏移
			 * @property {int} top - 拖拽元素相对父元素的垂直偏移
			 * @property {array} drag - 可拖拽的元素
			 * @property {array} drop - 可放置的元素
			 */
			data.dd = data.dd || {};
			data.dd.startX = e.pageX;
			data.dd.startY = e.pageY;
			data.dd.deltaX = 0;
			data.dd.deltaY = 0;
			data.dd.left = pos.left;
			data.dd.top = pos.top;
			data.dd.drag = dragElems;
			data.dd.drop = dropElems;
		});
		enable = true;
	} else {
		enable = false;
	}
}

function moveHandle(e){
	if(!enable) return;
	moving = true;
	window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
	
	each(dragElems, function(elem){
		var dd = getData(elem).dd;
		dd.deltaX = e.pageX - dd.startX;
		dd.deltaY = e.pageY - dd.startY;
		var ret = drag.call(elem, e, dd);
		if(false === ret) {
			enable = false;
			return false;
		}
	});

	if(undefined === moveHandle.time || (new Date).getTime() > moveHandle.time + 50) {
		moveHandle.time = (new Date).getTime();
		if(false === hover(e)) {
			enable = false;
		}
	}
}

function hover(e) {
	var ret;
	each(dropElems, function(drop){
		each(dragElems, function(drag){
			var dd = getData(drag);
			if(isOverlap(drag, drop)) {
				getData(drop).active = true;
				ret = dropstart.call(drop, e, dd);
				return false;
			} else {
				if(true === getData(drop).active) {
					delete getData(drop).active;
					dropend.call(drop, e, dd);
				}
			}
		});
		return ret;
	});
	return ret;
}

/**
 * 拖拽元素有重叠吗
 */
function isOverlap(dragElem, dropElem) {
	var drag = getOffset(dragElem),
		drop = getOffset(dropElem);
	return !(drag.left + drag.width < drop.left ||
			 drop.left + drop.width < drag.left ||
			 drag.top + drag.height < drop.top ||
			 drop.top + drop.height < drag.top);
}

function upHandle(e){
	if(!enable) return;

	each(dragElems, function(elem){
		var dd = getData(elem).dd;
		dragend.call(elem, e, dd);
		delete getData(elem).dd;
	});

	moving && each(dropElems, function(elem){
		if(getData(elem).active) {
			drop.call(elem, e);
			dropend.call(elem, e);
		}
	});
	moving = enable = false;
}

function noop() {}

function getPosition(elem) {
	var style;
	if(window.getComputedStyle) {
		style = window.getComputedStyle(elem);
	} else if(elem.currentStyle) {
		style = elem.currentStyle;
	}
	var left = parseInt(style.left),
	top = parseInt(style.top);
	return {
		left: isNaN(left) ? 0 : left,
		top: isNaN(top) ? 0 : top
	}
}

function getOffset(elem) {
	var width = parseInt(elem.offsetWidth),
	height = parseInt(elem.offsetHeight),
	left = parseInt(elem.offsetLeft),
	top = parseInt(elem.offsetTop);

	while(elem = elem.offsetParent) {
		var l = parseInt(elem.offsetLeft),
		t = parseInt(elem.offsetTop);
		l = isNaN(l) ? 0 : l;
		t = isNaN(t) ? 0 : t;
		left += l;
		top += t;
	}

	return {
		width: isNaN(width) ? 0 : width,
		height: isNaN(height) ? 0 : height,
		left: isNaN(left) ? 0 : left,
		top: isNaN(top) ? 0 : top
	}
}

function each(elem, fn) {
	if(!elem) return;
	var a = isNaN(elem.length) ? [elem] : elem;
	for(var i = 0, length = a.length; i < length; i++) {
		var ret = fn.call(a[i], a[i], i, a);
		if(false === ret) break;
	}
}

this.Drag = Drag;

/**
 * drag函数的唯一参数
 * @mixin object
 * @property {HTMLElement[]} elem - 要drag的DOM对象
 * @property {cb} draginit - mousedown事件触发时被执行，如果返回false则取消drag操作，如果返回数组即要drag这些元素
 * @property {cb} drag - mousemove事件触发时被执行，如果返回false则取消drag操作，依次在每个drag元素上执行该方法
 * @property {cb} dragend - mouseup事件触发时被执行，依次在每个拖拽元素上执行该方法
 * @property {HTMLElement[]} dropTarget - 要drop的DOM元素
 * @property {cb} dropstart - drag元素进入drop元素时被执行，如果返回false则取消drop操作，依次在每个满足条件的drop元素上执行该方法
 * @prpperty {cb} drop - 在drop元素上释放drag元素时被执行，如果返回false则取消drop操作，依次在每个满足条件的drop元素上执行该方法
 * @property {cb} dropend - drag元素离开drop元素时被执行，依次在每个满足条件的drop元素上执行该方法
 */

/**
 * @callback cb
 * @param {event} e - event对象
 * @param {drag_dd} dd - 与拖拽相关的属性集
 */
})();
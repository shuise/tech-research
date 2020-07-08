function selectMock(node,params){
	var temp = params.temp || {};
		temp.header = temp.header || '<div class="c_select_arr"><input value="{text}" _value="{value}" readonly><span></span></div><ul>';
		temp.repeater = temp.repeater || '<li lang="{value}" class="{selected}" _index="{index}">{text}</li>';
		temp.footer = temp.footer || '</ul>';

	_params = params || {};
	_params.temp = temp;
	_params.widthDiff = parseInt(_params.widthDiff || 3);
	_params.maxHeight = parseInt(_params.maxHeight || 200);
	_params.classes = _params.classes || {};
	_params.classes.wrapperOpen = _params.classes.wrapperOpen || "c_select_mock_open";
	_params.classes.wrapper = _params.classes.wrapper || "c_select_mock";
	_params.classes.selected = _params.classes.selected || "selected";
	this.params = _params;
	this.node = node;
}

selectMock.prototype.getNodes = function(_select){
	this.selectMock = _select;
	this.selectedNode = _select.getElementsByTagName('input')[0];
	this.selectList = _select.getElementsByTagName('ul')[0];
	this.selectItems = _select.getElementsByTagName('li');
}

selectMock.prototype.getData = function(){
	var options = this.node.options;
	var selectedClass = this.params.classes.selected;
	var optionData = [], index = 0, selected = "";
	for(var i = 0, l = options.length; i < l; i++){
		if(options[i].selected){
			index = i;
			selected = selectedClass;
		}else{
			selected = "";
		}
		optionData.push({value:options[i].value, text:options[i].text, selected : selected, index : i});
	} 
	this.index = index;
	return optionData; 	
}

selectMock.prototype.createUI = function(){
	var temp = this.params.temp;
	var optionData = this.getData();
	var index = this.index || 0;
	var html = [];
		html.push(substitute(temp.header,optionData[index]));
		html.push(substitute(temp.repeater, optionData));
		html.push(temp.footer);
	return html.join('');
}

selectMock.prototype.insertWrapper = function(){
	var node = this.node;
	var params = this.params;
	var classes = params.classes;
	var widthDiff = params.widthDiff;
	var maxHeight = params.maxHeight;
	var nodeHTML = this.createUI();

	var _select = document.createElement("div");
		_select.className = classes.wrapper; 
		_select.style.width = parseInt(node.clientWidth) + widthDiff + "px";
		_select.style.height = parseInt(node.clientHeight) + "px";
		_select.innerHTML = nodeHTML;

	node.parentNode.insertBefore(_select, node);
	node.style.visibility = "hidden";

	this.getNodes(_select);
	this.selectList.style.maxHeight = maxHeight + "px";
}

selectMock.prototype.attach = function(callback){
	var _this = this;
	var selectMock = _this.selectMock;
	var selectedNode = _this.selectedNode;
	var selectItems = _this.selectItems;
	var selectList = _this.selectList;
	var selectedItem = null;

	var index = this.index || 0;
	var classes = this.params.classes;
	var selectedClass = classes.selected;

	selectMock.onclick = function(event){
		stopBubble(event);
		_this.toggle(this);
		event = event || window.event;
		var target = event.target || event.srcElement;
		if(target.tagName.toLowerCase() == 'li'){
			_onSelect(target);
			var index = target.getAttribute("_index") || 0;
			positionFix(index/1);
		}
	}
	
	selectMock.onmousemove = function(event){
		event = event || window.event;
		var target = event.target || event.srcElement;
		if(target.tagName.toLowerCase() == 'li'){
			if(selectedItem){
				selectItems[index].className = "";
				selectedItem.className = "";
			}
			if(target.className.indexOf(selectedClass) == -1){
				target.className += " " + selectedClass;
				selectedItem = target;
			}
		}			
	}
	
	selectedNode.onfocus = function(){
		selectedNode.onkeyup = function(event){
			var len = selectItems.length;
			event = event || window.event;
			var kcode = event.keyCode || event.which;
			selectItems[index].className = "";
			if(kcode == 40){
				index = (index + 1)%len;
				_onSelect(selectItems[index]);
				selectItems[index].className = selectedClass;
				positionFix(index);
			}
			if(kcode == 38){
				if(index == 0){
					index = len - 1;
				}else{
					index -= 1;
				}
				_onSelect(selectItems[index]);
				selectItems[index].className = selectedClass;
				positionFix(index);
			}
		}
	}

	document.body.onclick = function(event){
		event = event || window.event;
		target = event.target || event.srcElement;
        var objP = getObjP(target, classes.wrapper);
        if (!objP) {
			selectMock.className = selectMock.className.replace(" " + classes.wrapperOpen,"");
		}
		
		selectItems[index].className += " " + selectedClass;
		if(selectedItem){
			selectedItem.className = "";
		}
	}

	function positionFix(num){	
		var itemHeight = selectItems[0].clientHeight;
		selectList.scrollTop = itemHeight*num;
	}

	function _onSelect(node){
		_this.setSelectData(node);
		if(callback){
			var data = _this.getSelectedData();
			callback(data);
		}
	}
}
	
selectMock.prototype.toggle = function(node){
	var classes = this.params.classes;
	var selectedNode = this.selectedNode;
	if(node.className.indexOf(classes.wrapperOpen)>-1){
		node.className = node.className.replace(" " + classes.wrapperOpen,"");
	}else{
		node.className += ' ' + classes.wrapperOpen;
		selectedNode.focus();
	}
}

selectMock.prototype.setSelectData = function(node){
	var selectedNode = this.selectedNode;
	selectedNode.value = node.innerHTML;
	selectedNode.setAttribute("_value",node.lang);
}

selectMock.prototype.getSelectedData = function(){
	var selectedNode = this.selectedNode;
	return {
		value : selectedNode.getAttribute('_value'),
		text : selectedNode.value
	}
}

selectMock.prototype.update = function(){
	var _select = this.selectMock;
	var html = this.createUI();
	_select.innerHTML = html;
	this.getNodes(_select);
	var maxHeight = this.params.maxHeight;
	this.selectList.style.maxHeight = maxHeight + "px";	
}

selectMock.prototype.init = function(callback){
	this.insertWrapper();
	this.attach(callback);
}

function substitute(template, data, regexp){
  if(!(Object.prototype.toString.call(data) === "[object Array]")){
    data = [data]
  }
  var ret = [];
  for(var i=0,j=data.length;i<j;i++){
    ret.push(replaceAction(data[i]));
  }
  return ret.join("");
  
  function replaceAction(object){
    return template.replace(regexp || (/\\?\{([^}]+)\}/g), function(match, name){
     if (match.charAt(0) == '\\') return match.slice(1);
     return (object[name] != undefined) ? object[name] : '';
    });
  }
}

function getObjP(obj,_class){
    if(obj == document || obj.tagName.toLowerCase() == 'body'){
        return null;
    }
	var obj = obj.parentNode;
	if ((" " + obj.className + " ").indexOf(" " + _class + " ")>-1){
		return obj;
	}else{
       return getObjP(obj,_class);
	}
}	

function stopBubble(e) {
	if ( e && e.stopPropagation ){
		e.stopPropagation();
	}else{
		window.event.cancelBubble = true;
	}	
}
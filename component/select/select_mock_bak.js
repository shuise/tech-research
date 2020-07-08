function selectMock(node,options){
	var temp = {
		header : '<div class="c_select_arr"><input value="{text}" readonly><span></span></div><ul>',
		repeater : '<li lang="{value}" class="{selected}" _index="{index}">{text}</li>',
		footer : '</ul>'
	};
	var _options = optionsHandler(options);
	var widthDiff = _options.widthDiff; 
	var maxHeight = _options.maxHeight; 
	var classes = _options.classes; 
	var selectMock = null;
	var selectedNode = null;
	var selectedItem = null;
	var selectItems = null;
	var optionData = [];
	var index = 0;
	
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

	function stopBubble(e) {
		if ( e && e.stopPropagation ){
			e.stopPropagation();
		}else{
			window.event.cancelBubble = true;
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

	function optionsHandler(_options){
		_options = _options || {};
		_options.widthDiff = parseInt(_options.widthDiff || 3);
		_options.maxHeight = parseInt(_options.maxHeight || 200);
		_options.classes = _options.classes || {};
		_options.classes.wrapperOpen = _options.classes.wrapperOpen || "c_select_mock_open";
		_options.classes.wrapper = _options.classes.wrapper || "c_select_mock";
		return _options;
	}		
	
	function createUI(_node){
		var options = _node.options;
		var html = [],selected = "";
		for(var i = 0, l = options.length; i < l; i++){
			if(options[i].selected){
				index == i;
				selected = "selected";
			}else{
				selected = "";
			}
			optionData.push({value:options[i].value, text:options[i].text, selected : selected, index : i});
		}   
		html.push(substitute(temp.header, {text:optionData[0].text}));
		html.push(substitute(temp.repeater, optionData));
		html.push(temp.footer);
		return html.join('');
	}
	
	function getNodes(_select){
		selectMock = _select;
		selectedNode = _select.getElementsByTagName('input')[0];
		selectList = _select.getElementsByTagName('ul')[0];
		selectItems = _select.getElementsByTagName('li');
	}

	function insertWrapper(nodeHTML){
		var _select = document.createElement("div");
			_select.className = classes.wrapper; 
			_select.style.width = parseInt(node.clientWidth) + widthDiff + "px";
			_select.style.height = parseInt(node.clientHeight) + "px";
			_select.innerHTML = nodeHTML;

		node.parentNode.insertBefore(_select, node);
		node.style.display = "none";
		getNodes(_select);

		selectList.style.maxHeight = maxHeight + "px";
	}

	function attach(callback){
		selectMock.onclick = function(event){
			stopBubble(event);
			toggle(this);
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
				if(target.className.indexOf("selected") == -1){
					target.className += " selected";
					selectedItem = target;
				}
			}			
		}
		
		selectedNode.onfocus = function(){
			selectedNode.onkeyup = function(event){
				var len = optionData.length;
				event = event || window.event;
				var kcode = event.keyCode || event.which;
				selectItems[index].className = "";
				if(kcode == 40){
					index = (index + 1)%len;
					_onSelect(selectItems[index]);
					selectItems[index].className = "selected";
					positionFix(index);
				}
				if(kcode == 38){
					if(index == 0){
						index = len - 1;
					}else{
						index -= 1;
					}
					_onSelect(selectItems[index]);
					selectItems[index].className = "selected";
					positionFix(index);
				}
			}
		}

		document.onclick = function(event){
			event = event || window.event;
			target = event.target || event.srcElement;
            var objP = getObjP(target, classes.wrapper);
            if (!objP) {
				selectMock.className = selectMock.className.replace(" " + classes.wrapperOpen,"");
			}
			
			selectItems[index].className += " selected";
			if(selectedItem){
				selectedItem.className = "";
			}
		}

		function positionFix(num){
			var itemHeight = selectItems[0].clientHeight;
			selectList.scrollTop = itemHeight*num;
		}

		function _onSelect(_node){
			setSelectData(_node);
			if(callback){
				callback(getSelectedData());
			}
		}
	}
	
	function toggle(_node){
		if(_node.className.indexOf(classes.wrapperOpen)>-1){
			_node.className = _node.className.replace(" " + classes.wrapperOpen,"");
		}else{
			_node.className += ' ' + classes.wrapperOpen;
			selectedNode.focus();
		}
	}

	function setSelectData(_node){
		selectedNode.value = _node.innerHTML;
		selectedNode.lang = _node.lang;
	}

	function getSelectedData(){
		return {
			value : selectedNode.getAttribute('lang'),
			text : selectedNode.value
		}
	}

	function init(callback){
		var html = createUI(node);
		insertWrapper(html);
		attach(callback);
	}

	return {
		temp : temp,
		substitute : substitute,
		createUI : createUI,
		insertWrapper : insertWrapper,
		getNodes : getNodes,
		getSelectedData : getSelectedData,
		setSelectData : setSelectData,
		attach : attach,
		init : init
	}
}


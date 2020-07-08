function validator(_form,config){
	var defaultsPadding = {
		errorClass: "nea_form_warning",
		validClass: "nea_form_valid",
		tipsClass : "nea_form_tips",
		infoElement: "span"
	};

	var messagesPadding = {
		required: "请输入必填项",
		email: "请输入正确的邮箱格式",
		url: "请输入正确的url",
		date: "请输入正确的日期",
		dateISO: "请输入一个合法的(ISO)时间",
		number: "请输入合法的数字",
		digits: "请输入整数",
		creditcard: "请输入合法的信用卡号",
		equalTo: "两次输入不一致，请重新输入",
		accept: "请输入正确后缀的值",
		maxlength: "请输入{1}个字符以下的内容",
		minlength: "请输入{0}个字符以上的内容",
		rangelength: "请输入长度在{0}和{1}之间的内容",
		range: "输入值必须在{0}与{1}之间",
		max: "输入值必须小于等于{1}",
		min: "输入值必须大于等于{0}",
		right : "信息输入正确"
	};

	var methodsPadding = {
		required: function(value, element) {
			return getLength(value,element,_form) > 0;
		},

		minlength: function(value, element) {
			return getLength(trim(value), element,_form) >= element.getAttribute("_minlength")/1;
		},

		maxlength: function(value, element) {
			return getLength(trim(value), element,_form) <= element.getAttribute("_maxlength")/1;
		},

		rangelength: function(value, element) {
			var length = getLength(trim(value), element,_form);
			var param = {
				0 : element.getAttribute("_minlength")/1,
				1 : element.getAttribute("_maxlength")/1
			};
			return ( length >= param[0] && length <= param[1] );
		},

		min: function( value, element) {
			return value >= element.getAttribute("_min")/1;
		},

		max: function( value, element) {
			return value <= element.getAttribute("_max")/1;
		},

		range: function( value, element) {
			var param = {
				0 : element.getAttribute("_min")/1,
				1 : element.getAttribute("_max")/1
			};
			return ( value >= param[0] && value <= param[1] );
		},

		email: function(value, element) {
			return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(value);
		},

		url: function(value, element) {
			return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
		},

		date: function(value, element) {
			return !/Invalid|NaN/.test(new Date(value));
		},

		dateISO: function(value, element) {
			return /^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}$/.test(value);
		},

		number: function(value, element) {
			return /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(value);
		},

		digits: function(value, element) {
			return /^\d+$/.test(value);
		},

		creditcard: function(value, element) {
			if (/[^0-9 -]+/.test(value))
				return false;
			var nCheck = 0,
				nDigit = 0,
				bEven = false;

			value = value.replace(/\D/g, "");

			for (var n = value.length - 1; n >= 0; n--) {
				var cDigit = value.charAt(n);
				var nDigit = parseInt(cDigit, 10);
				if (bEven) {
					if ((nDigit *= 2) > 9)
						nDigit -= 9;
				}
				nCheck += nDigit;
				bEven = !bEven;
			}

			return (nCheck % 10) == 0;
		},

		accept: function(value, element) {
			var param = element.getAttribute("_accept");
				param = param.replace(/,/g, '|');
			return value.match(new RegExp(".(" + param + ")$", "i"));
		},

		equalTo: function(value, element) {
			var _selector = element.getAttribute("_equalTo");
			var target = document.getElementById(_selector);
			return value == target.value;
		}
	};

	var config = config || {};
	var autoCheck = config.autoCheck || false;
	var defaults = config.defaults || {};
	var messages = config.messages || {};
	var methods = config.methods || {};

	this.defaults = copy(defaults,defaultsPadding);
	this.messages = copy(messages,messagesPadding);
	this.methods = copy(methods,methodsPadding);
	this.autoCheck = autoCheck;
	this._form = _form;
	this._submit = false;
}	

validator.prototype.show = function(obj){
	obj = (typeof obj == 'object') ? obj : document.getElementById(obj);
	if(obj) {
		obj.style.display = "inline-block";
	}	
}	
	
validator.prototype.hide = function(obj){
	obj = (typeof obj == 'object') ? obj : document.getElementById(obj);
	if(obj) {
		obj.style.display = "none";
	}
}	

validator.prototype.getTipsNode = function(node){
	var defaults = this.defaults;
	var rel = node.parentNode;
	if(node.type == "checkbox" || node.type == "radio"){
		rel = rel.parentNode; 
	}
	var _tag = defaults.infoElement;
	var	classOK = defaults.tipsClass;
	var	classError = defaults.errorClass;
	var nodeOk = getElsClass(rel,_tag,classOK)[0] || null;
	if(!nodeOk){
		nodeOk = document.createElement(_tag);
		nodeOk.className = classOK;
		rel.appendChild(nodeOk);
	}
	var nodeError = getElsClass(rel,_tag,classError)[0] || null;
	if(!nodeError){
		nodeError = document.createElement(_tag);
		nodeError.className = classError;
		rel.appendChild(nodeError);
	}
	return {
		ok : nodeOk,
		error : nodeError
	}
}

validator.prototype.beforeCheck = function(node){
}

validator.prototype.showError = function(node,info){
	var _this = this;
	var nodes = _this.getTipsNode(node);
	_this.beforeCheck(node);
	_this.hide(nodes.ok);

	var data = {};
		data[0] = node.getAttribute("_minlength") ||  node.getAttribute("_min") || "";
		data[1] = node.getAttribute("_maxlength") ||  node.getAttribute("_max") || "";
	var info = node.getAttribute("_info") || info || "";
		info = info.replace("{0}",data[0]);
		info = info.replace("{1}",data[1]);
	
	_this.show(nodes["error"]);	
	nodes["error"].innerHTML = info;
	// node.parentNode.className += " " + _this.defaults.errorClass;
}

validator.prototype.showRight = function(node){
	var _this = this;
	var nodes = _this.getTipsNode(node);
	var nodeP = node.parentNode;
	var cls = _this.defaults;
	_this.beforeCheck(node);
	_this.hide(nodes["error"]);
	_this.show(nodes.ok);
	nodes.ok.innerHTML = _this.messages.right;
	// nodeP.className = nodeP.className.replace(cls.errorClass,cls.validClass);
}

validator.prototype.hideTips = function(node){
	var _this = this;
	var nodes = _this.getTipsNode(node);
	_this.hide(nodes.ok);
	_this.hide(nodes["error"]);
}

validator.prototype.attach = function(node){	
	var _this = this;
	if(_this.autoCheck){
		var _type = node.type;
		var _tagName = node.tagName.toLowerCase();
		if(_tagName == "select"){
			_type = "select";
		}else if(_tagName == "textarea"){
			_type = "textarea";
		}
		switch(_type){
			case "select":
				node.onchange = _check;
				// break;
			case "checkbox":
			case "radio":
				node.onclick = _check;
				// break;
			case "text":
			case "password":
				node.onkeyup = _check;
				// break;
			default:
				node.onblur = _check;
		}
	}

	if(_this._submit){
		_check();
	}

	function _check(){
		_this.check(node);
	}
}

validator.prototype.check = function(node){
	var _this = this;
	var methods = _this.methods;
	var messages = _this.messages;
	var _required = node.getAttribute("_required") || "";
	var _type = node.getAttribute("_type") || "";
	var _tips = node.getAttribute("_tips") || {};
		_tips = jsonParse(_tips);
		_tips._required = _tips._required || messages.required;
		_tips._type = _tips._type || messages[_type];

	var _valid = isValid();
	if(_valid){
		_this.hideTips(node);
	}
	node.setAttribute("_valid",_valid);

	function isValid(){
		if(_type && methods[_type]){
			if(_required === "true"){
				return checkRequired() && checkType();
			}else if(node.value){
				return checkType();
			}else{
				return true;
			}
		}else if(_required === "true"){
			return checkRequired();
		}else{
			return true;
		}
	}

	function checkRequired(){
		var flag = methods.required(node.value,node);
		if(flag){
			_this.showRight(node);
		}else{
			_this.showError(node,_tips._required);
		}
		return flag;
	}

	function checkType(){
		var flag = methods[_type](node.value,node);	
		if(flag){
			_this.showRight(node);
		}else{
			_this.showError(node,_tips._type);
		}
		return flag;		
	}
}

validator.prototype.checkAll = function(){
	var _this = this;
	var nodes = _this._form.elements;
	var len = nodes.length;
	var isValid = true;
	for(var i = 0;i < len; i++){
		var node = nodes[i];
		_this.attach(node);
		if(node.getAttribute("_valid") == "false" || !node.getAttribute("_valid")){
			isValid = false;
			_this.firstError = node;
		}
	}
	return isValid;
}

validator.prototype._onSubmit = function(){
	var _this = this;
	_this._form.onsubmit = function(){
		_this._submit = true;
		var flag = _this.checkAll(this);
		if(!flag){
			var target = _this.firstError;
			if(!target.id){
				target.id = "nea_form_" + new Date().getTime();
			}
			location.hash = target.id;
		}
		return flag;
	}
}

validator.prototype.init = function(){
	this.checkAll();
	this._onSubmit();
}

function jsonParse(str){
	var ljson;
	if(typeof str == "object"){return str;}
	str = (str != null) ? str.split("\n").join("").split("\r").join("") : "";
	if (/^[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]*$/.test(str.replace(/\\./g, '@').replace(/"[^"\\\n\r]*"/g, ''))) {
		if (str != "") {return eval('(' + str + ')');}
	}
	return {};
}

function getElsClass(obj,tag,_class){
	if(!obj) return [];
	var elements = [];
	if (obj.querySelectorAll) {
		return obj.querySelectorAll(tag + "." + _class);
	};
	var _class = _class ? ' ' + _class + ' ' : '';
	tag = (tag == "") ? "*" : tag;
	var el = obj.getElementsByTagName(tag);
	for(var i=0,len = el.length;i<len;i++){
		if((' ' + el[i].className + ' ').indexOf(_class)>-1) {
			elements.push(el[i]);
		}	
	}	
	return elements;
}

function copy(a, b, isWrite, filter){
	for (var prop in b) 
	if (isWrite || typeof a[prop] === 'undefined' || a[prop] === null) 
		a[prop] = filter ? filter(b[prop]) : b[prop];
	return a;
}

function trim(str){
	return str.replace(/^\s+|\s+$/g,"");
}

function checkable( element ) {
	return /radio|checkbox/i.test(element.type);
}

function getValueByName(name,form) {
	var result = [];
	var nodes = form.getElementsByTagName("input");
	for(var i=0,len=nodes.length;i<len;i++){
		if(nodes[i].name == name && nodes[i].checked){
			result.push(nodes[i].value);
		}
	}
	return result.join(",")
}

function getLength(value, element ,_form) {
	if(checkable( element) ){
		return getValueByName(element.name ,_form).length;
	}else{
		return element.value.length;
	}
}
var HE = {
	browser : function(){
		var UA = navigator.userAgent.toLowerCase();				
		return  (UA.indexOf('msie')>-1) ? UA.split('; ')[1].split(' ').join('/') :
			(UA.indexOf('chrome')>-1) ? ('chrome' + UA.split('chrome')[1]).split(' ')[0] :
			(UA.indexOf('firefox')>-1) ? 'firefox' + UA.split('firefox')[1] :
			(UA.indexOf('safari')>-1) ? 'safari' + UA.split('safari')[1] : 
			(UA.indexOf('opera')>-1) ? UA.split(' ')[0] : UA;
	},
	isMockBros : function(){
		/*
		ie6,7,8,9,chrome,ff,opera
		sougou，360，世界之窗，mathon，qq都已通过，
		tt未通过
		*/
		var mocks = ['maxthon','tencent','qqbrowser',' se '];
		var uaFlag = false;  
		var ua = navigator.userAgent.toLowerCase();
		for(var i=0,len=mocks.length;i<len;i++){
			if(ua.indexOf(mocks[i])>-1){
				uaFlag = true;
				break;
			}
		}
		try{
			var upFlag = typeof navigator.userProfile !== 'undefined';
			var exFlag = typeof(window.external+'') == 'string';
		}catch(ex){
		
		}
		return uaFlag || (upFlag && exFlag);
	},
    $: function(slector,obj){
		var els;
		var a = slector.indexOf("#")>-1 ? "#" + slector.split("#")[slector.split("#").length-1] : slector;
		var b = a.split(" "),len = b.length;
		if((len == 1) && (b[0].indexOf("#")>-1)){
			els = document.getElementById(b[0].split("#")[1]);
		}else{	
			var obj = obj || document;
			var	els = [obj];
			for(var i=0;i<len;i++) els = getEls(els,b[i]);
		}
		return els;
		function getEls(_obj,_slector){
			var _els = [];
			for(var i=0,len = _obj.length;i<len;i++){
				if(_slector.indexOf("#")>-1){
					var objID = document.getElementById(_slector.split("#")[1]);
					if (objID) _els.push(objID);
				}else{
					var el = _slector.indexOf(".")>-1 ? getElsClass(_obj[i],_slector.split(".")[0],_slector.split(".")[1]) : _obj[i].getElementsByTagName(_slector);	
					for(var n=0,L=el.length;n<L;n++) {
						if(HE.array.indexOf(_els,el[n])==-1)
						_els.push(el[n]);
					}
				}
			}
			return _els;
		}
		function getElsClass(_obj,_tag,_class){
			var _els = [];
			var _class = _class ? ' ' + _class + ' ' : '';
			if(!_obj) return _els;
			_tag = (_tag == "") ? "*" : _tag;
			var el = _obj.getElementsByTagName(_tag);
			for(var i=0,len = el.length;i<len;i++){
				if((' ' + el[i].className + ' ').indexOf(_class)>-1) {
					_els.push(el[i]);
				}	
			}	
			return _els;
		}
	},
	objMock : function(obj,objP,tagname,_class){
		var isStr = typeof(obj) == 'string';
		var id = isStr ? obj : HE.guid();
		var obj = isStr ? HE.$('#' + obj) : obj;
		var objP = objP || HE.$('body')[0];
		if(!obj){
			var tagname = tagname || 'div';
			var el = document.createElement(tagname);
			el.className = _class || '';
			el.id = id;
			objP.appendChild(el);
			obj = el;
		}		
		return obj;
	},
	onReady : function(node,callback){
		if(!callback){return false;}
		if (HE.browser().indexOf('msie/')>-1){	
			node.onreadystatechange = function(){
				if(this.readyState == "complete" || this.readyState == "loaded"){
					callback();
				}
			}
		} else {
			node.onload = function(){callback()};
		}
	},
	getProp : function(obj,prop) {return obj[prop] || obj.getAttribute(prop);},
	setProp : function(obj,prop,value) {obj.prop = value;obj.setAttribute(prop,value);},
	removeProp : function(obj,prop) {
		delete obj[prop];
	},
	show : function(obj){obj = (typeof obj == 'object') ? obj : HE.$(obj);if(obj) obj.style.display = "block";},
	hide : function(obj){obj = (typeof obj == 'object') ? obj : HE.$(obj);if(obj) obj.style.display = "none";},
	removeNode : function(obj){
		obj = (typeof obj == 'object') ? obj : HE.$(obj);
		if(obj) obj.parentNode.removeChild(obj);
	},
	hasClass : function(obj,_class){return HE.array.indexOf(obj.className.split(" "),_class)>-1},
	addClass : function(obj,_class) {if(!HE.hasClass(obj,_class)) obj.className +=  " " + _class;},
	removeClass : function(obj,_class) {if(HE.hasClass(obj,_class)) obj.className = HE.trim.both((" " + obj.className + " ").replace(" " + _class + " "," "));},
	encode: function(c, d, a) {
        d = d === undefined ? '&' : d;
        a = a === false ? function (e) {return e;} : encodeURIComponent;
        var b = [];
        HE.array.forEach(c, function (f, e) {
            if (f !== null && typeof f != 'undefined') b.push(a(e) + '=' + a(f));
        });
        b.sort();
        return b.join(d);
    },
    decode: function (f) {
        var a = decodeURIComponent,d = {},e = f.split('&'),b, c;
        for (b = 0; b < e.length; b++) {
            c = e[b].split('=', 2);
            if (c && c[0]) d[a(c[0])] = a(c[1] || '');
        }
        return d;
    },
	json2Obj : function(str){
		var ljson;
		if(typeof str == "object"){return str;}
		str = (str != null) ? str.split("\n").join("").split("\r").join("") : "";
		if (/^[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]*$/.test(str.replace(/\\./g, '@').replace(/"[^"\\\n\r]*"/g, ''))) {
			if (str != "") {return eval('(' + str + ')');}
		}
		return {};
	},
	json2Str : function(json){
		switch (json.constructor) {
			case String:
				return '"' + json.replace(/(["\\])/g, '\\$1') + '"';
			case Array:
				return '[' + json.map(HE.json2Str).join(',') + ']';
			case Object:
				var lxStr = [];
				for (var property in json) 
					if (typeof(json[property]) != "function") {
						lxStr.push(HE.json2Str(property) + ':' + HE.json2Str(json[property]));
					}
				return '{' + lxStr.join(',') + '}';
			case Number:
				if (isFinite(json)) {
					break;
				}
			case Function:
				return '""';
			case Boolean:
				return json;
		}
		return String(json);
	},
	copy : function(a, b, isWrite, filter){
		for (var prop in b) 
		if (isWrite || typeof a[prop] === 'undefined' || a[prop] === null) 
			a[prop] = filter ? filter(b[prop]) : b[prop];
		return a;
	},
	guid: function(){return 'f' + (Math.random() * (1 << 30)).toString(16).replace('.', '');},
	trim : {
		left : function(str){return str.replace( /^\s*/, '');},
		right : function(str){return str.replace(/(\s*$)/g, "");},
		both : function(str){return str.replace(/^\s+|\s+$/g,"");},
		all : function(str){return str.replace(/\s+/g,"");}
	},
	array : {
		indexOf: function (a, c) {
			if (a.indexOf) return a.indexOf(c);
			var d = a.length;
			if (d) for (var b = 0; b < d; b++) if (a[b] === c) return b;
			return -1;
		},
		merge: function (c, b) {
			for (var a = 0; a < b.length; a++) 
				if (HE.array.indexOf(c, b[a]) < 0) c.push(b[a]);
			return c;
		},
		filter: function (a, c) {
			var b = [];
			for (var d = 0; d < a.length; d++) 
				if (c(a[d])) b.push(a[d]);
			return b;
		},
		keys: function (c, d) {
			var a = [];
			for (var b in c) 
				if (d || c.hasOwnProperty(b)) a.push(b);
			return a;
		},
		forEach: function (c, a, f) {
			if (!c) return;
			if (Object.prototype.toString.apply(c) === '[object Array]' || (!(c instanceof Function) && typeof c.length == 'number')) {
				if (c.forEach) {
					c.forEach(a);
				} else 
					for (var b = 0, e = c.length; b < e; b++) 
						a(c[b], b, c);
			} else 
				for (var d in c) 
					if (f || c.hasOwnProperty(d)) 
						a(c[d], d, c);
		}
	},
	getPara : function(url,name){
		var str = '',_p = name + '=';
		if(url.indexOf("&"+_p)>-1) str = url.split("&"+_p)[1].split("&")[0];
		if(url.indexOf("?"+_p)>-1) str = url.split("?"+_p)[1].split("&")[0];
		return str;
	},
	setPara : function(url,name,value){
		url = HE.trim.both(url);
		var paras = name + "=" + value;
		var v = HE.getPara(url,name);
		return v == "" ? (url + ((url.indexOf("?")<0) ? "?" : "&") + paras) : url.replace("&"+name+"="+v,"&"+paras).replace("?"+name+"="+v,"?"+paras);
	},
	removePara : function(url,name){
        if(!name){return url;}
		var v = HE.getPara(url,name);
        if(url.indexOf('&' + name + '=' + v)>-1){
            url = url.replace('&' + name + '=' + v,'');
        }else if(url.indexOf('?' + name + '=' + v + '&')>-1){
            url = url.replace(name + '=' + v + '&','');
        }else{
            url = url.replace('?' + name + '=' + v,'');        
        }
        return url;
	},    
	getHash : function(name){
		var url = window.location.hash.replace("#!","?");
		return HE.getPara(url,name);
	},
	setHash : function(name,value){
		var url = window.location.hash.replace("#!","?");
		location.hash = HE.setPara(url,name,value).replace("?","#!");
	},
	substitute : function(temp, data, regexp){
		if(!(Object.prototype.toString.call(data) === "[object Array]")) data = [data];
		var ret = [];
		for(var i=0,j=data.length;i<j;i++){
			ret.push(replaceAction(data[i]));
		}
		return ret.join("");
		function replaceAction(object){
			return temp.replace(regexp || (/\\?\{([^}]+)\}/g), function(match, name){
				if (match.charAt(0) == '\\') return match.slice(1);
				return (object[name] != undefined) ? object[name] : '';
			});
		}
	},
	insertCSS : function(link){
		var node = document.createElement("link");
		node.href = link;
		node.type = "text/css";
		node.rel = "stylesheet";
		document.getElementsByTagName('head')[0].appendChild(node);  
	},
	insertJS : function(link,callback){
		var node = document.createElement("script");
		node.src = link;  
		document.getElementsByTagName('head')[0].appendChild(node); 
		HE.onReady(node,callback); 
	},
	getFlashVersion:function() { 
		var f = "", n = navigator; 
		if (n.plugins && n.plugins.length) {
			for (var ii = 0; ii < n.plugins.length; ii++) {
				  if (n.plugins[ii].name.indexOf('Shockwave Flash') != -1) { 
					  f = n.plugins[ii].description.split('Shockwave Flash ')[1];
                      f = f.split(' ').join('.');
					  break; 
				 } 
			} 
		}else if (window.ActiveXObject) { 
			var swf = new ActiveXObject('ShockwaveFlash.ShockwaveFlash'); 
            if(swf) {
                VSwf=swf.GetVariable("$version");
                flashVersion=parseInt(VSwf.split(" ")[1].split(",")[0]);
                f = VSwf.toLowerCase().split('win').join('').split(',').join('.');
            }
		}
		return f;  
	},
	swfObject : function(data){
		var dataTrans = [];
			name = data.name || HE.guid();
			width = data.width || '100%';
			height = data.height || '100%';
			verson = data.verson || '7,0,19,0';
			params = data.params || {};
			bgcolor = params.bgcolor || '#ffffff', 
			wmode = params.wmode || 'opaque', 
			allowscriptaccess = params.allowscriptaccess || 'always'; 
			allowfullscreen = params.allowfullscreen || true; 
			allownetworking = params.allownetworking || 'all';
			flashvars = data.flashvars || '';
			dataTrans.push({src:data.src, name:name, width:width, height:height, verson:verson,bgcolor:bgcolor, wmode:wmode, allowscriptaccess:allowscriptaccess, allowfullscreen:allowfullscreen, allownetworking:allownetworking,flashvars:flashvars});
		var temp = ['<object type="application/x-shockwave-flash" id="{name}" name="{name}" data="{src}" width="{width}" height="{height}" style="visibility: visible;">',
					'  <param name="bgcolor" value="{bgcolor}">',
					'  <param name="wmode" value="{wmode}">',
					'  <param name="flashvars" value="{flashvars}">',
					'  <param name="movie" value="{src}">',
					'  <param name="src" value="{src}">',
					'  <param name="allowscriptaccess" value="{allowscriptaccess}">',
					'  <param name="allowfullscreen" value="{allowfullscreen}">',
					'  <param name="allownetworking" value="{allownetworking}">',
					'</object>'].join("");
		return HE.substitute(temp,dataTrans);
	},
	isCrossDomain : function(url){
		var prol = location.protocol + '//';
		if(url.indexOf(prol)==-1){
			return false;
		}
		var _host = prol + location.host;
		return url.indexOf(_host) !== 0;
	},
	is64 : function(){
		var flag = false;
		var pfMarks = ['amd64','ppc64','_64','win64'];
		var uaMarks = ['x86_64'];
		var pf = navigator.platform.toLowerCase();
		var ua = navigator.userAgent.toLowerCase();
		for(var i=0,len=pfMarks.length;i<len;i++){
			if (pf.indexOf(pfMarks[i])>-1){
				flag = true;
				break;
			}
		}
		for(var i=0,len=uaMarks.length;i<len;i++){
			if (ua.indexOf(uaMarks[i])>-1){
				flag = true;
				break;
			}
		}
		return flag;
	},
	loadJsonP : function(asUrl, afCallback){
		if (!asUrl) {return false;}
		var lsGUID = HE.guid();
		asUrl = (asUrl.indexOf("callback=") == -1) ? (asUrl + (asUrl.indexOf("?") != -1 ? "&" : "?") + "callback=" + lsGUID) : asUrl;
		window[lsGUID] = afCallback;
		var node = document.createElement('script');
		node.src = asUrl;
		document.getElementsByTagName('head')[0].appendChild(node);                                  
	},
	loadAjax : function(option){
		var xhr = (window.ActiveXObject) ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();
		option.method = option.method || 'get';
		if(option.method.toLowerCase() == 'get'){
			for(prop in option.data){
				option.url = HE.setPara(option.url,prop,option.data[prop]);
			}
			option.data = null;
		}else{
			if(typeof(option.data) != "string"){
				option.data = HE.encode(option.data);
			}
		}
		try{
			if(option.async !== false){option.async = true;}
			xhr.open(option.method || "POST",option.url,option.async);
			xhr.setRequestHeader("Content-Type",option.contentType||"application/x-www-form-urlencoded");
			xhr.onreadystatechange = handleStateChange;        
			xhr.send(option.data);
		}catch (ex) {
			return "";
		}
		function handleStateChange(){			
			if (xhr!=null && xhr.readyState==4){
				if(option.callback){
					option.callback(eval("("+xhr.responseText+")"));
				}
			} 
		}
	},
	ajax : function(args, callback) {
		if(HE.isCrossDomain(args.url)){
			var params = args.data || {};
			for(prop in params){
				args.url = HE.setPara(args.url,prop,params[prop]);
			}
			HE.loadJsonP(args.url, callback);
		}else{
			HE.loadAjax({
				url:args.url,
				method:args.method || 'get',
				contentType:args.contentType,
				data:args.data,
				callback:callback
			});
		}
	},
	getDate : function(model,time) {
		var time = time || new Date();
	    var z ={y:time.getFullYear(),
	            M:time.getMonth()+1,
	            d:time.getDate(),
	            h:time.getHours(),
	            m:time.getMinutes(),
	            s:time.getSeconds()
	    };
	    return model.replace(/(y+|M+|d+|h+|m+|s+)/g,function(v) {
	            return ((v.length>1?"0":"")+eval('z.'+v.slice(-1))).slice(-(v.length>2?v.length:2));
	    });
	},
	trace : function(str){
		if(typeof(console)!="undefined" && console.log){
			console.log(str);
		}
	},

	contains : function(parent,child){
		var doc = document.documentElement;
		if(typeof doc.compareDocumentPosition != 'undefined'){
			return (parent.compareDocumentPosition(child) & 16) !== 0;
		}else if(typeof doc.contains != 'undefined'){
			return parent !== child && parent.contains(child);
		}else{
		  if (parent === child) return false;
		  while (parent != child && (child = child.parentNode) != null);
		  return parent === child;		
		}
	},
	getStyle : function (obj, prop) {
	    prop = HE.string2CamelCase(prop);
		if(obj.currentStyle) {
			return obj.currentStyle[prop] || '';
		}
		else if(window.getComputedStyle) {
			return window.getComputedStyle(obj , null)[prop];
		}
	},
	getCookie : function(name){ 
		var start = document.cookie.indexOf(name + "="); 
		var len = start + name.length + 1; 
		if ((!start) && (name != document.cookie.substring(0,name.length))) { 
			return null; 
		} 
		if (start == -1) return null; 
		var end = document.cookie.indexOf( ';', len ); 
		if (end == -1) end = document.cookie.length; 
		return unescape(document.cookie.substring(len,end)); 
	},
	setCookie : function (name, value, expires, path, domain, secure) { 
		var today = new Date(); 
		today.setTime(today.getTime()); 
		if (expires) { 
			expires = expires * 1000 * 60 * 60 * 24; 
		} 
		var expires_date = new Date(today.getTime() + (expires) ); 
		document.cookie = name + '=' + escape(value) + 
		((expires) ? ';expires =' + expires_date.toGMTString() : '') + //expires.toGMTString() 
		((path) ? ';path=' + path : '') + 
		((domain) ? ';domain=' + domain : '') + 
		((secure) ? ';secure' : ''); 
	},
	delCookie : function(name){
		var exp = new Date();
		exp.setTime (exp.getTime() - 1);
		var cval = GetCookie (name);
		document.cookie = name + "=" + cval + "; expires="+ exp.toGMTString();
	},	
	string2CamelCase : function (str) {
	    if (str.indexOf('-') < 0 && str.indexOf('_') < 0) {
	        return str;
	    }
	    return str.replace(/[-_][^-_]/g, function (match) {
	        return match.charAt(1).toUpperCase();
	    });
	},
	insertBefore : function (newElement, existElement) {
	    existParent = existElement.parentNode;
	    if (existParent) {
	        existParent.insertBefore(newElement, existElement);
	    }
	    return newElement;
	},
	insertAfter : function(newElement,targetElement) {   
		var parent = targetElement.parentNode;   
		if (parent.lastChild == targetElement) {   
			parent.appendChild(newElement);   
		} else {   
			parent.insertBefore(newElement,targetElement.nextSibling);   
		}
	},
	removeNode : function(obj){
		obj = (typeof obj == 'object') ? obj : HE.$(obj);
		if(obj) obj.parentNode.removeChild(obj);
		//remove table cell???
	},
	getParent : function(obj,_class){
		_class = _class.toLowerCase();
		if(!obj){HE.trace('obj is undefined.')}
		if(obj.tagName.toLowerCase() == 'body'){
	        return HE.$('body')[0];
	    }
		var obj = obj.parentNode;
		if (HE.hasClass(obj,_class)){
			return obj;
		}else{
	       return HE.getParent(obj,_class);
		}
	},
	addEvent : function(obj,_event,func){
		if (obj.attachEvent){
			obj.attachEvent('on' + _event,func);
		}else{	
			obj.addEventListener(_event,func,false); 
		}	
	},
	getTarget : function (event) {
	    return event.target || event.srcElement;
	},
	getKeyCode : function (event) {
	    return event.which || event.keyCode;
	}	
};
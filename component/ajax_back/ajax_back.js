var ajax_back = function(){
	this.hashMap={};
	this.originalHash = "";
	this.lastHash = "";
	this.ie67Flag = false;
	this._iframeid="__ajax_iframe";
	this.hashparam = {};	
}
ajax_back.prototype ={
	_iframe:null,
	init:function(){
		var self = this;
		if(self._ie67()){
			self.ie67Flag=true;
			self.iframe = self.createIframe(self._iframeid);
			setInterval(function(){
				self.check();
			}, 100);
			return false;
		}
		var hash = location.hash;
		if(hash!=""){
			if(/^#!.*/.test(hash)){
				self.originalHash = "";
				self.hashparam = self.getparamFromHash(hash);
			}else{				
				self.originalHash = hash.match(/^#([^#!]+)/)[0];
				self.hashparam = self.getparamFromHash(/#!.*/.test(hash)?hash.match(/#!.*/)[0]:"");
			}		
		}
		self._addEvent(window,"hashchange",function(){
			self.check();
		});
	},
	execute:function(handle,hash){
		var self = this;
		var _hash = hash||self._nuid();
		if(self.ie67Flag){
			self.pushHashMap(_hash,handle);
			self.lastHash = self.getCurrentHash(self.iframe.contentWindow.document);
			self.iframe.contentWindow.document.open();
			self.iframe.contentWindow.document.close();				
			self.setHash(_hash,self.iframe.contentWindow.document);						
			return _hash;
		}
		self.pushHashMap(_hash,handle);
		self.lastHash = self.getCurrentHash();
		self.setHash(_hash);	
		return _hash;
	},
	check:function(){
		var self = this;
		var hash =  self.ie67Flag?self.getCurrentHash(self.iframe.contentWindow.document):self.getCurrentHash();
		if(hash!=self.lastHash){
			self.process(hash);
		}
	},	
	pushHashMap:function(hash,handle){
		var self= this;
		self.hashMap[hash]=handle;
	},
	process:function(hash){
		var self= this;
		self.lastHash = hash;
		self.hashMap[hash]&&self.hashMap[hash]();
	},
	setHash:function(hash,win){
		var hashparam = this.hashparam;		
		hashparam["ajax_back"]=hash;
		(win||window).location.hash = this.originalHash + "#!" + this.getParamStr(hashparam);
	},
	getCurrentHash:function(){
		return this._getCurrentHash();
	},
	createIframe:function(id,callback){
		var iframe = document.createElement("iframe");		
		iframe.id = id;		
		iframe.style.display = "none";
		iframe.src = "javascript:false;";	
		document.body.appendChild(iframe);
		return iframe;
	},
	mixOptions:function(t,b){
		var t = this;
		for (var key in b) {
		  if(typeof b[key] == "object" ){
		  	 if(t[key]==undefined){
		  	 	t[key] = {};
		  	 }
		  	 t.mixOptions(t[key],b[key]);
		  }else{
		  	 t[key] = b[key]; 
		  }
		}
	},
	getparamFromHash:function(hash){
		var _hash = hash || window.location.hash;
		var validHashReg = /([^#!]+)/ig;
		if(!/#!.*/.test(_hash)){
			return {};
		}
		var validHash = _hash.match(validHashReg)[0];
		var rhash = /[&]?([^&=]+)=([^&=]*)/ig;
		var result = rhash.exec(validHash);
		var param = {};		
		while (result) {
			param[result[1]] = result[2];
			result = rhash.exec(validHash);
		}	
		return param;		
	},
	getParamStr:function(param){
		var query = [];
		for (var key in param) {
		   if(this._isArray(param[key])){
		   	   query.push([
		   	   		key,
		   	   		param[key].join(",")
		   	   ].join("="));
		   }else if(!this._isObject(param[key])){
		   	   query.push([
		   	   		key,
		   	   		param[key]
		   	   ].join("="));
		   }			  
		}
		return query.join("&");		
	},
	_getCurrentHash:function(win){
		var self = this;
		var hash = (win||window).location.hash;
		var validHash = /#!.*/.test(hash)?hash.match(/#!.*/)[0]:"";
		var hashParam = self.getparamFromHash(validHash);
		if(hashParam&&hashParam.ajax_back!=undefined){
			return hashParam.ajax_back;
		}
		return "";
	},
	_addEvent:function(o,eventname,handle,args){
		var self= this;
		var addEvent = function(o,eventname,handle,args){
			o.addEventListener(eventname, function(e){
				handle(e,args);
			}, false);			
		};		
		if(window.attachEvent){
			addEvent = function(o,eventname,handle,args){
				o.attachEvent("on"+eventname,function(e){
					handle(e,args);
				});			
			}
		}
		self._addEvent = addEvent;
		self._addEvent(o,eventname,handle,args);	
	},
	_ie67:function(){
		var ua = navigator.userAgent.toLowerCase();
		var ie = !-[1,];
		var ie6 = ie&&!window.XMLHttpRequest;
		var ie7 = ie&&ua.indexOf("msie 7")>-1;
		return ie6||ie7;
	},		
	_isObject:function(obj){
        var type = (typeof obj).toLowerCase();
        if(null === obj || 'undefined' === type || 'string' === type || undefined !== obj.nodeType){ //ie fix
            return false;
        }
        return  Object.prototype.toString.call(obj) === '[object Object]';		
	},	
	_isArray:function(n){
		return Object.prototype.toString.call(n).indexOf("Array")!=-1;
	},		
	_nuid:function(){
		var random = new Date().getTime();
		return "_h"+random;	
	}	
}

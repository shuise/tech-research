/**
 *  hashchange在IE6,7下的fix方案
 *  对于支持hashchange的浏览器，勿用
 *  registerHash:将handle和hash对应；
 *  start:开始监听
 *  setHash:设置hash
 *  
 */
(function(win){
	"use strict";
	var fixHashChange = function(){
		this.lastHash = "";
		this.hashHandleMap={};
		this._timer = null;
		this.init();
	};	
	fixHashChange.prototype = {
		init:function(){
			var self = this;			
			self._fixFrame =self.createIframe(self.nuid());
		},
		start:function(){
			var self = this;
			var interval = 100;
			if(self._timer!=null){
				self.stop();
			}
			self._timer = setInterval(function(){
				self.check();
			}, interval);			
		},
		stop:function(){
			if(self._timer!=null){
				clearInterval(self._timer);
				self._timer = null;
			}
		},
		registerHash:function(hash,handle){
			this.hashHandleMap[hash] = handle;
		},
		check:function(){
			var self = this;
			var hash =  self.getHash();
			if(hash!=self.lastHash){
				self.process(hash);
			}
		},			
		process:function(hash){
			var self= this;
			self.lastHash = hash;
			self.hashHandleMap[hash]&&self.hashHandleMap[hash]();
		},
		setHash:function(hash){
			var self = this;			
			self.lastHash = self.getHash();
			self._fixFrame.contentWindow.document.open();
			self._fixFrame.contentWindow.document.close();	
			self._fixFrame.contentWindow.document.location.hash = hash;
			location.hash = hash;			
		},
		getHash:function(){
			var self = this;
			var doc = self._fixFrame.contentWindow.document;
			return 	doc.location.hash;
		},	
		createIframe:function(id){
			var iframe = document.createElement("iframe");		
			iframe.id = id;		
			iframe.style.display = "none";
			iframe.src = "javascript:false;";	
			document.body.appendChild(iframe);
			return iframe;
		},
		nuid:function(){
			var id = new Date().getTime();
			return "_"+id;				
		}	
	};
	
	win.fixHashChange = fixHashChange;	
	
})(window);

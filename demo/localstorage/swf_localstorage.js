/**
 * @author weixin
 */
var tools_swfstorage = {
	init:function(config){
		var t= this;
		var namespace = config.ns ||"swf_localstorage";
		var interval = config.interval || 60000;
		var _config = {
			swf : config.swf||"http://static.f2e.netease.com/demo/flashdemo/localstorage/localstorage.swf?t=2333344434",
			targetId : config.targetId,
			flashId : "local_swf",
			namespace : namespace,//flash内部命名空间
			flashvars : {namespace: namespace,interval:interval},//js对外接口命名空间，与上一致
			width     : 1,
			height    : 1
		}
		t.config = _config;
		t.needListen = config.needListen;
		t.swfobject = null;		
		t.listenLst = {};
		t.actionLst = {};
		t.onready = config.onready;//需要在flash创建完毕后执行				
		t.initSWF();							
	},
	initSWF : function(){
		var t= this;
		if(t.swfobject==null){
			NE.swf.embed(t.config,function(o){
				t.swfobject = o;
				t.onready&&t.onready();							
			});
			if(t.needListen){
				window[t.config.namespace].valueUpdate = function(key,params,callback){
					//params:{keyns,key,oldValue,newValue}
					t.update(params);
				}				
			}
			window[t.config.namespace].get = function(key,params,func){ //获取结果
				//回调处理callback(keyns, key, value)；keynamespace key value
				t.action(params);
			}																
		}
	},
	set : function(ns,key,value){
		var t = this;
		t.swfobject.call("save", {keyns:ns, key:key, value:value});
	},
	get : function(ns,key,callback){//get 队列
		var t = this;
		t.addAction(t.actionLst,ns,key,callback);
		t.swfobject.call("get", {keyns:ns, key:key});		
	},
	remove : function(ns,key){
		var t = this;
		if(typeof key =="undefined"){
			console.log(11)
			t.swfobject.call("clear",{keyns:ns});
			console.log(12)
		}else{
			console.log(22)
			t.swfobject.call("clear",{keyns:ns, key:key});
			console.log(21)
		}		
	},	
	update : function(params){
		var t = this;
		var key = params.keyns+"_"+params.key;
		if(typeof t.listenLst[key]!="undefined"){
			t.listenLst[key].callback(params);
		}else{
			console.log("update erro!");
		}
	},
	action : function(params){
		var t = this;
		var key = params.keyns+"_"+params.key;
		if(typeof t.actionLst[key]!="undefined"){
			t.actionLst[key].callback(params);
		}else{
			console.log("action erro!");
		}		
	},
	addAction : function(obj,ns,key,callback){
		var t = this;
		t.addItem(obj,{keyns:ns,key:key,callback:callback});			
	},
	removeAction : function(obj,ns,key){
		var t = this;
		t.removeItem(obj,{keyns:ns,key:key});		
	},		
	addListener : function(keyns,key,callback){
		var t = this;
		t.addListenerItem(keyns,key,callback);	
		t.swfobject.call("addListener", {keyns:keyns, key:key});		 
	},
	removeListener : function(keyns, key){
		t.removeListenerItem(keyns, key);
		t.swfobject.call("removeListener", {keyns:keyns, key:key});
	},
	addListenerItem : function(ns,key,callback){
		var t=this;
		t.addItem(t.listenLst ,{keyns:ns,key:key,callback:callback});
	},
	removeListenerItem : function(ns, key){
		var t=this;
		t.removeItem(t.listenLst ,{keyns:ns,key:key});
	},
	addItem : function(obj,param){
		var _key = param.keyns+"_"+param.key;
		obj[_key] = param;		
	},
	removeItem : function(obj,param){
		var _key = param.keyns+"_"+param.key;
		if(typeof obj[_key]!="undefined"){
			delete obj[_key];
		}		
	}	
}

	

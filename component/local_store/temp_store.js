/**
 * @author weixin
 */
(function(){
var NE = window["NE"] || {};	
NE._storage = {
	init:function(config){
		var t= this;
		var talker = config.talker ||"swf_localstorage";//window['swf_localstorage']变量，js和as通信
		var interval = config.interval || 60000;
		var _config = {
			swf : config.swf||"http://qa.developer.163.com/component/local_store/localstorage.swf",
			targetId : config.targetId,//swf替换的容器id，必须存在
			flashId : "local_swf",
			talker : talker,
			allowScriptAccess : 'always',
			flashvars : {interval:interval},//flash调用js接口；interval：监听时间间隔
			width     : 1,
			height    : 1
		}
		t.config = _config;
		t.needListen = config.needListen;//是否需要监听
		t.swfobject = null;		
		t.listenLst = {};
		t.actionLst = {};
		t.onready = config.onready;//需要在flash创建完毕后执行				
		t.initstorage();							
	},
	initstorage : function(){//初始化flash
		var t= this;
		if(t.swfobject==null){
			NE.swf.embed(t.config,function(o){
				t.swfobject = o;
				t.onready&&t.onready();							
			});
			if(t.needListen){
				window[t.config.talker].valueUpdate = function(key,params,callback){//flash调用，js的更新回调接口
					//params:{keyns,key,oldValue,newValue}
					t.update(params);
				}				
			}
			window[t.config.talker].get = function(key,params,func){ //flash调用，js的get回调接口
				//回调处理callback(keyns, key, value)；keynamespace key value
				t.action(params);
			}
			window[t.config.talker].log = function(key,params,func){ //log
				console.log(key,params);				
			}																			
		}
	},
	set : function(ns,key,value){
		var t = this;
		t.swfobject.call("save", {keyns:ns, key:key, value:value});
	},
	get : function(ns,key,callback){
		var t = this;
		t.addAction(t.actionLst,ns,key,callback);//get 队列
		t.swfobject.call("get", {keyns:ns, key:key});		
	},
	remove : function(ns,key){
		var t = this;
		if(typeof key =="undefined"){
			t.swfobject.call("clear",{keyns:ns});
		}else{
			t.swfobject.call("clear",{keyns:ns, key:key});
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
		t.addListenerItem(keyns,key,callback);	//listen 队列
		t.swfobject.call("addListener", {keyns:keyns, key:key});		 
	},
	removeListener : function(keyns, key){
		var t = this;
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
window["NE"] = NE;		
})();


	

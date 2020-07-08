var	NT = {
	tweenFunc:function(t,b,c,d){//t:当前时间值 b:初始值 c:变化量（目标值-初始值） d:持续时间       
		return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
	},
							
	isArray:function(n){
		return Object.prototype.toString.call(n).indexOf("Array")!=-1;
	},
	contains:function(a,b){
		 try {return a.contains ? a != b && a.contains(b) : !!(a.compareDocumentPosition(b)&16)}catch(e){};
	},								
	setOpacity:function(o,val){//0-100透明度兼容方法
		var t=this;
		if(typeof document.body.style.opacity !="undefined"){
			//兼容对象数组
			if(t.isArray(o)){
				for (var i=0; i < o.length; i++) {
				  o[i].style.opacity = val/100;
				};				
			}else{
				o.style.opacity = val/100;
			} 				
		}else{
			if(document.documentElement.filters){
				//兼容对象数组
				if(t.isArray(o)){
					for (var i=0; i < o.length; i++) {
					  o[i].style.filter = "alpha(opacity=" + val +")";
					};				
				}else{
					o.style.filter = "alpha(opacity=" + val +")";
				} 
			}
		}			
	},
	
	setNodeHeight:function(o,h){
		var t=this;
		t.setNodeStyle(o,"height",h+"px");
	},						
	setNodeStyle:function(o,n,v){
		var t=this;
		//兼容对象数组
		if(t.isArray(o)){
			for (var i=0; i < o.length; i++) {
			  o[i].style[n] = v;
			};				
		}else{
			o.style[n] = v;
		}			
	},								
	trendChangeHeight:function(node,start,end,delay,func){
		var t = this,
			val = 0,
			t_inc = 0;
		var timmer = null;						
		timmer = setInterval(function(){
			  if(t_inc>=delay){
			  	  t.setNodeHeight(node,end);
				  clearInterval(timmer);
				  timmer = null;
				  func&&func();
				  return;
			  }
			  val=t.tweenFunc(t_inc,start,end-start,delay);
			  t.setNodeHeight(node,val);
			  t_inc+=13;
		  },13);			
	},										
	trendShow:function(node,delay,func){
		var t = this,
			val = 0,
			t_inc = 0;
		var timmer = null;			
		NTES.style.addCss(node,{display:'block'});			
		timmer = setInterval(function(){
			  if(t_inc>=delay){
				  t.setOpacity(node,100);
				  clearInterval(timmer);
				  timmer = null;
				  func&&func();
				  return;
			  }
			  val=t.tweenFunc(t_inc,0,100,delay);
			  t.setOpacity(node,val);
			  t_inc+=13;
		  },13);						
	}
};
function listPlay(lst){
	this._timmer = null;
	this.lst = $(lst);
	this.flag = false;
	this.showDelay = 600;
	this.trendHeightDelay =1000;
	this.palyDelay = 3000;
	//初始化
	this.init();
};
listPlay.prototype = {
	constructor: listPlay,
	init:function(){
		var t = this;
		t.lst.addEvent("mouseover",function(e){
		   	t.stop();	
		});
		t.lst.addEvent("mouseout",function(e){
			t.play();						
		});	
		t.play();					
	},
	preTreat:function(node){
		var t = this;
		node.style.height ="0px";							
		NT.setOpacity(node,0);
		t.lst.insertBefore(node,t.lst.firstChild);
	},
	show : function(node,lasth){
		var t = this;										
		NT.trendChangeHeight(node,0,lasth,t.trendHeightDelay,function(){
		  //渐变显示
		  NT.trendShow(node,t.showDelay,function(){
		  	 t.flag = false;
		  });
		});
	},
	process:function(){
		var t=this;						
		if(t.flag){
			return;
		}
		var lis = t.lst.$("li"),
			lastli = lis[lis.length-1],
			lasth = lastli.offsetHeight;	
		t.preTreat(lastli);					
		t.show(lastli,lasth);
		t.callBack&&t.callback();//提供扩展
		t.flag = true;
	},
	play:function(){
		var t = this;
		if(t._timmer == null){
			t._timmer = setInterval(function(){
				t.process();
			},t.palyDelay);
		}
	},
	stop:function(){
		var t = this;
		if(t._timmer!=null){
			clearInterval(t._timmer);
			t._timmer=null;
		}					
	}				
};
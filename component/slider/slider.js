/**
 * @author wx
 */
/*	@ui{//支持传入单个DOM结点，生成一个默认的UI集合,一般初始化如下：
	 	slider,//sliderUI
		highlight,//范围UI
		upper,//上限控制UI
		lower//下限控制UI		
	}
	@param{
		slideClickbind,//true|false;默认true;是否需要绑定slidebody的click事件
		orientation,//"vertical"|"horizontal";水平或垂直slider;默认"horizontal"
		step,//步长
		min,//范围下限
		max,//范围上限
		values//初始化上下限,[0]:下限值,[1]:上限值;送单值时，支持单侧slider		
	}
	@callback{
		upperChange:function(value),
		lowerChange:function(value),
		upperStop:function(value),
		lowerStop:function(value)
	}
 */	
(function($,win){
	var _copy= $.util.extend;
	var isIE = $.browser.msie;
	function slider(ui,param,callback){
		var self = this;
		var _ui = {};
		var _param = {
			slideClickbind : true,
			orientation : "horizontal",
			max:100,
			min:0,
			step:5,
			value:[5,10]
		};
		var _h_fix = {
			pos: "left",
			boundStyle:"width",
			offsetSize: "offsetWidth",
			pageAxis: "pageX"			
		};
		var _v_fix = {
			pos: "top",
			boundStyle: "height",
			offsetSize: "offsetHeight",
			pageAxis: "pageY"
		};
		_copy(_param,param);
		self._param = _param;
		
		if(typeof ui.slider == "undefined"){//当只送一个结点		
			createUI(_ui,ui);	
		}else{
			_copy(_ui,ui);
		}		
		self._ui = _ui;
				
		callback&&(self.callback=callback);	
		self._curValues = _param.values;
		self.isSingleSlider = false;
		self._fix = self._param.orientation == "horizontal" ? _h_fix : _v_fix;	
	}	
	slider.prototype = {
		init:function(){
			var self = this;
			var orientation = self._ui.orientation;
			var slidebody = self._ui.slider;
			var step_str = self._param.step.toString();	
			self._dis_length = slidebody[self._fix.offsetSize];
			var incs = (self._param.max-self._param.min)/self._param.step;
			self._dis_interval = self._dis_length*1.0/incs;//每个inc像素值
			//self.offset_pos = getOffsetPos(slidebody);//resize会改变这个值
			if(!isArray(self._param.values)){
				var _arr =[self._param.min,self._param.values];
				//fix values
				self._param.values = _arr; 
				self._curValues = self._param.values;
				self.isSingleSlider = true;
			}
			if(step_str.indexOf(".")!=-1){
				self._digit = step_str.split(".")[1].length;
			}				
			self.bindEvent();
			self.setValues(self._param.values);			
		},
		bindEvent:function(){
			var self = this;
			!self.isSingleSlider&&self.bindCtrlHandle(self._ui.lower,"lower");
			
			self.bindCtrlHandle(self._ui.upper,"upper");
			
			//slide主题绑定click事件
			self._param.slideClickbind&&self.slideClickbind();
		},
		bindCtrlHandle:function(handle,flag){
			var self = this;	
			if (isIE) {
				$(handle).attr("unselectable", "on");			
			}		
			$(handle).addEvent("click",function(e){
				e.preventDefault();
				stopBubble(e);
			});
			$(handle).addEvent("dragstart",function(e){//fix支持strag的浏览器，因为目前是模拟strag，需要禁止原生FF,operadragstart事件
				return false;
			});					
			$(handle).addEvent("mousedown",function(e){
				$(document).addEvent("mousemove",mousemovehandle).addEvent("mouseup",mouseuphandle);
				$(handle).addEvent("mousemove",mousemovehandle).addEvent("mouseup",mouseuphandle);
			});
			function mousemovehandle(e){
				var slide_offset_pos = self.getOffsetPos(self._ui.slider);					
				var event_offset_dis = e[self._fix.pageAxis] - slide_offset_pos[self._fix.pos];			
				//计算相应值
				var incs = Math.round(event_offset_dis/self._dis_interval);
				var _curValue = self.fixValue(self._param.min+incs*self._param.step);			
				if(flag=="upper"){
					self.setUpperValue(_curValue);
				}else{
					self.setLowerValue(_curValue);				
				}			
				!self.isSingleSlider && self.setBound();
				stopBubble(e);			
			}	
			function mouseuphandle(e){		
				$(document).removeEvent("mousemove",mousemovehandle).removeEvent("mouseup",mouseuphandle);
				$(handle).removeEvent("mousemove",mousemovehandle).removeEvent("mouseup",mouseuphandle);
				if(flag=="upper"){
					self.callback&&self.callback.upperStop&&self.callback.upperStop(self._curValues[1]);
				}else{
					self.callback&&self.callback.lowerStop&&self.callback.lowerStop(self._curValues[0]);
				}
				stopBubble(e);								
			}							
		},
		slideClickbind:function(){
			var self = this;
			$(self._ui.slider).addEvent("click",function(e){
				var slide_offset_pos = self.getOffsetPos(self._ui.slider);
				var event_offset_dis = e[self._fix.pageAxis] - slide_offset_pos[self._fix.pos];
				var curVale = self.posToValue(event_offset_dis);
				var lowerValue = self._curValues[0];
				var upperValue = self._curValues[1];
				//相对距离比
				var _dis_flag = (curVale-lowerValue)*(curVale-lowerValue)-(curVale-upperValue)*(curVale-upperValue);
				if(_dis_flag>0||self.isSingleSlider){
					self.setUpperValue(curVale);
					self.callback&&self.callback.upperStop&&self.callback.upperStop(curVale);
				}else{
					self.setLowerValue(curVale);
					self.callback&&self.callback.lowerStop&&self.callback.lowerStop(curVale);
				}
				!self.isSingleSlider && self.setBound();
			});
		},
		setBound:function(){
			var self = this;
			var nbound = $(self._ui.highlight);
			self.setNodePosbyValue(nbound,self._curValues[0]);
			var inc = Math.round((self._curValues[1]-self._curValues[0])/self._param.step)*1.0*self._dis_interval;
			nbound.addCss(self._fix.boundStyle+":"+inc+"px;");
		},
		setNodePosbyValue:function(target,value){
			var self = this;
			var dis = Math.round((value-self._param.min)*1.0/self._param.step)*self._dis_interval;
			self.setctrlHandlePos($(target),dis);		
		},
		posToValue:function(dis){
			//计算相应值
			var self = this;
			var incs = Math.round(dis/self._dis_interval);
			return self.fixValue(self._param.min+incs*self._param.step);			
		},
		setValues:function(values){//通过数组设置上下限及位置
			var self = this;
			self.setUpperValue(values[1]);
			!self.isSingleSlider&&self.setLowerValue(values[0]);
			!self.isSingleSlider && self.setBound();		
		},
		digitFix:function(value){
			var self = this;
			return self._digit?value.toFixed(self._digit):value;
		},	
		fixValue:function(value){
			var self = this;
			var _min = value<self._param.min?self._param.min:value;	
			var _value = value>self._param.max?self._param.max:_min;
			//fix小数点有效位数		
			return self.digitFix(_value);
		},
		fixHandlePos:function(dis){
			var self = this;
			var _dis = Math.round(dis/self._dis_interval)*self._dis_interval;
			var _min = _dis<0?0:_dis;	 
			return _dis>self._dis_length?self._dis_length:_min;		
		},
		setctrlHandlePos:function(target,dis){
			var self = this;
			var _dis = self.fixHandlePos(dis);
			$(target).addCss(self._fix.pos+":"+_dis+"px;");
		},
		setUpperValue:function(value){
			var self = this;		
			//修正上限最小值不能小于下限
			value = value<self._curValues[0]?self._curValues[0]:value;	
			self.updateUpperValue(value);	
		},
		setLowerValue:function(value){
			var self = this;
			//修正下限最大值不能大于上限
			value = value>self._curValues[1]?self._curValues[1]:value;
			self.updateLowerValue(value);
		},
		updateUpperValue:function(value){//更新上限值
			var self = this;			
			self.setNodePosbyValue(self._ui.upper,value);
			self._curValues[1]=value;
			self.callback&&self.callback.upperChange&&self.callback.upperChange(value);
		},
		updateLowerValue:function(value){//更新下限值
			var self = this;			
			self.setNodePosbyValue(self._ui.lower,value);
			self._curValues[0]=value;
			self.callback&&self.callback.lowerChange&&self.callback.lowerChange(value);
		},
		getOffsetPos:function(node){//根据dom结点，计算结点pos信息
			var _scroll = getScroll();
			var rect = node.getBoundingClientRect();
			return {top:_scroll.top+rect.top,left:_scroll.left+rect.left};
		}					
	}
		
	win.NE = win.NE || {};
	win.NE.slider = slider;
		
	function createUI(ui,parent){
		var tpl = ['<div class="bound_slide_cnt">',
							 '<div class="bs_hound"></div>',
							 '<a href="javascript:;" target="_self" class="bs_left_ctrl bs_ctrl">←</a>',
							 '<a href="javascript:;" target="_self" class="bs_right_ctrl bs_ctrl">→</a></div>'
				  ].join("");
		parent.innerHTML = tpl;		
		ui.slider = $(parent).$(".bound_slide_cnt")[0];
		ui.highlight = $(parent).$(".bs_hound")[0];
		ui.upper = $(parent).$(".bs_left_ctrl")[0];
		ui.lower = $(parent).$(".bs_right_ctrl")[0];
		return ui;
	}
	function stopBubble(e){
		if(e.stopPropagation){
			e.stopPropagation();		
		}else{
			window.event.cancelBubble = true;
		}
	}
	function getScroll(){
	    var scrolltop, scrollleft, scrollwidth, scrollheight; 
	    if (document.documentElement && document.documentElement.scrollTop) {
	        scrolltop = document.documentElement.scrollTop;
	        scrollleft = document.documentElement.scrollLeft;
	    } else if (document.body) {
	        scrolltop = document.body.scrollTop;
	        scrollleft = document.body.scrollLeft;
	    }
	    return { top: scrolltop, left: scrollleft};			
	}
	function isArray(n){
		return Object.prototype.toString.call(n).indexOf("Array")!=-1;
	}		
})(NTES,window);


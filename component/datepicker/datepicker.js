/**
* version:1.0
* create:2012.08.17
* author:hejie
* 
*/
function datePicker(elem, opt){
	opt = opt||'';
	var self = this;
	var cls = {
		'weekend':'weekend',
		'active':'active',
		'hover':'hover',
		'disabled':'disabled',
		'title':'datepicker_title',
		'wrapper':'datepicker_wrapper',
		'selector':'date_selector',
		'nextBtn':'next_btn',
		'prevBtn':'prev_btn',
		'dateCell':'date_cell',
		'datePanel':'date_panel',
		'titleYear':'title_year',
		'titleMonth':'title_month',
		'prevMonth':'prev_month',
		'nextMonth':'next_month',
		'today':'datepicker_today'
	};
	if(opt.cls){
		for(var k in opt.cls){
			cls[k] = opt.cls[k];
		}
	}
	self.container = opt.container||document.body;
	self.callback = opt.callback||null;
	self.daynum = opt.daynum||'daynum';
	self.attrDate = opt.attrDate||'data-date';
	self.cls = cls;
	self.dateInputField =  elem;
	self.dateRange = opt.dateRange||null;
	self.disAfterToday = opt.disAfterToday;
	self.disWeekend = opt.disWeekend;
	self.format = opt.format||'yyyy-mm-dd';
	self.showOtherMonth = opt.showOtherMonth||false;
	self.initDate = opt.initDate;
	self.oninit = opt.oninit;
	self.onchange = opt.onchange;
	self.onhide = opt.onhide;
    self.setFromDate(opt.fromDate);
    self.setEndDate(opt.endDate);
	self.inited = false;
	self.temp = {
		row : '<tr>{0}</tr>',
		col : '<td>{0}</td>',
		content : '<table class="'+self.cls.selector+'"><thead><tr><th '+self.daynum+'="1">一</th><th '+self.daynum+'="2">二</th><th '+self.daynum+'="3">三</th><th '+self.daynum+'="4">四</th><th '+self.daynum+'="5">五</th><th '+self.daynum+'="6">六</th><th '+self.daynum+'="0">日</th></tr></thead><tbody>{0}</tbody></table>',
		title : '<a href="" class="'+self.cls.nextBtn+'"></a><a href="" class="'+self.cls.prevBtn+'"></a><span class="'+self.cls.titleYear+'">{year}</span>年<span class="'+self.cls.titleMonth+'">{month}</span>月'
	}
	if(opt.temp){
		for(var i in opt.temp){
			self.temp[i] = opt.temp[i];
		}
	}
	
	self.initTitle = opt.initTitle||self.initTitle;
	self.validateMonth = opt.validateMonth || function(){return true;}
	self.customCell = opt.customCell||self.customCell;
	//self.handlerMapping = self.getHandlerMap();
	self.start();
};
(function(T,P){
    function isFunction(obj) {
        return Object.prototype.toString.call(obj) === '[object Function]';
    }
	function format(tpl,data) {
		var arg = arguments;
		var pattern = /{(.+?)}/g;
		if(typeof data == 'object'){
			if(Object.prototype.toString.call(data) === "[object Array]"){
				var str = '';
				for(var i=0;i<data.lenth;i++){
					str += format(tpl,data[i]);
				}
				return str;
			}
			var str = tpl.replace(pattern,function($1,$2){return data[$2]==undefined?$1:data[$2]});
			return str;
		}else{
			return tpl.replace(pattern,function($1,$2){return arg[parseInt($2)+1]==undefined?$1:arg[parseInt($2)+1]});
		}
	}
	function domToString(dom){
		var div = document.createElement('div');
			div.appendChild(dom);
		return div.innerHTML;
	}
	function stringToDom(str){
		var div = document.createDocumentFragment();
			div.innerHTML = str;
		return div.children;
	}
	function hasClass(elem,cls){
		var classes = elem.className.split(' ');
		for(var i=0;i<classes.length;i++){
			if(classes[i]===cls)	return true;
		}
		return false;
	}
	function addClass(elem,cls){
		if(hasClass(elem,cls))return;
		else elem.className = elem.className + ' ' + cls;
		return elem;
	}
	function removeClass(elem,cls){
		var classes = elem.className.split(' '),cc = [];
		for(var i=0;i<classes.length;i++){
			if(classes[i]&&classes[i]!==cls)cc.push(classes[i]);
		}
		elem.className = cc.join(' ');
		return elem;
	}
	function find(options) {
		var css = options.css, attr = options.attr, val = options.attrValue, arr = [];
		var htmlcol = (options.parent||document.body).getElementsByTagName(options.tag || "*");
		var regexp = new RegExp("(^|\\s)" + css + "(\\s|$)");
		for (var i=0,len = htmlcol.length; i<len; i++) {
			var obj = htmlcol[i];
			if(obj.nodeType != 1)continue;
			if(typeof obj.className != "string" ) continue;//svg的className是个对象，所以下面判断会有bug
			if (css && (typeof obj.className == "string" && obj.className!=css && !obj.className.match(regexp))) continue;
			if (attr && !val && !obj.getAttribute(attr)) continue;
			if (attr && val && obj.getAttribute(attr)!=val) continue;
			arr.push(obj);
		}
		return arr;
	}
	P.start = function(){
		var self = this;
        if(self.dateInputField){
		    self.dateInputField.onclick = function(e){
			    if(self.wrapper&&self.wrapper.style.display == 'block'){
				    self.hide();
				    return;
			    }
			    self.show();
		    }
		    self.dateInputField.onfocus = function(){this.blur()};
        } else {
            self.show();
        }
	}
	P.init = function(){
		var self = this;
		var fmt = self.parseFormat();
		var data = (self.dateInputField && self.dateInputField.value) || self.initDate || new Date();
		
		if(typeof data == 'string'){
			var d = data.split(self.split);
			data = new Date(d[fmt['y']['num']],d[fmt['m']['num']]*1-1,d[fmt['d']['num']]);
		}
		self.curDate = new Date(data.getTime());
		self.selectedDate = new Date(data.getTime());
		//self.dateInputField.value = self.formatDate(self.curDate.getFullYear().toString(),self.curDate.getMonth().toString(),self.curDate.getDate().toString());
		self.initDom();
		self.buildDatePanel(data.getFullYear(),data.getMonth());
		self.initEvent();
		if(isFunction(self.oninit))self.oninit(self);
		self.inited = true;
	}
	P.custom = function(date,cell){
		var self = this;
		if(self.selectedDate.getTime()==date.getTime()){
			addClass(cell,self.cls.active);
		}
		if(typeof self.customCell == 'function') return self.customCell(date,cell) || cell;
        return cell;
	}
    P.setFromDate = function(date){
        if(!date)return;
        var self = this;
        var fmt = self.parseFormat();
        var ds = date.split(self.split);
        var y = ds[fmt['y']['num']]*1;
        var m = ds[fmt['m']['num']]*1-1;
        var d = ds[fmt['d']['num']]*1;
        self.fromDate = new Date(y, m, d, 0).getTime();
    };
    P.setEndDate = function(date){
        if(!date)return;
        var self = this;
        var fmt = self.parseFormat();
        var ds = date.split(self.split);
        var y = ds[fmt['y']['num']]*1;
        var m = ds[fmt['m']['num']]*1-1;
        var d = ds[fmt['d']['num']]*1;
        self.endDate = new Date(y, m, d, 23).getTime();
    };
	P.dateHandler = function(y,m,d,dir){
		var self = this;
        var today = new Date();
		function isToday(yy,mm,dd){
			return (yy==today.getFullYear()&&mm==today.getMonth()&&dd==today.getDate());	
		}
		function afterToday(yy,mm,dd){
			return new Date(yy,mm,dd).getTime()>today.getTime();	
		}
		if(!d)return format(self.temp.col,'&nbsp;');
		var date = new Date(y,m+dir,d),day = date.getDay();
		var a = document.createElement('a');
			a.className = self.cls.dateCell;
			a.setAttribute(self.attrDate,d);
			a.href='javascript:\;';
		if(isToday(y,m,d)){
			addClass(a,self.cls['today']);
		}
		if(day==0||day==6){
			addClass(a,self.cls['weekend']);
		}
		if(dir==-1){
			addClass(a,self.cls['prevMonth']);
		}else if(dir==1){
			addClass(a,self.cls['nextMonth']);
		}
        
		if(self.fromDate && new Date(y,m,d).getTime() < self.fromDate){
			addClass(a,self.cls.disabled);
            self.noPrev = true;
            if(self.prevMonthBtn)self.prevMonthBtn.style.visibility = 'hidden';
		}
		if(self.endDate && new Date(y,m,d).getTime() > self.endDate){
			addClass(a,self.cls.disabled);
            self.noNext = true;
            if(self.nextMonthBtn)self.nextMonthBtn.style.visibility = 'hidden';
		}
		if(self.disAfterToday && afterToday(y,m,d)){
			addClass(a,self.cls.disabled);
            self.noNext = true;
            if(self.nextMonthBtn)self.nextMonthBtn.style.visibility = 'hidden';
		}
		a.innerHTML = d;
		a = self.custom(date,a);
		return format(self.temp.col,domToString(a));
	}
	P.parseFormat = function(){
		var self = this;
		var split = self.format.match(/\W{1}/)[0];
		var fmt = self.format.split(split);
		var len = fmt.length;
		var obj = {}
		self.split = split;
		for(var i=0;i<len;i++){
			if(/^yy|yyyy$/i.test(fmt[i])){
				obj['y'] = {'len':fmt[i].length,'num':i}
			}else if(/^mm$/i.test(fmt[i])){
				obj['m'] = {'len':fmt[i].length,'num':i}
			}else{
				obj['d'] = {'len':fmt[i].length,'num':i}
			}
		}
		return obj;
	}
	P.formatDate = function(y,m,d){
		var self = this;
		m = (m*1+1).toString();
		if(m.length<2)m = '0'+m;
		if(d.length<2)d = '0'+d;
		var fmt = self.parseFormat(),set = [];
		if(fmt['y']){ y = y.substr(- fmt['y']['len']);set[fmt['y']['num']] = y};
		if(fmt['m']){ m = m.substr(- fmt['m']['len']);set[fmt['m']['num']] = m};
		if(fmt['d']){ d = d.substr(- fmt['d']['len']);set[fmt['d']['num']] = d};
		return set.join(self.split);
	}
	P.getOneMonth = function(y,m){
		var self = this;
		function existDate(y,m,d){
			var newDate = new Date(y,m,d);
			return (newDate.getFullYear()==y&&newDate.getMonth()==m&&newDate.getDate()==d)
		}
		var dates = [];
		var th = find({'parent':self.datePanel,'attr':self.daynum});
		for(var i = 1;i<32;i++){
			if(existDate(y,m,i)){
				if(i==1){
					var dt = new Date(y,m,i);
					var day = dt.getDay();
					if(th.length>0){
						for(var j=0;j<th.length;j++){
							var tDay = th[j].getAttribute(self.daynum);

							if(tDay!=day){
								dates.push('');
							}else {
								self.prevNum = dates.length;
								if(self.showOtherMonth){
									for(var n=self.prevNum;n>0;n--){
										dates[n-1] = new Date(y,m,n-self.prevNum).getDate();
									}
								}
								break;
							}
						}
					}else{
						self.prevNum = day;
						for(var k=0;k<day;k++){
							if(self.showOtherMonth){
								dates.push(new Date(y,m,k-day).getDate());
							}else{
								dates.push('');
							}
						}
					}
				}
				dates.push(i);
			}
		}
		var len = dates.length%7;
		if(len>0){
			self.nextNum = 7-len;
			for(var l=0;l<self.nextNum;l++){
				if(self.showOtherMonth){
					dates.push(l+1);
				}else{
					dates.push('');
				}
			}
		}
		return dates;
	}
	P.buildDatePanel = function(y,m){
		var self = this;
		var dates = self.getOneMonth(y,m);
		var col = '',row = '';
        self.noPrev = false;
        self.noNext = false;
        if(self.prevMonthBtn)self.prevMonthBtn.style.visibility = 'visible';
        if(self.nextMonthBtn)self.nextMonthBtn.style.visibility = 'visible';
		for(var i=0;i<dates.length;i++){
			var dir = 0;
			if(self.showOtherMonth){
				if(i<self.prevNum) dir = -1;
				if(dates.length-i<=self.nextNum) dir = 1;
			}
			col += self.dateHandler(y,m,dates[i],dir);
			if(i%7==6){
				row += format(self.temp.row,col);
				col = '';
			}
		}
		self.datePanel.innerHTML = format(self.temp.content,row);
        if(self.titleYear)self.titleYear.innerHTML = y;
        if(self.titleMonth)self.titleMonth.innerHTML = m+1;
        self.curDate = new Date(y,m);
		if(isFunction(self.onchange))self.onchange(y, m+1);
	}
	P.initDom = function(){
		var self = this;
		var n = document.createElement('div');
        var container = self.container;
		n.className = self.cls.wrapper;
		n.innerHTML = '<div class="'+self.cls.title+'">'+self.initTitle()+'</div><div class="'+self.cls.datePanel+'"></div>';
		container.appendChild(n);
		self.wrapper = n;
        if(self.dateInputField) self.initDomPos();
		self.datePanel = find({'parent':n,'css':self.cls.datePanel})[0];
		self.datepickerTitle = find({'parent':n,'css':self.cls.title})[0];
		self.datePanel.innerHTML = format(self.temp.content,'');
	}
    P.initDomPos = function(){
        var self = this;
        var n = self.wrapper;
		var pos = self.dateInputField.getBoundingClientRect();
		n.style.left = pos.left +'px';
		n.style.top = pos.bottom + (document.documentElement.scrollTop||document.body.scrollTop) +'px';	
    }
	P.initTitle = function(){
		var self = this;
		return format(self.temp.title,{'year':self.curDate.getFullYear(),'month':self.curDate.getMonth()+1});
	}
	P.initEvent = function(){
		var self = this;
		function bind(elem,type,fn){
			if(elem.addEventListener){
				elem.addEventListener(type,fn,false);
			}else if(elem.attachEvent){
				elem.attachEvent('on'+type,fn);
			}else {
				elem['on'+type] = fn;
			}
		}
		function trigger(elem,type){
			var e;
			if(document.createEvent){
				e = document.createEvent('Events');
				e.initEvent(type,true,false);
			}else if(document.createEventObject){
				e = document.createEventObject();
			}
			if(elem.dispatchEvent){
	
				elem.dispatchEvent(e);
			}else if(elem.fireEvent){
				elem.fireEvent('on'+type,e);
			}
		}
		var mapping = self.getHandlerMap();
		for(var i=0;i<mapping.length;i++){
			mapping[i].elem&&bind(mapping[i].elem,mapping[i].event||'click',mapping[i].handler);
		}
		bind(document.body,'click',function(e){
			e = e||window.event;
			var input = e.target||e.srcElement;
			if(input != self.dateInputField){
				self.hide();
			}
		});
		bind(self.wrapper,'click',function(e){
			e = e||window.event;
			var node = e.target||e.srcElement,dir = 0;
			if(hasClass(node,self.cls.dateCell)&&!hasClass(node,self.cls.disabled)){
				var d = node.getAttribute(self.attrDate)*1;
				if(hasClass(node,self.cls.prevMonth)) dir=-1;
				if(hasClass(node,self.cls.nextMonth)) dir=1;
				var now = new Date(self.curDate.getFullYear(),self.curDate.getMonth()+dir,d);
				var val = self.formatDate(now.getFullYear().toString(),(now.getMonth()).toString(),d.toString());
                if(self.dateInputField){
				    self.dateInputField.value = val;
				    self.hide();
                }
				self.selectedDate = now;
				self.curDate = now;

				if(isFunction(self.callback))self.callback(val, node);
			}
		});
	}
	P.getHandlerMap = function(){
		var self = this,
			wrapper = self.wrapper;
			self.prevMonthBtn = find({'parent':wrapper,'css':self.cls.prevBtn})[0];
			self.nextMonthBtn = find({'parent':wrapper,'css':self.cls.nextBtn})[0];
			self.titleYear = find({'parent':wrapper,'css':self.cls.titleYear})[0];
			self.titleMonth = find({'parent':wrapper,'css':self.cls.titleMonth})[0];

		return [{
					'elem':self.prevMonthBtn,
					'handler':function(e){
						e = e||window.event;
						e.stopPropagation&&e.stopPropagation();
						e.preventDefault&&e.preventDefault();
						e.cancelBubble = true;
						e.returnValue = false;
						self.prevMonth(function(date){
							self.titleYear.innerHTML = date.getFullYear();
							self.titleMonth.innerHTML = date.getMonth()+1;

						});
					}
				},{
					'elem':self.nextMonthBtn,
					'handler':function(e){
						e = e||window.event;
						e.stopPropagation&&e.stopPropagation();
						e.preventDefault&&e.preventDefault();
						e.cancelBubble = true;
						e.returnValue = false;
						self.nextMonth(function(date){
							self.titleYear.innerHTML = date.getFullYear();
							self.titleMonth.innerHTML = date.getMonth()+1;

						});
					}
				}];
	}
	P.gotoMonth = function(year,month,callback){
		var self = this;


		var date = new Date(year,month);
		var y = date.getFullYear(), m = date.getMonth();
		if(self.validateMonth(y,m+1)!==false){
			self.buildDatePanel(y,m);
			self.curDate = date;
			if(isFunction(callback))callback(date);
		}
	}
	P.prevMonth = function(callback){
		var self = this;

		self.gotoMonth(self.curDate.getFullYear(),self.curDate.getMonth()-1,callback);


	}
	P.nextMonth = function(callback){
		var self = this;
		self.gotoMonth(self.curDate.getFullYear(),self.curDate.getMonth()+1,callback);
	}
	P.show = function(){
		var self = this;
        if(self.dateInputField){
		    var dps = find({css:self.cls.wrapper});
		    for(var i=0;i<dps.length;i++){
			    dps[i].style.display = 'none';
		    }
        }
		if(!self.inited)self.init();
		else{
			self.initDomPos();
			self.buildDatePanel(self.curDate.getFullYear(),self.curDate.getMonth());
			self.titleMonth.innerHTML = self.curDate.getMonth()+1;
		}
		self.wrapper.style.display = 'block';
       
	}
	P.hide = function(){
		var self = this;
        if(!self.inited || !self.dateInputField) return;
		self.wrapper.style.display = 'none';
		self.onhide&&self.onhide(self);
	}
	P.disable = function(elem){
		var self = this;
		addClass(elem,self.cls.disabled);
	}
	P.enable = function(elem){
		var self = this;
		removeClass(elem,self.cls.disabled);
	}
	P.addAction = function(elem,handler){
		var self = this;
		if(self.handlerMapping){
			self.handlerMapping.push({
				'elem':elem,
				'handler':handler
			});
		}
	}
})(datePicker,datePicker.prototype);

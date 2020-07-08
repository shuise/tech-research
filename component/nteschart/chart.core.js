/**
 * NTESChart
 [ function ] 图表绘制内核
 * 
 > 参数
 - options [Object] 画布参数
 */

(function(){
  var doc = document.documentElement;
  var PI = Math.PI, cos = Math.cos, sin = Math.sin, round = Math.round;
  var ArrayProto = Array.prototype;
  var nativeMap = ArrayProto.map;
  var nativeReduce = ArrayProto.reduce;
  var NC = function(options){
    if(!NC.scratch){
      NC.scratch = Raphael(-100, -100, 1, 1);
      NC.scratchPole = NC.scratch.path("M0,0L0,0");
    }
    this.options = NC.deepExtend({
      container : document.body,
      type : 'svg',
      zoom : 1
    }, options);
    options = this.options;
    var container = options.container;
    if (!options.width) {
      options.width = container.offsetWidth || 600;
    }
    if (!options.height) {
      options.height = container.offsetHeight || 400;
    }
    
    this.$$padding = {
      left : parseInt(NC.getStyle(container, 'paddingLeft') || 0),
      top : parseInt(NC.getStyle(container, 'paddingTop') || 0)
    };
    this.status = {
      containerWidth : options.width,
      containerHeight : options.height,
      oContainerWidth : 0
    }
    var that = this;
    var initFuncs = {
      'svg' : function(){
        that.$$r = Raphael(options.container, 
                           options.width, 
                           options.height);
        that.$$r.setViewBox(0, 0, options.width, options.height);
      }
    };
    initFuncs[this.options.type]();
    this.init();
    this.initEve();
    this.initResize();
    this.htmlObjs = [];
    this.chartObjs = [];
  };
  Raphael.st.scaleAt = function(sx, sy, cx, cy){
    return this.transform(['m', sx, 0, 0, sy, (1-sx)*cx, (1-sy)*cy]);
  }

  NC.isMobile = /(android|ipad|ipod|blackberry|mobile|phone)/i.test(navigator.userAgent);
  var touchEvents = {
    click : 'touchend',
    mousedown : 'touchstart',
    mouseup : 'touchend',
    mouseover : 'touchstart',
    mouseout : 'touchend',
    mousemove : 'touchmove'
  };
  NC.evName = function(name){
    return NC.isMobile ? touchEvents[name] : name;
  };
  NC.$$font = '12px 微软雅黑, Arial';
  NC.$$sfont = '11px 微软雅黑, Arial';
  NC.$$attr = {
    txt : {txtAttr : {font: NC.$$font, fill : '#555'}},
    screen : {stroke: "none", fill: "#fff", opacity: 0}
  };
  NC.isObject = function(obj) {
    var type = typeof obj;
    if (null === obj || 'undefined' === type || 'string' === type || undefined !== obj.nodeType) { //ie fix
      return false;
    }
    return  Object.prototype.toString.call(obj) === '[object Object]';
  };
  
  NC.isArray = Array.isArray || function (obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
  };
  
  NC.isFunction = function(obj) {
    return Object.prototype.toString.call(obj) === '[object Function]';
  };

  NC.each = function(obj, iterator, context) {
    if (obj == null) return;
    if (obj.length === +obj.length) {
      for (var i = 0, length = obj.length; i < length; i++) {
        if (iterator.call(context, obj[i], i, obj) === false) return;
      }
    } else {
      for (var key in obj) {
        if (iterator.call(context, obj[key], key, obj) === false) return;
      }
    }
  };
  
  var rAF = window.requestAnimationFrame||
	    window.webkitRequestAnimationFrame	||
	    window.mozRequestAnimationFrame		||
	    window.oRequestAnimationFrame		||
	    window.msRequestAnimationFrame		||
	    function (callback) { window.setTimeout(callback, 30); };

  NC.animate = function(vals, duration, onStep, onEnd){
    duration = duration || 1000;
    var _startTime = this.startTime = new Date, len = vals.length;
    var step = function(){
      var _passTime = (new Date) - _startTime;
      var progress = _passTime / duration;
      if(progress < 1){
        var _vals = [];
        for(var i = 0; i < len; i ++){
          _vals.push(vals[i] * progress);
        }
        onStep(_vals);
        rAF(step);
      }else{
        onStep(vals);
        onEnd && onEnd();
      }
    };
    rAF(step);
  };
  
  NC.map = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    NC.each(obj, function(value, index, list) {
      results.push(iterator.call(context, value, index, list));
    });
    return results;
  };
  
  NC.reduce = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context && iterator.bind) iterator = iterator.bind(context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    NC.each(obj, function(value, index, list) {
      if (!initial) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError('Reduce of empty array with no initial value');
    return memo;
  };
  
  NC.deepExtend = NC.DeepExtend = function(){
    //将第2-n个参数覆盖到第1个中(如果是json，递归覆盖json中的值)
    var target = arguments[0];
    for (var i = 1, l = arguments.length; i < l; i++) {
      var extension = arguments[i];
      for (var key in extension) {
        var copy = extension[key];
        if (copy == null || copy === target[key]) continue;
        if (NC.isObject(copy) && NC.isObject(target[key])){
          NC.deepExtend((target[key] || (target[key] = {})), copy);
          continue;
        }
        if (typeof copy == 'function' && typeof target[key] == 'function' && !target[key].base) {
          copy.base = target[key];
        }
	    target[key] = copy;
      }
    }
    return target;
  };
  
  NC.deepSupplement = function(){
    //将第2-n个参数补充到第1个中(如果是json，递归补充json中的值)
    var target = arguments[0];
    for (var i = 1, l = arguments.length; i < l; i++) {
      var extension = arguments[i];
      for (var key in extension) {
        var copy = extension[key];
        if (copy === target[key]) continue;
        if (NC.isObject(copy)){
          NC.deepSupplement((target[key] || (target[key] = {})), copy);
          continue;
        }
        if (typeof copy == 'function' && typeof target[key] == 'function' && !target[key].base) {
          target[key].base = copy;
        }
        if (!target.hasOwnProperty(key) && extension.hasOwnProperty(key)) {
	        target[key] = copy;
        }
      }
    }
    return target;
  };
  
  NC.getHSB = function(color){
    var hsb = {};
    if (/hsb\(([0-9\.]+),([0-9\.]+),([0-9\.]+)\)/.test(color)) {
      hsb.h = RegExp.$1;
      hsb.s = RegExp.$2;
      hsb.b = RegExp.$3;
    }else if (/^#[0-9a-f]{6}$/i.test(color)) {
      var rgb = Raphael.getRGB(color);
      hsb = Raphael.rgb2hsb(rgb.r, rgb.g, rgb.b);
    }
    return hsb;
  };
  
  NC.colorSB = function(color, s, b, toRGB){
    if(!/^(#|hsb)/.test(color)) return color;
    var hsb = NC.getHSB(color);
    hsb.s = hsb.s * s;
    if(hsb.s > 1) hsb.s = 0.98;
    hsb.b = hsb.b * b;
    if(hsb.b > 1) hsb.b = 0.98;
    return toRGB
      ? Raphael.hsb2rgb(hsb.h, hsb.s, hsb.b).hex
      : "hsb("+hsb.h+","+hsb.s+","+hsb.b+")";
  }
  
  NC.getGradient = function(color, direction){
    direction = direction || 15;
    var hsb = NC.getHSB(color);
    var c1 = Raphael.hsb2rgb(hsb.h, hsb.s, hsb.b).hex;
    var c2 = Raphael.hsb2rgb(hsb.h, hsb.s, hsb.b*0.8).hex;
    var c3 = Raphael.hsb2rgb(hsb.h, hsb.s, hsb.b*0.7).hex;
    return direction + '-' + c1 + '-' + c2 + '-' + c3;
  }
  //获取曲线控制点
  NC.getAnchors = function(p1x, p1y, p2x, p2y, p3x, p3y) {
    var l1 = (p2x - p1x) / 2,
        l2 = (p3x - p2x) / 2,
        a = Math.atan((p2x - p1x) / (Math.abs(p2y - p1y) || 1e-10)),
        b = Math.atan((p3x - p2x) / (Math.abs(p2y - p3y) || 1e-10));
    a = p1y < p2y ? PI - a : a;
    b = p3y < p2y ? PI - b : b;
    var alpha = PI / 2 - ((a + b) % (PI * 2)) / 2,
        dx1 = l1 * sin(alpha + a),
        dy1 = l1 * cos(alpha + a),
        dx2 = l2 * sin(alpha + b),
        dy2 = l2 * cos(alpha + b);
    return {
      x1: (p2x - dx1).toFixed(3),
      y1: (p2y + dy1).toFixed(3),
      x2: (p2x + dx2).toFixed(3),
      y2: (p2y + dy2).toFixed(3)
    };
  }
  
  NC.quoteNum = function (n){
    var str = n.toString().replace(/[^\-\d\.]/g, '');
    if (/(\d+)(\.\d+)/.test(str)) {
      return NC.quoteNum(RegExp.$1) + RegExp.$2;
    }
    var arr = str.split('');
    for (var i = arr.length-3; i > 0; i-=3) {
      arr.splice(i, 0, ",");
    }
    return arr.join("");
  }
  
  NC.getStyle = function(node, prop) {
	if(node.currentStyle) {
	  return node.currentStyle[prop] || '';
	}else if(window.getComputedStyle) {
	  return window.getComputedStyle(node , null)[prop];
	}else{
      return '';   
    }
  }
  
  var tokenRegex = /\{([^\}]+)\}/g,
      objNotationRegex = /(?:(?:^|\.)(.+?)(?=\[|\.|$|\()|\[('|")(.+?)\2\])(\(\))?/g, // matches .xxxxx or ["xxxxx"] to run over object properties
      replacer = function (all, key, obj) {
        var res = obj;
        key.replace(objNotationRegex, function (all, name, quote, quotedName, isFunc) {
          name = name || quotedName;
          if (res) {
            if (name in res) {
              res = res[name];
            }
            typeof res == "function" && isFunc && (res = res());
          }
        });
        if (res == null) {
          res = "";
        }else{
          res = (res == obj ? all : res) + "";
        }
        return res;
      };
  
  NC.subs = function (str, obj) {
    return String(str).replace(tokenRegex, function (all, key) {
      return replacer(all, key, obj);
    });
  };
  
  function htmlTip(opts, paper){
    var chart = opts.chart;
    this.$$r = paper;
    this.options = opts;
    this.midx = opts.left + opts.width / 2;
    this.midy = opts.top + opts.height / 2;
    this.$body = document.createElement("div");
    this.$body.className = "nteschart-tip";
    this.$body.onmouseover = function(){
      if(chart.tip_timer) clearTimeout(chart.tip_timer);
    };
    this.$arrow = document.createElement("i");
    this.$arrow.className = "nteschart-tip-arrow";
    this.$body.appendChild(this.$arrow);
    this.$content = document.createElement("div");
    this.$content.className = "nteschart-tip-content";
    this.$body.appendChild(this.$content);
    
    if(NC.getStyle(opts.wrap, 'position') == 'static'){
      opts.wrap.style.position = 'relative';
    }
    opts.wrap.appendChild(this.$body);
    
    if(opts.docked){
      var canvasOptions = chart.$$canvas.options;
      var maxWidth = canvasOptions.width - 8;
      //var cx = opts.cx || ((chart.options.left || 0) + chart.options.width / 2);
      var cx = opts.cx || canvasOptions.width / 2;
      var width = Math.min(opts.boxWidth || maxWidth, maxWidth, cx*2);
      var left = cx - width / 2;
      this.$body.style.width = width + 'px';
      this.$body.style.left = left + 'px';
      this.$arrow.style.marginLeft = -left + 'px';
      if(chart.options.radius){
        var top = (chart.options.radius - canvasOptions.height / 2 + 20)
        this.$body.style.top = top + 'px';
      }
    }
    this.reset();
  }
  htmlTip.prototype = {
    reset : function(){
      this.milestone = null;
      this.average = 0;
      this.rows = [];
      this.sum = 0;
    },
    update : function(info){
      if(!info.data) info.data = {}; //why empty
      fixTipsInfo(info.data, this.options.fixTips);
      var label = NC.subs(info.label || "{text}", info.data);
      var opts = this.options;
      this.x = info.x;
      this.y = info.y;
      
      if(opts.group){  //tips合并显示
        var chart = opts.chart;
        if(chart.parsedData[chart.curSeries]){
          var iseq = chart.parsedData[chart.curSeries].iseq;
          if(label.substr(0,1) != '<') {
            label = "<tr><td><i></i>" + label;
          }
          if(chart.colorArr){
            var color = chart.colorArr[iseq].plot;
            label = label.replace(/<i><\/i>/, "<i style='background:" + color + "'></i>");
          }
        }
        this.sum += info.data._o.y;
        this.average += info.data._o.average;
        this.xtick = info.data.xtick;
        if(info.data.gtitle) this.title = info.data.gtitle;
        if(info.data.milestone) {
          this.milestone = info.data.milestone;
        }
        label = label.replace(/\t/g, '<td>');
        if(opts.rankOrder){
          this.rows.push(label);
        }else{
          this.rows[chart.curSeries] = label;
        }
      }else if(opts.single){  //单个tip
        info.data.rows = label;
        this.$content.innerHTML = NC.subs(opts.single, info.data);
      }
    },
    hide : function(){
      if(this.set) {
        this.set.remove();
        this.set = null;
      }
      if(this.$body){
        this.$body.style.display = "none";
      }
    },
    remove : function(){
      this.hide();
      if(this.$body){
        var wrap = this.$body.parentNode;
        if(wrap && (wrap == this.options.wrap)){
          wrap.removeChild(this.$body);
        }
      }
    },
    show : function(){
      var r = this.$$r;
      var opts = this.options;
      if(opts.group){  //tips合并显示
        var info = {
          rows : this.rows.join("\n"),
          milestone : this.milestone,
          xtick : this.xtick,
          title : this.title,
          sum : this.sum,
          average : this.average
        };
        if(NC.isFunction(opts.fixTips)){
          opts.fixTips(info);
        }
        this.$content.innerHTML = NC.subs(opts.group, info);
      }
      
      this.$body.style.display = "block";
      if(opts.docked){ //重新定位tips指示箭头
        opts.wrap.style.paddingBottom = this.$body.offsetHeight + this.$arrow.offsetHeight + 'px';
        this.$arrow.style.left = this.x - this.$arrow.offsetWidth/2 + 'px';
      }else{ //重新定位tips框
        var offW = this.$body.offsetWidth;
        var offH = this.$body.offsetHeight;
        var top, left;
        if(opts.group){
          top = this.midy - offH / 2;
        }else{
          top = this.y - offH / 2;
        }
        if(this.x > this.midx){
          left = this.x - offW - opts.offset;
        }else{
          left = this.x + opts.offset;
        }
        this.$body.style.top = top + opts.padding.top + 'px';
        this.$body.style.left = left + opts.padding.left + 'px';
      }
      
      //绘制指示竖线
      if(this.set) this.set.remove();
      this.set = r.set();
      var vlineAttr = typeof opts.vline == 'object' ? opts.vline
            : {stroke:'#666666'};
      if(opts.vline){
        var chart = opts.chart;
        var vline = r.path(
          ["M", this.x, opts.top, "v", opts.height].join(" ")
        ).attr(vlineAttr);
        if(chart.$framepole) vline.insertBefore(chart.$framepole);
        else if(chart.$pole) vline.insertBefore(chart.$pole);
        this.set.push(vline);
      }
    }
  };
  
  NC.prototype.htmlTip = function(chart){
    var fOptions = chart.options;
    var htipOpts = NC.deepExtend({
      wrap : this.options.container,
      chart : chart,
      offset : 5,
      cx : fOptions.cx,
      left : fOptions.left || 0,
      top : fOptions.top || 0,
      width : fOptions.width,
      height : fOptions.height,
      padding : this.$$padding,
      fixTips : fOptions.fixTips
    }, fOptions.htmlTips);
    var htmlObj = new htmlTip(htipOpts, this.$$r);
    this.htmlObjs.push(htmlObj);
    return htmlObj;
  }
  
  var Tip = function(opts){
    this.options = {
      x: 100,
      y: 100,
      type : 'frame',
      label : '{text}',
      labelPos : 'right',
      fillAttr : {}, //背景色
      plotAttr : {},  //边框
      txtAttr : [{font: '12px 宋体', fill: "#fff"},
                 {font: '12px Helvetica, Arial', fill: "#ff0"},
                 {font: '12px Helvetica, Arial', fill: "#ff0"}]  //文字
    };
    NC.deepExtend(this.options, opts);
  };
  
  Tip.prototype = {
    drawLabel : function(label){
      var options = this.options;
      var r = this.$$r;
      var labels = label.toString().split("\n");
      var labelSet = r.set();
      var yk = 0;
      NC.each(labels, function(label, k){
        if (label != '') {
          yk ++;
          labelSet.push(r.text(options.x, options.y + yk*16, label).
                        attr(options.txtAttr[k] || options.txtAttr[0]));
        }
      });
      return labelSet;
    },
    init : function(){
      var options = this.options;
      var r = this.$$r;
      this.set = r.set();
      this.is_label_visible = false;
      this.labelSet = this.drawLabel(options.label);
      this.labelSet.hide();
      this.body = this.$$canvas.popup(options.x, options.y, this.labelSet, options.labelPos).hide();
      this.set.push(this.body);
      this.set.push(this.labelSet);
      var canvas = this.$$canvas;
      var that = this;
      return this;
    },
    moveBody : function(pole){
      this.body.insertBefore(pole);
      this.labelSet.insertBefore(pole);
    },
    show : function(){
      this.body.show();
      this.labelSet.show();
      this.is_label_visible = true;
      return this;
    },
    hide : function(){
      if(!this.body) return this;
      this._id = null;
      this.body.hide();
      this.labelSet.hide();
      this.is_label_visible = false;
      return this;
    },
    remove : function(){
      if(!this.body) return this;
      this._id = null;
      this.body.remove();
      this.labelSet.remove();
      return this;
    },
    update : function(_params){
      if(!this.body) this.init();
      var that = this;
      var canvas = this.$$canvas;
      var r = this.$$r;
      var params = {
        x : this.options.x,
        y : this.options.y,
        defaultAttr : {fill: "#fff", stroke: "#999",  'stroke-width' : 1},
        activeAttr : {fill: "#ff0", stroke: "#888"},
        hoverAttr : {fill: "#f00", stroke: "#202020"},
        animate : false,
        labelPos : "right"
      }
      NC.deepExtend(params, _params);
      
      var options = this.options;
      var side = params.labelPos;
      var x = params.x;
      var y = params.y;
      if (this.labelSet[0].transform()[0]) {
        this.lx = this.labelSet[0].transform()[0][1];
        this.ly = this.labelSet[0].transform()[0][2];
      }
      fixTipsInfo(params.data, options.fixTips);
      var label = NC.subs(params.label || options.label || "{text}", params.data);
      var set = this.drawLabel(label).insertBefore(this.labelSet);
      var tbb = set.getBBox();
      this.labelSet.remove();
      this.set.splice(1,1, set);
      this.labelSet = set;
      if (x + tbb.width / 2 + 3 > canvas.options.width) {
        side = 'left';
      }else if (x - tbb.width / 2 - 3 < 0) {
        side = 'right';
      }
      if (params.animate && Raphael.svg) {
        this.labelSet.translate(this.lx, this.ly);
        //动画
        var ppp = canvas.popup(x, y, this.labelSet, side, 1);
        this.lx += ppp.dx;
        this.ly += ppp.dy;
        if (this.is_label_visible) {
          
          var anim = Raphael.animation({
            path: ppp.path,
            transform: ["t", ppp.dx, ppp.dy]
          }, 200);
          var anim2 = Raphael.animation({
            transform: ["t", this.lx, this.ly]
          }, 200);
          
          this.body.animate(anim).show();
          this.labelSet.animate(anim2).show();
        } else {
          this.body.attr({
            path: ppp.path,
            transform: ["t", ppp.dx, ppp.dy]
          }).show();
          this.labelSet.attr({
            transform: ["t", this.lx, this.ly]
          }).show();
        }
        this.is_label_visible = true;
      }else{ //重新创建this.body
        var bb = this.labelSet.getBBox();
        this.body.remove();
        this.body = canvas.popup(x, y, this.labelSet, side);
        this.set.splice(0, 1, this.body);
        this.labelSet.show();
        this.is_label_visible = false;
      }
    }
  };
  
  NC.prototype.initEve = function(){
    var container = this.options.container;
    container.onmouseout = function(){
      eve("containerOut");
    };
    container.onmouseover = function(){
      eve("containerOver");
    };
  }

  NC.prototype.setSize = function(width, height){
    width = width || this.options.width;
    height = height || this.options.height;
    this.options.width = width;
    this.options.height = height;
    this.$$r.setSize && this.$$r.setSize(width, height);
    this.$$r.setViewBox && this.$$r.setViewBox(0, 0, width, height);
  };
  
  NC.prototype.initResize = function(){
    var self = this;
    var container = this.options.container;
    this.status.oContainerWidth = container.offsetWidth;
    this.status.oContainerHeight = container.offsetHeight;
    
    var _chartWidth = this.options.width, tm_resize;
    eve.on("winResize", function(){
      if(tm_resize) clearTimeout(tm_resize);
      tm_resize = setTimeout(function(){
        var newWidth = container.offsetWidth;
        var newHeight = container.offsetHeight;
        //隐藏状态下不重绘，容器大小不变不重绘，容器太小不重绘
        var ddw = Math.abs(newWidth - self.status.oContainerWidth);
        var ddh = Math.abs(newHeight - self.status.oContainerHeight);
        if(newWidth > 250 && ddw > 15 || newHeight > 250 && ddh > 15){
          var dw = newWidth - self.status.containerWidth; //相对于容器初始宽
          var dh = newHeight - self.status.containerHeight;  //相对于容器初始高
          self.options.width = _chartWidth + dw;
          self.$$r.setSize && self.$$r.setSize(newWidth, container.offsetHeight);
          self.$$r.setViewBox && self.$$r.setViewBox(0, 0, newWidth, container.offsetHeight);
          eve("chartResize", self, dw, dh);
          self.status.oContainerWidth = newWidth;
          self.status.oContainerHeight = newHeight;
        }
        tm_resize = null;
      }, 50);
    });
  }
  
  NC.prototype.init = function(){
    var r = this.$$r;
    //外弧
    r.customAttributes.arcsegment = function (x, y, radius, a1, a2) {
      var flag = (a2 - a1) > 180;
      radius = radius + 3;
      a1 = (a1 % 360) * PI / 180;
      a2 = (a2 % 360) * PI / 180;
      return {
        path: [
          ["M", x + radius * cos(a1), y + radius * sin(a1)], 
          ["A", radius, radius, 0, +flag, 1, x + radius * cos(a2), y + radius * sin(a2)]
        ],
        "stroke-width": 3
      };
    };
    //扇形
    r.customAttributes.sector = function (x, y, radius, a1, a2, radius2) {
      radius2 = radius2 || 0;
      var flag = (a2 - a1) > 180 ? 1 : 0;
      a1 = (a1 % 360) * PI / 180;
      a2 = (a2 % 360) * PI / 180;
      var a = (a1 + a2) / 2;
      return  radius2 ? {
        path: [
          ["M", x + radius2 * cos(a2), y + radius2 * sin(a2)], 
          ["A", radius2, radius2, 0, flag, 0, x + radius2 * cos(a1), y + radius2 * sin(a1)], 
          ["L", x + radius * cos(a1), y + radius * sin(a1)], 
          ["A", radius, radius, 0, flag, 1, x + radius * cos(a2), y + radius * sin(a2)], 
          ["z"]
        ]
      } : {
        path: [
          ["M", x + radius * cos(a1), y + radius * sin(a1)], 
          ["A", radius, radius, 0, flag, 1, x + radius * cos(a2), y + radius * sin(a2)],  
          ["L", x, y], 
          ["z"]
        ]
      }
    };
    var dotIcons = {
      'diamond' : function(cx, cy, width, height){
        width = width || 7;
        height = height || 7;
        return {
          path : [
            ["M", cx, cy - height/2], 
            ["l", width/2, height/2],
            ["l", -width/2, height/2],
            ["l", -width/2, -height/2],
            ["z"]
          ]
        }
      },
      'tri' : function(cx, cy, size){
        size = size || 8;
        return {
          path : [
            ["M", cx, cy - size/2], 
            ["l", 0.42*size, 0.75*size],
            ["l", -0.84*size, 0],
            ["z"]
          ]
        }
      },
      'x' : function(cx, cy, r){
        r = r || 4;
        return {
          path : [
            ["M", cx + r * sin(PI/4), cy - r * cos(PI/4)], 
            ["L", cx - r * sin(PI/4), cy + r * cos(PI/4)],
            ["M", cx - r * sin(PI/4), cy - r * cos(PI/4)], 
            ["L", cx + r * sin(PI/4), cy + r * cos(PI/4)]
          ]
        }
      },
      '*' : function(cx, cy, r){
        r = r || 4;
        return {
          path : [
            ["M", cx + r * sin(PI/3), cy - r * cos(PI/3)], 
            ["L", cx - r * sin(PI/3), cy + r * cos(PI/3)],
            ["M", cx, cy - r], 
            ["L", cx, cy + r],
            ["M", cx - r * sin(PI/3), cy - r * cos(PI/3)], 
            ["L", cx + r * sin(PI/3), cy + r * cos(PI/3)]
          ]
        }
      },
      'star' : function(cx, cy, r){
        r = r || 4;
        var r2 = r * 0.55;
        return {
          path : [
            ["M", cx, cy - r], 
            ["L", cx + r2 * sin(PI/5), cy - r2 * cos(PI/5)],
            ["L", cx + r * sin(2*PI/5), cy - r * cos(2*PI/5)],
            ["L", cx + r2 * sin(2*PI/5), cy + r2 * cos(PI/5)],
            ["L", cx + r * sin(PI/5), cy + r * cos(PI/5)],
            ["L", cx, cy + r2],
            ["L", cx - r * sin(PI/5), cy + r * cos(PI/5)],
            ["L", cx - r2 * sin(2*PI/5), cy + r2 * cos(PI/5)],
            ["L", cx - r * sin(2*PI/5), cy - r * cos(2*PI/5)],
            ["L", cx - r2 * sin(PI/5), cy - r2 * cos(PI/5)],
            ["z"]
          ]
        }
      }
    };
    r.customAttributes.dotIcon = function (type) {
      if (!NC.isFunction(dotIcons[type])) {
        return {};
      }
      return dotIcons[type].apply(this, Array.prototype.slice.call(arguments,1));
    };
  };
  
  NC.prototype.mousePos = function(e, noPrevent){
    e = e || window.event;
    if(e && e.preventDefault && !noPrevent) e.preventDefault();
    var pos = {};
    var wrap = this.options.container;
    var clientX = e.clientX || 0;
    var clientY = e.clientY || 0;
    if (e.touches){
      switch (e.type) {
      case "touchstart":
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
        break;
      case "touchend":
      case "touchmove":
        clientX = e.changedTouches[0].clientX;
        clientY = e.changedTouches[0].clientY;
        break;
      }
    }
    pos.x = clientX - this.$$padding.left;
    pos.y = clientY - this.$$padding.top;
    if(NC.isFunction(wrap.getBoundingClientRect)){
      var rect = wrap.getBoundingClientRect();
      pos.x -= rect.left;
      pos.y -= rect.top;
    }else{
      var wrapOffP = wrap;
      var fixed = false, _fixed, body = document.body;
      while((_fixed = NC.getStyle(wrapOffP, "position") == 'fixed')
            || wrapOffP.offsetParent){ //chrome下fixed元素无offsetParent
        fixed = fixed || _fixed;
        pos.x -= wrapOffP.offsetLeft;
        pos.y -= wrapOffP.offsetTop;
        wrapOffP = wrapOffP.offsetParent;
        if(!wrapOffP) break;
      }
      if(!fixed){
        var wrapP = wrap;
        while(wrapP.parentNode){
          if(wrapP == body) {
            pos.x += doc.scrollLeft || body.scrollLeft;
            pos.y += doc.scrollTop || body.scrollTop;
            break;
          } else {
            pos.x += wrapP.scrollLeft;
            pos.y += wrapP.scrollTop;
          }
          wrapP = wrapP.parentNode;
        }
      }
    }
    return pos;
  };
  
  NC.prototype.tip = function(opts){
    var tip = new Tip(opts);
    tip.$$r = this.$$r;
    tip.$$canvas = this;
    return tip;
  };

  NC.prototype.path = function(svgPath, scale){
    var that = this;
    //等比例缩放
    if (typeof scale == 'number') {
      svgPath = svgPath.replace(/(\-?[0-9\.]+)/g, function(match, num){
        return parseInt(1000 * parseFloat(num) * scale) / 1000;
      });
    }
    var Funcs = {
      'svg' : function(){
        return that.$$r.path(svgPath);
      }
    };
    return Funcs[this.options.type]();
  };
  
  NC.prototype.popup = function (X, Y, set, pos, ret) {
    var $$r = this.$$r;
    var defaultAttr = {fill: "#000", stroke: "#666", "stroke-width": 2, "fill-opacity": .8};
    pos = String(pos || "top-middle").split("-");
    pos[1] = pos[1] || "middle";
    var radius = 5,
        bb = set.getBBox(),
        w = round(bb.width),
        h = round(bb.height),
        x = round(bb.x) - radius,
        y = round(bb.y) - radius,
        gap = Math.min(h / 2, w / 2, 10);
    if (pos[0] == "right" || pos[0] == 'left') {
      pos[0] = X > this.options.width / 2 ? "left" : "right";
    }
    if (pos[0] == "top" && Y - bb.height < 20) {
      pos[0] = "bottom";
    }else if (pos[0] == "bottom" && Y + bb.height + 20 > this.options.height) {
      pos[0] = "top";
    }
    var shapes = {
      top: "M{x},{y}h{w4},{w4},{w4},{w4}a{r},{r},0,0,1,{r},{r}v{h4},{h4},{h4},{h4}a{r},{r},0,0,1,-{r},{r}l-{right},0-{gap},{gap}-{gap}-{gap}-{left},0a{r},{r},0,0,1-{r}-{r}v-{h4}-{h4}-{h4}-{h4}a{r},{r},0,0,1,{r}-{r}z",
      bottom: "M{x},{y}l{left},0,{gap}-{gap},{gap},{gap},{right},0a{r},{r},0,0,1,{r},{r}v{h4},{h4},{h4},{h4}a{r},{r},0,0,1,-{r},{r}h-{w4}-{w4}-{w4}-{w4}a{r},{r},0,0,1-{r}-{r}v-{h4}-{h4}-{h4}-{h4}a{r},{r},0,0,1,{r}-{r}z",
      right: "M{x},{y}h{w4},{w4},{w4},{w4}a{r},{r},0,0,1,{r},{r}v{h4},{h4},{h4},{h4}a{r},{r},0,0,1,-{r},{r}h-{w4}-{w4}-{w4}-{w4}a{r},{r},0,0,1-{r}-{r}l0-{bottom}-{gap}-{gap},{gap}-{gap},0-{top}a{r},{r},0,0,1,{r}-{r}z",
      left: "M{x},{y}h{w4},{w4},{w4},{w4}a{r},{r},0,0,1,{r},{r}l0,{top},{gap},{gap}-{gap},{gap},0,{bottom}a{r},{r},0,0,1,-{r},{r}h-{w4}-{w4}-{w4}-{w4}a{r},{r},0,0,1-{r}-{r}v-{h4}-{h4}-{h4}-{h4}a{r},{r},0,0,1,{r}-{r}z"
    };
    var mask = [{
      x: x + radius,
      y: y,
      w: w,
      w4: w / 4,
      h4: h / 4,
      right: 0,
      left: w - gap * 2,
      bottom: 0,
      top: h - gap * 2,
      r: radius,
      h: h,
      gap: gap
    }, {
      x: x + radius,
      y: y,
      w: w,
      w4: w / 4,
      h4: h / 4,
      left: w / 2 - gap,
      right: w / 2 - gap,
      top: h / 2 - gap,
      bottom: h / 2 - gap,
      r: radius,
      h: h,
      gap: gap
    }, {
      x: x + radius,
      y: y,
      w: w,
      w4: w / 4,
      h4: h / 4,
      left: 0,
      right: w - gap * 2,
      top: 0,
      bottom: h - gap * 2,
      r: radius,
      h: h,
      gap: gap
    }][pos[1] == "middle" ? 1 : (pos[1] == "top" || pos[1] == "left") * 2];
    var dx = 0, dy = 0;
    var out = this.$$r.path(NC.subs(shapes[pos[0]], mask)).insertBefore(set);
    switch (pos[0]) {
    case "top":
      dx = X - (x + radius + mask.left + gap);
      dy = Y - (y + radius + h + radius + gap);
      break;
    case "bottom":
      dx = X - (x + radius + mask.left + gap);
      dy = Y - (y - gap);
      break;
    case "left":
      dx = X - (x + radius + w + radius + gap);
      dy = Y - (y + radius + mask.top + gap);
      break;
    case "right":
      dx = X - (x - gap);
      dy = Y - (y + radius + mask.top + gap);
      break;
    }
    out.translate(dx, dy);
    if (ret) {
      ret = out.attr("path");
      out.remove();
      return {
        path: ret,
        dx: dx,
        dy: dy
      };
    }
    var lx = 0, ly = 0;
    if (set[0].transform()[0]) {
      lx = set[0].transform()[0][1];
      ly = set[0].transform()[0][2];
    }
    set.transform(["t", lx + dx, ly + dy]);
    return out.attr(defaultAttr);
  };
  
  NC.prototype.framedText = function (X, Y, text, opts) {
    var r = this.$$r;
    var params = {
      pos : 'right',
      txtAttr : {stoke: "#444", fill: "#f00"},
      frameAttr : {fill: "#fff", stroke: "#888", "stroke-width": 1}
    };
    NC.deepExtend(params, opts, this.options.framedTextAttr);
    var set = r.text(0, 0, text).attr(params.txtAttr);
    var pos = String(params.pos || "top-middle").split("-");
    pos[1] = pos[1] || "middle";
    var radius = 3,
        bb = set.getBBox(),
        w = round(bb.width),
        h = round(bb.height),
        x = round(bb.x) - radius,
        y = round(bb.y) - radius;
    var shapes = {
      top: "M{x},{y}h{w4},{w4},{w4},{w4}a{r},{r},0,0,1,{r},{r}v{h4},{h4},{h4},{h4}a{r},{r},0,0,1,-{r},{r}l-{right},0-{left},0a{r},{r},0,0,1-{r}-{r}v-{h4}-{h4}-{h4}-{h4}a{r},{r},0,0,1,{r}-{r}z",
      bottom: "M{x},{y}l{left},0,{right},0a{r},{r},0,0,1,{r},{r}v{h4},{h4},{h4},{h4}a{r},{r},0,0,1,-{r},{r}h-{w4}-{w4}-{w4}-{w4}a{r},{r},0,0,1-{r}-{r}v-{h4}-{h4}-{h4}-{h4}a{r},{r},0,0,1,{r}-{r}z",
      right: "M{x},{y}h{w4},{w4},{w4},{w4}a{r},{r},0,0,1,{r},{r}v{h4},{h4},{h4},{h4}a{r},{r},0,0,1,-{r},{r}h-{w4}-{w4}-{w4}-{w4}a{r},{r},0,0,1-{r}-{r}l0-{bottom},0-{top}a{r},{r},0,0,1,{r}-{r}z",
      left: "M{x},{y}h{w4},{w4},{w4},{w4}a{r},{r},0,0,1,{r},{r}l0,{top},0,{bottom}a{r},{r},0,0,1,-{r},{r}h-{w4}-{w4}-{w4}-{w4}a{r},{r},0,0,1-{r}-{r}v-{h4}-{h4}-{h4}-{h4}a{r},{r},0,0,1,{r}-{r}z"
    };
    var mask = [{
      x: x + radius,
      y: y,
      w: w,
      w4: w / 4,
      h4: h / 4,
      right: 0,
      left: w,
      bottom: 0,
      top: h,
      r: radius,
      h: h,
      gap: 0
    }, {
      x: x + radius,
      y: y,
      w: w,
      w4: w / 4,
      h4: h / 4,
      left: w / 2,
      right: w / 2,
      top: h / 2,
      bottom: h / 2,
      r: radius,
      h: h
    }, {
      x: x,
      y: y,
      w: w,
      w4: w / 4,
      h4: h / 4,
      left: 0,
      right: w,
      top: 0,
      bottom: h,
      r: radius,
      h: h
    }][pos[1] == "middle" ? 1 : (pos[1] == "top" || pos[1] == "left") * 2];
    var dx = 0, dy = 0;
    var out = r.path(NC.subs(shapes[pos[0]], mask)).insertBefore(set);
    switch (pos[0]) {
    case "top":
      dx = X - (x + radius + mask.left);
      dy = Y - (y + radius + h + radius);
      break;
    case "bottom":
      dx = X - (x + radius + mask.left);
      dy = Y - y;
      break;
    case "left":
      dx = X - (x + w + 2*radius);
      dy = Y - (y + radius + mask.top);
      break;
    case "right":
      dx = X - x;
      dy = Y - (y + radius + mask.top);
      break;
    }
    out.translate(dx, dy).attr(params.frameAttr);
    set.translate(dx, dy);
    var group = r.set();
    group.push(out);
    group.push(set);
    return group;
  };

  NC.prototype.clear = function(){
    NC.each(this.chartObjs, function(chartObj){
      if(chartObj.postClear) chartObj.postClear();
    });
    NC.each(this.htmlObjs, function(htmlObj){
      htmlObj.remove();
    });
    this.htmlObjs = [];
    this.chartObjs = [];
    this.$$r.clear();
    eve("canvasClear", this);
  };

  NC.prototype.zoom = function(scale){
    this.options.zoom = scale;
    this.$$r.setViewBox && this.$$r.setViewBox(this.options.x,
                        this.options.y,
                        this.options.width/scale, 
                        this.options.height/scale);
  };

  NC.prototype.move = function(dx, dy){
    this.options.x = dx;
    this.options.y = dy;
    var scale = this.options.zoom;
    this.$$r.setViewBox && this.$$r.setViewBox(dx,
                        dy,
                        this.options.width/scale, 
                        this.options.height/scale);
  };
  
  NC.$ = function(el, attr) {
    if(!Raphael.svg) return null;
    if (attr) {
      if (typeof el == "string") {
        el = NC.$(el);
      }
      for (var key in attr) {
        el.setAttribute(key, attr[key]);
      }
    } else {
      el = document.createElementNS("http://www.w3.org/2000/svg", el);
      el.style && (el.style.webkitTapHighlightColor = "rgba(0,0,0,0)");
    }
    return el;
  };
  
  NC.getBBox = function(el) {
    var bb = el.getBBox();
    if(!bb.width){  //当图表隐藏时，需要复制到非隐藏区域
      var tmpEl = el.clone().insertBefore(NC.scratchPole);
      bb = tmpEl.getBBox();
      tmpEl.remove();
    }
    return bb;
  }

  function fixTipsInfo(info, fixTips){
    if(info && !info._o){
      info._o = NC.deepExtend({}, info);
      if(!info.fmtval){
        info.fmtval = NC.quoteNum(info.value || info.y || 0);
      }
      if(NC.isFunction(fixTips)){
        fixTips(info);
      }
      if(NC.isFunction(info.fmtPercent) && typeof info.percent == 'number'){
        info.percent = info.fmtPercent(info.percent);
      }
      if(NC.isFunction(info.fixMeanNum) && typeof info.average == 'number'){
        info.average = info.fixMeanNum(info.average);
      }
      info.ave = info.average;
    }
  }

  window.NTESChart = NC;
  
})();

/*!
 * NTESChart 0.1 - JavaScript Chart Library
 *
 * Copyright (c) 2012 xqwei @ netease
 */

(function(){
    
    var isObject = function(obj) {
        var type = typeof obj;
        if(null === obj || 'undefined' === type || 'string' === type || undefined !== obj.nodeType){ //ie fix
            return false;
        }
        return  Object.prototype.toString.call(obj) === '[object Object]';
    };
    
    var isArray = Array.isArray || function (obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    };
    
    var isFunction = function(obj) {
        return Object.prototype.toString.call(obj) === '[object Function]';
    };
    
    function getGradient(c){
        var rgb=Raphael.getRGB(c);
        var hsb=Raphael.rgb2hsb(rgb.r, rgb.g, rgb.b);
        var c1=Raphael.hsb2rgb(hsb.h, hsb.s, hsb.b).hex;
        var c2=Raphael.hsb2rgb(hsb.h, hsb.s, hsb.b*0.8).hex;
        var c3=Raphael.hsb2rgb(hsb.h, hsb.s, hsb.b*0.6).hex;
        return '0-'+c1+'-'+c2+'-'+c3;
    }
    //获取曲线控制点
    function getAnchors(p1x, p1y, p2x, p2y, p3x, p3y) {
        var l1 = (p2x - p1x) / 2,
            l2 = (p3x - p2x) / 2,
            a = Math.atan((p2x - p1x) / (Math.abs(p2y - p1y) || 1e-10)),
            b = Math.atan((p3x - p2x) / (Math.abs(p2y - p3y) || 1e-10));
        a = p1y < p2y ? Math.PI - a : a;
        b = p3y < p2y ? Math.PI - b : b;
        var alpha = Math.PI / 2 - ((a + b) % (Math.PI * 2)) / 2,
            dx1 = l1 * Math.sin(alpha + a),
            dy1 = l1 * Math.cos(alpha + a),
            dx2 = l2 * Math.sin(alpha + b),
            dy2 = l2 * Math.cos(alpha + b);
        return {
            x1: (p2x - dx1).toFixed(3),
            y1: (p2y + dy1).toFixed(3),
            x2: (p2x + dx2).toFixed(3),
            y2: (p2y + dy2).toFixed(3)
        };
    }
    
    function fmtNum(n){
        var str = n.toString();
        if(/(\d+)(\.\d+)/.test(str)){
            return fmtNum(RegExp.$1) + RegExp.$2;
        }
        var arr = str.split('');
        var cn =0;
        str = '';
        for(var i=arr.length-1;i>=0;i--){
            cn++;
            str = (i>0 && cn%3==0 ? ',' : '') +arr[i] + str;
        }
        return str;
    }
    
    function Chart(options){
        this.options = {
            container : document.getElementById("body"),
            x : 0,
            y : 0,
            type : 'svg',
            zoom : 1
        };
        DeepExtend(this.options, options);
        options = this.options;
        if(!options.width){
            options.width = options.container.offsetWidth || 600;
        }
        if(!options.height){
            options.height = options.container.offsetHeight || 400;
        }
        var that = this;
        var initFuncs = {
            'svg' : function(){
                that._R = Raphael(options.container, 
                                  options.width, 
                                  options.height);
                that._R.setViewBox(options.x,
                                   options.y,
                                   options.width, 
                                   options.height);
            },
            'swf' :function(){
                
                
            },
            'webgl' : function(){
                
            }
        };
        initFuncs[this.options.type]();
    };
    
    var DeepExtend = Chart.DeepExtend = function(){
        //将第2-n个参数覆盖到第1个中(如果是json，递归覆盖json中的值)
        var target = arguments[0];
        for (var i = 1, l = arguments.length; i < l; i++) {
            var extension = arguments[i];
            for (var key in extension) {
                var copy = extension[key];
                if (copy === target[key]) continue;
                if (isObject(copy)){
                    DeepExtend((target[key] || (target[key] = {})), copy);
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
    
    var DeepSupplement = Chart.DeepSupplement = function(){
        //将第2-n个参数补充到第1个中(如果是json，递归补充json中的值)
        var target = arguments[0];
        for (var i = 1, l = arguments.length; i < l; i++) {
            var extension = arguments[i];
            for (var key in extension) {
                var copy = extension[key];
                if (copy === target[key]) continue;
                if (isObject(copy)){
                    DeepSupplement((target[key] || (target[key] = {})), copy);
                    continue;
                }
                if (typeof copy == 'function' && typeof target[key] == 'function' && !target[key].base) {
                    target[key].base = copy;
                }
                if(!target.hasOwnProperty(key) && extension.hasOwnProperty(key)){
	                target[key] = copy;
                }
            }
        }
        return target;
    };

    var Frame = function(options){
        this.options = {
            x: 0,
            y: 0,
            width: 640,
            height: 300,
            xTick : {},
            yTick : {},
            xpadding : 0,
            flip : 0
        };
        DeepExtend(this.options, options);
        this._Series = 0; //数据集编号
        this.curSeries = 1; //数据集编号
        this.hint = [];
        this.hintReset = [];
    };
    
    Frame.prototype.reset = function(dy, minY){
        if(!dy) return;
        var zeros = Math.floor(Math.log(dy)/Math.log(10));
        if(zeros > 1){
            dy = dy - (dy % Math.pow(10, zeros - 1));
        }
        this.Series.remove();
        //this._Grid.remove();
        this._yTick.remove();
        this.options.yTick.interval = dy;
        this.options.yTick.startY = minY;
        this.options.yTick.total = dy * (this.options.yTick.ticks - 1);
        this.yTick(this.options.yTick);
    };
    
    Frame.prototype.hoverArea = function(datas, _params){
        if(!isArray(datas)) return;
        var data = datas[0];
        if(!isArray(data)) return;
        var r = this._R;
        var frame = this;
        var params = {
            zone : 'full',
            hidden : []
        };
        DeepExtend(params, _params);
        
        var canvas = this._Canvas;
        
        var foptions = this.options;
        var dx = foptions.x + (foptions.flip ? 0 : foptions.xTick.startX);
        var len = data.length;
        var fwidth = foptions.width;
        var fheight = foptions.height;
        var scale = params.scale || 1;
        var X = (foptions.flip ? fheight : fwidth) / (len - 1 + 2*foptions.xpadding) / scale;
        if(foptions.flip){
            var Y = fheight / foptions.xTick.maxX;
        }else{
            var Y = fheight / foptions.yTick.total;
        }
        var startY = foptions.yTick.startY;
        var dy = foptions.y;
        var leave_timer;
        var rect;
        var tip = frame.R_tips;
        var leftgutter = 0.5;
        var bottomgutter = 0.5;
        var xgap = Math.floor(X);
        var height = fheight + dy + startY*Y;
        
        this.R_blankets = r.set();
        var ss = datas.length;
        var orders = [], Ys, Yall;
        for(var k = 0; k < ss; k++){
            if(!params['hidden'][k])
                orders.push(k);
        }
        var ss2 = orders.length;
        for(var i = 0; i < len; i++){
            Ys = [];
            Yall = [];
            for(var k = 0; k < ss; k++){
                Yall.push(datas[k][i]);
                if(!params['hidden'][k])
                    Ys.push(datas[k][i]);
            }
            orders = orders.sort(function(a,b){
                return Yall[b] - Yall[a];
            });
            Ys = Ys.sort(function(a,b){
                return b-a;
            });
            
            var x = Math.round(leftgutter + X * scale * i + dx);
            var y = Math.round(height - bottomgutter - Y * i * scale);
            var hoverAttr = {stroke: "none", fill: "#fff", opacity: 0};
            
            for(var k = 0; k < ss2; k++){
                var s = orders[k] + 1;
                var Y1 = (Ys[k-1] + Ys[k])/2;
                var Y2 = k == ss2-1 ? 0 : (Ys[k]+Ys[k+1])/2;
                
                if(foptions.flip){
                    var x1 = k== 0 ? fwidth : Y1 * X;
                    var x2 = Y2 * X;
                    rect = r.rect(leftgutter + dx + x2, y - xgap/2 - foptions.xTick.startX, x1-x2, xgap).attr(hoverAttr);
                }else{
                    var y1 = k== 0 ? 0 : height - bottomgutter - Y1 * Y;
                    var y2 = height - bottomgutter - Y2 * Y;
                    rect = r.rect(x-xgap/2, y1, xgap, y2-y1-startY*Y).attr(hoverAttr);
                }
                /*if(params.zone == 'bottom'){
                    rect = r.rect(x-xgap/2, y, xgap, height - bottomgutter-y).attr({stroke: "none", fill: "#fff", opacity: 0});
                }else if(params.zone == 'top'){
                    rect = r.rect(x-xgap/2, 0, xgap, y).attr({stroke: "none", fill: "#fff", opacity: 0});
                }else if(params.zone == 'full'){
                    rect = r.rect(x-xgap/2, 0, xgap, height - bottomgutter).attr({stroke: "none", fill: "#fff", opacity: 0});
                }else{ //高30的column
                    rect = r.rect(x-xgap/2, y-15, xgap, 30).attr({stroke: "none", fill: "#fff", opacity: 0});
                }*/
                frame.R_blankets.push(rect);
                (function(i, s){
                    rect.hover(function(){
                        frame.curSeries = s;
                        if(canvas.tip_timer){
                            clearTimeout(canvas.tip_timer);
                            canvas.tip_timer = null;
                        }
                        if(isFunction(frame.hint[s])){
                            frame.hint[s](i); //dot.attr("r", 4);
                        }
                    }, function(){
                        if(isFunction(frame.hintReset[s])){
                            frame.hintReset[s](i); //dot.attr("r", 3);
                        }
                        canvas.tip_timer = setTimeout(function () {
                            tip.hide();
                            tip._id=null;
                        }, 500);
                    });
                })(i, s);
            }
        }
    };
    
    Frame.prototype.addSeries = function(_data, _chartType, _params){
        var r = this._R;
        var frame = this;
        if(!this.R_blankets){
            this.R_blankets = r.set();   
        }
        if(isArray(_chartType)){
            var set = r.set();
            for(var i = 0, clen = _chartType.length; i < clen; i++){
                set.push(this.addSeries(_data, _chartType[i], _params));
            }
            return set;
        }
        
        var params = {
            label : "{x}, {y}",
            plotAttr : {stroke: "hsl(.1, .5, .5)", "stroke-width": 2.5},
            fillAttr : {stroke: "none", opacity: .3, fill: "hsl(.1, .5, .5)"},
            dotAttr : {fill: "#fff", stroke: "hsl(.1, .5, .5)", "stroke-width": 1.5},
            barAttr : {fill: "#fff", stroke: "none", "stroke-width": 0},
            labelPos : "right",
            noBG : true
        };
        DeepExtend(params, _params);
        
        var that = this._Canvas;
        var options = that.options;
        var foptions = this.options;
        var chartType = _chartType || 'line';
        var scale = params.scale || 1;
        
        var leftgutter = 0.5;
        var bottomgutter = 0.5;
        var fwidth = foptions.width;
        var fheight = foptions.height;
        var len = _data.length;
        var X, Y;
        var dx, dy;//第一个数据点
        if(foptions.flip){
            Y = isArray(_data[0]) ? 1 : fheight / (len - 1 + 2*foptions.xpadding) / scale;
            X = fwidth / foptions.yTick.total;
            dy = foptions.xTick.y - foptions.xTick.startX;
            dx = foptions.x;
        }else{
            X = isArray(_data[0]) ? 1 : fwidth / (len - 1 + 2*foptions.xpadding) / scale;
            Y = fheight / foptions.yTick.total;
            dx = foptions.x + foptions.xTick.startX;
            dy = foptions.y;
        }
        var startY = foptions.yTick.startY;
        var width = options.width;
        var height = fheight + dy + startY*Y;
        var p = [];
        var bgpp = [];
        var svgPath = '';
        var bgPath = '';
        var colorhue = .1 || Math.random();
        var color = "hsl(" + [colorhue, .5, .5] + ")";
        var data = [];
        var dotSet = r.set();
        var barSet = r.set();
        
        for(var i = 0; i < len; i++){
            data[i] = [];
            if(!isArray(_data[i])){
                data[i][0] = scale * i;
                data[i][1] = scale * _data[i];
            }else{
                data[i][0] = scale * _data[i][0];
                data[i][1] = scale * _data[i][1];
            }
        }
        
        var procFuncs = {
            'line' :function(){
                for(var i = 0, ii = data.length; i < ii; i++){
                    var x = Math.round(leftgutter + X * (data[i][0]) + dx);
                    var y = Math.round(height - bottomgutter - Y * data[i][1]);
                    if (!i) {
                        p = ["M"+x, y, "L"+x, y];
                        bgpp = ["M", x, height - bottomgutter - Y*startY, "L", x, y, "L", x, y];
                    } else {
                        p = p.concat([x, y]);
                        bgpp = bgpp.concat([x, y]);
                    }
                }
                bgpp = bgpp.concat(["L", x, height - bottomgutter - Y*startY, "z"]);
                svgPath = p.join(",");
                bgPath = bgpp.join(",");
            },
            'bar' :function(){
                var xs = [], ys = [];
                var seriesNum = frame.seriesNum || 1;
                var barw = Math.round(0.8*X/seriesNum);
                for(var i = 0, ii = data.length; i < ii; i++){
                    var x = Math.round(leftgutter + X * (data[i][0]) + dx);
                    x += (frame._Series - 1 - seriesNum/2) * barw;
                    var y = Math.round(height - bottomgutter - Y * data[i][1]);
                    xs.push(x);
                    ys.push(y);
                    
                    var bar = r.rect(x+1, y, barw-1, height - bottomgutter - y - startY*Y).attr(params.barAttr);
                    (function(i, num){
                        bar.mouseover(function(){
                            if(isFunction(frame.hint[num])){
                                frame.hint[num](i);
                            }
                        });
                    })(i, frame._Series);
                    barSet.push(bar);
                }
                frame.hint[frame._Series] = function(i){
                    var tip = frame.R_tips;
                    var id = frame.curSeries + '_' + i;
                    if(tip && tip._id != id){
                        tip._id = id;
                        tip.update({
                            x : xs[i] + barw/2,
                            y : ys[i],
                            lbaelPos : params.labelPos,
                            data :  {
                                x: i+1, 
                                y: data[i][1], 
                                title : params.title,
                                xtick: (isArray(foptions.xTick.labels)? foptions.xTick.labels[i] : '')
                            },
                            animate: false
                        });
                    }
                };
            },
            'hbar' :function(){
                var xs = [], ys = [];
                var seriesNum = frame.seriesNum || 1;
                var barw = Math.round(0.8*Y/seriesNum);
                for(var i = 0, ii = data.length; i < ii; i++){
                    var y = Math.round(foptions.y + dy - Y * (data[i][0]) - barw);
                    y -= (frame._Series - 1 - seriesNum/2) * barw;
                    var x = Math.round(dx + leftgutter + X * data[i][1]);
                    xs.push(x);
                    ys.push(y);
                    
                    var bar = r.rect(dx, y+1, x - dx - leftgutter, barw - 1).attr(params.barAttr);
                    (function(i, num){
                        bar.mouseover(function(){
                            if(isFunction(frame.hint[num])){
                                frame.hint[num](i);
                            }
                        });
                    })(i, frame._Series);
                    barSet.push(bar);
                }
                frame.hint[frame._Series] = function(i){
                    var tip = frame.R_tips;
                    var id = frame.curSeries + '_' + i;
                    if(tip && tip._id != id){
                        tip._id = id;
                        tip.update({
                            x : xs[i],
                            y : ys[i] + barw/2,
                            lbaelPos : params.labelPos,
                            data :  {
                                x: i+1, 
                                y: data[i][1], 
                                title : params.title,
                                xtick: (isArray(foptions.xTick.labels)? foptions.xTick.labels[i] : '')
                            },
                            animate: false
                        });
                    }
                };
            },
            'dot' :function(){
                var xs = [], ys = [];
                for(var i = 0, ii = data.length; i < ii; i++){
                    var x = Math.round(leftgutter + X * (data[i][0]) + dx);
                    var y = Math.round(height - bottomgutter - Y * data[i][1]);
                    xs.push(x);
                    ys.push(y);
                    
                    var dot = r.circle(x, y, 3).attr(params.dotAttr);
                    (function(i, num){
                        dot.mouseover(function(){
                            if(isFunction(frame.hint[num])){
                                frame.hint[num](i);
                            }
                        });
                    })(i, frame._Series);
                    dotSet.push(dot);
                }
                frame.hint[frame._Series] = function(i){
                    if(dotSet[i])dotSet[i].attr("r", 4);
                    var tip = frame.R_tips;
                    var id = frame.curSeries + '_' + i;
                    if(tip && tip._id != id){
                        tip._id = id;
                        tip.update({
                            x : xs[i],
                            y : ys[i],
                            lbaelPos : params.labelPos,
                            data :  {
                                x: i+1, 
                                y: data[i][1], 
                                title : params.title,
                                xtick: (isArray(foptions.xTick.labels)? foptions.xTick.labels[i] : '')
                            },
                            animate: false
                        });
                        //frame.R_blankets.toFront();
                    }
                };
                frame.hintReset[frame._Series] = function(i){
                    if(dotSet[i])dotSet[i].attr("r", 3);
                };
            },
            'curve' :function(){
                for(var i = 0, ii = data.length; i < ii; i++){
                    var x = Math.round(leftgutter + X * (data[i][0]) + dx);
                    var y = Math.round(height - bottomgutter - Y * data[i][1]);
                    if (!i) {
                        p = ["M"+x, y, "C"+x, y];
                        bgpp = ["M", leftgutter + x, height - bottomgutter, "L", x, y, "C", x, y];
                    }
                    if (i && i < ii - 1) {
                        var X0 = Math.round(leftgutter + X * (data[i-1][0]) + dx),
                            Y0 = Math.round(height - bottomgutter - Y * data[i - 1][1]),
                            X2 = Math.round(leftgutter + X * (data[i+1][0]) + dx),
                            Y2 = Math.round(height - bottomgutter - Y * data[i + 1][1]);
                        var a = getAnchors(X0, Y0, x, y, X2, Y2);
                        p = p.concat([a.x1, a.y1, x, y, a.x2, a.y2]);
                        bgpp = bgpp.concat([a.x1, a.y1, x, y, a.x2, a.y2]);
                    }
                }
                p = p.concat([x, y, x, y]);
                bgpp = bgpp.concat([x, y, x, y, "L", x, height - bottomgutter, "z"]);
                svgPath = p.join(",");
                bgPath = bgpp.join(",");
            }
        };
        procFuncs[chartType]();
        
        var Funcs = {
            'svg' : function(){
                var set = r.set();
                if(dotSet.length > 0){
                    set.push(dotSet);
                }
                if(barSet.length > 0){
                    set.push(barSet);
                }
                if(svgPath != ''){
                    set.push(that.path(svgPath).attr(params.plotAttr));
                }
                if(!params.noBG && bgPath != ''){
                    set.push(that.path(bgPath).attr(params.fillAttr));
                }
                (function(num){
                    set.mouseover(function(){
                        frame.curSeries = num;
                    });
                })(frame._Series);
                return set;
            },
            'swf' :function(){
                
            },
            'webgl' : function(){
                
            }
        };
        return Funcs[options.type]();
    };
    
    var Tip = function(_options){
        this.options = {
            x: 100,
            y: 100,
            type : 'frame',
            label : '',
            labelPos : 'right',
            fillAttr : {}, //背景色
            plotAttr : {},  //边框
            txtAttr : [{font: '12px 宋体', fill: "#fff"},
                           {font: '10px Helvetica, Arial', fill: "#ff0"}]  //文字
        };
        DeepExtend(this.options, _options);
    };
    
    Tip.prototype.init = function(){
        var options = this.options;
        var r = this._R;
        this.set = r.set();
        var labelSet = r.set(),
            lx = 0, ly = 0;
        this.is_label_visible = false;
        options.labelTpl = options.label.split("\n");
        options.labelLen = options.labelTpl.length;
        for(var k = 0; k < options.labelLen; k++){
            labelSet.push(r.text(options.x - 40, options.y  - 40 + k*16, options.labelTpl[k]).attr(options.txtAttr[k]));
        }
        labelSet.hide();
        this.labelSet = labelSet;
        this.body = this._Canvas.popup(options.x, options.y, this.labelSet, options.labelPos).hide();
        this.set.push(this.body);
        this.set.push(this.labelSet);
        var canvas = this._Canvas;
        var that = this;
        this.set.mouseover(function(){
            if(canvas.tip_timer){
                clearTimeout(canvas.tip_timer);
                canvas.tip_timer = null;
            }
        }).mouseout(function(){
            canvas.tip_timer = setTimeout(function () {
                that.hide();
                that._id=null;
            }, 500); 
        });
        return this;
    };
    
    Tip.prototype.toFront = function(){
        this.body.toFront();
        this.labelSet.toFront();
        return this;
    };
    
    Tip.prototype.show = function(){
        this.body.show();
        this.labelSet.show();
        this.is_label_visible = true;
        return this;
    };
    
    Tip.prototype.hide = function(){
        if(!this.body) return this;
        this.body.hide();
        this.labelSet.hide();
        this.is_label_visible = false;
        return this;
    };
    
    Tip.prototype.update = function(_params){
        if(!this.body) this.init();
        var params = {
            x : this.options.x,
            y : this.options.y,
            label : "{name}",
            defaultAttr : {fill: "#fff", stroke: "#999",  'stroke-width' : 1},
            activeAttr : {fill: "#ff0", stroke: "#888"},
            hoverAttr : {fill: "#f00", stroke: "#202020"},
            labelPos : "right",
            animate : true
        };
        var that = this;
        var canvas = this._Canvas;
        var r = this._R;
        DeepExtend(params, _params);
        var options = this.options;
        var side = params.labelPos;
        var x = params.x;
        var y = params.y;
        if (x + this.body.getBBox().width + 50 > canvas.options.width) {
            side = "left";
        }
        if (x - this.body.getBBox().width < 0) {
            side = "right";
        }
        
        for(var k = 0; k < options.labelLen; k ++){
            this.labelSet[k].attr({
                text: subs(options.labelTpl[k], params.data)
            });
        }
        if(params.animate && Raphael.svg){
            //动画
            var ppp = canvas.popup(x, y, this.labelSet, side, 1);
            this.lx = this.labelSet[0].transform()[0][1] + ppp.dx;
            this.ly = this.labelSet[0].transform()[0][2] + ppp.dy;
            if(this.is_label_visible){
                var anim = Raphael.animation({
                    path: ppp.path,
                    transform: ["t", ppp.dx, ppp.dy]
                }, 200);
                
                this.body.animate(anim).show();
                this.labelSet.animateWith(this.body, anim, {
                    transform: ["t", this.lx, this.ly]
                }, 200).show();
            }else{
                this.body.attr({
                    path: ppp.path,
                    transform: ["t", ppp.dx, ppp.dy]
                }).show();
                this.labelSet.attr({
                    transform: ["t", this.lx, this.ly]
                }).show();
            }
        }else{
            /*this.labelSet.remove();
            this.labelSet = r.set();
            for(var k = 0; k < options.labelLen; k ++){
                this.labelSet.push(r.text(x,y + k*16,subs(options.labelTpl[k], params.data)).attr(options.txtAttr[k]));
            }*/
            var bb = this.labelSet.getBBox();
            this.body.remove();
            this.body = canvas.popup(x, y, this.labelSet, side);
            this.labelSet.show();
        }
        this.is_label_visible = true;
    };
    
    Chart.prototype.map = function(data, _params){
        var params = {
            label : "{name}",
            defaultAttr : {fill: "#fff", stroke: "#999",  'stroke-width' : 1},
            hoverAttr : {fill: "#f22", stroke: "#888"},
            txtAttr : {font: '12px Helvetica, Arial', fill: "#fff"},
            labelPos : "right",
            scale : Math.min(this.options.width / 900, this.options.height / 800),
            //scale : this.options.width / 900,
            getclr : function(a,b,c){
                return "hsb("+0.1+","+a+","+1+")";
            }
        };
        DeepExtend(params, _params);
        
        var _data = params.mapData || window.mapData;
        if(!_data){
            alert("初始化地图失败。");
            return;   
        }
        
        var getclr = params.getclr;
        var container = this.options.container;
        var shiftx = (this.options.width - 900*params.scale)/2;
        
        var that = this;
        var r = this._R;
        var options = this.options;
        
        var tip = that.tip({
            x : 500*params.scale+shiftx, y: 400*params.scale,
            label : params.label
        }).init();
        
        /*container.onmouseout = function(){
            that.tm_clearTip = setTimeout(function(){
                tip.hide().toFront(); 
                if(maskArea)maskArea.toFront();
                if(activeArea){
                    activeArea.stop().attr(activeArea._attr);
                }
            }, 100);
        };
        container.onmouseover = function(){
            if(that.tm_clearTip){
                clearTimeout(that.tm_clearTip);
                that.tm_clearTip = null;
            }
        };*/
        
        var maskArea;
        var activeArea;
        var activeAreaName;
        var Regions = {};
        var max = 0;
        var total = 0;
        if(isArray(data)){
            for(var i = 0, len = data.length; i < len; i++){
                Regions[data[i]] = 1;
            }
            max = 1;
        }else if(isObject(data)){
            Regions = data;
            for(var key in Regions){
                total += (Regions[key] || 0);
                if(Regions[key] > max){
                    max =  Regions[key];
                }
            }
        }
        
        for(var prov in _data){
            var map = this.path(_data[prov], params.scale).translate(shiftx, 0);
            map._attr = Regions[prov] ? {
                stroke: '#888',
                fill: getclr(Regions[prov]/max, .65, .7)
            }: params.defaultAttr;
            map.attr(map._attr);
            (function(prov){
                map.mouseover(function () {
                    var map = this;
                    if(maskArea){
                        maskArea.remove();   
                    }
                    if(activeArea){
                        activeArea.stop().attr(activeArea._attr);
                    }
                    
                    var bb = this.getBBox();
                    var x = Math.round(bb.x + bb.width/2);
                    var y = Math.round(bb.y + bb.height/2);
                    if(prov == '内蒙古') y += 70*params.scale;
                    
                    map.attr(params.hoverAttr).toFront();
                    
                    tip.update({
                        x : x, y : y,
                        lbaelPos : params.labelPos,
                        data :  {
                            name : prov, 
                            value : fmtNum(Regions[prov] || ''),
                            percent : parseInt((Regions[prov] || 0) / total * 100)
                        }
                    });
                    tip.toFront();
                    
                    activeArea = map;
                    activeAreaName = prov;
                    maskArea = r.path(map.realPath).attr({
                        fill : '#fff', stroke : 'none', opacity: 0
                    }).translate(shiftx, 0).toFront();
                    
                    maskArea.mouseout(function () {
                        map.stop().attr(map._attr);
                        map.toFront();
                        tip.hide();
                        maskArea.remove();
                        maskArea = null;
                        r.safari();
                    }).click(function () {
                        if(isFunction(params.click)){
                            params.click(prov);
                        }
                    });
                    
                    if(isFunction(params.mouseover)){
                        params.mouseover(prov);
                    }
                    
                    r.safari();
                });
            })(prov);
        }
        function addLegend(){ //map
            var R_legend = r.set();
            var scale = params.scale;
            var dx = 45*scale, dy = 30*scale;
            var x0 = options.width/2 - 3.5*dx;
            var y0 = 740*scale;
            R_legend.push(r.text(x0-10, y0+dy/2, '0').attr({
                "fill" : "#000", font: '11px 微软雅黑, Arial'
            }));
            var R_t = r.text(x0+7*dx+5, y0+dy/2, (fmtNum(max) || '强')).attr({
                "fill" : "#000", font: '11px 微软雅黑, Arial'
            });
            var tbb = R_t.getBBox();
            R_legend.push(R_t.translate(tbb.width/2, 0));
            for(var i = 0; i< 7;i++){
                R_legend.push(r.rect(x0+i*dx, y0, dx, dy).attr({
                    "stroke" : "none",
                    "fill" : getclr(i/7, .65, .7)
                }));
            }
            R_legend.push(r.rect(x0, y0, 7*dx, dy).attr({
                "fill" : "none",
                "stroke" : "#888"
            }));
        }
        addLegend();
    };

    Chart.prototype.path = function(svgPath, scale){
        var that = this;
        //等比例缩放
        if(typeof scale == 'number'){
            svgPath = svgPath.replace(/(\-?[0-9\.]+)/g, function(match, num){
                return parseInt(1000 * parseFloat(num) * scale) / 1000;
            });
        }
        var Funcs = {
            'svg' : function(){
                return that._R.path(svgPath);
            },
            'swf' :function(){
                
                
            },
            'webgl' : function(){
                
            }
        };
        return Funcs[this.options.type]();
    };
    
    Chart.prototype.circle = function(center, radius, params){
        var that = this;
        var Funcs = {
            'svg' : function(){
                return that._R.circle();
            },
            'swf' :function(){
                
                
            },
            'webgl' : function(){
                
            }
        };
        return Funcs[this.options.type]();
    };
    
    Chart.prototype.xyChart = function(_data, chartType, _params){
        var params = {
            x: 70,
            y: 20,
            width: this.options.width - 170,
            height: this.options.height - 100,
            xTick : {interval : 1},
            yTick : {},
            getclr : function(a,b,c){
                return "hsb("+a+","+b+","+c+")";
            },
            autofix : true,
            xpadding : 1,
            nogrid : 0,
            shadow : 1 //grid隔行背景
        };
        if(_params.xTick && _params.xTick.dy){
            params.height -= _params.xTick.dy*1.7;
        }
        DeepExtend(params, _params);
        var getclr = params.getclr;
        var r = this._R;
        
        var labels = [];
        
        var dataArr = [];
        var maxYs = [];
        var minYs = [];
        var maxY = -Math.pow(10,10);
        var minY = Math.pow(10,10);
        var minX, maxX;
        var dataL;
        
        function parseArray(_data){
            //[26,49,48,47,52,46,51]
            //[[1,26],[5,49],[10,48],[15,47],[18,52],[22,46],[28,51]]
            dataL = _data.length;
            minX = params.xpadding ? 1 : 0;  //第一个数据点
            maxX = params.xpadding ? dataL + 1 : dataL - 1;  //坐标轴最右边
            var data = [];
            if(isArray(_data[0])){
                for(var i = 0; i < dataL; i++){
                    labels.push(_data[i][0]);
                    data.push(_data[i][1]);
                }
            }else{
                data = _data;   
            }
            var _maxY = -Math.pow(10,10);
            var _minY = Math.pow(10,10);
            for(var i = 0; i < dataL; i++){
                if(data[i] > _maxY) _maxY = data[i];
                if(data[i] < _minY) _minY = data[i];
            }
            maxYs.push(_maxY);
            minYs.push(_minY);
            if(_maxY > maxY) maxY = _maxY;
            if(_minY < minY) minY = _minY;
            
            dataArr.push(data);
        }
        if(typeof _params.minY != 'undefined'){
            minY =  _params.minY;
        }
        
        var legends = [];
        if(isObject(_data)){
            for(var key in _data){
                legends.push(key);
                parseArray(_data[key]);   
            }
        }else{
            parseArray(_data);   
        }
        
        if(labels.length > 0){
            params.xTick.labels = labels;
        }
        
        params.xTick.ticks = parseInt((dataL-1) / params.xTick.interval) + 1;
        var xunit = params.width / maxX;
        var apronum = params.yTick.apronum || 9;
        if(!params.yTick.interval){
            params.yTick.interval = Math.ceil((maxY - minY) / 10 / apronum) * 10;
            var bit = Math.floor(Math.log(params.yTick.interval)/Math.log(10)) - 1;
            params.yTick.interval -= (params.yTick.interval % Math.pow(10, bit));
        }
        var yunit = params.yTick.interval;
        params.xTick.minX = minX;
        params.xTick.maxX = maxX;
        
        var dY = maxY - minY;
        var startY = minY;
        var endY = maxY;
        params.yTick.ticks = parseInt((endY - startY) / params.yTick.interval) + 3;
        params.yTick.startY = startY;
        
        params.grid = {
            cols : params.xTick.ticks,
            rows : params.yTick.ticks - 1,
            shadow : params.shadow,
            nogrid : params.nogrid
        };
        
        for(var ti = 0, tl = chartType.length; ti < tl; ti++){
            if(chartType[ti] == 'hbar'){
                params.flip = 1;
            }
        }
        
        var frame = this.frame(params);
        
        this._F = frame;
        var options = {};
        if(params.label){
            options.label = params.label;
        }
        frame.Series = r.set();
        
        if(!frame.R_tips){
            frame.R_tips = this.tip({
                label : params.label
            }).init();
        }
        var hidden = [];
        frame.seriesNum = dataArr.length;
        function drawSeries(){
            if(frame.R_blankets){
                frame.R_blankets.remove();
            }
            for(var i=0, len=dataArr.length; i<len;i++){
                if(!hidden[i]){
                    frame._Series = i+1;
                    options.plotAttr = {
                        stroke : getclr(i/len, .4, .85)
                    };
                    options.dotAttr = {
                        stroke : getclr(i/len, .5, .7)
                    };
                    options.barAttr = {
                        fill : getGradient(getclr(i/len, .7, .8))
                    };
                    options.title = legends[i];
                    //addSeries
                    frame.Series.push(frame.addSeries(dataArr[i], chartType, options));
                }
            }
            frame.R_tips.toFront();
            //hoverArea
            frame.hoverArea(dataArr);
        }
        drawSeries();
        if(params.anim)frame.clipAnim();
        if(legends.length > 0){ 
            //xyChart.addLegend
            var R_legend = r.set();
            var y = this.options.height - 50;
            var px = 0, py = y;
            var dx = 25, dy = 15;
            var len = legends.length;
            for(var i = 0; i < len; i++){
                var set = r.set();
                set.push(r.path(["M", px, py+dy/2, "l", dx, 0].join(" ")));
                set.push(r.circle(px+dx/2, py+dy/2, 3).attr({
                    "fill" : "#fff"
                }));
                set.attr({
                    "stroke" : getclr(i/len, .5, .85),
                    "stroke-width" : 2
                });
                px += dx + 3;
                var R_t = r.text(px, py+dy/2, legends[i]).attr({
                    "fill" : '#333', "font" : '11px 微软雅黑, Arial'
                });
                var bb = R_t.getBBox();
                px += bb.width/2;
                set.push(R_t.attr({x: px}));
                px += bb.width/2 + 15;
                var bbb = set.getBBox();
                //点击图例显隐线图
                (function(i){
                    var box = r.rect(bbb.x, bbb.y, bbb.width, bbb.height).attr({
                        "opacity" : 0,
                        "fill" : "#fff",
                        "cursor" : "pointer" 
                    });
                    box.click(function(){
                        if(hidden[i]){
                            if(!params.autofix)frame.Series[i].show();
                            hidden[i] = 0;
                            R_legend[i][0].attr({
                                "stroke" : getclr(i/len, .5, .85)
                            });
                            R_legend[i][1].attr({
                                "stroke" : getclr(i/len, .5, .85)
                            });
                            R_legend[i][2].attr({
                                "fill" : "#333"
                            });
                        }else{
                            if(!params.autofix)frame.Series[i].hide();
                            hidden[i] = 1;
                            R_legend[i][0].attr({
                                "stroke" : getclr(i/len, 0.2, 0.8)
                            });
                            R_legend[i][1].attr({
                                "stroke" : getclr(i/len, 0.2, 0.8)
                            });
                            R_legend[i][2].attr({
                                "fill" : "#aaa"
                            });
                        }
                        if(params.autofix){
                            var _maxY = -Math.pow(10,10);
                            var _minY = Math.pow(10,10);
                            for(var j = 0; j< len; j++){
                                if(!hidden[j]){
                                    if(maxYs[j] > _maxY){
                                        _maxY =  maxYs[j];
                                    }
                                    if(minYs[j] < _minY){
                                        _minY =  minYs[j];
                                    }
                                }
                            }
                            if(_maxY < _minY){
                                _maxY = maxY;
                                _minY = minY;
                            }
                            var yscale = (maxY-minY)/(_maxY-_minY);
                            if(yscale > 0.9 && yscale < 1.1){yscale = 1;}
                            var dy = parseInt(yunit / yscale) || 1;
                            frame.reset(dy, _minY);
                            
                            drawSeries();
                        }
                    });
                    set.push(box);
                })(i);
                R_legend.push(set);
            }
            var sbb = R_legend.getBBox();
            var x = this.options.width/2 - sbb.width/2;
            R_legend.translate(x, 0);
            R_legend.push(r.rect(x-4.5, y-4.5, sbb.width+9, sbb.height+9).attr({
                stroke: '#aaa', 'stroke-width' : 1
            }));
        }
    };
    
    Chart.prototype.tip = function(_options){
        var tip = new Tip(_options);
        tip._R = this._R;
        tip._Canvas = this;
        return tip;
    };
    
    Chart.prototype.frame = function(_options){
        var frame = new Frame(_options);
        frame._R = this._R;
        frame._Canvas = this;
        if(frame.options.grid){
            frame.drawGrid(frame.options.grid);
        }
        if(frame.options.Title){
            frame.Title(frame.options.Title);
        }
        if(frame.options.xTitle){
            frame.xTitle(frame.options.xTitle);
        }
        if(frame.options.yTitle){
            frame.yTitle(frame.options.yTitle);
        }
        frame.xTick(frame.options.xTick);
        frame.yTick(frame.options.yTick);
        return frame;
    };
    var $ = function (el, attr) {
        if (attr) {
            if (typeof el == "string") {
                el = $(el);
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
    Frame.prototype.clipAnim = function(during){
        if(!Raphael.svg)return;
        var r = this._R;
        var options = this.options;
        var Series = this.Series;
        if(Series){
            var dt = 30;
            during = during || 1200;
            var n = Math.round(during / dt);
            var w = 0;
            var dw = (options.width+20) / n;
            var el = $("clipPath"),
                rc = $("rect");
            el.id = (new Date()).getTime();
            $(rc, {
                x: options.x-10,
                y: options.y-20,
                width: 0,
                height: options.height+40
            });
            el.appendChild(rc);
            r.defs.appendChild(el);
            Series.attr({
                'clip-path' : 'url(#'+el.id+')'
            });
            var interval_start = setInterval(function(){
                w += dw;
                $(rc, {
                    width: w 
                });
                if(w >= options.width+20){
                    clearInterval(interval_start);
                }
            }, dt);
        }
    };
    
    Frame.prototype.drawGrid = function(_params){
        var params = {
            plotAttr : {stroke: '#ccc'},
            oddAttr : {fill: '#f2f2f2', stroke:'none'},
            vline : false,
            shadow : 1,
            nogrid : 0
        };
        DeepExtend(params, _params);
        var foptions = this.options;
        var x = foptions.x;
        var y = foptions.y;
        var w = foptions.width;
        var h = foptions.height;
        var cols = _params.cols;
        var rows = _params.rows;
        var r = this._R;
        this._Grid = r.set();
        
        var path = ["M", Math.round(x) + .5, Math.round(y) + .5, "L", Math.round(x + w) + .5, Math.round(y) + .5, Math.round(x + w) + .5, Math.round(y + h) + .5, Math.round(x) + .5, Math.round(y + h) + .5, Math.round(x) + .5, Math.round(y) + .5],
            rowHeight = h / rows,
            columnWidth = w / cols;
        if(!params.nogrid){
            for (var i = 1; i < rows; i++) {
                if(foptions.flip){
                    rowHeight = h / cols;
                    columnWidth = w / rows;
                    path = path.concat(["M", Math.round(x + i * columnWidth) + .5, Math.round(y) + .5, "V", Math.round(y + h) + .5]);
                    if(params.shadow && i%2==1){
                        this._Grid.push(this._R.rect(Math.round(x + i * columnWidth) + .5, Math.round(y) + .5, columnWidth, h).attr(params.oddAttr));
                    }
                }else{
                    path = path.concat(["M", Math.round(x) + .5, Math.round(y + i * rowHeight) + .5, "H", Math.round(x + w) + .5]);
                    if(params.shadow && i%2==1){
                        this._Grid.push(this._R.rect(Math.round(x) + .5, Math.round(y + i * rowHeight) + .5, w, rowHeight).attr(params.oddAttr));
                    }
                }
            }
        }
        if(params.vline){ //竖直线
            for (i = 1; i < cols; i++) {
                path = path.concat(["M", Math.round(x + i * columnWidth) + .5, Math.round(y) + .5, "V", Math.round(y + h) + .5]);
            }
        }
        
        this._Grid.push(r.path(path.join(",")).attr(params.plotAttr));
    };
    
    
    Frame.prototype.xTick = function(_params){
        var params = {
            startX : 0,
            endX : this.options.flip ? this.options.height : this.options.width,
            y : this.options.height, //x横轴的y坐标
            dy : 0,
            interval : 1,
            roate : 0,
            txtAttr : {
                font: '11px 微软雅黑, Arial', fill : '#444'
            }
        };
        DeepExtend(params, _params);
        var xunit = params.endX / params.maxX || 1;
        params.startX = xunit * params.minX;
        this.options.xTick = params;
        
        if(params.labels){
            var labels = [];
            var inter = 1;
            if(isArray(params.labels)){
                labels = params.labels;
                inter = params.interval;
            }else if(typeof  params.labels == 'string'){
                for(var i = 0; i < params.ticks; i++){
                    labels.push(subs(params.labels, {x: i * params.interval + 1}));
                }
            }
            var len = params.ticks;
            var dx = xunit * params.interval;
            for(var j = 0; j < len; j++){
                var k = j*inter;
                if(this.options.flip){
                    this._R.text(-10-params.dy, .5 + Math.round(params.y - params.startX - j * dx), labels[k]||'').translate(this.options.x, this.options.y).rotate(params.rotate).attr(params.txtAttr);
                }else{
                    this._R.text(.5 + Math.round(params.startX + j * dx), Math.round(params.y + params.dy) + 10, labels[k]||'').translate(this.options.x, this.options.y).rotate(params.rotate).attr(params.txtAttr);
                }
            }
        }
    };
    
    Frame.prototype.yTick = function(_params){
        var _size_px = (this.options.flip ? this.options.width : this.options.height);
        var params = {
            startY : 0,
            posX : 0,
            ticks : _size_px,
            interval : 1,
            roate : 0,
            txtAttr : {
                font: '11px 微软雅黑, Arial', fill : '#444'
            }
        };
        DeepExtend(params, _params);
        var r = this._R;
        this._yTick = r.set();
        if(!params.total){ //y轴能显示的最大数据
            params.total = params.interval * (params.ticks - 1);
        }
        params.startY = params.startY - ( params.startY % params.interval );
        this.options.yTick = params;
        
        function fixNum(n){
            if(n>=1000 && n%100 == 0){
                return n/1000 + 'k';
            }else{
                return n;
            }
        }
        
        if(params.labels && params.ticks != _size_px){
            var labels = [];
            var label;
            if(isArray(params.labels)){
                labels = params.labels;
            }else if(typeof  params.labels == 'string'){
                for(var i = 0; i < params.ticks; i++){
                    label = fixNum(params.startY + i*params.interval);
                    labels.push(subs(params.labels, {y: label}));
                }
            }
            var len = labels.length;
            var dy = _size_px / (len-1);
            for(var j = 0; j < len; j++){
                if(this.options.flip){
                    this._yTick.push(r.text(Math.round(.5 + j * dy), this.options.height + 10, labels[j]).translate(this.options.x, this.options.y).rotate(params.rotate).attr(params.txtAttr));
                }else{
                    this._yTick.push(r.text(Math.round(params.posX) - 16.5, Math.round(this.options.height) + .5 - j * dy, labels[j]).translate(this.options.x, this.options.y).rotate(params.rotate).attr(params.txtAttr));
                }
            }
        }
    };
    
    Frame.prototype.Title= function(_params){
        if(!_params.title) 
            return false;
        var params = {
            txtAttr : {font: '12px  微软雅黑, Arial', fill : '#444'},
            posX : this.options.x + this.options.width/2,
            posY : this.options.y,
            dy : 0
        };
        DeepExtend(params, _params);
        return this._R.text(Math.round(params.posX), Math.round(params.posY + params.dy - 40) + 25.5, params.title)
            .attr(params.txtAttr);
    };
    
    Frame.prototype.xTitle= function(_params){
        if(!_params.title) 
            return false;
        var params = {
            txtAttr : {font: '12px  微软雅黑, Arial', fill : '#444'},
            posX : this.options.x + this.options.width/2,
            posY : this.options.y + this.options.height,
            dy : 0
        };
        DeepExtend(params, _params);
        return this._R.text(Math.round(params.posX), Math.round(params.posY + params.dy) + 25.5, params.title)
            .attr(params.txtAttr);
    };
    
    Frame.prototype.yTitle= function(_params){
        if(!_params.title) 
            return false;
        var params = {
            txtAttr : {font: '12px  微软雅黑, Arial', fill : '#444'},
            //txtAttr : {font: '12px Helvetica, Arial', fill : '#444'},
            dx : 0,
            posX : this.options.x,
            posY : this.options.y + this.options.height/2
        };
        DeepExtend(params, _params);
        return this._R.text(Math.round(params.posX - params.dx) - 40, Math.round(params.posY), params.title)
            .rotate(-90)
            .attr(params.txtAttr);
    };
    
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
            res = (res == null || res == obj ? all : res) + "";
            return res;
        },
        subs = function (str, obj) {
            return String(str).replace(tokenRegex, function (all, key) {
                return replacer(all, key, obj);
            });
        };
    
    Chart.prototype.popup = function (X, Y, set, pos, ret) {
        var _R = this._R;
        var defaultAttr = {fill: "#000", stroke: "#666", "stroke-width": 2, "fill-opacity": .8};
        pos = String(pos || "top-middle").split("-");
        pos[1] = pos[1] || "middle";
        var r = 5,
            bb = set.getBBox(),
            w = Math.round(bb.width),
            h = Math.round(bb.height),
            x = Math.round(bb.x) - r,
            y = Math.round(bb.y) - r,
            gap = Math.min(h / 2, w / 2, 10);
        var shapes = {
                top: "M{x},{y}h{w4},{w4},{w4},{w4}a{r},{r},0,0,1,{r},{r}v{h4},{h4},{h4},{h4}a{r},{r},0,0,1,-{r},{r}l-{right},0-{gap},{gap}-{gap}-{gap}-{left},0a{r},{r},0,0,1-{r}-{r}v-{h4}-{h4}-{h4}-{h4}a{r},{r},0,0,1,{r}-{r}z",
                bottom: "M{x},{y}l{left},0,{gap}-{gap},{gap},{gap},{right},0a{r},{r},0,0,1,{r},{r}v{h4},{h4},{h4},{h4}a{r},{r},0,0,1,-{r},{r}h-{w4}-{w4}-{w4}-{w4}a{r},{r},0,0,1-{r}-{r}v-{h4}-{h4}-{h4}-{h4}a{r},{r},0,0,1,{r}-{r}z",
                right: "M{x},{y}h{w4},{w4},{w4},{w4}a{r},{r},0,0,1,{r},{r}v{h4},{h4},{h4},{h4}a{r},{r},0,0,1,-{r},{r}h-{w4}-{w4}-{w4}-{w4}a{r},{r},0,0,1-{r}-{r}l0-{bottom}-{gap}-{gap},{gap}-{gap},0-{top}a{r},{r},0,0,1,{r}-{r}z",
                left: "M{x},{y}h{w4},{w4},{w4},{w4}a{r},{r},0,0,1,{r},{r}l0,{top},{gap},{gap}-{gap},{gap},0,{bottom}a{r},{r},0,0,1,-{r},{r}h-{w4}-{w4}-{w4}-{w4}a{r},{r},0,0,1-{r}-{r}v-{h4}-{h4}-{h4}-{h4}a{r},{r},0,0,1,{r}-{r}z"
            },
            offset = {
                hx0: X - (x + r + w - gap * 2),
                hx1: X - (x + r + w / 2 - gap),
                hx2: X - (x + r + gap),
                vhy: Y - (y + r + h + r + gap),
                "^hy": Y - (y - gap)
            },
            mask = [{
                x: x + r,
                y: y,
                w: w,
                w4: w / 4,
                h4: h / 4,
                right: 0,
                left: w - gap * 2,
                bottom: 0,
                top: h - gap * 2,
                r: r,
                h: h,
                gap: gap
            }, {
                x: x + r,
                y: y,
                w: w,
                w4: w / 4,
                h4: h / 4,
                left: w / 2 - gap,
                right: w / 2 - gap,
                top: h / 2 - gap,
                bottom: h / 2 - gap,
                r: r,
                h: h,
                gap: gap
            }, {
                x: x + r,
                y: y,
                w: w,
                w4: w / 4,
                h4: h / 4,
                left: 0,
                right: w - gap * 2,
                top: 0,
                bottom: h - gap * 2,
                r: r,
                h: h,
                gap: gap
            }][pos[1] == "middle" ? 1 : (pos[1] == "top" || pos[1] == "left") * 2];
        var dx = 0,
            dy = 0,
            out = this._R.path(subs(shapes[pos[0]], mask)).insertBefore(set);
        switch (pos[0]) {
        case "top":
            dx = X - (x + r + mask.left + gap);
            dy = Y - (y + r + h + r + gap);
            break;
        case "bottom":
            dx = X - (x + r + mask.left + gap);
            dy = Y - (y - gap);
            break;
        case "left":
            dx = X - (x + r + w + r + gap);
            dy = Y - (y + r + mask.top + gap);
            break;
        case "right":
            dx = X - (x - gap);
            dy = Y - (y + r + mask.top + gap);
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
        set.translate(dx, dy);
        return out.attr(defaultAttr);
    };

    Chart.prototype.pie = function(_data, _params){
        var params = {
            cx : this.options.width/2,
            cy : this.options.height/2,
            radius : Math.min(this.options.width*0.75, this.options.height)*0.4,
            plotAttr : {stroke: "#fff", 'stroke-width' : 0, 'cursor' : 'pointer'},
            borderAttr : {stroke: "#fff", 'stroke-width' : 2},
            txtAttr : {font: '12px  微软雅黑, Arial', fill : '#444', 'cursor' : 'pointer'},
            legendAttr : {font: '12px  微软雅黑, Arial', fill : '#444', 'text-align' : 'left'},
            getclr : function(a,b,c){
                return "hsb("+a*0.6+","+b+","+c+")";
            },
            tipRatio : 0.1
        };
        DeepExtend(params, _params);
        var getclr = params.getclr;
        var container = this.options.container;
        
        var r = this._R,
            paths = r.set(),
            arcs = r.set(),
            total = 0,
            start = -90;
        var canvas = this;
        var cx = params.cx;
        var cy = params.cy;
        var radius = params.radius;
        var R_legend = [];
        var legend = [];
        var data = [];
        var percents = [];
        if(isObject(_data)){
            for(var key in _data){
                legend.push(key);
                //data.push(_data[key]);
            }
            legend = legend.sort(function(a,b){return _data[b]-_data[a];});
            for(var i=0,len=legend.length;i<len;i++){
                data.push(_data[legend[i]]);
            }
        }else{
            data = _data;
        }
        var ii = data.length;
        var max = 0;
        for (var i = 0; i < ii; i++) {
            total += data[i];
            if(data[i] > max) max = data[i];
            if(!legend[i]){
                legend[i] = i+1;
            }
        }
        var clr = []; //配色
        for (var i = 0; i < ii; i++) {
            clr[i] = data[i] / max;
            percents[i] = parseInt(data[i] / total * 100);
        }
        
        r.customAttributes.arcsegment = function (x, y, r, a1, a2) {
            var flag = (a2 - a1) > 180;
            var clr = (a2 - a1) / 120;
            r = r * 1.025;
            a1 = (a1 % 360) * Math.PI / 180;
            a2 = (a2 % 360) * Math.PI / 180;
            return {
                path: [["M",  x+r * Math.cos(a1), y+r * Math.sin(a1)], ["A", r, r, 0, +flag, 1, x + r * Math.cos(a2), y + r * Math.sin(a2)]],
                "stroke-width": 5
            };
        };
        
        r.customAttributes.segment = function (x, y, r, a1, a2) {
            var flag = (a2 - a1) > 180;
            var clr = (a2 - a1) / 120;
            a1 = (a1 % 360) * Math.PI / 180;
            a2 = (a2 % 360) * Math.PI / 180;
            var a = (a1+a2)/2;
            return {
                path: [["M", x, y], ["l", r * Math.cos(a1), r * Math.sin(a1)], ["A", r, r, 0, +flag, 1, x + r * Math.cos(a2), y + r * Math.sin(a2)], ["z"]]
            };
        };
        
        var labels = [];
        var tip;
        if(params.labels){
            if(isArray(params.labels)){
                labels = params.labels;
            }else if(typeof  params.labels == 'string'){
                for(var i = 0; i < ii; i++){
                    labels.push(subs(params.labels, {
                        title: legend[i], 
                        value: fmtNum(data[i]),
                        percent: percents[i]
                    }));
                }
            }
            tip = this.tip({
                x: cx, y: cy,
                label : "{text}"
            });
        }
        
        var that = this;
        container.onmouseout = function(){
            that.tm_clearTip = setTimeout(function(){
                tip.hide(); 
                tip._id=null;
            }, 100);
        };
        container.onmouseover = function(){
            if(that.tm_clearTip){
                clearTimeout(that.tm_clearTip);
                that.tm_clearTip = null;
            }
        };
        
        var activeSeg;
        var border = [];
        
        var left = []; //左边的legend
        var right = []; //右边的legend
        
        for (i = 0; i < ii; i++) {
            var val = 360 / total * data[i];
            if(start + val/2 > 90 && start + val/2 <=270){
                left.push(i);   
            }else{
                right.push(i);   
            }
            (function (i, direction) {
                var seg = r.set();
                seg.direction = direction;
                border.push(["M", cx, cy, "l", radius*Math.cos(start*Math.PI / 180), radius*Math.sin(start*Math.PI / 180)]);
                seg.push(r.path()
                         .attr({
                             segment: [cx, cy, radius, start, start + val], 
                             fill: getclr(clr[i], .75, .65)
                         })
                         .attr(params.plotAttr));  //扇形
                seg.push(r.path()
                         .attr({
                             arcsegment: [cx, cy, radius, start, start + val], 
                             stroke: getclr(clr[i], .8, .9)
                         }).hide());  //外圆弧
                
                seg.mouseover(function(){popOut(i,direction);});
                /*seg.click(function () {
                    
                });*/
                paths.push(seg);
            })(i, (start + val/2) * Math.PI / 180);
            start += val;
        }
        var popOut = function(i, direction, pos){
            if(canvas.tip_timer){
                clearTimeout(canvas.tip_timer);
                canvas.tip_timer = null;
            }
            if(activeSeg){
                activeSeg[1].hide();
                activeSeg.stop().animate({transform: ["t", 0, 0]}, 10);
            }
            activeSeg = paths[i];
            paths[i].animate({
                transform: ["t", radius *0.1 * Math.cos(direction), radius*0.1 * Math.sin(direction)]
            }, 600, "bounce");
            paths[i][1].show();
            if(labels[i]){
                if(!pos){
                    pos = ( direction > Math.PI / 2 && direction < Math.PI * 3/2 ? "left" : "right" );
                }
                
                tip.update({
                    x : cx + (radius) * Math.cos(direction),
                    y : cy + (radius) * Math.sin(direction),
                    data : {text : labels[i]},
                    labelPos : pos
                });
                if(params.tipRatio && data[i]/total > params.tipRatio){
                    tip.hide();
                }else{
                    tip.show();
                }
            }
        };
        
        function addLegend(lx, ly, a, j){  //pie
            var x = cx + (radius-12)*Math.cos(a);
            var y = cy + (radius-12)*Math.sin(a);
            var R_t = r.text(lx, ly, legend[j]).attr(params.legendAttr);
            var set = r.set();
            set.push(R_t);
            var bb = R_t.getBBox();
            R_t.attr({
                fill: getclr(clr[j], .7, .6)
            });
            if(radius < 120){
                R_t.attr({
                    'x': lx+(Math.cos(a) > 0 ? 35:-35)
                });
            }else{
                R_t.attr({
                    'x': lx+(Math.cos(a) > 0 ?bb.width/2+2:-bb.width/2-2)
                });
            }
            if(params.tipRatio && data[i]/total > params.tipRatio){ //直接在饼图上显示label
                var ratio = 0.66;
                if(data[j]/total > 0.25){
                    ratio = 0.5;   
                }
                x = cx + (radius*ratio)*Math.cos(a);
                y = cy + (radius*ratio)*Math.sin(a);
                paths[j].push(r.text(x, y, labels[j]).attr({
                    'fill' : '#fff', 'font-size' : 12
                }));
                R_t.hide();
            }
            if(params.noLegend)R_t.hide();
            R_legend[j] = set.toBack().mouseover(function(){popOut(j,a,(Math.cos(a) > 0 ? 'left':'right'));});
        }
        var l_left = left.length;
        var l_right = right.length;
        for(i = 0; i< l_left; i++){
            var j = left[i];
            var _h = Math.max(l_left*20, 2*radius);
            var dh = Math.min(_h/l_left, 30);
            _h = l_left*dh;
            var starty = (this.options.height - _h)/2 - dh;
            var lx = 70;
            var ly = starty+(l_left-i)*dh;
            var a = paths[j].direction;
            addLegend(lx, ly, a, j);
        }
        for(i = 0; i< l_right; i++){
            var j = right[i];
            var starty = (this.options.height - l_right*20)/2;
            var lx = this.options.width-70;
            var ly = starty+i*20;
            var a = paths[j].direction;
            addLegend(lx, ly, a, j);
        }
        
        r.path(border.join(" ")).attr(params.borderAttr).toFront();
    };

    Chart.prototype.zoom = function(scale){
        this.options.zoom = scale;
        this._R.setViewBox(this.options.x,
                           this.options.y,
                           this.options.width/scale, 
                           this.options.height/scale);
    };

    Chart.prototype.move = function(dx, dy){
        this.options.x = dx;
        this.options.y = dy;
        var scale = this.options.zoom;
        this._R.setViewBox(dx,
                           dy,
                           this.options.width/scale, 
                           this.options.height/scale);
    };

    window.NTESChart = Chart;
    
})();
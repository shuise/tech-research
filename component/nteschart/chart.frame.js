/**
 * NTES.xyChart
 [ function ] 绘制line, curve, dot, cross, bar, hbar等图表
 */

(function(NC){
  var round = Math.round;
  var floor = Math.floor;
  
  var Cross = NC.Cross = function(opts){
    this.options = {
      left : 100,
      top : 100,
      fillAttr : {}, //文字背景
      plotAttr : {},  //十字线
      txtAttr : [
        {fill: "#090"},
        {fill: "#f00"}
      ]
    };
    NC.deepExtend(this.options, opts);
    if(!NC.isArray(this.options.txtAttr)) {
      this.options.txtAttr = [this.options.txtAttr, this.options.txtAttr];
    }
    if(!this.options.txtAttr[1]) this.options.txtAttr[1] = this.options.txtAttr[0];
  };
  
  Cross.prototype= {
    init: function(){
      var r = this.$$r;
      this.relObj = r.circle(0,0,1).hide();
      return this;
    },
    
    toFront : function(){
      if(this.Set) this.Set.toFront();
      this.relObj.toFront();
      return this;
    },
    
    update : function(opts){
      var that = this;
      var r = this.$$r;
      var frame = this.$$frame;
      var canvas = frame.$$canvas;
      var params = {
        x : this.options.left,
        y : this.options.top,
        defaultAttr : {fill: "#fff", stroke: "#999", 'stroke-width' : 1},
        crossAttr : {'stroke-width' : 0.5, stroke: "#666"},
        labels :{left: "100", bottom: "10:00"}
      };
      var fOptions = frame.options
      var LeftTop = {
        x: fOptions.left + 0.5,
        y: fOptions.top + 0.5
      }
      var RightBottom = {
        x: LeftTop.x + fOptions.width,
        y: LeftTop.y + fOptions.height
      }
      NC.deepExtend(params, opts);
      if(this.Set) this.Set.remove();
      this.Set = r.set();
      
      var crossline = [
        "M", LeftTop.x, floor(params.y)+0.5, 
        "H", RightBottom.x, 
        "M", floor(params.x)+0.5, LeftTop.y, 
        "V", RightBottom.y
      ].join(" ");
      
      this.Set.push(r.path(crossline).attr(params.crossAttr).insertBefore(this.relObj));
      var midY = frame.options.yTick.midY;
      
      //涨红跌绿
      var txtAttr = parseFloat(params.labels.left) >= midY ? this.options.txtAttr[1]
            : this.options.txtAttr[0];
      this.Set.push(canvas.framedText(LeftTop.x, params.y, params.labels.left, {
        pos : "left", 
        txtAttr : txtAttr
      }));
      this.Set.push(canvas.framedText(params.x, RightBottom.y, params.labels.bottom, {
        pos : "bottom", 
        txtAttr : txtAttr
      }));
    },
    
    show : function(){
      if(this.Set) this.Set.show();
      return this;
    },
    
    hide : function(){
      this._id=null;
      if(this.Set) this.Set.hide();
      return this;
    }
  }
  
  var Frame = NC.Frame = function(opts){
    this.options = {
      x: 0,
      y: 0,
      width: 640,
      height: 300,
      avaSpace: { left: 40, right: 20 },
      padding: { y: 20, x: 60, left: 0, bottom: 0 },
      barAttr: { thickness:80 },
      tableH: 20,
      xpadding : 1,
      legendAttr : { border: true },
      dotInterval : 1,
      flip : 0
    };
    NC.deepExtend(this.options, opts);

    this.elms = {};
    this.groups = [];
    this.seriesCursor = 0; //数据集编号
    this.curSeries = 1; //数据集编号
    this.hint = []; //functions
    this.hintReset = []; //functions
    this.$$afterPole = [];
    this.occupation = {   //label, title占地大小
      xTick : {width : 0, height : 0}
    };
    var frame = this;
    eve.on("frame.legendOver", function(iSeries, iSeq){
      if(frame != this) return;
      if(frame.tip_timer) {
        frame.onleave();
        clearTimeout(frame.tip_timer);
        frame.tip_timer = null;
      }
      if(NC.isFunction(frame.hint[iSeries])) {
        frame.curSeries = iSeries;
        if(iSeq == '*') {
          var xlen = frame.hoverAreas.length;
          for(var i = 0; i < xlen; i ++) {
            frame.hint[iSeries](i, (i == xlen - 1));
          }
        }else{
          frame.curSeries_i = iSeq;
          frame.hint[iSeries](iSeq);
        }
      }
    });
    eve.on("frame.seriesOver", function(iSeries, iSeq, mpos){
      if(frame != this) return;
      frame.curSeries_i = iSeq;
      var fOptions = frame.options;
      var isGroup = fOptions.htmlTips && fOptions.htmlTips.group;
      var segs = frame.hoverAreas[iSeq]["segs"];
      if(frame.tip_timer) {
        clearTimeout(frame.tip_timer);
        frame.tip_timer = null;
      }
      if(isGroup){  //grouped tips
        if(frame.elms.tip) {
          frame.elms.tip.reset();
          for(var i = 0; i < segs.length; i ++){
            if(NC.isFunction(segs[i].func)) {
              frame.curSeries = segs[i].series - 1;
              segs[i].func(iSeq, segs[i].subSeg, mpos);
            }
          }
        }
      }else{
        if(segs[iSeries] && NC.isFunction(segs[iSeries].func)) {
          segs[iSeries].func(iSeq, segs[iSeries].subSeg, mpos);
        }
      }
      if(fOptions.htmlTips){
        frame.elms.tip.show();
      }
    });
    eve.on("frame.seriesOut", function(iSeq){
      if(frame != this) return;
      if(NC.isFunction(frame.hintReset[frame.curSeries])) {
        var xlen = frame.hoverAreas.length;
        for(var i = 0; i < xlen; i ++) {
          if(opts.htmlTips && opts.htmlTips.group){ //多组合并显示
            NC.each(frame.hintReset, function(func){
              if(NC.isFunction(func)){
                func(i);
              }
            });
          }else{
            frame.hintReset[frame.curSeries](i, true);
          }
        }
      }
      frame.curSeries_i = null;
      frame.curSeries = null;
    });
    if(frame.initAirview) frame.initAirview();
  };
  
  Frame.prototype.updateOptions = function(opts){
    var fOptions = this.options;
    NC.deepExtend(fOptions, opts);
    if(this.elms.tip){
      this.elms.tip.remove();
    }
    if(opts.htmlTips){
      this.elms.tip = this.$$canvas.htmlTip(this);
    }else{
      this.elms.tip = this.$$canvas.tip({ //鼠标tips
        txtAttr : fOptions.tipAttr,
        label : (fOptions.tips || '.')
      });
    }
  };
  
  Frame.prototype.reset = function(yunit, minY){//重新设定坐标系范围
    var fOptions = this.options;
    
    if(!yunit) yunit = fOptions.yTick.interval;
    if(!minY) minY = fOptions.yTick.startY;
    var r = this.$$r;
    if(fOptions.yTick.yunit) { //用户定义yunit
      yunit = fOptions.yTick.yunit;
    }else{
      var bit = floor(Math.log(yunit[0])/Math.log(10)) - 1;
      yunit[0] = Math.ceil(yunit[0] / Math.pow(10,bit)) * Math.pow(10,bit);
      
      bit = floor(Math.log(yunit[1])/Math.log(10)) - 1;
      yunit[1] = Math.ceil(yunit[1] / Math.pow(10,bit)) * Math.pow(10,bit);
    }
    fOptions.yTick.interval = yunit;
    fOptions.yTick.startY = minY;
    fOptions.yTick.total = [
      yunit[0] * (fOptions.yTick.ticks - 1), 
      yunit[1] * (fOptions.yTick.ticks - 1)
    ];
    
    if(this.$screen) this.$screen.remove();
    if(this.elms.Series) this.elms.Series.remove();
    if(this.elms.yTick) this.elms.yTick.remove();
    this.calcAvaSpace();
  };
  
  Frame.prototype.drawAxis = function(){//绘制坐标轴及label, title
    var r = this.$$r;
    if(this.options.grid) {
      this.drawGrid();
    }
    this.elms.xTick = this.xTick(this.options.xTick);
    this.elms.yTick = this.yTick(this.options.yTick);
    if(this.options.Title) {
      this.Title();
    }
    if(this.options.xTitle) {
      this.xTitle();
    }
    if(this.options.yTitle) {
      this.yTitle();
    }
    if(this.options.yRightTitle) {
      this.yRightTitle();
    }
    if(this.$framepole) this.$framepole.remove();
    this.$framepole = r.rect(0,0,0,0);
  };
  
  Frame.prototype.drawLegend = function(){//绘制legend并调整坐标轴空间
    var r = this.$$r;
    var fOptions = this.options;
    var legendTxtAttr = {
      "fill" : '#333',
      "font" : NC.$$sfont
    };
    var frame = this;
    var curLine = r.set();
    this.elms.legend = r.set();
    var y = fOptions.height + fOptions.top + 34; //legend顶部坐标
    if(fOptions.xTick.height)
      y += fOptions.xTick.height >= 0 ? fOptions.xTick.height : -20;
    var px = 0, py = y;
    var dx = 25, dy = 15; //图标容器大小
    var dh = 0;
    var len = this.legends.length;
    var sbb;
    for(var i = 0; i < len; i++) {
      if(this.seriesInfo[i].chart == 'xtable') {
        continue;
      }
      var set = r.set();
      //绘制图标：点/线/块
      if(this.isRectIcon(i)){
        //方块
        set.push(r.rect(px + 2, py + 4, 9, 9, 1).attr({
          "fill" : this.colorArr[i].plot
        }));
        px -= 13;
      }else{
        //短横线
        var subset = r.set();
        subset.push(r.path(["M", px, py + dy/2, "l", dx, 0].join(" ")));
        //点形状
        subset.push(this.dotDraws[i](px + dx/2, py + dy/2).attr({
          "fill" : "#fff"
        }));
        set.push(subset);
      }
      set.attr({
        "stroke" : this.colorArr[i].plot,
        "stroke-width" : 2
      });
      px += dx + 3;
      var R_t = r.text(px, py + dy/2, this.legends[i]).attr(legendTxtAttr);
      var bb = NC.getBBox(R_t);
      set.push(R_t.attr({x : px + bb.width/2}));
      px += bb.width + 15;
      var bbb = NC.getBBox(set);
      
      var box = r.rect(bbb.x, bbb.y, bbb.width, bbb.height).attr({
        "opacity" : 0,
        "fill" : "#fff",
        "cursor" : "pointer" 
      });
      set.push(box);
      curLine.push(set);
      sbb = NC.getBBox(curLine);
      //超长换行
      if(sbb.width > fOptions.width) {
        i--;
        set.remove();
        curLine = r.set();
        dh += 20;
        py += 20;
        px = 0;
      }else{
        this.elms.legend.push(set);
        //点击图例显示/隐藏对应的图形
        (function(i, legendSet){
          var iseq = frame.parsedData[i].iseq;
          box.click(function(){
            frame.toggleSeries(i);
            var tip = frame.elms.tip;
            if(tip) tip.hide();
          }).mouseover(function(){
            var icon = legendSet[1];
            if(typeof icon.transformStr != 'string')
              icon.transformStr = icon.transform().toString();
            legendSet[0].transform(icon.transformStr + "s1.2");
            eve("frame.legendOver", frame, iseq + 1, '*');
          }).mouseout(function(){
            var icon = legendSet[1];
            if(typeof icon.transformStr == 'string'){
              legendSet[0].transform(icon.transformStr);
            }
            eve("frame.seriesOut", frame);
          });
        })(i, frame.elms.legend[frame.elms.legend.length - 1]);
      }
    }
    fOptions.height -= dh;
    if(this.userOpts.xTick.y) fOptions.xTick.y = this.userOpts.xTick.y - dh;
    
    sbb = NC.getBBox(this.elms.legend);
    //图例左侧坐标
    var x = fOptions.left + (fOptions.width - sbb.width - fOptions.avaSpace.left)/2;
    
    //legend 边框
    if(fOptions.legendAttr.border){
      this.elms.legend.push(r.rect(-4.5, y-4.5, sbb.width+9, sbb.height+9).attr({
        stroke: '#aaa', 'stroke-width' : 1
      }));
    }
    this.elms.legend.translate(x, -dh);
  }
  
  Frame.prototype.dotDrawFunc = function(type){
    var r = this.$$r;
    type = type || 'circle';
    switch(type){
    case 'circle':
      return function(x,y,size){if(size>1)size--;else size=3;return r.circle(x, y, size);}
    case 'rect':
      return function(x,y,size){if(size>1)size--;else size=3;return r.rect(x-size, y-size, 2*size, 2*size);}
    default :
      return function(x,y,size){
        return r.path().attr({
          dotIcon : [type, x, y, size]
        });
      }
    }
  }
  
  Frame.prototype.parseData = function(seriesInfo){//解析数据
    var r = this.$$r;
    var opts = this.userOpts;
    var fOptions = this.options;
    var frame = this;
    var apronum = fOptions.yTick.apronum || 9;
    
    if(seriesInfo){
      frame.hidden = [];
      frame.seriesInfo = [];
      if(NC.isObject(seriesInfo)) {
        for(var key in seriesInfo) {
          frame.seriesInfo.push({
            "title" : key,
            "data" : seriesInfo[key]
          });
        }
      }else{
        frame.seriesInfo = seriesInfo;
      }
      
      if(!frame._seriesInfo){ //保留原始数据，供sample用
        frame._seriesInfo = frame.seriesInfo.slice();
      }
    }
    
    frame.parsedData = []; //seriesInfo
    frame.groups = [];
    frame.minY = [NaN, NaN];
    frame.maxY = [NaN, NaN];
    frame.minX = NaN;
    frame.maxX = NaN;
    frame.legends = [];
    frame.maxYs = [];
    frame.minYs = [];
    frame.rightSide = []; //左右y轴采用不同的比例，需要将数据分为两类
    frame.dotDraws = [];
    
    var len = frame.seriesInfo.length;
    var seq; //根据group调整次序后的序号
    var iseq; //根据group调整次序前的序号
    var leftCursor = 0;
    var rightCursor = len - 1;
    
    frame.seriesNum = {"total" : len};
    
    for(iseq = 0; iseq < len; iseq++) {
      //统计各种类型的图形数
      var chartType = frame.seriesInfo[iseq].chart || fOptions.chartType;
      if(!NC.isArray(chartType)) {
        chartType = [chartType];
      }
      var userConf = frame.seriesInfo[iseq].config || {};
      this.dotDraws[iseq] = this.dotDrawFunc(userConf.dotAttr ? userConf.dotAttr.type : 'circle');
      for(var j = 0; j < chartType.length; j++) {
        var _chart = chartType[j];
        if(!frame.seriesNum[_chart])
          frame.seriesNum[_chart] = 0;
        
        var group = frame.seriesInfo[iseq].group;
        if(group) {
          if(!frame.groups[group]) {
            frame.seriesNum[_chart] ++;
            frame.groups[group] = {cursor:0, pos: [], total: [], Py: []};
          }
        }else{
          frame.seriesNum[_chart] ++;
        }
        
        if(_chart == 'xtable') {
          fOptions.padding.bottom += fOptions.tableH;
          fOptions.height -= fOptions.tableH;
          if(!frame.occupation.xTableH) frame.occupation.xTableH = 0;
          frame.occupation.xTableH += fOptions.tableH;
        }
      }
      
      //逐个series处理(max, 规范化)
      var series = frame.seriesInfo[iseq];
      if(!fOptions.tips) fOptions.tips = series.label || series.tips;
      if(fOptions.showLegend) {
        frame.legends.push(series['title'] || '数据' + iseq);
      }
      //倒序是为了让每个stacked图可见
      if(series.group) {
        seq = rightCursor--;   
      }else{
        seq = leftCursor++; 
      }
      frame.rightSide[seq] = (typeof series.rightSide != 'undefined' ? series.rightSide : false);
      if(NC.isArray(series.data)) {
        parseSeries(series, frame.hidden[iseq]);
      }
    }
    
    if(fOptions.unify) {
      if(!NC.isArray(fOptions.unify)) {
        fOptions.unify = [fOptions.unify, fOptions.unify];
      }
      frame.maxY = [fOptions.unify[0], fOptions.unify[1]];
    }
    for(var i = 0; i < len; i ++) {
      var _i = frame.parsedData[i].iseq;
      if(NC.isArray(frame.seriesInfo[_i].data))
        unifySeries(frame.parsedData[i], frame.seriesInfo[_i], i);
    }
    
    if(isNaN(frame.maxY[0])) frame.maxY[0] = 10 * apronum;
    if(isNaN(frame.minY[0])) {
      if(fOptions.yTick.midY) {
        frame.minY[0] = fOptions.yTick.midY * 0.95;
      }else{
        frame.minY[0] = 0;
      }
    }
    
    if(NC.isArray(frame.userOpts.yTick.startY)) {
      frame.minY = frame.userOpts.yTick.startY.slice();
      if(frame.maxY[0] < frame.minY[0]) frame.maxY[0] = frame.minY[0];
    }
    frame.max_minY = [frame.maxY[0] - frame.minY[0], frame.maxY[1] - frame.minY[1]];
    var scaleY;  //y轴宽裕度
    var dY;  //y轴数据区间大小
    
    if(fOptions.yTick.midY) {
      scaleY = 1.13;
      var halfY = Math.max(fOptions.yTick.midY - frame.minY[0], frame.maxY[0] - fOptions.yTick.midY) * scaleY;
      frame.maxY[0] = fOptions.yTick.midY + halfY;
      frame.minY[0] = fOptions.yTick.midY - halfY;
      dY = frame.maxY[0] - frame.minY[0];
    }else{
      if(fOptions.chartType.length == 1 && fOptions.chartType[0] == 'bar') {
        scaleY = 1.1;
      }else{
        scaleY = fOptions.yTick.rows ? 1 + 2.2/fOptions.yTick.rows : 1.18;
      }
      dY = (frame.maxY[0] - frame.minY[0]) * scaleY;
    }
    
    var bit;
    if(!opts.yTick.interval) {
      fOptions.yTick.interval = [];
      if(dY == 0){ //强制居中
        bit = floor(Math.log(frame.maxY[0]) / Math.log(10)) - 1;
        fOptions.yTick.interval[0] = Math.pow(10,bit) * 2;
        fOptions.yTick.midY = frame.maxY[0];
      }else{
        if(opts.yTick.ticks) {
          fOptions.yTick.interval[0] = dY / (opts.yTick.ticks - 1);
        }else if(opts.grid && opts.grid.rows) {
          fOptions.yTick.interval[0] = dY / opts.grid.rows;
        }else{
          fOptions.yTick.interval[0] = dY / apronum;
        }
        bit = floor(Math.log(fOptions.yTick.interval[0]) / Math.log(10)) - 1;
        fOptions.yTick.interval[0] = Math.ceil(fOptions.yTick.interval[0] / Math.pow(10,bit)) * Math.pow(10,bit);
      }
    } else if(!NC.isArray(opts.yTick.interval)) {
      fOptions.yTick.interval = [opts.yTick.interval];
    }
    
    if(!fOptions.yTick.interval[0]){
      fOptions.yTick.interval[0] = 1;
    }
    
    fOptions.yTick.ticks = opts.yTick.ticks || 
      (opts.grid && opts.grid.rows ?  opts.grid.rows + 1 
       : parseInt(dY / fOptions.yTick.interval[0]) + 2);
    
    fOptions.yTick.interval[1] = (frame.maxY[1] - frame.minY[1]) * scaleY / (fOptions.yTick.ticks - 1);
    bit = floor(Math.log(fOptions.yTick.interval[1]) / Math.log(10)) - 1;
    fOptions.yTick.interval[1] = Math.ceil(fOptions.yTick.interval[1] / Math.pow(10,bit)) * Math.pow(10,bit);
    
    if(!fOptions.yTick.interval[1]) fOptions.yTick.interval[1] = 1;
    
    if(fOptions.yTick.midY) {
      frame.minY[0] = fOptions.yTick.midY - fOptions.yTick.interval[0] * (fOptions.yTick.ticks - 1) / 2;
    }
    
    fOptions.xTick.minX = frame.minX;
    if(!frame.userOpts.xTick.maxX) {
      fOptions.xTick.maxX = frame.maxX || 5;
    }
    
    fOptions.yTick.startY = frame.minY;
    
    if(!fOptions.grid.cols)
      fOptions.grid.cols = fOptions.xTick.ticks - 1 + fOptions.xpadding;
    if(!fOptions.grid.rows)
      fOptions.grid.rows = fOptions.yTick.ticks - 1;
    
    this.colorArr = [];
    for(var i = 0; i < len; i++) {
      var color = fOptions.colors[i] || fOptions.getclr(i, len);
      this.colorArr[i] = {
        orig : color,
        plot : fOptions.vivid ? color : NC.colorSB(color, .5, .85, true)
      };
    }
    
    function unifySeries(data, params, iseq){ //数据按组归一化
      var unify;
      if(fOptions.unify)
        unify = params.rightSide ? fOptions.unify[1] : fOptions.unify[0];
      var userConf = frame.seriesInfo[data.iseq].config || {};
      if(typeof data.ave == 'undefined'){
        data.ave = getAverage(data, true, fOptions.invalid);
        if(params.group && frame.groups[params.group]) {
          data.aveGroupSum = getAverage(frame.groups[params.group]['total'], true, fOptions.invalid);
        }
      }
      NC.each(data, function(dotData, i){
        dotData.average = data.ave;
        dotData.fixMeanNum = userConf.fixMeanNum || fOptions.fixMeanNum;
        if(params.group && frame.groups[params.group]) {
          var total = frame.groups[params.group]['total'][i];
          if(unify){ //叠加后的坐标
            dotData.Py = unify * (total ? dotData.Py / total : i/data.length);
            if(dotData._Py){ //叠加前的坐标
              dotData._Py = unify * (total ? dotData._Py / total : 1/data.length);
            }
          }
          dotData.percent = dotData.y * (total ? 100 / total : 1/data.length);
          dotData.fmtPercent = fOptions.fmtPercent;
          dotData.averageGroupSum = data.aveGroupSum;
          dotData.groupSum = total;
        }
      });
    }
    
    function parseSeries(info, hidden){ //读取单个序列里的数据
      var origData = info.data;
      var dataL = origData.length;
      var _minX = fOptions.xpadding;  //第一个数据点
      if(!(_minX >= frame.minX)) frame.minX = _minX;
      var _maxX = dataL - 1 + 2*fOptions.xpadding;  //坐标轴最右边(0.._maxX)
      if(!(_maxX <= frame.maxX)) frame.maxX = Math.max(_maxX, 0);
      var data = []; //处理后的数据
      var _labels = [];
      var scale = fOptions.scale || 1; //逐个series设置
      for(var i = 0; i < dataL; i++) {
        if(NC.isObject(origData[i])) {
          //以右y轴为基准的数据
          if(!origData[i].y && origData[i].r) {
            origData[i].y = origData[i].r;
            frame.rightSide[seq] = true;
          }
          data.push(origData[i]);
        }else if(NC.isArray(origData[i])) {
          //stacked data
          var sum = 0;
          NC.each(origData[i], function(item){sum+=item.y||item});
          data.push({
            y : sum,
            ys : origData[i]
          });
        }else{
          data.push({
            y: origData[i] || 0
          });
        }
        if(typeof data[i].y == 'undefined' && data[i]['ys']) {
          data[i].y = NC.reduce(data[i]['ys'], function(a,ys){return a+ys.y});
        }
        data[i].y = parseFloat(data[i].y) || 0;
        
        if(typeof data[i].x != 'undefined') _labels.push(data[i].x);
        else data[i].x = i + 1;
        
        //x,y:原始数据  Px,Py:缩放堆叠后的数据  Dx,Dy:绘制视图中的坐标
        NC.deepExtend(data[i], {
          Px : scale * i,
          Py : scale * data[i].y
        });
        
        if(info.group && frame.groups[info.group]) {
          if(!frame.groups[info.group]['total'][i]) {
            frame.groups[info.group]['total'][i] = 0
          }
          frame.groups[info.group]['total'][i] += data[i].y;

          if(!hidden){
            if(typeof frame.groups[info.group]['Py'][i] != 'undefined') {
              data[i]._Py = data[i].Py;
              data[i].Py += frame.groups[info.group]['Py'][i];
            }
            frame.groups[info.group]['Py'][i] = data[i].Py;
          }
        }
        
        if(data[i].milestone) {
          fOptions.xTick.milestones[i] = data[i].milestone;
        }else{
          if(fOptions.xTick.milestones && fOptions.xTick.milestones[i]) {
            data[i].milestone = fOptions.xTick.milestones[i];
          }else{
            data[i].milestone = '';
          }
        }
      }
      
      if(!fOptions.xTick._labels && _labels.length > 0) {
        fOptions.xTick._labels = _labels;
      }
      var _maxY = NaN;
      var _minY = NaN;
      NC.each(data, function(dotData){
        if(dotData.Py == null) return;
        if(!(dotData.Py <= _maxY)) _maxY = dotData.Py;
        if(!(dotData.Py >= _minY)) _minY = dotData.Py;
      });
      frame.maxYs.push(_maxY);
      frame.minYs.push(_minY);
      if(frame.rightSide[seq]) {
        if(!(_maxY <= frame.maxY[1])) frame.maxY[1] = _maxY;
        if(!(_minY >= frame.minY[1])) frame.minY[1] = _minY;
      }else{
        if(!(_maxY <= frame.maxY[0])) frame.maxY[0] = _maxY;
        if(!(_minY >= frame.minY[0])) frame.minY[0] = _minY;
      }
      
      data.iseq = iseq;
      frame.parsedData[seq] = data;  //parsedData与原数据次序不同
      var xticks = parseInt((dataL - 1) / fOptions.xTick.interval) + 1;
      if(!(fOptions.xTick.ticks > xticks)) fOptions.xTick.ticks = xticks;
    }
  }
  
  Frame.prototype.updateData = function(seriesInfo){//更新数据并重绘
    this.groups = [];
    this.yunit = null;
    this.hint = []; //functions
    this.hintReset = []; //functions
    this.showLegend();
    var fOptions = this.options;
    fOptions.width = fOptions._width;
    fOptions.height = fOptions._height;
    fOptions.yTick.interval = null;
    this.parseData(seriesInfo);
    this.reset(fOptions.yTick.interval, fOptions.yTick.startY);
    if(fOptions.avaSpace.modified) {
      fOptions.avaSpace.modified = 0;
      this.reDraw();
    }else{
      if(fOptions.showLegend) {
        if(this.elms.legend) this.elms.legend.remove();
        this.drawLegend();
      }
      this.elms.yTick = this.yTick(this.options.yTick);
      this.xyDraw();
    }
  }
  
  Frame.prototype.toggleSeries = function(i){//切换曲线显示状态
    this.hint = []; //functions
    this.hintReset = []; //functions
    var fOptions = this.options;
    fOptions.width = fOptions._widthPostLegend;
    fOptions.height = fOptions._heightPostLegend;
    var len = this.parsedData.length;
    var hidden = this.hidden;
    var rightSide = this.rightSide;
    var yunit = this.yunit;
    this.toggleLegend(i);
    if(fOptions.autofix) {
      var maxY = [NaN, NaN];
      var minY = [NaN, NaN];
      this.parseData();
      for(var j = 0; j< len; j++) {
        if(!hidden[j]) {
          var side = rightSide[j] ? 1 : 0;
          if(!(this.maxYs[j] <= maxY[side])) {
            maxY[side] =  this.maxYs[j];
          }
          if(!(this.minYs[j] >= minY[side])) {
            minY[side] =  this.minYs[j];
          }
        }
      }
      if(NC.isArray(this.userOpts.yTick.startY)) {
        minY = this.userOpts.yTick.startY.slice();
      }

      var dy = [];
      var yscale0 = (maxY[0] == minY[0] || isNaN(maxY[0]) || isNaN(minY[0]) || fOptions.unify) ? 1 : (this.max_minY[0]) / (maxY[0] - minY[0]);
      dy[0] = ( yscale0 == 0 ? 1 : yunit[0] / yscale0 );
      var yscale1 = (maxY[1] == minY[1]  || isNaN(maxY[1]) || isNaN(minY[1]) || fOptions.unify) ? 1 : (this.max_minY[1]) / (maxY[1] - minY[1]);
      dy[1] = ( yscale1 == 0 ? 1 : yunit[1] / yscale1 );
      
      if(isNaN(minY[0])) minY[0] = this.minY[0];
      if(isNaN(minY[1])) minY[1] = this.minY[1];

      this.reset(dy, minY);
      this.elms.yTick = this.yTick(this.options.yTick);
      this.drawSeries();
    }else{
      if(hidden[i]) {
        this.elms.Series[i].hide();
      }else{
        this.elms.Series[i].show();
      }
    }
  }
  
  Frame.prototype.showLegend = function(i){
    if(typeof i == 'undefined') {
      var hidden = this.hidden;
      for(i = 0; i < hidden.length; i ++) {
        if(hidden[i]) {
          hidden[i] = 0;
          this.showLegend(i);
        }
      }
    }else{
      if(this.elms.legend[i]) {
        var attr = {
          "stroke" : this.colorArr[i].plot
        };
        if(this.isRectIcon(i)){
          attr.fill = this.colorArr[i].plot;
        }
        this.elms.legend[i][0].attr(attr);
        this.elms.legend[i][1].attr({
          "fill" : "#333"
        });
      }
    }
  }

  Frame.prototype.isRectIcon = function(i){
    var fOptions = this.options;
    if(fOptions.legendAttr.icon == 'rect'){
      return true;
    }else{
      var icontype = this.seriesInfo[i].chart || fOptions.chartType;
      if(NC.isArray(icontype)) icontype = icontype[0];
      return (icontype == 'bar' || icontype == 'hbar');
    }
  }
  
  Frame.prototype.toggleLegend = function(i){//切换legend显示状态(变灰)
    var hidden = this.hidden;
    if(hidden[i]) {
      hidden[i] = 0;
      this.showLegend(i);
    }else{
      hidden[i] = 1;
      if(this.elms.legend[i]) {
        var attr = {
          "stroke" : "#aaa"
        };
        if(this.isRectIcon(i)){
          attr.fill = "#aaa";
        }
        this.elms.legend[i][0].attr(attr);
        this.elms.legend[i][1].attr({
          "fill" : "#aaa"
        });
      }
    }
  }
  
  Frame.prototype.drawSeries = function(){//绘制所有数据图和交互区域
    var r = this.$$r;
    var hidden = this.hidden;
    var rightSide = this.rightSide;
    var parsedData = this.parsedData;
    var fOptions = this.options;
    this.hoverAreas = [];
    this.elms.Series = r.set();
    this.barCursor = 1;
    parsedData.xLen = 0;
    var seriesLen = parsedData.length;
    for(var i = 0; i < seriesLen; i++) {
      if(NC.isArray(parsedData[i]) && parsedData[i].length > parsedData.xLen) {
        parsedData.xLen = parsedData[i].length;
      }
      var iseq = parsedData[i].iseq;
      var userConf = this.seriesInfo[i].config || {}; //单条曲线配置
      if(!hidden[iseq]) {
        var color = this.colorArr[iseq].orig;
        var hoverColor = fOptions.hovers && fOptions.hovers[iseq];
        var options = {
          rightSide : rightSide[i],
          title : this.seriesInfo[iseq].title,
          fixedLabel : fOptions.fixedLabel || fOptions.topLabel,
          midLabel : fOptions.midLabel,
          labelPos : fOptions.labelPos,
          tips : this.seriesInfo[iseq].tips || fOptions.tips,
          meanTips : this.seriesInfo[iseq].meanTips || fOptions.meanTips,
          subtips : fOptions.subtips,
          group : this.seriesInfo[iseq].group
        };
        this.seriesCursor = i + 1;
        
        var plotAttr = userConf.plotAttr || fOptions.plotAttr;
        if(NC.isArray(plotAttr)) plotAttr = plotAttr[iseq];
        options.plotAttr = NC.deepExtend({
          stroke : this.colorArr[iseq].plot
        }, plotAttr);
        
        options.meanLineAttr = NC.deepExtend({
          stroke : NC.colorSB(color, .4, .88),
          "stroke-width" : 1.4
        }, fOptions.meanLineAttr, userConf.meanLineAttr);
        options.meanTxtAttr = NC.deepExtend({
          fill : NC.colorSB(color, .4, .88),
          'font-weight' : 'bold'
        }, fOptions.meanTxtAttr, userConf.meanTxtAttr);
        userConf.dotAttr = NC.deepSupplement(userConf.dotAttr || {}, fOptions.dotAttr);
        options.dotAttr = NC.deepExtend({
          type : 'circle',
          stroke : NC.colorSB(color, .5, .7)
        }, userConf.dotAttr);
        if(userConf.dotAttr.solid) options.dotAttr["fill"] = NC.colorSB(color, .5, .7);
        options.dotDraw = this.dotDraws[i];
        
        userConf.barAttr = NC.deepSupplement(userConf.barAttr || {}, fOptions.barAttr);
        options.barAttr = NC.deepExtend({
          fill : userConf.barAttr.nogradient ? 
            color : NC.getGradient(NC.colorSB(color, .9, 1))
        }, userConf.barAttr);
        if(hoverColor){
          options.hoverAttr = NC.deepExtend({
            fill : userConf.barAttr.nogradient ? 
              hoverColor : NC.getGradient(NC.colorSB(hoverColor, .9, 1))
          }, userConf.hoverAttr);
        }
        options.color = color;

        var fillAttr = userConf.fillAttr || fOptions.fillAttr;
        if(fillAttr) {
          options.noBG = false;
          fillAttr = NC.isArray(fillAttr) ? fillAttr[iseq] : fillAttr;
        } else if(fOptions.noBG == false) {
          options.noBG = false;
        }
        if(options.noBG == false){
          options.fillAttr = NC.deepExtend({
            fill : NC.colorSB(color, 0.6, 1)
          }, fillAttr);
        }
        
        //绘制曲线
        var chartType = this.seriesInfo[iseq].chart || fOptions.chartType;
        
        if(chartType == 'xtable' || chartType[0] == 'xtable') {
          hidden[iseq] = 1; //不参与重绘
        }
        //注意：Series的顺序与原数据的顺序不一致
        this.elms.Series.push(this.addSeries(
          parsedData[i],
          chartType,
          options
        ));
      }
    }
    if(this.elms.cross) this.elms.cross.toFront();
    if(!fOptions.noHover) this.hoverTips(parsedData, {
      hidden: hidden,
      rightSide: rightSide
    });
  }
  
  Frame.prototype.xyDraw = function(data){//包含动画的drawSeries
    this.drawSeries();
    if(this.options.animate && !this.noAnimate)
      this.clipAnim();
  }
  
  Frame.prototype.postClear = function(){
    this.elms = {};
  }
  
  Frame.prototype.reDraw = function(dw){//清空画布重画
    var fOptions = this.options;
    this.$$canvas.clear();
    fOptions.height = fOptions._height;
    fOptions.width = fOptions._width + (dw || 0);
    fOptions.left = fOptions._left;
    NC.deepExtend(fOptions.avaSpace, fOptions._avaSpace);
    this.$screen = this.$framepole = null;
    if(fOptions.htmlTips){
      this.elms.tip = this.$$canvas.htmlTip(this);
    }else{
      this.elms.tip = this.$$canvas.tip({
        fixTips : fOptions.fixTips,
        txtAttr : fOptions.tipAttr,
        label : (fOptions.tips || '.')
      });
    }
    if(this.elms.cross) this.elms.cross = this.cross(fOptions.markerAttr).init();
    this.elms.Series = null;
    this.elms.yTick = null;
    this.reset(fOptions.yTick.interval, fOptions.yTick.startY);
    this.drawAxis();
    this.xyDraw();
    if(fOptions.showLegend){
      this.drawLegend();
    }
  };
  
  Frame.prototype.hoverTips = function(parsedData, opts){//交互提示
    if(!NC.isArray(parsedData)) return;

    var xLen = parsedData.xLen; //x向hover区域数
    if(xLen == 0) return;
    
    var r = this.$$r;
    var frame = this;
    var params = {
      zone : 'full',
      hidden : [],
      rightSide : []
    };
    NC.deepExtend(params, opts);
    
    var canvas = this.$$canvas;
    var cOptions = canvas.options;
    
    var fOptions = this.options;
    var dx = fOptions.left + (fOptions.flip ? 0 : fOptions.xTick.startX);
    var dy = fOptions.top;
    var fwidth = fOptions.width;
    var fheight = fOptions.height;
    var scale = params.scale || 1;
    var xsegments = fOptions.xTick.maxX ? fOptions.xTick.maxX 
          : xLen - 1 + 2 * fOptions.xpadding;
    //每个hover矩形的宽度
    var X = (fOptions.flip ? fheight : fwidth) / xsegments / scale;
    var Y;
    var startY = fOptions.yTick.startY;
    var tip = frame.elms.tip;
    var cross = frame.elms.cross;
    var leftgutter = 0.5;
    var bottomgutter = 0.5;
    var xgap = X;
    var height = fheight + dy;
    
    var ss = parsedData.length;  //数据series个数
    var orders = [], Ys, Yall;
    for(var k = 0; k < ss; k++) {
      if(!params['hidden'][parsedData[k].iseq])
        orders.push(k);
    }
    var ss2 = orders.length; //当前可交互的数据series个数
    var screenY;
    frame.onleave = function () {
      if(!fOptions.tipsAlwaysOn){
        eve("frame.seriesOut", frame);
        if(frame.elms.tip) frame.elms.tip.hide();
        if(frame.elms.cross) frame.elms.cross.hide();
      }
    };
    for(var i = 0; i < xLen; i++) {
      Ys = [];  //显示的点
      Yall = [];  //所有点
      for(var k = 0; k < ss; k++) {
        var yTotal = fOptions.yTick.total[params['rightSide'][k] ? 1 : 0];
        if(fOptions.flip) {
          Y = fwidth / yTotal;
        }else{
          Y = fheight / yTotal;
        }
        var screenY0 = (parsedData[k][i] ? parsedData[k][i].Py * Y : null);
        if(screenY0 != null) {
          if(params['rightSide'][k]) {
            screenY = screenY0 - startY[1] * Y;
          }else{
            screenY = screenY0 - startY[0] * Y;
          }
        }else{
          screenY = null;
        }
        Yall.push(screenY0);
        if(!params['hidden'][k]) {
          Ys.push(screenY);
        }
      }
      orders = orders.sort(function(a,b){ //parsedData下标
        return Yall[b] - Yall[a];
      });
      Ys = Ys.sort(function(a,b){  //y值
        return b - a;
      });
      
      var x, y;
      
      if(fOptions.flip) {
        y = dy + bottomgutter + X * scale * i + fOptions.xTick.startX;
        var dh = (i == xLen-1 ? Math.max(fheight - X * scale * i - fOptions.xTick.startX, xgap) : xgap);
        frame.hoverAreas[i] = {
          y2 : y - xgap/2 + dh,
          segs : []
        };
      }else{
        x = leftgutter + X * scale * i + dx;
        var dw = (i == xLen-1 ? Math.max(fwidth - X * scale * i - fOptions.xTick.startX, xgap) : xgap);
        frame.hoverAreas[i] = {
          x2 : x - xgap/2 + dw,
          segs : []
        };
      }
      //从上往下计算每个hover区域
      var segs = frame.hoverAreas[i]['segs'];
      for(var k = 0; k < ss2; k++) {
        if(Ys[k] == null) continue;
        var s = orders[k] + 1; //s为parsedData的序号
        if(Yall[s-1] == fOptions.invalid) continue; //startY不为0时有问题
        var Y1 = k == 0
              ? Ys[k] 
              : (Ys[k-1] + Ys[k])/2;
        var Y2 = (k == ss2-1 || Ys[k+1] == null)
              ? 0
              : (Ys[k] + Ys[k+1]) / 2;
        var subYs = parsedData[s-1][i] ? parsedData[s-1][i].ys : null;
        var iseq = parsedData[s-1].iseq;
        var segOpts = {
          series : s,
          func : frame.hint[s]
        }
        if(fOptions.flip) {
          var x1 = Y2;
          var x2 = k == 0 ? fwidth : Y1;
          if(typeof parsedData[s-1][i].y1 != 'undefined') {
            segOpts.y1 = parsedData[s-1][i].y1;
            segOpts.y2 = parsedData[s-1][i].y2;
          }else{
            segOpts.x1 = leftgutter + dx + Math.min(x1, x2);
            segOpts.x2 = leftgutter + dx + Math.max(x1, x2);
          }
          if(subYs) { //先处理ys分段
            subSegs(segs, subYs, segOpts, leftgutter + dx + Ys[k]);
          }
        }else{
          var y1 = k == 0 ? fOptions.top
                : height - bottomgutter - Y1;
          var y2 = height - bottomgutter - Y2;
          if(parsedData[s-1][i] && typeof parsedData[s-1][i].x1 != 'undefined') { //柱图
            segOpts.x1 = Math.min(parsedData[s-1][i].x1, parsedData[s-1][i].x2);
            segOpts.x2 = Math.max(parsedData[s-1][i].x1, parsedData[s-1][i].x2);
          }
          segOpts.y1 = y1;
          segOpts.y2 = y2;
          
          if(frame.meanLineHint && frame.meanLineHint[s]) {
            meanLineSeg(parsedData[s-1], segOpts, height - bottomgutter + startY[0] * Y);
          }
          if(subYs) { //先处理ys分段
            subSegs(segs, subYs, segOpts, height - bottomgutter - Ys[k]);
          }
        }
        segs.push(segOpts);
      }
    }
    
    function meanLineSeg(datas, segOpts, posT){//parsedData[s-1]
      var meanLineOpts = NC.deepSupplement({
        subSeg : i,
        func : frame.meanLineHint[s]
      }, segOpts);
      
      var val = datas.ave;
      var dis = 7;
      if(fOptions.flip) {
        posT += val * Y;
        meanLineOpts.x1 = posT - dis;
        meanLineOpts.x2 = posT + dis;
      }else{
        posT -= val * Y;
        meanLineOpts.y1 = posT - dis;
        meanLineOpts.y2 = posT + dis;
      }
      segs.push(meanLineOpts);
    }
    
    function subSegs(subs, ys, segOpts, posT){
      if(!frame.hint[s].subHint) return;
      var ysLen = ys.length;
      if(fOptions.mirror) {
        posT = fOptions.width + fOptions.left * 2 - posT;
      }
      
      for(var i = ysLen - 1; i >= 0; i --) {
        var val = ys[i].y;
        var subSegOpts = NC.deepSupplement({
          subSeg : i,
          func : frame.hint[s].subHint
        }, segOpts);
        if(fOptions.flip) {
          if(fOptions.mirror) {
            subSegOpts.x1 = posT;
            subSegOpts.x2 = posT + val * Y;
          }else{
            val = -val;
            subSegOpts.x1 = posT + val * Y;
            subSegOpts.x2 = posT;
          }
        }else{
          subSegOpts.y1 = posT;
          subSegOpts.y2 = posT + val * Y;
        }
        segs.push(subSegOpts);
        posT += val * Y;
      }
    }
    
    //鼠标移动交互区
    this.$pole = r.rect(0,0,0,0);
    for(var p = this.$$afterPole.length - 1; p >= 0; p --){
      this.$$afterPole[p].insertBefore(this.$pole);
    }
    this.$$afterPole = [];

    if(fOptions.grid.vline){
      var vline = this._Grid[this._Grid.length - 1];
      if(vline) vline.insertBefore(this.$pole);
    }
    var allowance = NC.isMobile ? 12 : 1;
    this.$screen = r.rect(
      fOptions.left - allowance, //左右加1px盈余空间
      fOptions.top - allowance, 
      fOptions.width + 2 * allowance, 
      fOptions.height + 2 * allowance
    ).attr(NC.$$attr.screen);
    if(fOptions.ys || fOptions.onclick) this.$screen.attr({cursor : "pointer"});
    
    if(fOptions.hoverOnInit) {  //初始时激活hoverTip
      var hoverPos = (fOptions.hoverOnInit == 'left'
                      ? 0
                      : frame.hoverAreas.length - 1);
      eve("frame.seriesOver", frame, 0, hoverPos);
    }
    this.$screen
    [NC.evName("mousemove")](moveHandle)
    [NC.evName("mouseover")](overHandle)
      .touchstart(moveHandle)
      .mouseout(outHandle)
      .click(clickHandle);

    function overHandle(e){
      if(!frame.hovering){
        eve("pieOver");  //reset关联饼图
        if(tip.body) tip.moveBody(this);
        frame.hovering = true;
        if(fOptions.dotHidden == 2) { //显示全部dot
          var xlen = frame.hoverAreas.length;
          NC.each(frame.hint, function(func){
            if(NC.isFunction(func))
              for(var j = 0; j < xlen; j ++){
                func(j);
              }
          });
        }
      }
    }
    function outHandle(e){
      frame.tip_timer = setTimeout(frame.onleave, 600);
      frame.hovering = false;
    }
    function clickHandle(e){
      var hint = frame.hint[frame.curSeries];
      if(!hint) return;
      var mpos = canvas.mousePos(e, true);
      //沿x轴扫描得到i
      for(var i = 0; i < frame.hoverAreas.length; i ++){
        var area = frame.hoverAreas[i];
        if(area["segs"].length > 0
           && inSelection(mpos, area)){
          if(hint.subChart){
            hint.subChart(i);
          }
          if(fOptions.onclick) fOptions.onclick(i);
          break;
        }
      }
    }
    function moveHandle(e){
      var mpos = canvas.mousePos(e);
      var xlen = frame.hoverAreas.length;
      if(xlen == 0) return;
      
      //根据clientX, clientY计算hover区域(hoverSeries, i)
      var xArea;
      for(var iSeq = 0; iSeq < xlen; iSeq ++) {//沿分类轴找到组内编号iSeq
        xArea = frame.hoverAreas[iSeq];
        if(xArea["segs"].length > 0
           && inSelection(mpos, xArea)){
          break;
        }
      }
      if(iSeq == xlen) iSeq --;

      var k = -1;
      if(fOptions.htmlTips && fOptions.htmlTips.group){ //多组合并显示
        if(frame.curSeries_i == iSeq) return;
        //清除之前的显示
        if(fOptions.dotHidden != 2 && typeof frame.curSeries_i != 'undefined'){
          NC.each(frame.hintReset, function(func){
            if(NC.isFunction(func)){
              func(frame.curSeries_i);
            }
          });
        }
      }else{ //沿y轴找到数组序号k
        var segs = xArea["segs"];
        for(k = 0; k < segs.length; k ++) {
          if(inSelection(mpos, segs[k])) {
            break;
          }
        }
        if(!segs[k]) return;
        var hoverSeries = segs[k].series;
        if(frame.curSeries == hoverSeries
           && frame.curSeries_k == k
           && frame.curSeries_i == iSeq) return;
        
        //清除之前的显示
        if(typeof frame.curSeries_i != 'undefined'
           && NC.isFunction(frame.hintReset[frame.curSeries])){
          frame.hintReset[frame.curSeries](frame.curSeries_i);
        }
        frame.curSeries = hoverSeries;
        frame.curSeries_k = k;
      }
      eve("frame.seriesOver", frame, k, iSeq, mpos); //group显示时，k=-1
    }
  };
  
  function inSelection(mpos, seg){
    if(typeof seg.y1 != 'undefined' && mpos.y < seg.y1) {
      return false;
    }
    if(typeof seg.y2 != 'undefined' && mpos.y > seg.y2) {
      return false;
    }
    if(typeof seg.x1 != 'undefined' && mpos.x < seg.x1) {
      return false;
    }
    if(typeof seg.x2 != 'undefined' && mpos.x > seg.x2) {
      return false;
    }
    return true;
  }
  
  Frame.prototype.cross = function(opts){//十字线指示
    var cross = new Cross(opts);
    cross.$$r = this.$$r;
    cross.$$frame = this;
    return cross;
  };
  
  Frame.prototype.addSeries = function(datas, chartTypes, opts){//绘制单个数据图
    var r = this.$$r;
    if(NC.isArray(chartTypes)) {
      if(chartTypes.length == 1){
        chartTypes = chartTypes[0];
      }else{
        var set = r.set();
        for(var i = 0, clen = chartTypes.length; i < clen; i++) {
          set.push(this.addSeries(datas, chartTypes[i], opts));
        }
        return set;
      }
    }
    
    var MAAttr = this.options.MAAttr || {plotAttr : {"stroke-width": 1, stroke:'#ef7f44'}};
    if(/^ma(\d+)$/i.test(chartTypes)) {
      var size = RegExp.$1;
      return this.addSeries(moveAverage(datas, size), 'line', MAAttr);
    }else if(chartTypes == 'mline') {
      return this.addSeries(getAverage(datas), 'line', MAAttr);
    }
    
    var frame = this;
    var fOptions = this.options;
    var canvas = this.$$canvas;
    if(typeof fOptions.xTick.startX == 'undefined')
      this.elms.xTick = this.xTick();
    if(typeof fOptions.yTick.startY == 'undefined')
      this.elms.yTick = this.yTick();
    
    var params = {
      width : fOptions.width,
      height : fOptions.height,
      x : fOptions.left,
      y : fOptions.top,
      plotAttr : {"stroke-width": 2.5},
      fillAttr : {stroke: "none", opacity: .5},
      dotAttr : {fill: "#fff", "stroke-width": 1.5, "type": "circle"},
      barAttr : {stroke: "none", "stroke-width": 0},
      labelAttr : {fill: "#555", font: NC.$$font},
      midLabelAttr : {fill: "#fff", font: NC.$$font},
      xTableAttr : {fill: "#555", font: NC.$$sfont},
      fixedLabel : false,
      labelPos : "top",
      noBG : true,
      scale : 1,
      meanTips : "平均值: {ave}",
      rightSide : false
    };
    NC.deepExtend(params, opts);
    if(!params.dotDraw) params.dotDraw = this.dotDrawFunc();
    
    var that = this.$$canvas;
    var iseq = datas.iseq || 0;
    var options = that.options;
    var chartType = chartTypes || 'line';
    var scale = params.scale;
    
    var leftgutter = 0.5;
    var bottomgutter = 0.5;
    var fwidth = params.width;   //可绘区域
    var fheight = params.height;
    var len = datas.length;
    var maxX = fOptions.xTick.maxX;
    var X, Y;  //1单元数值对应的像素数
    var dx, dy; //第一个数据点
    var yTotal = params.rightSide ? fOptions.yTick.total[1] : fOptions.yTick.total[0]; //y轴数据量
    if(fOptions.flip) {
      Y = NC.isArray(datas[0]) ? 1 : fheight / (maxX) / scale;
      X = fwidth / yTotal;
      dy = fOptions.xTick.y - Y * maxX + fOptions.xTick.startX;
      dx = params.x;
    }else{
      X = NC.isArray(datas[0]) ? 1 : fwidth / (maxX) / scale;
      Y = fheight / yTotal;
      dx = params.x + fOptions.xTick.startX;
      dy = params.y;
    }
    var startY = fOptions.yTick.startY ?
          params.rightSide ? fOptions.yTick.startY[1] : fOptions.yTick.startY[0]
        : 0;
    var width = options.width;
    var height = fheight + dy + startY * Y; //y=0对应的画面位置
    var p = [], bgpp = [], bgpp2 = [];
    var svgPath = '';
    var bgPath = '';
    var meanPath = '';
    var meanTxt;
    var colorhue = .1 || Math.random();
    var color = "hsl(" + [colorhue, .5, .5] + ")";
    var fixedLabelSet = r.set();
    var dotSet = r.set();
    var barSet = r.set();
    var xtick; //tips中的{xtick}
    NC.each(datas, function(dotData, i){
      if(dotData && typeof dotData.title == 'undefined') {
        xtick = NC.isArray(fOptions.xTick.labelText) ? 
          (NC.isObject(fOptions.xTick.labelText[i]) ? fOptions.xTick.labelText[i].text : fOptions.xTick.labelText[i]) : '';
        if(!xtick) xtick = '';
        NC.deepSupplement(dotData, {
          title : params.title,
          xtick : xtick.toString().replace(/\n/g, '')
        });
      }
      
      if(frame.groups[params.group]) { //group.y, group.title
        dotData.group = {
          y : fOptions.yTick.fixNum(frame.groups[params.group]['total'][i]),
          title : params.group
        }
      }
    });
    var userConf = frame.seriesInfo && frame.seriesInfo[iseq] ? frame.seriesInfo[iseq].config : null;
    if(!userConf) userConf = {};
    var fixMeanNum = userConf.fixMeanNum || fOptions.fixMeanNum || round;
    
    var procFuncs = {
      'line' :function(){
        NC.each(datas, function(dotData, i){
          if(p.length == 0 && dotData.y == fOptions.invalid) return;
          if(dotData.Px == null) dotData.Px = i * scale;
          if(dotData.Py == null) dotData.Py = dotData.y;
          var x = leftgutter + X * (dotData.Px) + dx;
          var y = height - bottomgutter - Y * dotData.Py;
          if(dotData._Py){
            var y2 = height - bottomgutter - Y * (dotData.Py - dotData._Py);
            bgpp2 = [x, y2].concat(bgpp2);
          }
          if(p.length == 0) {
            p = ["M", x, y, "L", x, y];
            if(bgpp2.length){
              bgpp = ["M", x, y, "L"];
            }else{
              bgpp = ["M", x, height - Y*startY, "L", x, y];
            }
          } else {
            p = p.concat([x, y]);
            bgpp = bgpp.concat([x, y]);
          }
        });
        if(bgpp2.length){
          bgpp = bgpp.concat(bgpp2);
        }else{
          bgpp = bgpp.concat(["V", height - Y*startY]);
        }
        if(fOptions.meanLine) {
          datas.ave = getAverage(datas, true, fOptions.invalid, 'Py');
          var posAve = height - bottomgutter - Y * datas.ave;
          meanPath = ["M", fOptions.left, posAve, "h", fOptions.width].join(",");
          
          if(fOptions.htmlTips && fOptions.htmlTips.group){ //固定文字
            meanTxt = r.text(0, 0, fixMeanNum(datas.ave));
            var tbb = NC.getBBox(meanTxt);
            var textX = params.rightSide ? fOptions.left + fOptions.width - tbb.width/2 - 3
                  : fOptions.left + tbb.width/2 + 3
            meanTxt.attr({
              x : textX,
              y : posAve - tbb.height/2
            });
          }else{
            if(!frame.meanLineHint) {
              frame.meanLineHint = {};
            }
            frame.meanLineHint[frame.seriesCursor] = function(i, subseg, mpos){
              var tip = frame.elms.tip;
              var id = 'mline' + frame.seriesCursor;
              if(tip && tip._id != id) {
                tip._id = id;
                tip.update({
                  x : mpos ? mpos.x : fOptions.left + fwidth*i/datas.length,
                  y : posAve,
                  label : params.meanTips,
                  labelPos : params.labelPos,
                  data : {
                    average : datas.ave,
                    fixMeanNum : fixMeanNum
                  },
                  animate: false
                });
              }
            }
          }
        }
        svgPath = p.join(",");
        bgPath = bgpp.join(",") + "z";
      },
      'xtable':function(){
        var xlen = datas.length;
        r.text(
          frame.elms.xTick.xTickPos.x[0] - floor(fOptions.width / (xlen + 1)), 
          frame.elms.xTick.xTickPos.y, 
          datas[0].title).attr(params.xTableAttr);
        for(var i = 0; i < xlen; i++) {
          r.text(frame.elms.xTick.xTickPos.x[i], frame.elms.xTick.xTickPos.y, datas[i].y).attr(params.xTableAttr);
        }
        frame.elms.xTick.xTickPos.y += fOptions.tableH;
      },
      'bar' :function(){
        var xs = [], ys = [];
        var bars = [];
        var seriesNum = frame.seriesNum.bar || 1;
        var barThick = round(0.8 * X / seriesNum);
        var maxBarThick = params.barAttr.thickness;
        var hasSubSeg = false;
        if(barThick > maxBarThick) barThick = maxBarThick;
        for(var i = 0, ii = datas.length; i < ii; i++) {
          var cursor = frame.groups[params.group] && frame.groups[params.group].cursor ? 
                frame.groups[params.group].cursor : frame.barCursor;
          var x = round(leftgutter + X * (datas[i].Px) + dx);
          x += (cursor - 1 - seriesNum/2) * barThick;
          var y;
          if(fOptions.mirror) {
            y = round(fOptions.top + Y * datas[i].Py);
          }else{
            y = round(height - bottomgutter - Y * datas[i].Py);
          }
          xs.push(x);
          ys.push(y);
          
          var barH = Y * (datas[i].Py - startY);
          if(barH < 0.5) {
            y -= 0.5;
            barH = 0.5;
          }
          var bar;
          if(fOptions.mirror) {
            bar = r.rect(
              x + 1, fOptions.top, 
              barThick - 1, barH
            );
          }else{
            bar = r.rect(
              x + 1, y + 0.5, 
              barThick - 1, barH
            );
          }
          barSet.push(bar);
          bars[i] = bar;
          
          bars[i].barAttr = NC.deepExtend({}, params.barAttr);
          if(datas[i].color)
            bars[i].barAttr.fill = params.barAttr && params.barAttr.nogradient ? 
            datas[i].color : NC.getGradient(NC.colorSB(datas[i].color, .9, 1));
          bar.attr(bars[i].barAttr);
          
          if(!params.group) {
            datas[i].x1 = x;
            datas[i].x2 = x + barThick;
          }
          
          //柱顶的label
          if(params.fixedLabel) {
            var label = NC.subs(params.fixedLabel, datas[i]);
            var topTranslate = fOptions.mirror ? 9 : -9;
            barSet.push(r.text(x + barThick/2, y + topTranslate, label)
                        .attr(params.labelAttr));
          }
          if(datas[i].ys) {
            hasSubSeg = true;
            var sVal = 0;
            NC.each(datas[i].ys, function(_ys, j){
              var dVal = j == 0 ? _ys[0].y - startY
                    : _ys[j].y;
              barH = dVal * Y;
              var subBar = r.rect(
                x + 1, y + sVal * Y,
                barThick - 1, barH
              ).attr(params.barAttr);
              sVal += _ys[j].y;
              
              barSet.push(subBar);
            });
          }
        }

        var posAve, tbb;
        if(fOptions.meanLine) { //单柱平均线
          datas.ave = getAverage(datas, true, fOptions.invalid, 'Py');
          posAve = height - bottomgutter - Y * datas.ave;
          meanPath = ["M", fOptions.left, posAve, "h", fOptions.width].join(",");
          meanTxt = r.text(0, 0, fixMeanNum(datas.ave));
          tbb = NC.getBBox(meanTxt);
          meanTxt.attr({
            x : fOptions.left + tbb.width/2 + 3,
            y : posAve - tbb.height/2
          });
        }
        
        if(params.group) {
          if(!frame.groups[params.group].cursor) { //分类轴上一组柱内的次序
            //只为数据轴上最高的柱子画平均线
            if(fOptions.groupMeanLine) { //平均线
              datas.ave = getAverage(datas, true, fOptions.invalid, 'Py');
              posAve = height - bottomgutter - Y * datas.ave;
              meanPath = ["M", fOptions.left, posAve, "h", fOptions.width].join(",");
              meanTxt = r.text(0, 0, fixMeanNum(datas.ave));
              tbb = NC.getBBox(meanTxt);
              meanTxt.attr({
                x : fOptions.left + tbb.width/2 + 3,
                y : posAve - tbb.height/2
              });
            }
            
            frame.groups[params.group].cursor = frame.barCursor;
            frame.barCursor ++;
          }
          frame.groups[params.group]['pos'][i] = {x:x, y:y};
        }else{
          frame.barCursor ++;
        }
        
        if(!params.midLabel) {
          if(params.labelPos == 'top' && fOptions.mirror) {
            params.labelPos = 'bottom';
          }
          frame.hint[frame.seriesCursor] = function(i){
            var tip = frame.elms.tip;
            var id = frame.curSeries + '_' + i;
            if(tip && tip._id != id) {
              tip._id = id;
              tip.update({
                x : xs[i] + barThick/2,
                y : ys[i],
                label : params.tips,
                labelPos : params.labelPos,
                data : datas[i],
                animate: true
              });
            }
            if(params.hoverAttr){
              bars[i].attr(params.hoverAttr);
            }
          };
          
          if(params.hoverAttr){
            frame.hintReset[frame.seriesCursor] = function(i, hideTip){
              bars[i].attr(bars[i].barAttr);
            };
          }
        }
        
        if(hasSubSeg) { //bar二级交互
          if(!frame.hint[frame.seriesCursor]) {
            frame.hint[frame.seriesCursor] = {};   
          }
          frame.hint[frame.seriesCursor].subHint = function(i, k){
            var tip = frame.elms.tip;
            var id = frame.curSeries + '_' + i + '_' + k;
            if(tip && tip._id != id) {
              tip._id = id;
              var vals = 0;
              var subSegLen = datas[i].ys.length;
              for(var j = subSegLen - 1; j > k; j --) {
                vals += datas[i].ys[j].y;
              }
              vals += datas[i].ys[k].y / 2;
              datas[i].sub = datas[i].ys[k];
              tip.update({
                x : xs[i] + barThick,
                y : ys[i] + vals * Y,
                label : params.subtips || params.tips,
                labelPos : 'right',
                data :  datas[i],
                animate: true
              });
            }
          }
        }
      },
      'hbar' :function(){
        var positions = [];
        var bars = [];
        var hasSubSeg = false;
        var seriesNum = frame.seriesNum.hbar || 1;
        var barThick = round(0.8 * Y / seriesNum);
        for(var i = 0, ii = datas.length; i < ii; i++) {
          var cursor = frame.groups[params.group] && frame.groups[params.group].cursor ? 
                frame.groups[params.group].cursor : frame.barCursor;
          var y = round(dy + Y * (datas[i].Px));
          y += (cursor - 1 - seriesNum/2) * barThick;
          var x;
          if(fOptions.mirror) {
            x = fOptions.width + dx - X * (datas[i].Py - startY);
          }else{
            x = round(dx + X * (datas[i].Py - startY));
          }
          positions.push({ //柱顶位置
            x : x + 1.5,
            y : y
          });
          
          var barH = X * (datas[i].Py - startY);
          
          var bar;
          if(fOptions.mirror) {
            bar = r.rect(
              fOptions.width + dx + 1 - barH, y + 1,
              barH, barThick - 1
            ).attr(params.barAttr);
          }else{
            bar = r.rect(
              dx + 1, y + 1,
              barH, barThick - 1
            ).attr(params.barAttr);
          }
          bars[i] = bar;
          barSet.push(bar);
          
          if(!params.group) {
            datas[i].y1 = y;
            datas[i].y2 = y + barThick;
          }
          
          //柱顶的label
          if(params.fixedLabel) {
            var label = NC.subs(params.fixedLabel, datas[i]);
            var topText = r.text(x, y + barThick/2, label)
                  .attr(params.labelAttr);
            var topTranslate = topText.getBBox().width / 2 + 4;
            if(fOptions.mirror) topTranslate = - topTranslate;
            topText.translate(topTranslate, 0);
            barSet.push(topText);
          }
          
          if(datas[i].ys && !fOptions.ys) {
            hasSubSeg = true;
            var sVal = 0;
            NC.each(datas[i].ys, function(_ys, j){
              var dVal = j == 0 ? _ys.y - startY
                    : _ys.y;
              var subBarH = dVal * X;
              var sx;
              if(fOptions.mirror) {
                sx = fOptions.width + dx - sVal * X - subBarH;
              }else{
                sx = dx + sVal * X;
              }
              var subBar = r.rect(
                sx, y + 1, 
                subBarH, barThick - 1
              ).attr(params.barAttr);
              sVal += dVal;
              
              barSet.push(subBar);
            });
          }
          //柱间的label
          if(params.midLabel) {
            label = NC.subs(params.midLabel, datas[i]);
            var midX;
            if(fOptions.mirror) {
              midX = fOptions.width + dx - barH * 0.48;
            }else{
              midX = dx + barH * 0.52;
            }
            barSet.push(r.text(
              midX, 
              y + barThick/2, label
            ).attr(params.midLabelAttr));
          }
        }
        if(!params.midLabel) {
          frame.hint[frame.seriesCursor] = function(i){
            var pos = positions[i]; //柱顶
            var tip = frame.elms.tip;
            var id = frame.curSeries + '_' + i;
            if(tip && tip._id != id) {
              tip._id = id;
              tip.update({
                x : pos.x,
                y : pos.y + barThick/2,
                label : params.tips,
                labelPos : (fOptions.mirror ? 'left' : 'right'),
                data :  datas[i],
                animate: true
              });
            }
            if(params.hoverAttr){
              bars[i].attr(params.hoverAttr);
            }
          };
          
          if(params.hoverAttr){
            frame.hintReset[frame.seriesCursor] = function(i, hideTip){
              bars[i].attr(params.barAttr);
            };
          }
        }
        
        if(params.group) {
          if(!frame.groups[params.group].cursor) { //分类轴上一组柱内的次序
            frame.groups[params.group].cursor = frame.barCursor;
            frame.barCursor ++;
          }
          frame.groups[params.group]['pos'][i] = {x:x, y:y};
        }else{
          frame.barCursor ++;
        }
        
        if(!frame.hint[frame.seriesCursor]) {
          frame.hint[frame.seriesCursor] = {};
        }
        if(hasSubSeg) { //hbar二级交互
          frame.hint[frame.seriesCursor].subHint = function(i, k){
            var tip = frame.elms.tip;
            var pos = positions[i]; //柱顶
            var id = frame.curSeries + '_' + i + '_' + k;
            if(tip && tip._id != id) {
              tip._id = id;
              var vals = 0;
              var subSegLen = datas[i].ys.length;
              for(var j = subSegLen - 1; j > k; j --) {
                vals += datas[i].ys[j].y;
              }
              vals += datas[i].ys[k].y / 2;
              datas[i].sub = datas[i].ys[k];
              var xs;
              if(fOptions.mirror) {
                xs = pos.x + vals * X;
              }else{
                xs = pos.x - vals * X;
              }
              
              tip.update({
                x : xs,
                y : pos.y + barThick,
                label : params.subtips || params.tips,
                labelPos : 'bottom',
                data :  datas[i],
                animate: true
              });
            }
          }
        } else if(fOptions.ys) {
          var subRadius = Math.min(fOptions.height/2, fOptions.width * 0.5);
          var cx = fOptions.mirror ? 
                fOptions.left - fOptions.width * .65
                : fOptions.left + fOptions.width * 1.75;
          var pie = canvas.ring(datas[0].ys, {
            tips : "{title}\n{percent}% [{fmtval}]",
            cx : cx,
            radius : subRadius,
            legend : 0,
            tipRatio : (subRadius > 75 ? 0.2 : 0),
            tipAttr : {fill:'#555'},
            animate : true,
            getclr : function(a){
              return NC.colorSB(params.color, 0.1, 1-a*0.2)
            }
          });
          var cy = pie.options.cy;
          var arrow;
          var drawArrow = function(i){
            if(arrow) arrow.remove();
            var posx = fOptions.mirror ? 
                  positions[i].x - 42.5
                  : positions[i].x + 42.5;
            var posy = positions[i].y + barThick / 2 - 1.5;
            var dis = Math.sqrt(Math.pow(cx-posx, 2) + Math.pow(cy-posy, 2));
            var ratio = (subRadius + 10) / dis;
            arrow = r.path([
              'M', posx, posy,
              'L', 
              posx * ratio + cx * (1-ratio),
              posy * ratio + cy * (1-ratio)
            ].join()).toBack().attr({
              stroke : NC.colorSB(params.color, 0.8, 0.9),
              'stroke-width' : 3.5
            });
          }
          drawArrow(0);
          frame.hint[frame.seriesCursor].subChart = function(i){
            drawArrow(i);
            var data = datas[i].ys || [];
            pie.reDraw(data);
          }
        }
      },
      'dot' :function(){
        var xs = [], ys = [];
        var inVisible = {};
        var invalidCount = 0;
        for(var i = 0, ii = datas.length; i < ii; i++) {
          if(datas[i].y == null) continue;
          if(datas[i].y == fOptions.invalid){
            invalidCount ++;
            continue;
          }
          var x = leftgutter + X * (datas[i].Px) + dx;
          var y = height - bottomgutter - Y * datas[i].Py;
          xs[i] = x;
          ys[i] = y;
          
          var dot;
          var size = params.dotAttr.size;
          var dotAttr = params.dotAttr;
          if(dotAttr.fixedLabel) {
            var fixedLabel = r.text(x, y, fOptions.yTick.fixNum(datas[i].y));
            fixedLabelSet.push(fixedLabel);
            if(dotAttr.txtAttr) fixedLabel.attr(dotAttr.txtAttr);
            var tbb = fixedLabel.getBBox();
            var labelLocate = {
              "left" : function(){
                fixedLabel.translate(-tbb.width/2 - size, 0);
              },
              "right" : function(){
                fixedLabel.translate(tbb.width/2 + size, 0);
              },
              "top" : function(){
                fixedLabel.translate(0, -tbb.height/2 - size);
              },
              "bottom" : function(){
                fixedLabel.translate(tbb.height/2 + size, 0);
              }
            }
            if(labelLocate[params.dotAttr.fixedLabel])
              labelLocate[params.dotAttr.fixedLabel]();
          }
          dot = params.dotDraw(x, y, size).attr(params.dotAttr);
          dotSet.push(dot);
          if(fOptions.dotHidden || (i % fOptions.dotInterval != 0 && !(fOptions.dotAtEnd && i == ii - 1))) {
            inVisible[i] = 1;
            dot.hide();
          }
        }
        
        frame.hint[frame.seriesCursor] = function(i, showTip){
          var dotI = i - invalidCount;
          if(dotSet[dotI]) {
            dotSet[dotI].insertAfter(frame.$pole);
            dotSet[dotI].transform("s1.2");
          }
          if(fOptions.dotHidden != 3 && inVisible[dotI]) dotSet[dotI].show();
          var tip = frame.elms.tip;
          var id = frame.curSeries + '_' + i;
          if(showTip != false && tip && tip._id != id) {
            tip._id = id;
            tip.update({
              x : xs[i],
              y : ys[i],
              label : params.tips,
              labelPos : params.labelPos,
              data :  datas[i],
              animate: true
            });
          }
        };
        
        frame.hintReset[frame.seriesCursor] = function(i, hideTip){
          var dotI = i - invalidCount;
          if(dotSet[dotI]) dotSet[dotI].transform("s1");
          if(inVisible[dotI]) dotSet[dotI].hide();
          if(hideTip) {
            var tip = frame.elms.tip;
            if(tip) tip.hide();
          }
        };
      },
      'marker' :function(){
        if(!frame.elms.cross) {
          frame.elms.cross = frame.cross(fOptions.markerAttr).init();
        }
        var xs = [], ys = [];
        for(var i = 0, ii = datas.length; i < ii; i++) {
          if(datas[i].y == null) continue;
          var x = leftgutter + X * (datas[i].Px) + dx;
          var y = height - bottomgutter - Y * datas[i].Py;
          xs.push(x);
          ys.push(y);
        }
        frame.hint[frame.seriesCursor] = function(i){
          var cross = frame.elms.cross;
          var id = frame.curSeries + '_' + i;
          if(cross && cross._id != id) {
            cross._id = id;
            cross.update({
              x : xs[i],
              y : ys[i],
              labels : {
                left: fOptions.yTick.fixNum(datas[i].y),
                bottom: datas[i].time || getStockTime(datas[i].Px, maxX)
              },
              labelPos : params.labelPos,
              data :  datas[i],
              animate: true
            });
          }
        };
      },
      'curve' :function(){
        for(var i = 0, ii = datas.length; i < ii; i++) {
          var x = leftgutter + X * (datas[i].Px) + dx;
          var y = height - bottomgutter - Y * datas[i].Py;
          if(!i) {
            p = ["M"+x, y, "C"+x, y];
            bgpp = ["M", leftgutter + x, height, "L", x, y, "C", x, y];
          }
          if(i && i < ii - 1) {
            var X0 = round(leftgutter + X * (datas[i-1].Px) + dx),
                Y0 = round(height - bottomgutter - Y * datas[i - 1].Py),
                X2 = round(leftgutter + X * (datas[i+1].Px) + dx),
                Y2 = round(height - bottomgutter - Y * datas[i + 1].Py);
            var a = NC.getAnchors(X0, Y0, x, y, X2, Y2);
            p = p.concat([a.x1, a.y1, x, y, a.x2, a.y2]);
            bgpp = bgpp.concat([a.x1, a.y1, x, y, a.x2, a.y2]);
          }
        }
        p = p.concat([x, y, x, y]);
        bgpp = bgpp.concat([x, y, x, y, "L", x, height, "z"]);
        svgPath = p.join(",");
        bgPath = bgpp.join(",");
      }
    };
    procFuncs[chartType]();
    var Funcs = {
      'svg' : function(){
        var set = r.set();
        set.chartType = chartType;
        if(dotSet.length) {
          set.push(dotSet);
        }
        if(fixedLabelSet.length){
          set.push(fixedLabelSet);
        }
        if(barSet.length) {
          set.push(barSet);
        }
        if(meanPath != '') {
          var $meanPath = that.path(meanPath).attr(params.meanLineAttr || params.plotAttr);
          set.push($meanPath);
          frame.$$afterPole.push($meanPath);
        }
        if( meanTxt ) {
          set.push(meanTxt.attr(params.meanTxtAttr));
          frame.$$afterPole.push(meanTxt);
        }
        if(svgPath != '') {
          set.push(that.path(svgPath).attr(params.plotAttr));
        }
        if(!params.noBG && bgPath != '') {
          set.push(that.path(bgPath).attr(params.fillAttr));
        }
        return set;
      }
    };
    return Funcs[options.type]();
  };
  
  Frame.prototype.barAnim = function(series, during){//柱图增长动画
    var fOptions = this.options;
    during = during || 1000;
    var sbb = series.getBBox(series);
    var bottom = sbb.y + sbb.height;
    series.attr({
      transform : "s1,0,0," + bottom
    });
    series.animate({
      transform : "s1,1,0," + bottom
    }, during, "easeInOut", function(){
      series.attr({transform : ""});
      if(fOptions.drawEnd){
        fOptions.drawEnd();
      }
    });
  }
  
  Frame.prototype.clipAnim = function(during){//从左到右出场动画
    if(!Raphael.svg)return;
    var frame = this;
    var r = this.$$r;
    var fOptions = this.options;
    var sets = this.elms.Series || [];
    var el = NC.$("clipPath"),
        rc = NC.$("rect");
    el.id = (new Date()).getTime();
    NC.$(rc, {
      x: fOptions.left - 35,
      y: fOptions.top - 20,
      width: 0,
      height: fOptions.height + 40
    });
    el.appendChild(rc);
    r.defs.appendChild(el);

    var clipCount = 0;
    NC.each(sets, function(series){
      if(series.chartType == 'bar'){
        frame.barAnim(series, during);
      }else{
        clipCount ++;
        series.attr({
          'clip-path' : 'url(#' + el.id + ')'
        });
      }
    });

    if(clipCount){
      setTimeout(function(){
        NC.animate([fOptions.width + 70], 1200, function(vals){
          NC.$(rc, {
            width: vals[0]
          });
        }, function(){
          if(fOptions.drawEnd){
            fOptions.drawEnd();
          }
        });
      }, fOptions.delay || 0);
    }
  };
  
  Frame.prototype.drawGrid = function(opts){//绘制坐标轴
    opts = opts || this.options.grid;
    var params = {
      lineAttr : {stroke: '#ccc'},
      borderAttr : {stroke: '#ccc'},
      evenAttr : {stroke:'none'},
      oddAttr : {fill: '#f2f2f2', stroke:'none'},
      vline : false,
      shadow : 1,
      nogrid : 0
    };
    NC.deepExtend(params, opts);
    var fOptions = this.options;
    var x = fOptions.left;
    var y = fOptions.top + (params.dy || 0);
    var w = fOptions.width;
    var h = fOptions.height - (params.dy || 0);
    var cols = opts.cols + fOptions.xpadding;
    var rows = opts.rows;
    var r = this.$$r;
    this._Grid = r.set();
    
    var path = [];
    if(!params.borderAttr){
      if(!params.nogrid) { //只绘制头尾两条横线
        path = [
          "M", round(x) + .5, round(y) + .5,
          "h", w,
          "M", round(x) + .5, round(y + h) + .5,
          "h", w
        ];
      } else if(params.nogrid == 'b') { //只绘制尾线
        path = [
          "M", round(x) + .5, round(y + h) - 4.5,
          "v", 6,
          "h", w,
          "v", -6
        ];
      } 
    }
    
    if(params.midline) {
      this._Grid.push(r.path([
        "M", round(x) + .5, round(y) + 1 + h/2, 
        "H", round(x + w) + .5
      ].join(" ")).attr(params.borderAttr));
    }
    var rowHeight = h / rows;
    var columnWidth = w / cols;
    //条纹线及背景
    if(!params.nogrid) {
      for(var i = 1; i < rows; i++) {
        if(fOptions.flip) {
          rowHeight = h / cols;
          columnWidth = w / rows;
          path = path.concat([
            "M", round(x + i * columnWidth) + .5, round(y) + .5, 
            "V", round(y + h) + .5
          ]);
          if(params.shadow && i%2 == 1) { //条纹背景
            this._Grid.push(this.$$r.rect(
              round(x + i * columnWidth) + .5, 
              round(y) + .5, columnWidth, 
              h).attr(params.oddAttr));
          }
        }else{
          path = path.concat([
            "M", round(x) + .5, round(y + i * rowHeight) + .5, 
            "H", round(x + w) + .5
          ]);
          if(params.shadow && i%2 == 1) { //条纹背景
            this._Grid.push(this.$$r.rect(
              round(x) + .5, 
              round(y + i * rowHeight) + .5, 
              w, 
              rowHeight
            ).attr(params.oddAttr));
          }
        }
      }
    }
    
    if(params.borderAttr) {  //主象限边框
      this._Grid.push(r.rect(
        round(x) + .5, 
        round(y) + .5, 
        w, h).attr(params.borderAttr));
    }

    //Grid横线
    this._Grid.push(r.path(path.join(",")).attr(params.lineAttr));

    var vlinePath = [];
    if(params.vline) { //Grid竖线
      for(i = 1; i < cols; i++) {
        vlinePath = vlinePath.concat([
          "M", round(x + i * columnWidth) + .5, round(y) + .5, 
          "V", round(y + h) + .5
        ]);
      }
      this._Grid.push(r.path(vlinePath.join(",")).attr(params.lineAttr));
    }
  };
  
  Frame.prototype.calcAvaSpace = function(){//检查为label预留的空间是否足够
    var paper = NC.scratch;
    var canvas = this.$$canvas;
    var fOptions = this.options;
    var yParams = fOptions.yTick;
    var xParams = fOptions.xTick;
    yParams.labelText = [];
    yParams.rLabelText = [];
    xParams.labelText = [];
    if(this.userOpts && NC.isArray(this.userOpts.yTick.startY)) {
      yParams.startY = this.userOpts.yTick.startY.slice();
    }else if(!yParams.midY) {
      var bit = floor(Math.log(yParams.interval[0])/Math.log(10));
      yParams.startY[0] = yParams.startY[0] - Math.abs( yParams.startY[0] % Math.pow(10, bit) );
      bit = floor(Math.log(yParams.interval[1])/Math.log(10));
      yParams.startY[1] = yParams.startY[1] - Math.abs( yParams.startY[1] % Math.pow(10, bit) );
    }
    var label, j;
    //y[0]轴labels
    if(NC.isArray(yParams.labels)) {
      yParams.labelText = yParams.labels;
    }else if(typeof yParams.labels == 'string') {
      for(j = 0; j < yParams.ticks; j++) {
        label = yParams.fixNum(yParams.startY[0] + j * yParams.interval[0]);
        yParams.labelText.push(NC.subs(yParams.labels, {y: label}));
      }
    }
    //y[1]轴labels
    if(NC.isArray(yParams.rLabels)) {
      yParams.rLabelText = yParams.rLabels;
    }else if(typeof yParams.rLabels == 'string') {
      for(j = 0; j < yParams.ticks; j++) {
        label = yParams.fixNum(yParams.startY[1] + j * yParams.interval[1]);
        yParams.rLabelText.push(NC.subs(yParams.rLabels, {y: label}));
      }
    }
    //x轴ticks
    var cols = xParams.cols ? xParams.cols + 1 : xParams.ticks; //标注总数
    if(NC.isArray(xParams.labels)) {
      xParams.labelText = [];
      for(var i = 0; i < xParams.labels.length * fOptions.dotInterval; i ++) {
        xParams.labelText.push(
          i % fOptions.dotInterval ? null : xParams.labels[i / fOptions.dotInterval]
        );
      }
    }else if(NC.isArray(xParams._labels)) {
      if(xParams.labels != '') {
        xParams.labelText = xParams._labels;
      }
    }else if(typeof xParams.labels == 'string') {
      if(!xParams._labels) {
        xParams._labels = [];
        for(var i = 0; i <= xParams.maxX; i++) {
          xParams._labels.push(NC.subs(xParams.labels, {
            x : i + 1
          }));
        }
      }
      xParams.labelText = xParams._labels;
    }
    var el, tbb, labelW, dx;
    if(yParams.labelText) {
      //y[0]轴label所需空间
      el = paper.text(0, -50, yParams.labelText.join("\n")).attr(yParams.txtAttr);
      tbb = el.getBBox();
      labelW = tbb.width + 23;
      dx = 0;
      if(labelW > fOptions.avaSpace.left) {
        dx = labelW - fOptions.avaSpace.left;
        fOptions.left += dx;
        fOptions.avaSpace.left = labelW;
        fOptions.avaSpace.modified = 1;
      }
      fOptions.width -= fOptions.avaSpace.left;
      el.remove();
    }
    if(fOptions.yTitle && fOptions.yTitle.title) {
      fOptions.left += 12;
    }
    if(yParams.rLabelText) {
      //y[1]轴label所需空间
      el = paper.text(0, -50, yParams.rLabelText.join("\n")).attr(yParams.txtAttr);
      tbb = el.getBBox();
      labelW = tbb.width;
      dx = 0;
      if(labelW > fOptions.avaSpace.right) {
        dx = labelW - fOptions.avaSpace.right;
        fOptions.avaSpace.right = labelW;
        fOptions.avaSpace.modified = 1;
      }
      fOptions.width -= labelW;
      el.remove();
    }
    var xInter = xParams.interval * fOptions.dotInterval;
    if(xParams.labelText) {
      //x轴label所需空间
      this.occupation.xTick = canvas.estimateSpace(xParams.labelText, xParams.txtAttr);
      var xAdjust;
      if(fOptions.flip) {
        xAdjust = this.occupation.xTick.width + 18;
        if(fOptions.mirror) {
          if(xAdjust > fOptions.avaSpace.left){
            fOptions.left -= 53;
            fOptions.width -= (xAdjust - fOptions.avaSpace.left) - 25;
          }
        }else{
          dx = xAdjust - fOptions.avaSpace.left;
          fOptions.width -= dx;
          fOptions.left += dx;
        }
        fOptions.avaSpace.left = xAdjust;
      }else{
        xAdjust = this.occupation.xTick.height - 18;
        fOptions.height -= xAdjust;
      }
      fOptions.padding.bottom = this.occupation.xTick.height;
    }
    
    if(fOptions.xTitle && fOptions.xTitle.title) {
      fOptions.height -= 22;
    }
    //计算xunit和startX
    var xMaxWithSkip = (fOptions.xTick.maxX + 2 * (fOptions.xTick.skip || 0));
    var endX = fOptions.flip ? fOptions.height : fOptions.width;
    fOptions.xunit = endX / xMaxWithSkip || 1;
    fOptions.xTick.startX = fOptions.xTick.minX * fOptions.xunit;
    
    //计算xTick.interval (抽样显示避免文字重叠)
    if(!fOptions.flip && !this.userOpts.xTick.interval) {
      var xLabelW = this.occupation.xTick.width;
      var xTickMax = this.options.width / xLabelW / 1.1;
      fOptions.xTick.interval = floor(xMaxWithSkip / xTickMax / fOptions.dotInterval) + 1;
    }
  }
  
  Frame.prototype.xTick = function(params){
    //minX 0表示第一个tick处于原点，1表示从原点右移一位
    //maxX x轴能表示的最大数值(非像素值)
    if(!params) params = {};
    var r = this.$$r;
    var paper = NC.scratch;
    var xTickSet = r.set();
    var fOptions = this.options;
    var defaultParams = {
      y : fOptions.height + fOptions.top, //x横轴的y坐标
      shiftY : 0,
      minX : fOptions.xpadding,
      maxX : 10,
      interval : 1,
      startX : 0,
      skip : 0,  //第一个xtick的位置为: skip * xunit
      rotate : 0,
      vlineAttr : {stroke: '#00CCFF', 'stroke-width':1.5, 'stroke-dasharray': '- '}  //milestone
    };
    NC.deepSupplement(params, defaultParams, NC.$$attr.txt);
    if(!fOptions.xTick) fOptions.xTick = params;
    var xInter = params.interval * fOptions.dotInterval;
    
    var endX = fOptions.flip ? fOptions.height : fOptions.width;
    var xunit = fOptions.xunit;
    var xtick_unit;
    if(params.cols) {
      xtick_unit = endX / (params.cols + 1);
      xInter = 1;
    }else{
      xtick_unit = xunit;
    }
    params.startXtick = xtick_unit * params.minX;
    xTickSet.xTickPos = {
      x: [],
      y: 0
    }
    
    if(params.milestones) { //milestone竖线
      var path_milestone = [];
      var yl = fOptions.top;
      var yh = fOptions.top + fOptions.height;
      for(var x in params.milestones) {
        var posX = fOptions.left + round(params.startX + (parseFloat(x) + params.skip) * xunit) + .5;
        path_milestone = path_milestone.concat([
          "M", posX, round(yl) + .5, 
          "V", round(yh) + .5
        ]);
      }
      xTickSet.push(
        r.path(path_milestone.join(",")).attr(params.vlineAttr)
      );
    }
    
    if(!params.ticks) { //可显示xtick数
      params.ticks = floor((params.maxX - 2*params.minX) / xInter) + 1;
    }
    var cols = params.cols ? params.cols + 1 : params.ticks; //实际xtick数

    if(params.labelText && params.labelText.length > 0) {
      var labels = params.labelText;
      var len = params.maxX + 1 - 2*params.minX;
      var xTickLabel, tbb;
      //绘制xTick
      var xtick_x;
      var maxHt = 0;
      for(var i = 0; i < cols; i++) {
        var j = xInter * i;
        var text = '';
        var txtAttr = params.txtAttr;
        if(labels[j] && NC.isObject(labels[j])) {
          text = labels[j].text || '';
          if(labels[j].attr) {
            txtAttr = NC.deepSupplement(labels[j].attr, params.txtAttr);
          }
        }else{
          text = labels[j] || '';
        }
        
        if(fOptions.flip) { //xy轴对调
          xTickLabel = r.text(
            fOptions.mirror ? fOptions.width + params.shiftY
              : - params.shiftY, 
            params.y + params.startXtick + (params.skip + j - params.maxX) * xtick_unit, 
            text);
          xTickLabel.attr(txtAttr).rotate(params.rotate);
          tbb = NC.getBBox(xTickLabel);
          var label_dx = Math.max(tbb.width/2, 7) + 6;
          if(fOptions.mirror) {
            if(params.align == 'center') {
              label_dx = - this.occupation.xTick.width / 2 - 6;
            }else{
              label_dx = - label_dx;
            }
          }
          xTickLabel
            .rotate(-params.rotate)
            .translate(fOptions.left - label_dx, 0)
            .rotate(params.rotate);
        }else{
          xtick_x = 0.5 + params.startXtick + (params.skip + j) * xtick_unit;
          xTickSet.xTickPos.x.push(xtick_x + fOptions.left);
          xTickLabel = r.text(0, 0, text);
          xTickLabel.attr(txtAttr).rotate(params.rotate);
          tbb = NC.getBBox(xTickLabel);
          var label_dy = params.shiftY < 0 ? 
                - tbb.height/2 - 4.5 : tbb.height/2 + 4.5;
          xTickLabel
            .rotate(-params.rotate)
            .translate(xtick_x + fOptions.left, params.y + label_dy)
            .rotate(params.rotate);
          if(tbb.height > maxHt) maxHt = tbb.height;
          label_dy -= tbb.height/2;
        }
        xTickSet.push(xTickLabel);
      }
      if(fOptions.flip) {
        xTickSet.xTickPos.y = params.y + label_dy + maxHt + 14;
      }else{
        xTickSet.xTickPos.y = params.y + label_dy + maxHt + 14;
      }
      this.occupation.xTick.height = maxHt;
    }
    return xTickSet;
  };
  
  Frame.prototype.yTick = function(params){
    if(!params) params = {};
    var frame = this;
    var fOptions = this.options;
    var yTickH = (fOptions.flip ? fOptions.width : fOptions.height);
    var defaultParams = {
      startY : [0, 0],
      shiftX : 0,
      interval : [1, 1], //每格yTick表示的数值
      total : [],
      rotate : 0,
      ticks : yTickH  //要绘制的ticks数
    };
    NC.deepSupplement(params, defaultParams);
    
    if(!fOptions.yTick) fOptions.yTick = params;
    if(!params.interval[0]) params.interval[0] = 1;
    if(!params.interval[1]) params.interval[1] = 1;
    if(!NC.isArray(fOptions.yTick.total)) {
      fOptions.yTick.total = [fOptions.yTick.total, fOptions.yTick.total];  
    }
    if(!params.total[0]) { //y轴左侧能显示的最大数值
      params.total[0] = params.interval[0] * (params.ticks - 1);
    }
    if(!params.total[1]) { //y轴右侧能显示的最大数值
      params.total[1] = params.interval[1] * (params.ticks - 1);
    }
    //保存每格yTick表示的数值，用于toggleSeries
    if(!frame.yunit) frame.yunit = params.interval.slice();
    
    var r = this.$$r;
    var yTickSet = r.set();
    
    var len = params.ticks;
    var dy = yTickH / (len - 1);
    
    if(params.labels && params.labelText && params.ticks != yTickH) {
      var text;
      for(var j = 0; j < len; j++) {
        if(fOptions.flip) {
          yTickLabel(
            j * dy, 
            fOptions.height + 3, 
            params.labelText[j], 
            1, 1
          );
        }else{
          yTickLabel(
            0, 
            fOptions.height - j * dy, 
            params.labelText[j], 
            0, 1
          );
        }
      }
    }
    
    if(params.rLabels && params.ticks != yTickH) {
      for(var j = 0; j < len; j++) {
        if(this.options.flip) {
          yTickLabel(
            j * dy, fOptions.height + 3, 
            params.rLabelText[j], 
            1, -1
          );
        }else{
          yTickLabel(
            fOptions.width, 
            fOptions.height - j * dy, 
            params.rLabelText[j], 
            0, -1
          );
        }
      }
    }
    
    function yTickLabel(x, y, text, flip, side){
      if(fOptions.mirror) {
        if(fOptions.flip) {
          x = fOptions.width - x;
        }else{
          y = fOptions.height - y;
        }
      }
      var el = r.text(x, fOptions.top + y, text).attr(params.txtAttr);
      el.rotate(params.rotate);
      var tbb = NC.getBBox(el);
      if(flip) {
        var label_dy = Math.max(tbb.height/2 || 0, 8) + 3.5;
        el.rotate(-params.rotate)
          .translate(fOptions.left, side * label_dy)
          .rotate(params.rotate);
      }else{
        var label_dx = Math.max(tbb.width/2 || 0, 8) + 3.5;
        el.rotate(-params.rotate)
          .translate(fOptions.left - side * label_dx, 0)
          .rotate(params.rotate);
      }
      yTickSet.push(el);
    }
    return yTickSet;
  };
  
  Frame.prototype.Title = function(){
    var opts = this.options.Title;
    if(!opts.title) return;
    var params = NC.deepExtend({
      x : this.options.left + this.options.width/2,
      y : this.options.top - 13,
      shiftY : 0
    }, NC.$$attr.txt, opts);
    var $text = this.$$r.text(params.x, params.y + params.shiftY, params.title).attr(params.txtAttr);
    if(typeof opts.x == 'number'){
      $text.translate($text.getBBox().width / 2);
    }
  };
  
  Frame.prototype.xTitle = function(){
    var opts = this.options.xTitle
    if(!opts.title) return;
    var params = NC.deepExtend({
      posX : this.options.left + this.options.width/2,
      posY : this.options.top + this.options.height,
      shiftY : 0
    }, opts, NC.$$attr.txt);
    
    var posY = params.posY + params.shiftY + 18;
    if(this.occupation.xTick.height) posY += this.occupation.xTick.height;
    if(this.occupation.xTableH) posY += this.occupation.xTableH;
    this.$$r.text(params.posX, posY, params.title)
      .attr(params.txtAttr);
  };
  
  Frame.prototype.yTitle = function(){
    var opts = this.options.yTitle;
    if(!opts.title) return;
    var fOptions = this.options;
    var params = NC.deepExtend({
      shiftX : 0,
      posX : fOptions.left - fOptions.avaSpace.left,
      posY : fOptions.top + fOptions.height/2
    }, opts, NC.$$attr.txt);

    var title = opts.vertical ? params.title.split("").join("\n")
          : params.title;
    var gTitle = this.$$r.text(params.posX - params.shiftX, params.posY, title)
          .attr(params.txtAttr);
    if(!opts.vertical)gTitle.rotate(-90);
  };
  
  Frame.prototype.yRightTitle = function(){
    var opts = this.options.yRightTitle
    if(!opts.title) return;
    var params = NC.deepExtend({
      shiftX : 0,
      posX : this.options.left + this.options.width + this.options.avaSpace.right + 15,
      posY : this.options.top + this.options.height/2
    }, opts, NC.$$attr.txt);
    
    var title = opts.vertical ? params.title.split("").join("\n")
          : params.title;
    var gTitle = this.$$r.text(params.posX - params.shiftX, params.posY, title)
      .attr(params.txtAttr);
    if(!opts.vertical) gTitle.rotate(90);
  };
  
  NC.prototype.frame = function(opts){
    var frame = new Frame(opts);
    frame.$$r = this.$$r;
    frame.$$canvas = this;
    this.chartObjs.push(frame);
    return frame;
  };
  
  NC.prototype.xyChart = function(seriesInfo, chartType, opts){
    if(!seriesInfo) return null;
    var r = this.$$r;
    var canvas = this;
    var chartOptions = canvas.options;
    var padding = {y:20, x:60, left:0, bottom:0};
    var boxSpace = NC.deepExtend({
      width : chartOptions.width,
      height : chartOptions.height,
      left : 0,
      top : 0
    }, opts.boxSpace);
    var avaSpace = { //给label, legends预留的空间
      left: 40, 
      right: 20, 
      bottom: (opts.showLegend == false ? 9 : 45)
    };
    NC.deepExtend(padding, opts.padding);
    var fixnum = function(n){
      if(n>=1000 && n%100 == 0) {
        return n/1000 + 'k';
      }else{
        if(/\.\d{4,}/.test(n.toString())) {
          n = n.toFixed(3).toString().replace(/\.?0+$/, '');
        }
        return n;
      }
    };
    var xyOptions = {
      left : boxSpace.left + padding.x + padding.left,
      top : boxSpace.top + padding.y + 5,
      avaSpace : avaSpace, //给label, legends预留的空间
      padding : padding,
      width: boxSpace.width - padding.x * 2 - padding.left + avaSpace.left,
      height: boxSpace.height - avaSpace.bottom - padding.y * 2 - padding.bottom - 3,
      dotInterval : 1,
      xTick : {
        txtAttr : { font: NC.$$sfont, fill : '#555' },
        interval : 1, 
        milestones : {}
      },
      yTick : {
        txtAttr : { font: NC.$$sfont, fill : '#555' },
        fixNum : fixnum
      },
      //fixMeanNum : round,
      fmtPercent : round,
      getclr : function(a, len){
        if(len){
          a = len == 1 ? 0.5 : a / len;   
        }
        return "hsb(" + a + "," + 1 + "," + 0.9 + ")";
      },
      colors : [],
      autofix : true, //显隐series时重新调整y轴高度
      xpadding : 1,
      showLegend : true,
      grid : {
        shadow : true,
        nogrid : false,
        vline : false
      }
    };
    if(opts.yRightTitle) {
      xyOptions.width -= 15;
    }
    opts.animate = opts.animate || opts.anim; //兼容旧写法
    NC.deepExtend(xyOptions, opts);
    if(opts.ys){
      if(opts.mirror) xyOptions.left += xyOptions.width*0.54;
      xyOptions.width *= 0.46;   
    }
    chartType = chartType || [];
    xyOptions.chartType = chartType;
    NC.each(chartType, function(typ){
      if(typ == 'hbar') xyOptions.flip = 1;
    });
    xyOptions.tips = xyOptions.tips || xyOptions.label;
    if(!xyOptions.Title) {
      xyOptions.top -= 6;
      xyOptions.height += 6;
    }
    if(opts.grid) {
      if(opts.grid.cols) {
        xyOptions.xTick.cols = opts.grid.cols;
      }
      if(opts.grid.rows) {
        xyOptions.yTick.rows = opts.grid.rows;
      }
    }
    if(opts.yTick && opts.yTick.shiftX) {
      if(xyOptions.flip) {
        xyOptions.height -= opts.yTick.shiftX;
      } else {
        xyOptions.left += opts.yTick.shiftX;
        xyOptions.width -= opts.yTick.shiftX;
      }
    }
    if(opts.xTick && opts.xTick.shiftY) { //为xTick指定预留的空间
      if(xyOptions.flip) {
        xyOptions.xTick.width = 2 * opts.xTick.shiftY;
      } else {
        xyOptions.xTick.height = 2 * opts.xTick.shiftY;
      }
    }
    if(xyOptions.xTick && xyOptions.xTick.height) {
      xyOptions.height -= xyOptions.xTick.height >= 0 ? xyOptions.xTick.height : -20;
    }
    if(!xyOptions.dotInterval) xyOptions.dotInterval = 1;
    //开始绘制
    var frame = canvas.frame(xyOptions);
    if(!opts.xTick) opts.xTick = {};
    if(!opts.yTick) opts.yTick = {};
    if(typeof opts.yTick.startY == 'number') opts.yTick.startY = [opts.yTick.startY, opts.yTick.startY];
    frame.userOpts = opts;
    var fOptions = frame.options;
    
    frame.parseData(seriesInfo); //整理数据
    if(fOptions.airview) frame.drawAirview(); //绘制Airview区域
    
    //记录绘制legend和airview区域后的可用空间
    fOptions._height = fOptions.height;
    fOptions._width = fOptions.width;
    fOptions._left = fOptions.left;
    fOptions._avaSpace = NC.deepExtend({}, fOptions.avaSpace);
    
    if(fOptions.showLegend) frame.drawLegend(); //绘制legend
    fOptions._heightPostLegend = fOptions.height;
    fOptions._widthPostLegend = fOptions.width;

    frame.calcAvaSpace(); //计算label所需空间
    frame.drawAxis(); //绘制坐标系
    
    if(fOptions.htmlTips){
      frame.elms.tip = this.htmlTip(frame);
    }else{
      frame.elms.tip = this.tip({ //鼠标tips
        txtAttr : fOptions.tipAttr,
        label : (fOptions.tips || '.')
      });
    }
    
    if(frame.airview) {
      frame.airview.options.width = fOptions.width;
      frame.airview.options.top = fOptions.top + fOptions.height + frame.occupation.xTick.height;
      frame.airview.init(); //绘制airview
    }else{
      frame.xyDraw(); //绘制曲线
    }

    if(!opts.noResize){ //监听重绘
      eve.on("chartResize", function(dw){
        if(this == canvas){
          frame.$framepole = null;
          frame.noAnimate = true;
          frame.reDraw(dw);
          frame.noAnimate = false;
        }
      });
    }
    
    canvas.frames ? canvas.frames.push(frame) : canvas.frames = [frame];
    return frame;
  };
  
  NC.prototype.estimateSpace = function(labels, opts){
    var paper = NC.scratch;
    var space = {
      width : 0,
      height : 0
    }
    if(NC.isArray(labels)) {
      var labelOption = NC.deepExtend({
        font: NC.$$font
      }, opts);
      var el, tbb;
      NC.each(labels, function(label){
        var text = NC.isObject(label) ? label.text : label;
        el = paper.text(-50, -50, text).attr(labelOption);
        tbb = el.getBBox();
        if(tbb.width > space.width) space.width = tbb.width;
        if(tbb.height > space.height) space.height = tbb.height;
        el.remove();
      });
    }
    return space;
  }
  
  function getStockTime(seq, max){//返回A股盘中时间
    if(!max) max = 240;
    var dotsPerHour = max / 4;
    var scale = (60/dotsPerHour);
    var hour, min;
    if(seq > max / 2) {
      seq -= max / 2;
      hour = 13 + floor(seq / dotsPerHour);
      min = (seq * scale) % 60;
    }else{
      hour = 9 + floor((seq + dotsPerHour / 2) / dotsPerHour);
      min = ((seq * scale + 30) % 60);
    }
    return hour + ":" + (min < 10 ? '0':'') + min;
  }
  function getAverage(datas, returnNumber, invalid, yKey){//平均值
    if(!yKey) yKey = 'y';
    var total = 0;
    var validLen = 0;  //跳过前N个空数据
    NC.each(datas, function(_val){
      var val = typeof _val == 'object' ? _val[yKey] : _val;
      if(validLen == 0 && val == invalid) return;
      total += val;
      validLen ++;
    });
    var ave = validLen == 0 ? 0 : total / validLen;
    if(returnNumber) {
      return ave;
    }else{
      return NC.map(datas, function(val){
        return {y : ave};
      });
    }
  }
  function moveAverage(datas, size){//移动平均值
    if(typeof size == 'undefined') size = 10;
    else size = parseInt(size);
    
    var newdata = NC.map(datas, function(dotData, i){
      var ll = size ? Math.min(i + 1, size) : i + 1;
      var sum = 0;
      for(var j = i; j > i-ll; j--) {
        sum += datas[j].y;
      }
      return {y: sum / ll};
    });
    return newdata;
  }
})(window.NTESChart);

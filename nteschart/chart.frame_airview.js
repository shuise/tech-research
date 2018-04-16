(function(NC){
  var floor = Math.floor;
  var Frame = NC.Frame;
  var Airview = function(opts){
    this.options = {
      pos : 'bottom',
      left : 0,
      top : 0,
      shiftY : 3,
      height : 60,
      width : 450,
      least : 2, //最少选中点数
      plotAttr : {fill : '#76899F', stroke : 'none'},
      maskAttr : {fill : '#CCC', opacity : 0.7, stroke : 'none'}, //文字背景
      selectAttr : {fill : '#77f', opacity : 0.3, stroke : 'none'}
    };
    NC.deepExtend(this.options, opts);
    this.els = {};
  }
  
  Airview.prototype = {
    init : function(){
      if(!this.options.len && !NC.isArray(this.options.data))
        return;
      var that = this;
      var canvas = this.$$canvas;
      eve.on("airviewSample", function(p1, p2){
        if(canvas != this) return;
        that.x1 = p1 * that.options.width;
        that.x2 = p2 * that.options.width;
        that.reLocMask();
      });
      this.draw();
      this.els.wrap.mousedown(dragStart).mousemove(dragMove)
        .mouseup(dragEnd).mouseout(dragEnd);
      function dragStart(e){
        that.dragging = true;
        var mousePos = canvas.mousePos(e);
        that.selectMask(mousePos.x - that.ox);
        e.preventDefault && e.preventDefault();
        return false;
      }
      function dragMove(e){
        if (that.dragging) {
          var mousePos = canvas.mousePos(e);
          that.selectMask(null, mousePos.x - that.ox);
        }
        e.preventDefault && e.preventDefault();
        return false;
      }
      function dragEnd(e){
        if (that.dragging) {
          if (that.x1 > that.x2) {
            var tmp = that.x1;
            that.x1 = that.x2;
            that.x2 = tmp;
          }
          var len = that.options.len || that.options.data.length;
          var dots = floor(len * (that.x2 - that.x1) / that.options.width);
          if (dots < that.options.least) {
            that.x2 = that.x1 + that.options.least / len * that.options.width;
          }
          if (that.x2 > that.options.width) {
            that.x2 = that.options.width;
            that.x1 = that.x2 - that.options.least / len * that.options.width;
          }
          that.dragging = false;
          that.els.selectMask.attr({width:0});
          eve("airviewSample", canvas, 
              that.x1 / that.options.width, 
              that.x2 / that.options.width);
        }
        e.preventDefault && e.preventDefault();
        return false;
      }
    },
    
    draw : function(){ //绘制mastarea
      var r = this.$$r;
      var frame = this.$$frame;
      var boxH = this.options.height * 0.6;
      var fullW = this.options.width;
      var canvas = this.$$canvas;
      this.ox = this.options.left;  //左上角位置(ox, oy)
      this.oy = this.options.top + this.options.shiftY + 8;
      this.els.leftMask = r
        .rect(this.ox, this.oy, fullW / 2, boxH)
        .attr(this.options.maskAttr);
      this.els.rightMask = r
        .rect(this.ox + fullW / 2, this.oy, fullW * 0.5, boxH)
        .attr(this.options.maskAttr);
      this.els.selectMask = r
        .rect(this.ox + this.x1, this.oy, 0, boxH)
        .attr(this.options.selectAttr);
      if(frame && this.options.data)
        this.els.curve = frame.addSeries(this.options.data, "line", {
          y : this.oy,
          noBG : false,
          height : boxH,
          fillAttr : {'fill' : '#94B8F3'},
          plotAttr : {"stroke-width": 1, stroke:'#84a8f3'}
        });
      this.els.wrap = r
        .rect(this.ox, this.oy, fullW, boxH)
        .attr({"opacity" : 0, "fill" : "#fff"});
      this.els.xTick = frame.xTick({
        y : this.oy + boxH,
        labelText : frame.options.xTick.labelText,
        interval : frame.options.xTick.interval * 2
      });
      eve("airviewSample", canvas, 0.8, 0.95);
    },
    
    selectMask : function(x1, x2){
      var r = this.$$r;
      var boxH = this.options.height * 0.6;
      if (x1) {
        this.x1 = x1;
      }
      if (x2) {
        x1 = this.x1;
        this.x2 = x2;
        if (x1 > x2) {
          var tmp = x1;
          x1 = x2;
          x2 = tmp;
        }
        this.els.selectMask.attr({
          x : this.ox + x1,
          width : x2 - x1
        });
      }
    },
    
    reLocMask : function(){
      this.els.leftMask.attr({
        width : this.x1 
      });
      this.els.rightMask.attr({
        x : this.ox + this.x2,
        width : this.options.width - this.x2
      });
    }
  };
  
  Frame.prototype.initAirview = function(){
    var frame = this;
    eve.on("airviewSample", resample);
    function resample(){ //airview触发图表重绘
      if(frame.$$canvas == this) {
        frame.sample.apply(frame, arguments);
      }
    }
  };
  
  Frame.prototype.sample = function(p1, p2){
    var seriesInfo = this._seriesInfo;
    if (seriesInfo) {
      var newData = [];
      for (var i = 0; i < seriesInfo.length; i ++) {
        var item = {};
        var len = seriesInfo[i].data.length;
        NC.deepExtend(item, seriesInfo[i]);
        item.data = seriesInfo[i].data.slice(floor(len * p1),floor(len * p2));
        newData.push(item);
      }
      this.updateData(newData);
      this.xTickSample(p1, p2);
    }
  }
  
  Frame.prototype.xTickSample = function(p1, p2){
    var params = this.options.xTick;
    if(!params._labelText) params._labelText = params.labelText.slice();
    var labels = params._labelText;
    var len = labels.length;
    var opts = {};
    NC.deepExtend(opts, params);
    opts.labelText = labels.slice(floor(len * p1),floor(len * p2));
    this.els.xTick.remove();
    this.els.xTick = this.xTick(opts);
  }
  
  Frame.prototype.drawAirview = function(){//绘制airview区域并调整坐标轴空间
    var fOptions = this.options;
    var opts = {
      left : fOptions.left,
      width : fOptions.width,
      data : this.parsedData[0]
    }
    NC.deepExtend(opts, fOptions.airview);
    this.airview = new Airview(opts);
    this.airview.$$r = this.$$r;
    this.airview.$$frame = this;
    this.airview.$$canvas = this.$$canvas;
    fOptions.height -= this.airview.options.height + this.airview.options.shiftY;
  };

})(NTESChart);

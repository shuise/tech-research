/**
 * NTESChart.touchPie / NTESChart.touchRing
 [ function ] 手机版饼图或圆环图
 * 
 > 参数
 - data [Object/Array] 数据
 - opts [Object] 图表参数
 */

(function(NC){
  var deg2rad = Math.PI / 180;
  function Legend(opts){ //每个扇形上的说明文字
    this.options = NC.deepExtend({
      txtAttr : {
        font: NC.$$font,
        fill: '#444',
        'text-align': 'left'
      },
      minLineH : 18 //最小行高
    }, opts);
  }
  
  Legend.prototype = {
    construct : function(sectors){ //为每个扇形建立说明文字
      var lOptions = this.options;
      var paper = lOptions.$$r;
      var chart = lOptions.chart;
      var items = this.items = [];
      this.sectors = sectors;
      NC.each(sectors, function($sector, i){
        var $text = paper.text(0,0,"");
        $text[NC.evName("click")](function(){
          chart.rotateBySeq(i);
        }).attr(lOptions.txtAttr);
        items.push({
          $sector : $sector,
          $text : $text
        });
      });
      this.refresh();
    },
    drawGroup : function(group, side){ //按组添加说明文字
      var that = this;
      var lOptions = this.options;
      var cx = lOptions.cx;
      var cy = lOptions.cy;
      var radius = lOptions.radius;
      var minLineH = lOptions.minLineH;
      var maxHeight = 2.7 * radius;
      var len = group.length;
      var totalH = Math.max(len * minLineH, 2 * radius);
      var dh = Math.min(totalH / len, 30);
      totalH = len * dh;
      var starty = side == 'left' ?
            (totalH > maxHeight ? cy + maxHeight/2 - totalH - dh/2
             : cy - totalH/2 - dh/2)
          : Math.max((maxHeight - len * dh)/2, 0);
      group.forEach(function(item, i){
        var seq = group[i];
        var x, y;
        if (side == 'left') {
          x = cx - radius * 1.15;
          y = starty + ( len - i ) * dh;
        }else{
          x = cx + radius * 1.15;
          y = starty + i * dh;
        }
        that.locateText(item, x, y, side);
      });
    },
    locateText : function(item, lx, ly, side){ //设定文字位置
      var lOptions = this.options;
      var cx = this.options.cx;
      var cy = this.options.cy;
      var radius = this.options.radius;
      var $text = item.$text.show();
      var $sector = item.$sector;
      var radMid = $sector.radMid;
      var x = cx + (radius - 12) * Math.cos(radMid);
      var str = $sector.title;
      var olen = str.length;
      $text.attr({
        y : ly,
        text : str,
        fill : NC.colorSB($sector.color, 0.9, 0.9)
      });
      var bb = $text.getBBox();
      if(side == "left" && bb.width > lx - 10){
        var nlen = Math.floor(lx / bb.width * olen);
        str = str.substr(0, nlen - 2) + '..';
        $text.attr({text : str});
        bb = $text.getBBox();
      }else if(side == "right" && olen < 10){
        $text.attr({text : str + '　　　'});
        bb = $text.getBBox();
      }
      if (radius >= 120) {  //左侧右对齐，右侧左对齐
        lx += (side == "right" ? bb.width/2 + 2 : -bb.width/2 - 2);
      } else {
        lx += (side == "right" ? bb.width/2 - 3 : -bb.width/2 + 3);
      }
      $text.attr({
        x : lx
      });
    },
    destruct : function(){ //销毁、释放内存
      this.items.forEach(function(item){
        item.$text.remove();
        item = null;
      });
    },
    refresh : function(){ //更新位置
      var degOrig = this.sectors.degOrig;
      var activeSeq = this.sectors.activeSeq;
      var lOptions = this.options;
      var maxHeight = lOptions.radius * 2.7;
      
      var minLineH = lOptions.minLineH;
      var maxLines = Math.floor( maxHeight / minLineH ); //可容纳的行数
      
      var items = this.items;
      var groupLeft = lOptions.show == 'left' ? items : [];
      var groupRight = lOptions.show == 'right' ? items : [];

      if(lOptions.show == 'auto'){
        this.items.forEach(function(item, i){
          if(i == activeSeq) {
            item.$text.hide();
            return;
          }
          var $sector = item.$sector;
          var degFrom = $sector.degFrom;
          var degSize = $sector.degSize;
          var rad = (degOrig + degFrom + degSize/2) * deg2rad;
          if (Math.cos(rad) > 0) {
            groupRight.push(item);
          }else{
            groupLeft.push(item);
          }
        });
        
        if (groupLeft.length > maxLines) {
          groupRight = groupRight.concat(
            groupLeft.splice(0, Math.min(maxLines - groupRight.length + 1, groupLeft.length - maxLines - 1))
          );
        } else if (groupRight.length > maxLines) {
          groupLeft = groupLeft.concat(
            groupLeft.splice(maxLines)
          );
        }
      }

      this.drawGroup(groupLeft, "left");
      this.drawGroup(groupRight, "right");
    }
  };
  
  function Ring(paper, opts){
    this.$$r = paper;
    this.options = {
      rotate : 0,
      innerRatio : 0.35,
      strokeAttr : {
        'stroke-width': 0
      },
      edgeAttr : {
        stroke: "#fff",
        'stroke-width': 1.5
      },
      activeAttr : {
        'fill' : '#FF4473'
      },
      centerTipAttr : {
        'fill' : '#FF4473'
      },
      getColor : function(a){
        return "hsb(" + a*0.55 + ",.75,.65)";
      },
      legend : {
        show : 'right' //auto/none/left/right
      },
      fmtPercent : Math.round,
      colors : []
    };
    NC.deepExtend(this.options, opts);
  }
  
  Ring.prototype = {
    init : function(pieData){
      var chart = this;
      var params = this.options;
      var container = this.$$canvas.options.container;
      params.radius2 = params.radius * params.innerRatio;
      if(params.radius2 > params.radius) {
        params.radius2 = 0;
      }
      
      var data = [];
      if(!pieData){
        pieData = {};
      }
      if (NC.isObject(pieData)) {
        for (var key in pieData) {
          data.push({
            id : key,
            title : key,
            value : pieData[key]
          });
        }
      }else{
        data = pieData;
        NC.each(data, function(sectorData){
          if(typeof sectorData.value == 'undefined'){
            sectorData.value = sectorData.y;   
          }
          if(typeof sectorData.title == 'undefined'){
            sectorData.title = sectorData.name;   
          }
        });
      }
      data = data.sort(function(a,b){return b.value - a.value;});
      this.data = data;
      if(document.addEventListener && (!this.$$canvas.noAnimate && this.options.animate)){
        document.addEventListener('scroll', onScroll, false);
        onScroll();
      }else{
        this.show();
      }
      function onScroll(){
        document.removeEventListener('scroll', onScroll, false);
        if(chart.inited) return;
        var scrollV = (document.documentElement.scrollTop || document.body.scrollTop) + window.innerHeight;
        if(scrollV > container.offsetTop){
          chart.show();
        }
      }
    },
    clear : function(){
      var paper = this.$$r;
      this.inited = false;
      this.elms.tip.remove();
      this.elms.sectors.remove();
      this.elms.sectors = paper.set();
      this.legend.destruct();
      this.legend.construct();
      if(this.elms.edge) {
        this.elms.edge.remove();
      }
    },
    reDraw : function(pieData){
      this.clear();
      if(pieData){
        this.init(pieData);
      }else{
        this.draw();
      }
    },
    show : function(){
      this.inited = true;
      this.draw();
    },
    animateShow : function(callback){//开场动画
      if(NC.isFunction(callback)){
        this.animateCb = callback;
      }
      var paper = this.$$r;
      var chart = this;
      var pOptions = this.options;
      var $$canvas = this.$$canvas;
      var cx = pOptions.cx; //圆心
      var cy = pOptions.cy;
      var radius = pOptions.radius;
      var radius2 = pOptions.radius2
      
      if((!this.$$canvas.noAnimate && this.options.animate && this.total) && Raphael.svg) {
        var ratio = 0;
        var startDeg = -90 + pOptions.rotate;
        
        //添加clipPath
        var el = NC.$("clipPath"),
            mask = paper.path();
        el.id = (new Date()).getTime();
        mask.attr({
          sector: [cx, cy, radius2, 0, 0]
        });
        el.appendChild(mask[0]);
        paper.defs.appendChild(el);
        chart.elms.sectors.attr({
          'clip-path' : 'url(#' + el.id + ')'
        });
        
        //clipPath动画
        setTimeout(function(){
          NC.animate([359, radius - radius2], 800, function(vals){
            if(pOptions.animate == 'reverse'){
              mask.attr({
                sector: [cx, cy, radius2+vals[1], startDeg - vals[0], startDeg]
              });
            }else{
              mask.attr({
                sector: [cx, cy, radius2+vals[1], startDeg, startDeg + vals[0]]
              });
            }
          }, onEnd);
        }, pOptions.delay || 0);
      }else{
        onEnd();
      }
      function onEnd(){
        if(chart.animateCb) {
          chart.animateCb();
          chart.elms.sectors.attr({
            'clip-path' : ''
          });
          chart.animateCb = null;
        }
      }
    },
    dropShadow : function(cx, cy, radius, cls){
      var paper = this.$$r;
      paper.circle(cx, cy, radius).toBack().attr(NC.$$attr.screen).glow({
        opacity : 0.3,
        stroke : 'none',
        'stroke-width' : 0
      });
    },
    draw : function(){ //绘制扇形
      var paper = this.$$r;
      var chart = this;
      var pOptions = this.options;
      var $$canvas = this.$$canvas;
      var cx = pOptions.cx; //圆心
      var cy = pOptions.cy;
      var radius = pOptions.radius;
      var radius2 = pOptions.radius2;
      var data = this.data;
      
      var container = pOptions.container;
      this.id2seq = {};
      
      var degOrig = -90 + pOptions.rotate;
      //sectors/data按seq索引，legends按id索引
      this.elms = {
        sectors : paper.set()  //扇形
      };

      this.elms.centerTip = paper.text(cx, cy, "")
        .attr(pOptions.centerTipAttr)
        .attr({
          'font-size' : radius2*0.6 + 'px'
        });
      
      var i, ii = data.length;
      var max = 0;
      var total = 0;
      for (i = 0; i < ii; i++) {
        if(typeof data.id == 'undefined') data.id = i;
        total += data[i].value;
        data[i].fmtval = NC.quoteNum(data[i].value);
        if(data[i].value > max) max = data[i].value;
      }
      for (i = 0; i < ii; i++) {
        if(!data[i].color) {
          data[i].color = pOptions.colors[i] || pOptions.getColor(1 - i / ii);
        }
        data[i].ratio = total ? data[i].value / total * 100 : 0;
        data[i].percent = pOptions.fmtPercent(data[i].ratio);
      }
      this.total = total;
      
      chart.tips = [];
      if (pOptions.tips) {
        if (NC.isArray(pOptions.tips)) {
          chart.tips = pOptions.tips;
        }else if (typeof pOptions.tips == 'string') { //将tips模板转为数组
          for (i = 0; i < ii; i++) {
            data[i].text = NC.subs(pOptions.tips, data[i]);
            chart.tips.push(data[i].text);
          }
        }
        if(pOptions.htmlTips){
          chart.elms.tip = $$canvas.htmlTip(chart);
        }else{
          chart.elms.tip = $$canvas.tip({
            x: cx,
            y: cy
          });
        }
      }
      
      var edge = ["M", cx, cy - radius2, "L", cx, cy - radius];
      
      if (ii == 0 && total == 0) { //无数据
        var seg = paper.set();
        seg.push( //空心圆形
          paper.circle(cx, cy, radius).attr(pOptions.strokeAttr)
            .attr({
              stroke: pOptions.getColor(1),
              "stroke-width": 3
            })
        );
        chart.elms.sectors.push(seg);
      }
      var degFrom = 0;
      for (i = 0; i < ii; i++) {
        chart.id2seq[data[i].id] = i;
        var val = (total == 0 ? 0 : 360 / total * data[i].value);
        
        if(i == 0){   //记录pie基本位置形态
          pOptions.rotate = 90;
          degOrig = pOptions.rotate;
          chart._degRotated = -val / 2;
        }
        
        (function (i) { //绘制扇形图形
          var deg1 = degOrig + degFrom;
          var deg2 = deg1 + val;
          var rad1 = deg1 * deg2rad;
          var seg = paper.set();
          seg.radMid = (deg1 + val/2) * deg2rad;  //扇形角度
          seg.degSize = val;  //扇形角度
          seg.degFrom = degFrom;  //扇形中线角度
          if (ii == 1 || Math.abs(val - 360) < 0.001) { //唯一数据：绘制一个实心圆形
            seg.push(
              paper.path().attr(pOptions.strokeAttr).attr({
                sector: [cx, cy, radius, 0, 359.9, radius * pOptions.innerRatio], 
                fill: data[i].color
              })
            );
          }else{        //正常扇形
            var edgeLine = [
              "M",
              cx + radius2 * Math.cos(rad1), 
              cy + radius2 * Math.sin(rad1), 
              "L",
              cx + radius * Math.cos(rad1), 
              cy + radius * Math.sin(rad1)
            ];
            seg.push(     //扇形
              paper.path().attr(pOptions.strokeAttr).attr({
                sector: [cx, cy, radius, deg1, deg2, radius * pOptions.innerRatio], 
                fill: data[i].color
              })
            );
            seg.push(paper    //扇形左边界
                     .path(edgeLine.join(" "))
                     .attr(pOptions.edgeAttr)); 
          }
          seg.color = data[i].color;
          seg.title = data[i].title;
          chart.elms.sectors.push(seg);
        })(i);
        degFrom += val;
      }
      chart.elms.sectors.degOrig = degOrig;
      chart.rotateByDeg(chart._degRotated);
      
      this.animateShow(function(){
        chart.dropShadow(cx, cy, radius);
        chart.dropShadow(cx, cy, radius2, "inner");
        chart.legend = new Legend(NC.deepExtend({
          $$r : paper,
          chart : chart,
          radius : radius,
          cx : cx,
          cy : cy
        }, pOptions.legend));
        chart.legend.construct(chart.elms.sectors);
        
        if(ii > 1 && pOptions.rotate == 0) {
          chart.elms.edge = paper.path(edge.join(" "))
            .attr(pOptions.edgeAttr).toFront();
        }
        if(NC.isFunction(pOptions.animateEnd)){
          pOptions.animateEnd();
        }
      });
      if(!pOptions.noHover) this.addScreen();
    },
    addScreen : function(){ //添加响应区域，处理mouseover, rotate
      var chart = this;
      var pOptions = this.options;
      var paper = this.$$r;
      var canvas = this.$$canvas;
      var cx = pOptions.cx; //圆心
      var cy = pOptions.cy;
      var radius = pOptions.radius;
      var sectors = this.elms.sectors;
      var sectorsLen = sectors.length;
      var degRotated, degDown, degUp = 0;
      this.$pole = paper.rect(0,0,0,0);
      this.$screen = paper.circle(cx, cy, radius).attr(NC.$$attr.screen);

      var body = document.body;
      body.addEventListener(NC.evName("mouseup"), upHandle);
      body.addEventListener(NC.evName("mousemove"), moveHandle);
      this.$screen[NC.evName("mousedown")](downHandle);
      function getDegByEvent(e){ //返回鼠标相对于degOrig的角度
        e = e || window.event;
        var mpos = canvas.mousePos(e);
        var rx = mpos.x - cx;
        var ry = mpos.y - cy;
        var deg = Math.atan(ry/rx) / deg2rad;
        if(rx < 0) deg = 180 + deg;
        deg -= sectors.degOrig;
        while(deg < 0) deg += 360;
        return deg;
      }
      function downHandle(e){
        degRotated = chart._degRotated;
        degDown = getDegByEvent(e);
        chart.rotating = true;
      }
      function upHandle(e){
        if(chart.rotating){
          e.preventDefault();
          degUp = getDegByEvent(e);
          chart.rotating = false;
          degRotated = chart.rotateByDeg(degRotated + degUp - degDown);
          while(degRotated && degRotated > 360) degRotated -= 360;
        }
      }
      function moveHandle(e){
        if(chart.rotating){
          var deg = getDegByEvent(e);
          sectors.transform("R" + (degRotated + deg - degDown) + "," + cx + "," + cy);
        }
      }
    },
    rotateBySeq : function(seq){ //转到指定序号的数据
      var sectors = this.elms.sectors;
      this.rotateByDeg(-sectors[seq].degFrom - 1);
    },
    rotateByDeg : function(degRotated){ //转到指定角度对应的数据
      var sectors = this.elms.sectors;
      var pOptions = this.options;
      var cx = pOptions.cx; //圆心
      var cy = pOptions.cy;
      var seq = -1;
      var sector;
      var degCursor = -degRotated;
      while(degCursor < 0) degCursor += 360;
      while(degCursor > 360) degCursor -= 360;
      for(var i = 0; i < sectors.length; i ++){
        sector = sectors[i];
        if(degCursor < sector.degFrom + sector.degSize){
          seq = i;
          break;
        }
      }

      if(seq >= 0){
        degRotated = -sector.degFrom - sector.degSize / 2;
        this._degRotated = degRotated;
        sectors.transform("R" + this._degRotated + "," + cx + "," + cy);
      }
      sectors.degOrig = 90 + degRotated;
      while(sectors.degOrig < 0) sectors.degOrig += 360;
      while(sectors.degOrig > 360) sectors.degOrig -= 360;
      
      if(seq >= 0){
        this.activeArea(seq);
      }
      return degRotated;
    },
    activeArea : function (seq){ //显示指定序号的数据
      var pOptions = this.options;
      this.elms.sectors.activeSeq = seq;

      if(this.elms.activeSeg){
        this.elms.activeSeg.attr({
          fill : this.elms.activeSeg.color
        });
      }
      this.elms.centerTip.attr({
        text : Math.round(this.data[seq].percent) + '%'
      });
      this.elms.activeSeg = this.elms.sectors[seq]
        .attr(pOptions.activeAttr);
      if (this.tips[seq]) {
        this.elms.tip.update({
          data : this.data[seq]
        });
        this.elms.tip.show();
      }
      if(pOptions.legend.show == 'auto' && this.legend) {
        this.legend.refresh();
      }
    }
  }
  
  NC.prototype.touchRing = function(pieData, opts, opts2){
    opts = opts || opts2;
    var chartOptions = this.options;
    var width = opts.width || chartOptions.width;
    var height = opts.height || chartOptions.height;
    var widthRatio = 0.9;
    if(opts.legend){
      if(opts.legend.show == 'auto') widthRatio = 0.8;
      else if(opts.legend.show == 'left' || opts.legend.show == 'right')
        widthRatio = 0.85;
    }
    var radius = Math.min(
        width * widthRatio,
        height
      ) * 0.4;
    var pOptions = {
      cx : width / 2 + (opts.shiftX || 0),
      cy : height / 2,
      radius : radius,
      height : height,
      width : width
    };
    NC.deepExtend(pOptions, opts);
    pOptions.tips = pOptions.tips || pOptions.labels;
    
    var paper = this.$$r;
    var ring = new Ring(paper, pOptions);
    ring.$$canvas = this;
    ring.init(pieData);
    
    if(!opts.noResize) winResize();
    eve.on("canvasClear", function(){
      if(this == ring.$$canvas){
        ring.animateCb = null;
      }
    });
    function winResize(){
      eve.on("chartResize", function(dw){
        if(this == ring.$$canvas){
          var pOptions = ring.options;
          if(!opts.cx){
            pOptions.cx = (chartOptions.width + dw) / 2 + (opts.shiftX || 0);
          }
          if(!opts.radius){
            pOptions.radius = Math.min(
              (chartOptions.width + dw) * 0.7,
              chartOptions.height
            ) * 0.4;
          }
          pOptions.width = chartOptions.width + dw;
          ring.$$canvas.noAnimate = true;
          paper.clear();
          ring.init(pieData);
          ring.$$canvas.noAnimate = false;
        }
      });
    };
    this.chartObjs.push(ring);
    return ring;
  };
  
  NC.prototype.touchPie = function(pieData, opts, opts2){
    opts = opts || opts2;
    return this.ring(pieData, NC.deepExtend({
      innerRatio : 0
    }, opts));
  };
  
})(window.NTESChart);

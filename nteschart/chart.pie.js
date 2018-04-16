/**
 * NTESChart.pie / NTESChart.ring
 [ function ] 绘制饼图或环图
 * 
 > 参数
 - data [Object/Array] 数据
 - opts [Object] 图表参数
 */

(function(NC){
  var deg2rad = Math.PI / 180;
  function Ring(paper, opts){
    var ring = this;
    ring.rotatable = opts.htmlTips && opts.htmlTips.docked;
    ring.$$r = paper;
    ring.animId = 0;
    ring.scope = {};
    ring.options = NC.deepExtend({
      rotate : 0,
      bounce : false,
      sort : true,
      plotAttr : {
        'stroke-width': 0
      },
      edgeAttr : {
        stroke: "#fff",
        'stroke-width': 1.5
      },
      txtAttr : {
        font: NC.$$font,
        fill: '#444',
        cursor: 'pointer'
      },
      titleAttr : {
        'fill' : '#333',
        'font-size' : 14
      },
      tipAttr : {
        'fill' : '#fff',
        'font-size' : 12
      },
      legendAttr : {
        font: NC.$$font,
        fill: '#444',
        'text-align': 'left'
      },
      legendTxtAttr: {
        "fill" : '#333',
        "font" : NC.$$sfont
      },
      getclr : function(a){
        return "hsb(" + a*0.55 + ",.75,.65)";
      },
      fmtPercent : Math.round,
      legend : 2, //0:无任何legend, 1:只在扇形上显示legend, 2:在扇形内外均可显示legend, bottom:在底部显示legend
      colors : [],
      minLineH : 18 //最小行高
    }, opts);
    ring.options.innerRatio = parseFloat(ring.options.innerRatio || 0.35);
    ring.options.haloRatio = parseFloat(ring.options.haloRatio || 0);
    ring.options.tipRatio = parseFloat(ring.options.tipRatio || 0.12);
    eve.on("canvasClear", function(){
      if(ring.$$canvas == this){
        ring.animId = 0;
      }
    });
  }
  
  Ring.prototype = {
    init: function(pieData){//处理数据、绘图
      if(!pieData) return;
      var ring = this, canvas = ring.$$canvas;
      var pOptions = ring.options, scope = ring.scope;
      var container = canvas.options.container;
      scope.radius2 = scope.radius * pOptions.innerRatio;
      
      var data = [];
      if(NC.isObject(pieData)){
        for(var key in pieData){
          data.push({
            id : key,
            title : key,
            value : pieData[key]
          });
        }
      }else{
        NC.each(pieData, function(sectorData){
          data.push(sectorData = NC.deepExtend({}, sectorData));
          if(typeof sectorData.value == 'undefined'){
            sectorData.value = sectorData.y;   
          }
          if(typeof sectorData.title == 'undefined'){
            sectorData.title = sectorData.name;   
          }
        });
      }
      scope.data = pOptions.sort ? data.sort(function(a,b){return b.value - a.value;}) : data;
      if(document.addEventListener && (!canvas.noAnimate && pOptions.animate)){
        document.addEventListener('scroll', onScroll, false);
        onScroll();
      }else{
        ring.draw();
      }
      function onScroll(){
        if(ring.inited) return;
        var scrollV = (document.documentElement.scrollTop || document.body.scrollTop) + window.innerHeight;
        if(scrollV > container.offsetTop){
          ring.draw();
        }
      }
    },
    clear: function(){//擦除ring
      var paper = this.$$r, elms = this.elms;
      this.inited = false;
      elms.tip.remove();
      elms.sectors.remove();
      elms.sectors = paper.set();
      elms.legends.remove();
      elms.legends = paper.set();
      if(elms.edge) {
        elms.edge.remove();
      }
      if(elms.title) {
        elms.title.remove();
      }
      eve.unbind("containerOut");
      eve.unbind("pieOver");
      eve.unbind("containerOver");
    },
    reDraw: function(pieData){//重绘
      this.clear();
      if(pieData){
        this.init(pieData);
      }else{
        this.draw();
      }
    },
    clipAnim: function(callback){//开场动画
      var ring = this, scope = ring.scope;
      var animId = ++ring.animId;
      var paper = ring.$$r;
      var pOptions = ring.options;
      var $$canvas = ring.$$canvas;
      var cx = scope.cx; //圆心
      var cy = scope.cy;
      var radius = scope.radius;
      var radius2 = scope.radius2
      
      if((!$$canvas.noAnimate && pOptions.animate && scope.total) && Raphael.svg) {
        var degCursor = 0;
        var ratio = 0;
        var startDeg = -90 + pOptions.rotate;
        
        //添加clipPath
        var el = NC.$("clipPath"),
            mask = paper.path();
        el.id = +new Date;
        mask.attr({
          sector: [cx, cy, radius2, 0, 0]
        });
        el.appendChild(mask[0]);
        paper.defs.appendChild(el);
        ring.elms.sectors.attr({
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
        setTimeout(onEnd, 150);
      }
      function onEnd(){
        if(animId != ring.animId) return;
        if(NC.isFunction(callback)){
          ring.elms.sectors.attr({
            //'transform' : ["t", 0, 0],
            'clip-path' : ''
          });
          callback();
        }
        if(NC.isFunction(pOptions.drawEnd)){
          pOptions.drawEnd();
        }
        if(pOptions.subData){
          var distance = radius * 1.7;
          var subRadius = radius * 0.6;
          //指向渐变
          paper.path([
            'M', ring._pos1.x, ring._pos1.y,
            'L', pOptions.width / 2 + distance, cy - subRadius,
            'A', subRadius, subRadius, 0, 0, 0, pOptions.width / 2 + distance, cy + subRadius,
            'L', ring._pos2.x, ring._pos2.y,
            'Z'
          ].join()).toBack().attr({
            fill : '230-#A4BCDA-#D8E1EC-#FCFCFC',
            stroke : 'none'
          });
          $$canvas.ring(pOptions.subData, {
            labels : "{title}\n{percent}% [{fmtval}]",
            cx : scope.width / 2 + distance,
            radius : subRadius,
            noResize : true,
            legend : 0,
            tipRatio : 0,
            animate: (ring.options.animate ? 'reverse' : false),
            fmtPercent : function(val){ return val.toFixed(2); }
          });
        }
      }
    },
    draw: function(){ //绘制扇形、legend
      var ring = this, scope = ring.scope;
      var paper = ring.$$r, $$canvas = ring.$$canvas;
      var pOptions = ring.options;
      var radius = scope.radius;
      var radius2 = scope.radius2;
      var data = scope.data;
      ring.inited = true;
      
      var container = pOptions.container;
      ring.id2seq = {};
      
      var startDeg = -90 + ring.options.rotate;
      //sectors/data按seq索引，legends按id索引
      ring.elms = {
        sectors : paper.set(),  //扇形
        legends : paper.set()  //名字
      };
      
      var i, dataLen = data.length;
      var maxValue = 0;
      var total = 0;
      NC.each(data, function(sector, i){
        if(typeof sector.id == 'undefined') sector.id = i;
        total += sector.value;
        sector.fmtval = NC.quoteNum(sector.value);
        if(sector.value > maxValue) maxValue = sector.value;
      });
      maxValue = pOptions.maxValue || maxValue;
      NC.each(data, function(sector, i){
        if(!sector.color) sector.color = pOptions.colors[i] || pOptions.getclr(1 - i / dataLen);
        sector.ratio = total ? sector.value / total * 100 : 0;
        sector.percent = pOptions.fmtPercent(sector.ratio);
      });
      scope.total = total;

      if(pOptions.legend == 'bottom'){
        ring.boxLegend();
      }
      var cx = scope.cx; //圆心
      var cy = scope.cy;
      if(pOptions.title) { //标题
        ring.elms.title = paper.text(cx, cy, pOptions.title).attr(pOptions.titleAttr);
      }
      if(pOptions.tips){ //提示
        if(NC.isArray(pOptions.tips)){
          NC.each(data, function(sector, i){
            sector.text = pOptions.tips[i];
          });
        }else if(typeof pOptions.tips == 'string'){
          NC.each(data, function(sector){
            sector.text = NC.subs(pOptions.tips, sector);
          });
        }
        if(pOptions.htmlTips){
          ring.elms.tip = $$canvas.htmlTip(ring);
        }else{
          ring.elms.tip = $$canvas.tip({
            x: cx,
            y: cy
          });
        }
      }
      
      var edge = ["M", cx, cy - radius2, "L", cx, cy - radius];
      
      var legendID_left = []; //左边的legend
      var legendID_right = []; //右边的legend
      if (dataLen == 0 && total == 0) { //无数据
        var seg = paper.set();
        seg.push( //空心圆形
          paper.circle(cx, cy, radius).attr(pOptions.plotAttr)
            .attr({
              stroke: pOptions.getclr(1),//'#2977A5',
              "stroke-width": 3
            })
        );
        seg.push( //外圆环
          paper.circle(cx, cy, radius + 3).attr({
            stroke: 'none'
          }).hide()
        );
        ring.elms.sectors.push(seg);
      }
      var baseValue = pOptions.nested ? maxValue : total; //整圆表示的数值
      for (i = 0; i < dataLen; i++) {
        ring.id2seq[data[i].id] = i;
        var degree = (baseValue == 0 ? 0 : 360 / baseValue * data[i].value);
        if(pOptions.orient == 'right'){
          legendID_left.push(i);
          if(i == 0){
            pOptions.rotate = 90 - degree / 2; //右张口时，强设rotate值
            startDeg = -90 + pOptions.rotate;
            if(degree > 180){
              ring._pos1 = {
                x : cx,
                y : cy - radius
              };
              ring._pos2 = {
                x : cx,
                y : cy + radius
              };
            }else{
              ring._pos1 = {
                x : cx + radius * Math.cos(startDeg * deg2rad),
                y : cy + radius * Math.sin(startDeg * deg2rad)
              };
              ring._pos2 = {
                x : cx + radius * Math.cos((startDeg + degree) * deg2rad),
                y : cy + radius * Math.sin((startDeg + degree) * deg2rad)
              };
            }
          }
        }else{
          if (startDeg + degree/2 - pOptions.rotate > 90
              && startDeg + degree/2 - pOptions.rotate <= 270) {
            legendID_left.push(i);   
          }else{
            legendID_right.push(i);   
          }
        }
        (function (i, direction) { //绘制扇形图形
          var seg = paper.set();
          seg.direction = direction;
          if (dataLen == 1) { //唯一数据：绘制一个实心圆形
            seg.push(
              paper.path().attr(pOptions.plotAttr).attr({
                sector: [cx, cy, radius, 0, 359.9, radius * pOptions.innerRatio], 
                fill: data[i].color
              })
            );
            seg.push( //外圆环
              paper.circle(cx, cy, radius + 3).attr({
                stroke: 'none'
              }).hide()
            );
          }else{
            if(Math.abs(degree - 360) < 0.001) degree -= 0.1;
            //正常扇形
            if(pOptions.nested){  //嵌套圆环
              startDeg = (360 - degree) / 2 + pOptions.rotate;
              var ratio = (dataLen-i)/dataLen;
              var r1 = radius * ratio + radius * pOptions.innerRatio * (1-ratio);
              ratio = (dataLen-i-1)/dataLen;
              var r2 = radius * ratio + radius * pOptions.innerRatio * (1-ratio);
              seg.push(
                paper.path().attr(pOptions.plotAttr).attr({
                  sector: [cx, cy, r1, startDeg, startDeg + degree, r2], 
                  fill: data[i].color
                })
              );
            }else{
              var edgeLine = [
                "M", 
                cx + radius2 * Math.cos(startDeg * deg2rad), 
                cy + radius2 * Math.sin(startDeg * deg2rad), 
                "L", 
                cx + radius * Math.cos(startDeg * deg2rad), 
                cy + radius * Math.sin(startDeg * deg2rad)
              ];
              seg.push(  //扇形
                paper.path().attr(pOptions.plotAttr).attr({
                  sector: [cx, cy, radius, startDeg, startDeg + degree, radius * pOptions.innerRatio], 
                  fill: data[i].color
                })
              );
              seg.push(  //外圆弧
                paper.path().attr({
                  arcsegment: [cx, cy, radius, startDeg, startDeg + degree], 
                  stroke: NC.colorSB(data[i].color, 1.2, 1.4)
                }).hide()
              );
              seg.push(  //扇形左边界
                paper.path(edgeLine.join(" "))
                  .attr(pOptions.edgeAttr));
            }
          }
          //高亮圆环
          if(pOptions.haloRatio){
            seg.push(
              paper.path().attr(pOptions.plotAttr).attr({
                sector: [cx, cy, radius * pOptions.innerRatio, startDeg, startDeg + degree, radius * pOptions.haloRatio], 
                fill: '#FFFFFF',
                opacity: 0.15
              })
            );
          }
          
          seg.mouseover(function(){
            ring.popOut(i);
            if (NC.isFunction(pOptions.mouseover)) {
              pOptions.mouseover(i);
            }
          });
          if (NC.isFunction(pOptions.click)) {
            seg.click(function () {
              pOptions.click(i);
            });
          }
          ring.elms.sectors.push(seg);
        })(i, (startDeg + degree/2) * deg2rad);
        startDeg += degree;
      }
      
      var minLineH = pOptions.minLineH;
      var maxLines = Math.floor( 2.4 * radius / minLineH ); //可容纳的行数
      if (legendID_left.length > maxLines) {
        legendID_right = legendID_right.concat(
          legendID_left.splice(0, Math.min(maxLines - legendID_right.length + 1, legendID_left.length - maxLines - 1))
        );
      } else if (legendID_right.length > maxLines) {
        legendID_left = legendID_left.concat(
          legendID_right.splice(maxLines)
        );
      }
      eve.on("containerOut", function(){
        if(!pOptions.tipsAlwaysOn){
          ring.reset();
        }
      });
      eve.on("pieOver", function(){
        if(ring != this) ring.reset();
      });
      eve.on("containerOver", function(){
        if (ring.tm_clearTip) {
          clearTimeout(ring.tm_clearTip);
          ring.tm_clearTip = null;
        }
      });
      
      this.clipAnim(function(){
        ring.addLegendGroup(legendID_left, "left");
        ring.addLegendGroup(legendID_right, "right");
        if(dataLen > 1 && pOptions.rotate == 0 && !pOptions.nested) {
          ring.elms.edge = paper.path(edge.join(" ")).attr(pOptions.edgeAttr).toFront();
        }
        eve("pie.animate.end", scope);
      });
      
    },
    addLegendGroup: function(group, side){//分别在饼图两侧添加文字
      var ring = this, scope = ring.scope;
      var pOptions = ring.options;
      var cx = scope.cx; //圆心
      var cy = scope.cy;
      var radius = scope.radius;
      var minLineH = pOptions.minLineH;
      
      var len = group.length;
      var totalH = Math.max(len * minLineH, 2 * radius);
      var dh = Math.min(totalH / len, 30);
      totalH = len * dh;
      var starty = side == 'left' ?
            (totalH > scope.height ? cy + scope.height/2 - totalH - dh/2
             : cy - totalH/2 - dh/2)
          : Math.max((scope.height - len * dh)/2, 0) + dh/3;
      
      NC.each(group, function(seq, i){
        var x, y;
        if (side == 'left') {
          x = cx - radius * 1.2;
          y = starty + ( len - i ) * dh;
        }else{
          x = cx + radius * 1.2;
          y = starty + i * dh;
        }
        ring.addLegend(x, y, seq, side);
      });
    },
    addLegend: function(lx, ly, seq, side){//给各个扇形区添加文字提示
      var ring = this, scope = ring.scope, data = scope.data;
      if(!data[seq]) return;
      var paper = ring.$$r;
      var pOptions = ring.options;
      var cx = scope.cx; //圆心
      var cy = scope.cy;
      var radius = scope.radius, radius2 = scope.radius2;
      var id = data[seq].id;
      var a = ring.elms.sectors[seq].direction;
      var x = cx + (radius - 12) * Math.cos(a);
      var y = cy + (radius - 12) * Math.sin(a);
      var outerLegend = pOptions.legend == 2;
      data[seq].outerPos = {
        x: cx + radius*1.15*Math.cos(a),
        y: cy + radius*1.15*Math.sin(a)
      };
      var ratio = 0.7 + pOptions.innerRatio / 4;
      if (pOptions.haloRatio) {
        ratio = (pOptions.haloRatio + pOptions.innerRatio)/2;
      }else if (data[seq].ratio > 50) {
        ratio = 0.5 + pOptions.innerRatio / 4;
      } else if (data[seq].ratio > 25) {
        ratio = 0.6 + pOptions.innerRatio / 4;
      }
      x = cx + (radius*ratio)*Math.cos(a);
      y = cy + (radius*ratio)*Math.sin(a);
      data[seq].innerPos = {x: x, y: y};
      if (pOptions.tipRatio && data[seq].ratio > pOptions.tipRatio * 100) {
        //直接在饼图上显示label
        ring.elms.sectors[seq].push(
          paper.text(x, y, data[seq].text).attr(pOptions.tipAttr)
        );
      }
      if (outerLegend) {
        var gText = ring.outerText(lx, ly, data[seq].title, side)
              .attr({
                fill: NC.colorSB(data[seq].color, 0.9, 0.9)
              });
        ring.elms.legends[id] = gText.toBack().mouseover(function(){
          ring.popOut(seq, (Math.cos(a) > 0 ? 'left' : 'right'));
        });
      }
    },
    boxLegend: function(){//在底部绘制legend并调整坐标轴空间
      var ring = this;
      var paper = ring.$$r;
      var pOptions = ring.options, scope = ring.scope;
      var data = scope.data;
      var curLine = paper.set();
      ring.elms.legend = paper.set();
      var dh = 30;
      var y = scope.height; //legend顶部坐标
      var px = 0, py = y;
      var dx = 25, dy = 15; //图标容器大小
      var len = data.length;
      var sbb;
      for (var i = 0; i < len; i++) {
        var set = paper.set();
        //绘制图标：方块
        set.push(paper.rect(px + 2, py + 4, 9, 9, 1).attr({
          "fill" : data[i].color
        }));
        set.attr({
          "stroke" : data[i].color,
          "stroke-width" : 2
        });
        px += dx - 10;
        var R_t = paper.text(px, py + dy/2, data[i].title).attr(pOptions.legendTxtAttr);
        var bb = NC.getBBox(R_t);
        set.push(R_t.attr({x : px + bb.width/2}));
        px += bb.width + 15;
        var bbb = NC.getBBox(set);
        
        var box = paper.rect(bbb.x, bbb.y, bbb.width, bbb.height).attr({
          "opacity" : 0,
          "fill" : "#fff",
          "cursor" : "pointer" 
        });
        set.push(box);
        curLine.push(set);
        sbb = NC.getBBox(curLine);
        //超长换行
        if (sbb.width > scope.width) {
          i--;
          set.remove();
          curLine = paper.set();
          dh += 22;
          py += 22;
          px = 0;
        }else{
          ring.elms.legend.push(set);
          //点击图例显示/隐藏对应的图形
          var tm;
          (function(i, legendSet){
            var iseq = i;
            box.mouseover(function(){
              if(tm) clearTimeout(tm), tm = null;
              var icon = legendSet[1];
              if(typeof icon.transformStr != 'string')
                icon.transformStr = icon.transform().toString();
              legendSet[0].transform(icon.transformStr + "s1.2");
              ring.popOut(i);
              if (NC.isFunction(pOptions.mouseover)) {
                pOptions.mouseover(i);
              }
            }).mouseout(function(){
              var icon = legendSet[1];
              if(typeof icon.transformStr == 'string'){
                legendSet[0].transform(icon.transformStr);
              }
              tm = setTimeout(function(){
                tm = null;
                eve("containerOut", ring);
              }, 200);
            });
          })(i, ring.elms.legend[ring.elms.legend.length - 1]);
        }
      }
      scope.cy -= dh/2;
      
      sbb = NC.getBBox(ring.elms.legend);
      //图例左侧坐标
      var x = (scope.width - sbb.width)/2;
      
      //legend 边框
      if(pOptions.legendAttr.border){
        ring.elms.legend.push(paper.rect(-4.5, y-4.5, sbb.width+9, sbb.height+9).attr({
          stroke: '#aaa', 'stroke-width' : 1
        }));
      }
      ring.elms.legend.translate(x, -dh-5);
    },
    outerText: function(lx, ly, str, side){
      var paper = this.$$r, scope = this.scope;
      var pOptions = this.options;
      var radius = scope.radius;
      var gText = paper.text(lx, ly, str).attr(pOptions.legendAttr);
      var bb = gText.getBBox();
      if(side == "left" && bb.width > lx - 10){
        var olen = str.length;
        var nlen = Math.floor(lx / bb.width * olen);
        str = str.substr(0, nlen - 2) + '..';
        gText.remove();
        gText = paper.text(lx, ly, str).attr(pOptions.legendAttr);
        bb = gText.getBBox();
      }
      if (radius >= 120) {  //左侧右对齐，右侧左对齐
        lx += (side == "right" ? bb.width/2 + 2 : -bb.width/2 - 2);
      } else {
        lx += (side == "right" ? bb.width/2 - 3 : -bb.width/2 + 3);
      }
      
      gText.attr({x : lx});
      gText.side = side;
      return gText;
    },
    popOut: function (seq, pos){ //弹出扇形
      var ring = this, scope = ring.scope, data = scope.data;
      var pOptions = ring.options;
      var $$canvas = ring.$$canvas;
      var cx = scope.cx; //圆心
      var cy = scope.cy;
      var radius = scope.radius;
      var dataLen = data.length;
      var total = scope.total;
      
      var direction = ring.elms.sectors[seq].direction;
      if (total != 0) {
        if ($$canvas.tip_timer) {
          clearTimeout($$canvas.tip_timer);
          $$canvas.tip_timer = null;
        }
        if (ring.activeSeg) {
          ring.activeSeg[1] && ring.activeSeg[1].hide();
          if(ring.options.bounce){
            ring.activeSeg.stop().animate({transform: ["t", 0, 0]}, 10);
          }
        }
        ring.activeSeg = ring.elms.sectors[seq];
        if (dataLen > 1 && data[seq].value) {
          if(ring.options.bounce){
            ring.elms.sectors[seq].animate({
              transform: ["t", 
                          radius * 0.1 * Math.cos(direction), 
                          radius * 0.1 * Math.sin(direction)]
            }, 600, "bounce");
          }
          if(ring.elms.sectors[seq][1]) ring.elms.sectors[seq][1].show();
        }
      }
      
      if (data[seq].text) {
        if (!pos) {
          pos = ( Math.cos(direction) > 0 ? "left" : "right" );
        }
        ring.elms.tip.update({
          x : cx + (dataLen > 1 && total != 0 ? (radius) * Math.cos(direction) : 0),
          y : cy + (dataLen > 1 && total != 0  ? (radius) * Math.sin(direction) : 0),
          data : data[seq],
          labelPos : pos
        });
        if (!pOptions.htmlTips && pOptions.tipRatio && data[seq].ratio > pOptions.tipRatio * 100) {
          ring.elms.tip.hide();
        }else{
          ring.elms.tip.show();
        }
      }
      eve("pieOver", this);
    },
    active: function(id){//突出显示
      var seq = this.id2seq[id];
      if (typeof seq != 'undefined') {
        this.popOut(seq);
      }
    },
    reset: function(){//取消突出显示
      var ring = this;
      ring.tm_clearTip = setTimeout(function(){
        ring.elms.tip.hide();
        if (ring.activeSeg) {
          ring.activeSeg[1] && ring.activeSeg[1].hide();
          ring.activeSeg.stop().animate({
            transform : ["t", 0, 0]
          }, 50);
          ring.activeSeg = null;
        }
      }, 100);
    }
  }
  
  NC.prototype.ring = function(pieData, opts, opts2){
    opts = opts || opts2;
    var chartOptions = this.options;
    var width = opts.width || chartOptions.width;
    var height = opts.height || chartOptions.height;
    var params = NC.deepExtend({
      width: width,
      height: height
    }, opts);
    params.tips = params.tips || params.labels;
    
    var paper = this.$$r;
    var ring = new Ring(paper, params);
    var canvas = ring.$$canvas = this;
    var pOptions = ring.options, scope = ring.scope;
    function draw(dw, dh){
      scope.width = width + dw;
      scope.height = height + dh;
      scope.cx = opts.cx || scope.width / 2 + (opts.shiftX || 0);
      scope.cy = opts.cy || scope.height / 2;
      scope.radius = opts.radius || Math.min(
        scope.width * (pOptions.legend>1?0.75 : 1),
        scope.height
      ) * 0.4;
      if(opts.radiusScale) scope.radius *= opts.radiusScale;
      if(dw || dh) canvas.noAnimate = true;
      //paper.clear(); //subpie时有问题
      eve.unbind("containerOut");
      eve.unbind("pieOver");
      eve.unbind("containerOver");
      ring.init(pieData);
      canvas.noAnimate = false;
    }
    draw(0, 0);
    
    if(!opts.noResize) eve.on("chartResize", function(dw, dh){//调整大小
      if(this == canvas) draw(dw, dh);
    });
    canvas.chartObjs.push(ring);
    return ring;
  };
  
  NC.prototype.pie = function(pieData, opts, opts2){
    opts = opts || opts2;
    return this.ring(pieData, NC.deepExtend({
      innerRatio : 0,
      bounce : true
    }, opts));
  };
  
})(window.NTESChart);

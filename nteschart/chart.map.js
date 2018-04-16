/**
 * NTESChart.map
 [ function ] 绘制地图(默认为中国地图)
 * 
 > 参数
 - data [Object] 分地区数据
 - opts [Object] 绘制参数
 */

(function(NC){
  NC.prototype.map = function(data, opts){
    var mapData = opts.mapData || window.mapData; //边界曲线数据
    var slider = null;
    if(opts.mapData) delete(opts.mapData);
    if(!mapData){
      alert("初始化地图失败。");
      return false;
    }
    if(opts.legend == "0") opts.legend = false;
    var oht = 740 + ((typeof opts.legend == 'undefined' || opts.legend) ? 70 : 0);
    var canvas = this;
    var paper = canvas.$$r;
    var options = canvas.options, _width = options.width;
    var scope = {
      width: _width,
      height: options.height,
      data: [], //各区域数据、位置
      activeArea: null
    };
    var params = {
      defaultAttr : {fill: "#fff", stroke: "#999", 'stroke-width': 1},
      hlAttr : {stroke: "#888"},
      shadowAttr : {fill: "#6B6B6B", stroke: "#a0a0a0", 'stroke-width': 1},
      hoverAttr : {fill: "#f22", stroke: "#888"},
      txtAttr : {fill: "#fff", font: "12px Helvetica, Arial"},
      legendAttr : {fill: "#000", font: NC.$$sfont},
      slideLineAttr : {fill: "none", stroke: "#DDDDDD", 'stroke-width': 10, 'stroke-linecap' : "round"},
      slideHolderAttr : {cursor: "pointer", fill: "#FFB980", stroke: "#FEF5F0", 'stroke-width': 3},
      labelPos : "right",
      animate : 300,
      legend : 'box',
      shadow : true,
      marker : {
        hoverClass: "hover",
        dx: 0, dy: 0
      },
      scale : Math.min(scope.width / 900, scope.height / oht),
      getclr : function(a){
        return "hsb("+0.1+","+a+","+0.97+")";
      }
    };
    NC.deepExtend(params, opts);
    
    var tip = null;
    var getclr = params.getclr;
    var container = options.container;
    var shiftx = (scope.width - 900*params.scale)/2;
    var shifty = (scope.height - oht*params.scale)/2;

    if(params.label && !params.noTip){
      tip = canvas.tip({
        x: 500*params.scale+shiftx,
        y: 400*params.scale,
        label : params.label
      }).init();
    }
    
    var activeAreaId;
    var max = 0;
    var total = 0;
    var areaInfo = {};
    var dataArr = scope.data;
    
    if(NC.isArray(data)){
      dataArr = data;
    }else if(NC.isObject(data)){
      for(var key in data){
        dataArr.push({
          name : key,
          value : data[key]
        });
      }
    }
    
    var areaid;
    var name2id = {};
    for(areaid in mapData){ //id:430000, name:湖南
      name2id[mapData[areaid].name] = areaid;
      if(params.shadow){
        var areaShadow = this.path(mapData[areaid].p, params.scale).translate(shiftx + 3, 3);
        areaShadow.attr(params.shadowAttr);
      }
    }
    
    //处理绘图数据
    var len = dataArr.length;
    for(var i = 0; i < len; i++){
      var val = dataArr[i].value || 0;
      total += val;
      if(val > max){
        max = val;
      }
      dataArr[i].fmtval = NC.quoteNum(val);
      if(!dataArr[i].id && dataArr[i].name) dataArr[i].id = name2id[dataArr[i].name];
    }
    for(var i = 0; i < len; i++){
      dataArr[i].percent = total ? parseInt((dataArr[i].value || 0) / total * 100) : 0
      if(dataArr[i].id) areaInfo[dataArr[i].id] = {data:dataArr[i]};
    }
    function isHighlight(info){
      if(!info || typeof info.data.value == 'undefined') return false;
      if(slider && info.data.value < slider.val1) return false;
      if(slider && info.data.value > slider.val2) return false;
      return true;
    }
    function drawAreas(updateOnly){
      for(areaid in mapData){ //填充有数据的省份
        var area = mapData[areaid].area;
        if(!updateOnly) area = mapData[areaid].area = canvas.path(mapData[areaid].p, params.scale).translate(shiftx, 0);
        if(!areaInfo[areaid]) areaInfo[areaid] = {
          data:{
            name: mapData[areaid].name,
            value: 0,
            percent: 0
          }
        }
        
        area._attr = isHighlight(areaInfo[areaid]) ? 
          (areaInfo[areaid].data.attr ? NC.deepExtend({stroke: '#fff'},areaInfo[areaid].data.attr) : NC.deepSupplement({
            fill: getclr(areaInfo[areaid].data.value/max)
          }, params.hlAttr)) : params.defaultAttr;
        area.attr(area._attr);
        areaInfo[areaid].path = area;
        if(updateOnly) continue;
        (function(areaid){ //每个地区的交互
          //省会位置
          var activeData = areaInfo[areaid].data || (areaInfo[areaid].data = {});
          activeData.x = mapData[areaid].x * params.scale + shiftx;
          activeData.y = mapData[areaid].y * params.scale;
          
          //中心位置
          var abb = area.getBBox();
          activeData.cx = abb.x + abb.width / 2 - shiftx;
          activeData.cy = abb.y + abb.height / 2 - shifty;
          
          if(areaid == "150000") activeData.cy += 70;
          if(areaInfo[areaid].marker){
            addMarker(areaInfo[areaid].marker, {
              id : areaid,
              dx : params.marker.dx,
              dy : params.marker.dy,
              position : 'capital'
            });
          }
          
          area.mouseover(function () {
            if(opts.quietWithoutData &&
               (!areaInfo[areaid].data || !areaInfo[areaid].data.value)) return;
            setActive(areaid);
          }).mouseout(function(){
            if(!areaInfo[areaid].timer) areaInfo[areaid].timer = setTimeout(function(){
              deActive(areaid);
            }, 80);
          }).click(function (e) {
            if(NC.isFunction(params.click)){
              params.click(areaid);
            }
          });
        })(areaid);
      }
    }
    
    function setActive(areaid){
      if(!areaInfo[areaid]) areaid = name2id[areaid];
      if(!areaInfo[areaid]) return;
      if(areaInfo[areaid].timer){
        clearTimeout(areaInfo[areaid].timer);
        areaInfo[areaid].timer = null;   
      }
      if(activeAreaId == areaid) return;
      if(activeAreaId) deActive(activeAreaId);
      
      if(areaInfo[areaid] && areaInfo[areaid].marker){
        addClass(areaInfo[areaid].marker, params.marker.hoverClass);
      }

      var activeData = scope.activeArea = areaInfo[areaid].data;
      var area = areaInfo[areaid].path;
      area.stop().toFront();
      if(params.animate){
        area.animate(params.hoverAttr, params.animate)   
      }else{
        area.attr(params.hoverAttr);
      }
      
      if(tip){
        tip.update({
          x : activeData.x, 
          y : activeData.y,
          lbaelPos : params.labelPos,
          data :  areaInfo[areaid].data
        });
        tip.set.toFront();
        tip.set.mouseover(function(){
          setActive(areaid);
        }).mouseout(tipMouseout);
      }
      
      if(NC.isFunction(params.mouseover)){
        params.mouseover(areaid);
      }
      
      paper.safari();
      activeAreaId = areaid;
      eve("map.change", scope);
    }
    function tipMouseout(){
      if(activeAreaId){
        if(!areaInfo[activeAreaId].timer) areaInfo[activeAreaId].timer = setTimeout(function(){
          deActive(activeAreaId);
        }, 80);
      }
    }
    function deActive(areaid){
      if(!activeAreaId || activeAreaId != areaid) return;
      var area = areaInfo[areaid].path;
      area.stop();
      if(params.animate){
        area.animate(area._attr, params.animate)   
      }else{
        area.attr(area._attr);
      }
      
      if(areaInfo[areaid] && areaInfo[areaid].marker){
        removeClass(areaInfo[areaid].marker, params.marker.hoverClass);
      }
      activeAreaId = null;
      scope.activeArea = null;
      
      if(tip) tip.hide();
      paper.safari();
      eve("map.change", scope);
    }
    
    function addLegend(){ //map
      var R_legend = paper.set();
      var scale = params.scale;
      var dx = 45*scale;
      var x0 = options.width/2 - 3.5*dx;
      var y0 = 740*scale;
      var dy = 30*scale;
      if (Raphael.svg && params.legend == 'slider') slider = {
        left : x0 + 7*dx,
        width : 0,
        val1 : max,
        val2 : max
      };
      
      if(slider){
        dy = Math.max(12*scale, 9.5);
        y0 += 20;
      }else{ //左右侧文本
        paper.text(x0-10, y0+dy/2, '0').attr(params.legendAttr);
        var R_t = paper.text(x0+7*dx+5, y0+dy/2, (NC.quoteNum(max) || '强')).attr(params.legendAttr);
        var tbb = R_t.getBBox();
        R_t.translate(tbb.width/2, 0);
      }
      if(params.legend == 'box'){
        R_legend.push(paper.rect(x0, y0, 7*dx, dy).attr({
          "fill" : "none",
          "stroke" : "#888"
        }));
      }else if(slider){
        paper.path(['M', x0+2, y0+5, 'h', 7*dx-4].join(" ")).attr(params.slideLineAttr);
      }
      for(var i = 0; i< 7;i++){
        R_legend.push(paper.rect(x0+i*dx, y0, dx, dy).attr({
          "stroke" : "none",
          "fill" : getclr(i/7)
        }));
      }
      if(slider){
        //添加clipPath
        var el = NC.$("clipPath"),
            mask = paper.rect(slider.left, y0, slider.width, dy);
        el.id = +new Date;
        el.appendChild(mask[0]);
        paper.defs.appendChild(el);
        R_legend.attr({
          'clip-path' : 'url(#' + el.id + ')'
        });
        
        R_legend.left = paper.set();
        R_legend.left.push(paper.circle(slider.left, y0+5, 10).attr(params.slideHolderAttr));
        var tip1 = canvas.tip({
          x: slider.left, y : y0 - 5,
          labelPos : 'top',
          label : slider.val1
        }).init();
        R_legend.left.push(tip1.set.show());
        R_legend.right = paper.set();
        R_legend.right.push(paper.circle(slider.left+slider.width, y0+5, 10).attr(params.slideHolderAttr));
        var tip2 = canvas.tip({
          x: slider.left + slider.width, y : y0 - 5,
          labelPos : 'top',
          label : slider.val2
        }).init();
        R_legend.right.push(tip2.set.show());
        R_legend.left.val = slider.val1;
        R_legend.right.val = slider.val2;
        initDrag(R_legend.left);
        initDrag(R_legend.right);
        var setVal = function(set, newval){
          if(newval > max) newval = max;
          else if(newval < 0) newval = 0;
          var mx = (newval - set.val)*7*dx/max;
          set.val = newval;
          set.translate(mx, 0);
          set[set.length-1][1][0].attr({
            text : Math.round(set.val)
          })
        }
        var dragEnd = function(){
          var val1 = R_legend.left.val;
          var val2 = R_legend.right.val;
          if(val1 > val2){
            var _val = val1;
            val1 = val2;
            val2 = _val;
          }
          slider.val1 = val1;
          slider.val2 = val2;
          slider.left = x0 + val1*7*dx/max;
          slider.width = (val2-val1)*7*dx/max;
          mask.attr({
            x : slider.left,
            width : slider.width
          });
          drawAreas(true);
        }
        document.addEventListener("mousemove", function(e){
          if(activeSet){
            var mx = e.clientX - dragStart.x;
            var dval = max*mx/7/dx;
            var newval = activeSet.val + dval;
            setVal(activeSet, newval);
            dragStart = {
              x : e.clientX
            };
          }
        });
        document.addEventListener("mouseup", function(e){
          if(activeSet){
            dragEnd();
            activeSet = null;
          }
        });
        slider.setSlider = function(ratio1, ratio2){
          if(slider){
            var val1 = ratio1*max;
            var val2 = ratio2*max;
            setVal(R_legend.left, val1);
            setVal(R_legend.right, val2);
            slider.val1 = val1;
            slider.val2 = val2;
            slider.left = x0 + val1*7*dx/max;
            slider.width = (val2-val1)*7*dx/max;
            mask.attr({
              x : slider.left,
              width : slider.width
            });
            drawAreas(true);
          }
        }
      }
    }
    var activeSet, dragStart;
    function initDrag(set){
      set.mousedown(function(e){
        activeSet = set;
        dragStart = {
          x : e.clientX
        };
      });
    }
    function addMarker(dom, opts){
      if(!opts.id){
        if(opts.name){
          opts.id = name2id(opts.name);
        }
        if(!opts.id) return;
      }
      var id = opts.id;
      var markerOpts = {
        dx : 0,
        dy : 0,
        position : "center" //capital
      }
      NC.deepExtend(markerOpts, opts);
      var area = areaInfo[id].path;
      var activeData = areaInfo[id].data;
      dom.style.top = (markerOpts.position == "capital"
                       ? activeData.y :
                       activeData.cy) - shifty + markerOpts.dy + "px";
      dom.style.left = (markerOpts.position == "capital"
                        ? activeData.x
                        : activeData.cx) + markerOpts.dx + "px";
      bind(dom, "mouseover", function(){
        if(areaInfo[id].timer){
          clearTimeout(areaInfo[id].timer);
          areaInfo[id].timer = null;
        }
        setActive(id);
      });
      bind(dom, "mouseout", function(){
        areaInfo[id].timer = setTimeout(function(){
          deActive(id);
        }, 50);
      });
      bind(dom, "click", function(){
        if(NC.isFunction(params.markerClick)) params.markerClick(id);
      });
    }
    function keepActive(){
      for(var id in areaInfo) if(areaInfo[id].timer) clearTimeout(areaInfo[id].timer), areaInfo[id].timer = null;
    }
    function reDraw(dw){
      scope.width = _width + dw;
      params.scale = Math.min(scope.width / 900, scope.height / oht);
      shiftx = (scope.width - 900*params.scale)/2;
      paper.clear();
      drawAreas();
    }
    if(params.legend)
      addLegend();
    drawAreas();
    eve.on("chartResize", function(dw){//调整大小
      if(this == canvas) reDraw(dw);
    });
    
    return {
      scope: scope,
      keepActive: keepActive,
      setActive: setActive,
      deActive: deActive,
      addMarker: addMarker,
      tipMouseout: tipMouseout,
      setSlider: slider ? slider.setSlider : null
    };
  };
  
  function hasClass(node, _class) {
    if(!node || typeof node.className != 'string') return false;
    var arr = node.className.split(" ");
    for(var i = arr.length - 1; i >= 0; i--){
      if(arr[i] == _class){
        return 1;
      }
    }
    return 0;
  }
  function addClass(node, _class) {
    if(!node) return;
	if (!hasClass(node, _class))
	  node.className += (node.className ? " " : "") + _class;
  }
  function removeClass(node, _class) {
    if(!node) return;
	if (hasClass(node, _class))
	  node.className = node.className.replace(new RegExp("\\b" + _class + "\\b"), "");
  }
  function bind(node, type, handle){
    if(!node) return;
	if (node.attachEvent) {
	  node.attachEvent("on" + type, handle);
	} else if (node.addEventListener) {
	  node.addEventListener(type, handle, false);
	}
  }
})(window.NTESChart);

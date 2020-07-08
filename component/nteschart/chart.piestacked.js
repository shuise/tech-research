/**
 * NTESChart.pieStacked
 [ function ] 绘制饼图、堆叠面积图或堆叠柱图
 * 
 > 参数
 - datas2 [Array] 要绘制的数据
 - opts1 [Object] 饼图参数(与堆叠面积图并列)，为null表示不画饼图
 - opts2 [Object] 堆叠面积图参数(与饼图并列)
 - opts3 [Object] 堆叠柱图参数(单独绘制)
 - labels [Array] 堆叠图x轴标注
 - opts [Object] 其它参数，如framePadding
 > 返回
 - toggle [function] 在并列的饼图、堆叠面积图和单独的堆叠柱图之间切换
 */

(function(NC){
  NC.prototype.pieStacked = function(datas2, opts1, opts2, opts3, labels, opts){
    var status = 0; //0:饼/堆叠面积图, 1:堆叠柱图
    var canvas = this;
    var r = this.$$r;
    var datas1, datas3 = datas2.xy3 || datas2;
    if (!NC.isObject(opts2) || !NC.isObject(opts3)) return null;
    opts2.noResize = true;
    opts3.noResize = true;
    if (!NC.isObject(opts1)) {
      opts1 = null;
    } else {
      opts1.noResize = true;
      if(datas2.pie){
        datas1 = datas2.pie;
        opts1.xyChart = false;
      }else if(datas2.xy1){
        datas1 = datas2.xy1;
        opts1.xyChart = true;
      }else{
        opts1.xyChart = false;
        datas1 = []; //将datas求和，得到饼图数据
        for(var i = 0; i < datas2.length; i ++){
          var datasum = 0;
          var _series = datas2[i];
          var _arr = NC.isArray(_series) ? _series : _series.data;
          for(var j = 0; j < _arr.length; j ++){
            datasum += _arr[j];
          }
          datas1.push({
            title : _series.title,
            value : datasum,
            xrange : labelText(labels[0]) + '至' + labelText(labels[labels.length - 1])
          });
        }
      }
    }

    var chartOptions = this.options;
    if (labels) {
      if(opts1 && opts1.xyChart){
        opts1.xTick = NC.deepExtend({
          _labels : labels
        }, opts1.xTick);
      }
      opts2.xTick = NC.deepExtend({
        _labels : labels
      }, opts2.xTick);
      opts3.xTick = NC.deepExtend({
        _labels : labels
      }, opts3.xTick);
    }
    var options = NC.deepExtend({
      framePadding : 10
    }, opts);

    function initOpts(){
      if(opts1){
        var chartW = chartOptions.width;
        var shiftX = (opts1.shiftX || 0);
        if(opts1.xyChart){
          chartW -= shiftX;
          opts1.boxSpace = {
            width : chartW / 2,
            left : shiftX
          };
          opts2.boxSpace = {
            width : chartW / 2,
            left : shiftX + chartW / 2 - 10
          };
        }else{
          var chartH = chartOptions.height;
          var pieWidth = Math.min(chartH, chartW / 2);
          //左侧饼图
          opts1.width = pieWidth;
          //右侧面积图
          opts2.left = opts1.width + options.framePadding + shiftX;
          opts2.width = (chartW - opts2.left - 10);
        }
      }
    }
    initOpts();
    
    eve.on("chartResize", function(dw){
      if(this == canvas){
        initOpts();
        canvas.clear();
        drawFuncs[status]();
      }
    });
    
    var chartObjs;
    var drawFuncs = [
      function(){
        chartObjs = [];
        if(opts1){
          if(opts1.xyChart){
            chartObjs[0] = canvas.xyChart(datas1, opts1.plot || ["line", "dot"], opts1);
          }else{
            chartObjs[0] = canvas.pie(datas1, opts1);
          }
        }
        chartObjs[1] = canvas.xyChart(datas2, opts2.plot || ["line", "dot"], opts2);
      },
      function(){
        chartObjs[2] = canvas.xyChart(datas3, opts3.plot || ["bar"], opts3);
      }
    ];
    drawFuncs[0]();
    return {
      toggle : function(flag){
        if(typeof flag != 'undefined'){
          if(status == flag){
            return;
          }else{
            status = flag;
          }
        }else{
          status = 1 - status;
        }
        canvas.clear();
        drawFuncs[status]();
      },
      updateOptions : function(newopts1, newopts2, newopts3){
        NC.deepExtend(opts1, newopts1);
        NC.deepExtend(opts2, newopts2);
        if(chartObjs[1] && newopts2) chartObjs[1].updateOptions(newopts2);
        NC.deepExtend(opts3, newopts3);
        if(chartObjs[2] && newopts3) chartObjs[2].updateOptions(newopts3);
      }
    }
  }

  function labelText(label){
    return NC.isObject(label) ? label.text : label;
  }
})(window.NTESChart);

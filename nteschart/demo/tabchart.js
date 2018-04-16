/**
 * NTESChart.initCharts
 [ function ]
 * 给定容器，根据其属性绘制图表
 > 参数
 - wrap [doms] 单个dom节点或querySelectorAll返回的nodeList
 */
/**
 * NTESChart.initTabCharts
 [ function ]
 * 给定标签组窗口，初始化其绘制功能
 > 参数
 - wrap [doms] 单个dom节点或querySelectorAll返回的nodeList
 - callback [function] 标签切换回调
 */

(function(NC){
  function $(css, wrap){
    if(wrap){
      return wrap.querySelectorAll(css);
    }else{
      return document.querySelectorAll(css);
    }
  }
  function initCharts(){}
  initCharts.prototype = {
    draw : function(wrap, indicator){
      indicator = indicator || wrap;
      var dataid = indicator.getAttribute("chart-data") || '';
      var labelid = indicator.getAttribute("chart-label") || '';
      var confid = indicator.getAttribute("chart-conf") || 'default';
      if(!window.chartDatas[dataid]) {
        if(dataid){
          throw "tabChart: chartDatas." + dataid + " not found.";
        }
        return;
      }
      if(typeof window.chartConfs[confid] == 'undefined') return;
      var canvas = wrap["canvas"];
      if(canvas){
        canvas.clear();
        canvas.options.width = wrap.offsetWidth;
      }else{
        canvas = new NC({
          container : wrap
        });
        wrap["canvas"] = canvas;
      }
      var config = window.chartConfs[confid];
      if(!config.type){
        config.type = 'xyChart';   
      }
      if(config.type == 'pieStacked'){
        wrap["chart"] = canvas[config.type](
          window.chartDatas[dataid],
          config.options[0],
          config.options[1],
          config.options[2],
          window.chartDatas[labelid]
        );
      }else{
        wrap["chart"] = canvas[config.type](
          window.chartDatas[dataid], 
          config.plot,
          NC.deepExtend({xTick : {_labels : window.chartDatas[labelid]}}, config.options)
        );
      }
    }
  }
  var dmCharts = new initCharts;
  
  function tabChart(wrap){
    this.doms = {
      wrap : wrap,
      heads : $(".nav-hd", wrap),
      subheads : $(".nav-subhd", wrap),
      bodys : $(".nav-bd", wrap)
    }
    this._seq = 0; //激活的标签页
  }
  tabChart.prototype = {
    init : function(callback){
      var that = this;
      if(this.doms.heads.length == 0){
        return;
      }
      if(this.doms.heads.length != this.doms.bodys.length){
        throw "tabChart: heads.length != bodys.length";
        return;
      }
      this.show(this._seq);
      for(var i = 0; i < this.doms.heads.length; i ++){
        (function(i){
          that.doms.heads[i].addEventListener('click', function(){
            that.show(i);
            if(NC.isFunction(callback)){
              callback(i);
            }
          });
        })(i);
      }
      if(this.doms.subheads.length){  //绑定二级标签页
        this.doms.subheads.bind("click", function(){
          if(that.activeBody) that.dmCharts.draw(that.activeBody, this);
        });
      }
    },
    show : function(seq){
      if(!dmCharts) return;
      if(this._seq != seq){
        this.doms.heads[this._seq].classList.remove("active");
        this.doms.bodys[this._seq].style.display = "none";
        this.doms.heads[seq].classList.add("active");
        this.doms.bodys[seq].style.display = "block";
        this._seq = seq;
      }
      
      var tabBody = this.doms.bodys[seq];
      var chartBody = $(".nteschart-body", this.doms.bodys[seq])[0];
      this.activeBody = chartBody;
      if(tabBody.getAttribute("inited")){
        eve("winResize");
        return;
      }
      
      var tabHead = this.doms.heads[seq];
      if(chartBody){
        dmCharts.draw(chartBody, tabHead);
        tabBody.setAttribute("inited", 1);
      }
    }
  }
  
  NC.initCharts = function(wrap){
    if(!wrap) return;
    if(Object.prototype.toString.apply(wrap) === '[object NodeList]'){
      for(var i = 0; i < wrap.length; i ++){
        NC.initCharts(wrap[i]);
      }
      return;
    }
    dmCharts.draw(wrap);
  }
  
  NC.initTabCharts = function(wrap, callback){
    if(!wrap) return;
    if(Object.prototype.toString.apply(wrap) === '[object NodeList]'){
      for(var i = 0; i < wrap.length; i ++){
        NC.initTabCharts(wrap[i]);
      }
      return;
    }
    var group = new tabChart(wrap);
    group.init(callback);
  }

})(window.NTESChart);

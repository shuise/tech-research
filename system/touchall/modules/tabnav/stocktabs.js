define(function(){
  var scope = this, $$ = bowlder;
  scope.stockGroup = [
    {
      name: "A股",
      list: [{name: "上证综指", code: "0000001"}, {name: "深证成指", code: "1399001"}, {name: "沪深300", code: "1399300"}]
    },
    {
      name: "美股",
      list: [{name: "道琼斯", code: "US_DOWJONES"}, {name: "纳斯达克", code: "US_NASDAQ"}, {name: "标普500", code: "US_SP500"}]
    },
    {
      name: "港股",
      list: [{name: "恒生指数", code: "hkHSI"}, {name: "国企指数", code: "hkHSCEI"}, {name: "红筹指数", code: "hkHSCCI"}]
    },
    {
      name: "基金",
      list: [{name: "沪市基指", code: "0000011"}, {name: "深市基指", code: "1399305"}]
    },
    {
      name: "外汇",
      list: [{name: "美元/人民币", code: "FX_USDCNY"}, {name: "美元/欧元", code: "FX_USDEUR"}, {name: "美元/日元", code: "FX_USDJPY"}]
    }
  ];
  var codeList = [];
  $$.each(scope.stockGroup, function(tab){
    $$.each(tab.list, function(item){
      var code = item.code;
      codeList.push(code);
      if(/^\d/.test(code)){
        item.chart = "http://img1.money.126.net/chart/hs/time/210x140/"+code+".png";  
      }else if(/(\w+)_(\w+)/.test(code)){
        item.chart = "http://img1.money.126.net/chart/"+RegExp.$1.toLowerCase()+"/time/210x140/"+RegExp.$2+".png";  
      }else if(/(\w{2})(\w+)/.test(code)){
        item.chart = "http://img1.money.126.net/chart/"+RegExp.$1.toLowerCase()+"/time/210x140/"+RegExp.$2+".png";
      }
    });
  });
  scope.init = function(widget){
    var url = "http://api.money.126.net/data/feed/"+codeList.join(",")+",money.api?callback=CALLBACK";
    $$.ajax.jsonp(url).success(function(json){
      $$.each(json, function(item){
        item.fmtPercent = $$.isString(item.percent) ? item.percent : (item.percent*100).toFixed(2) + '%';
        if(item.turnover) item.turnover = (parseFloat(item.turnover)/10000/10000).toFixed(1);
      });
      scope.stockData = json;
      scope.$refresh();
    });
  };
})

//http://api.money.126.net/data/feed/0000001,1399001,1399300,US_DOWJONES,US_NASDAQ,US_SP500,hkHSI,FG_aozhougushi,FG_rj225,FG_hanguo,FG_xinjiapo,FG_yindu,FG_yingguo,FG_ruishi,FG_deguo,FG_eluosi,FG_faguo,FG_xibanya,0000011,1399305,FX_USDCNY,FX_USDCHF,FX_USDEUR,FX_USDHKD,FX_USDJPY,FX_USDCAD,FU_thismonth,FU_au,FU_ag,money.api?callback=_ntes_quote_callback68662646

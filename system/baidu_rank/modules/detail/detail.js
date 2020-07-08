define(
  ["!/libs/raphael.js;/component/nteschart/chart.core.js;/component/nteschart/chart.frame.js"],
  function(){
    var scope = this, $$ = bowlder;
    var trendCanvas;
    function drawTrend(list){
      var cateinfo;
      window.catelist.forEach(function(item){
        if(item.id == scope.category) cateinfo = item;
      });
      var events = cateinfo && cateinfo.events ? cateinfo.events : {};
      
      var maxRank = 10;
      var _labels = [];
      var chartDatas = [{
        title : '百度',
        data : []
      }, {
        title : '360',
        data : []
      }];
      $$.each(list, function(item){
        var label = item.createTime;
        _labels.push(label);
        var baiduRank = item.rank.baidu||0;
        var qh360Rank = item.rank[360]||0;
        var yBaidu = baiduRank || 101;
        var baiduData = {
          y: yBaidu
        };
        if(yBaidu > maxRank) maxRank = yBaidu;
        if(events[label]) baiduData.milestone = '* ' + events[label]
        chartDatas[0].data.push(baiduData);
        
        var y360 = qh360Rank || 101;
        chartDatas[1].data.push({
          y: y360
        });
        if(y360 > maxRank) maxRank = y360;
      });
      var chartOpts = {
        htmlTips : {
          group : "<table><tr><th colspan=2>{xtick}</th></tr>{rows}</table>{milestone}",
          vline : true,
          rankOrder : true
        },
        fixTips : function(info){
          if(info.y == 101) info.y = "无";
        },
        tips : "{title}\t{y}",
        yTitle : {title: "搜索引擎排名"},
        xTick : {interval : 1, labels : _labels},
        yTick : {labels : "{y}", startY: [0, 0], interval: 5},
        anim : true,
        grid : {shadow:0}
      };
      if(maxRank > 80){
        chartOpts.grid.rows = 20;
      }
      trendCanvas.clear();
      trendCanvas.xyChart(chartDatas, ["line","dot"], chartOpts);
    }
    scope.routeInit = function(params){
      var tmp = params.key;
      if(/(.*?)\/(.*)/.test(tmp)){
        scope.info = {
          keyword : RegExp.$1,
          url : scope.originUrl = RegExp.$2
        }
      }

      scope.getDetail(scope.info.keyword, scope.info.originUrl).success(function(json){
        if(json.status == 'success'){
          scope.listByDate = json.list;
          if(json.list[0]){
            scope.category = json.list[0].category;
            scope.$refresh();
            drawTrend(json.list);
          }
        }
      });
    };
    scope.init = function(widget){
      var roles = widget.roles;
      var $trendChart = roles["trend-chart"];
      trendCanvas = new NTESChart({
        container : $trendChart[0]
      });
    };
  });

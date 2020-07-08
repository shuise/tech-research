(function(){
  var $ = angular.$;
  var seoModule = angular.module('seo');

  seoModule.controller("seolist", ['$routeParams', '$http', '$scope', '$rootScope', function ($routeParams, $http, $scope, $rootScope) {
    $scope.catelist = window.catelist;
    $scope.category = $routeParams.category || "quote";
    var pagesList;
    $scope.catelist.forEach(function(item){
      if(item.id == $scope.category) pagesList = item.pages;
    });
    $http.get("/seorank/list/" + $scope.category).success(function(json){
      var mapItems = {};
      json.forEach(function(item){
        var baidu = item.baidu[0];
        var google = item.google[0];
        baidu.rank = baidu.p ? 10*(baidu.p - 1) + baidu.r : '无';
        baidu.relrank = baidu.rp ? 10*(baidu.rp - 1) + baidu.rr : '无';
        if(baidu.rank == baidu.relrank){
          baidu.relrank = "";
        }
        item.baidu = baidu;
        
        google.rank = google.p ? 10*(google.p - 1) + google.r : '无';
        google.relrank = google.rp ? 10*(google.rp - 1) + google.rr : '无';
        if(google.rank == google.relrank){
          google.relrank = "";
        }
        item.google = google;
        
        mapItems[item.keyword + item.url] = item;
      });
      var newList = [];
      var oldList = [];
      pagesList.forEach(function(item, i){
        var _item = mapItems[item.keyword + item.url];
        newList.push(_item || item);
        delete(mapItems[item.keyword + item.url]);
      });
      for(var id in mapItems){
        oldList.push(mapItems[id]);
      }
      $scope.list = newList;
      if(oldList.length){
        $scope.toggleold = function(){
          $scope.oldlist = oldList;
          $scope.showold = !$scope.showold;
        };
      }
    });
  }]);

  seoModule.controller("seodetail", ['$routeParams', '$http', '$scope', '$rootScope', function ($routeParams, $http, $scope, $rootScope) {
    var id = $routeParams.id;
    $scope.category = $routeParams.category;
    var cateinfo;
    window.catelist.forEach(function(item){
      if(item.id == $scope.category) cateinfo = item;
    });
    var events = cateinfo && cateinfo.events ? cateinfo.events : {};
    $http.get("/seorank/detail/" + $scope.category + '/' + id).success(function(json){
      $scope.info = json;
      var chartDatas = [{
        title : '百度',
        data : []
      }, {
        title : '谷歌',
        data : []
      }];
      var _labels = [];
      var listByDate = [];
      var maxRank = 0; //图表中最大rank
      json.baidu.forEach(function(baidu, i){
        var google = json.google[i];
        var date = new Date(baidu.t);
        var day = date.format("yyyy/MM/dd HH:mm");
        var label = date.format("yyyy-MM-dd");
        _labels.push(label);
        var baiduRank = (baidu.p ? 10*(baidu.p-1) + baidu.r : 0);
        var googleRank = (google.p ? 10*(google.p-1) + google.r : 0);
        var baiduRelrank = (baidu.rp ? 10*(baidu.rp-1) + baidu.rr : 0);
        var googleRelrank = (google.rp ? 10*(google.rp-1) + google.rr : 0);
        var yBaidu = baiduRank || 101;
        var baiduData = {
          y: yBaidu
        };
        if(yBaidu > maxRank) maxRank = yBaidu;
        if(events[label]) baiduData.milestone = '* ' + events[label]
        chartDatas[0].data.push(baiduData);
        
        var yGoogle = googleRank || 101;
        chartDatas[1].data.push({
          y: yGoogle
        });
        if(yGoogle > maxRank) maxRank = yGoogle;
        
        listByDate.push({
          day : day,
          baidu : {
            rank : baiduRank || '无',
            p : baidu.p,
            r : baidu.r,
            rurl : baidu.rurl,
            relrank : (baidu.rp && (baiduRelrank != baiduRank) ? 10*(baidu.rp-1) + baidu.rr : 0)
          },
          google : {
            rank : googleRank || '无',
            p : google.p,
            r : google.r,
            rurl : google.rurl,
            relrank : (google.rp && (googleRelrank != googleRank) ? 10*(google.rp-1) + google.rr : 0)
          }
        });
      });

      $scope.listByDate = listByDate.reverse();

      var canvas = new NTESChart({
        container : document.getElementById("br_key_rank")
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
      canvas.xyChart(chartDatas, ["line","dot"], chartOpts);
    });
  }]);
  
})();

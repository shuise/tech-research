(function(){
  var $ = function(q, root) { root = root || document;if(!root.nodeType && root[0]) root = root[0];return root.nodeType ? angular.element(typeof q == 'string' && q.substr(0,1) != '<' ? root.querySelectorAll(q) : q) : []; }
  $.tagLC = function(dom){return dom.tagName.toLowerCase();}
  $.template = function(temp, data, regexp){
	if(!(Object.prototype.toString.call(data) === "[object Array]")) data = [data];
	var ret = [];
	for(var i=0,j=data.length;i<j;i++){
      data[i].i = i;
	  ret.push(replaceAction(data[i]));
	}
	return ret.join("");
	function replaceAction(object){
	  return temp.replace(regexp || (/\\?\{([^}]+)\}/g), function(match, name){
		if (match.charAt(0) == '\\') return match.slice(1);
		return (object[name] != undefined) ? object[name] : '';
	  });
	}
  }
  Date.prototype.format=function(fmt) {  
    var o = {
      "M+" : this.getMonth() + 1, //月份
      "d+" : this.getDate(), //日
      "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时
      "H+" : this.getHours(), //小时
      "m+" : this.getMinutes(), //分
      "s+" : this.getSeconds(), //秒
      "q+" : Math.floor((this.getMonth()+3)/3), //季度
      "S" : this.getMilliseconds() //毫秒
    };
    var weekname = ["日", "一", "二", "三", "四", "五", "六"];
    if (/(y+)/.test(fmt)) {  
      fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));  
    }
    if (/(E+)/.test(fmt)) {  
      fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "星期" : "周") : "")+weekname[this.getDay()]);  
    }
    for (var k in o) {  
      if (new RegExp("("+ k +")").test(fmt)) {  
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));  
      }
    }
    return fmt;  
  }

  var modsModule = angular.module('seo', ['ngRoute']);
  modsModule.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
      when('/list/:category', {
        templateUrl: 'seo_list.html',
        controller: 'seolist'
      }).
      when('/detail/:category/:id', {
        templateUrl: 'seo_detail.html',
        controller: 'seodetail'
      }).
      otherwise({
        redirectTo: '/list/quote'
      });
  }]);

  modsModule.controller("search", ['$http', '$scope', '$rootScope', function ($http, $scope, $rootScope) {
    $scope.keyword = "网易";
    $scope.url = "http://news.163.com";
    $scope.reset = function(){
      $scope.baidu = null;
      $scope.google = null;
    }
    $scope.reset();
    $scope.search = function(){
      var key = $scope.keyword.replace(/\s+$/, '');
      var url = $scope.url.replace(/\s+$/, '').replace(/^\s*http:\/\//, '');
      if(!key){
        alert("关键词不能为空");
      }
      if(!url){
        alert("URL不能为空");
      }
      $http.get("/seorank/baidu?keyword="+key+"&url="+url)
        .success(function(json){
          $scope.baidu = json;
        });
      $http.get("/seorank/google?keyword="+key+"&url="+url)
        .success(function(json){
          $scope.google = json;
        });
    }
  }]);
})();

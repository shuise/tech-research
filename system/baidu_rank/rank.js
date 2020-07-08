define(function(){
  var scope = this, $$ = bowlder;
  //trend.json?wd=%E6%BE%B3%E5%A4%A7%E5%88%A9%E4%BA%9A%E6%88%BF%E6%BA%90&url=http://vhouse.163.com/australia
  var apiRoot = "http://test.rankmonitor.163.com/service/rank/";
  var ajaxService = "/system/tools/node/get.js.node";
  scope.getList = function(category){
    return $$.ajax.get(ajaxService, {
      data : {url : apiRoot + "trend.json?cg="+category}
    });
  }
  scope.getDetail = function(wd, url){
    return $$.ajax.get(ajaxService, {
      data : {url : apiRoot + "list.json?wd="+wd+"&url="+url}
    });
  }
  scope.init = function(){
    
  };
});

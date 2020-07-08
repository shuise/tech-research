define(function(){
  var scope = this, $$ = bowlder;
  scope.results = [];
  scope.query = function(){
    var kw = scope.kw.trim();
    if(!kw) return;
    scope.results = [];
    search(kw);
  }
  function search(str){
    var promises = [];
    $$.each(str.split(/[\r\n]+/), function(word){
      word = word.replace(/(^\s+|[,;\s]+$)/g, '');
      if(!word) return;
      var url = "node/recommend.js.node?callback=CALLBACK&word=" + word;  //test.keyword.163.com 123.126.62.136
      var stime = +new Date;
      promises.push($$.ajax.jsonp(url).success(function(json){
        scope.results.push({
          duration : +new Date - stime,
          word : word,
          relates : scope.$filter(json.list, function(item){
            return item.hot || !/网$|下载|首页/.test(item.keyword)
          })
        });
      }));
    });
    $$.$q.all(promises).then(function(key){
      scope.$refresh();
    });
  }
});

define(function(){
  var scope = this, $$ = bowlder;
  function setList(i){
    scope.list = scope.bodyList[i];
    scope.$refresh();
  }
  scope.init = function(widget){
    var navWidget = widget.children[0];
    navWidget.extend({
      category: [
        {"n":"国内","l":"http://news.163.com/domestic/"},
        {"n":"国际","l":"http://news.163.com/world/"},
        {"n":"社会","l":"http://news.163.com/shehui/"},
        {"n":"深度","l":"http://focus.news.163.com/"},
        {"n":"评论","l":"http://news.163.com/review/"},
        {"n":"军事","l":"http://war.news.163.com/"},
        {"n":"图片","l":"http://news.163.com/photo/"},
        {"n":"视频","l":"http://v.163.com/news/"}]
    });
    var url = "http://news.163.com/special/0001220O/news_json.js?" + Math.random();
    $$.ajax.require(url, {
      headers : {charset:'gbk'}
    }).success(function(){
      if(!$$.isObject(window.data)) return;
      delete(data.category);
      scope.bodyList = data.news;
      navWidget.ready(function(){
        setList(0);
        var navScope = navWidget.scope;
        navScope.callback = function(i){
          setList(i);
        }
        navWidget.refresh();
      });
    });
  };
})

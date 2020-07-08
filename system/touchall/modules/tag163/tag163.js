define(function(){
  var scope = this, $$ = bowlder;
  scope.init = function(){
    var url = "http://news.163.com/special/hot_tags_recommend_data/";
    $$.ajax.require(url).success(function(){
      if(window.hotTagsData && $$.isArray(hotTagsData.data)){
        scope.tagList = hotTagsData.data.slice(0, 6);
        scope.$refresh();
      }
    });
  };
});

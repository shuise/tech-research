define(
  function(){
    var scope = this, $$ = bowlder;
    var state = scope.state = {};
    scope.imgThumb = $$.getThumbUrl;
    scope.init = function(widget){
      if(state.roomid){
        var url = "http://data.live.126.net/liveAllMobile/"+state.roomid+".json?jsoncallback=CALLBACK";
        $$.ajax.jsonp(url).success(function(json){
          if(json.logOrder == 'desc'){
            json.logs = json.logs.reverse();
          }
          $$.extend(scope, json);
          scope.$refresh();
        });
      }
    };
  });

define(
  function(){
    var scope = this, $$ = bowlder;
    scope.category = "";
    scope.routeInit = function(params){
      if(scope.category != params.key){
        scope.category = params.key;
        scope.getList(scope.category).success(function(json){
          if(json.status == 'success'){
            scope.list = json.list;
            scope.$refresh();
          }
        });
      }
    };
    scope.init = function(){
      
    };
  });

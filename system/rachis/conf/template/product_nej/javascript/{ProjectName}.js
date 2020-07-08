define([
  // dependencies list
  "util/query/query"
], function( query ){

  var page = {
    init: function(){
      query._$one("body #app").innerHTML = "NEJ is run";
    }
  }

  page.init()

})

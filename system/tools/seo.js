define(function(){
  var scope = this, $$ = bowlder;
  scope.toggleHelp = function(){
    var target = this.$target;
    var $btn = $$(target);
    var $div = $$("div.help", target.parentNode.parentNode);
    if($btn.hasClass("active")){
      $div.hide(300);
      //$div.slideUp(300, function(){
        $btn.removeClass("active");
      //});
    }else{
      //$div.slideDown(300);
      $div.show(300);
      $btn.addClass("active");
    }
  }
});

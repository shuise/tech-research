;(function(global,factory){
 if (typeof define === 'function'){
   define([], factory);
 }else if(typeof require == 'function' && typeof module == 'object' && module['export']){
   module["exports"] = factory();
 }else{
   global["PenCombox"] = factory() || {};
 }
})(this,function(){
    var PenCombox = {};
    PenCombox.genCombox = function(comboxId){
       if (typeof comboxId != 'undefined'){
          var combox = document.getElementById(comboxId),clsOpts = PenCombox.cssFactory();
          combox.className += " " + clsOpts.parent;
          for(var i=0,len = combox.childNodes.length; i<len; i++){
            combox.childNodes[i].className +=clsOpts.child;
          }
       }
    };

    PenCombox.bindEvent = function(elementObj,eventName,method){
       if (window.addEventListener) {
          elementObj.addEventListener(eventName,method);
       }else if(window.attachEvent){
          elementObj.attachEvent('on' + eventName,method);
       }
    };

    PenCombox.removeEvent = function(elementObj,eventName,method){
        if (window.addEventListener) {
           elementObj.removeEventListener(eventName,method);
        }else if(window.attachEvent){
           elementObj.detachEvent(eventName,method);
        }
    };

    // 重写此方法请返回对象 {parent:'',child:''}
    PenCombox.cssFactory = function(recreate){
     var clsOpts = {};
     if (!document.getElementById('penStyleId') && !recreate) {
         var style = document.createElement("style");
         document.head.appendChild(style);
         style.setAttribute('id','penStyleId');
         style.innerHTML = ".pen-parent-combox{width: 200px; line-height: 25px; border-radius: 5px; border:1px solid #ccc; font-size: 12px; padding:0 10px; position: relative;}" +
                           ".pen-child-combox{ list-style-type: none; border-bottom: 1px dashed #eee; cursor: pointer;transition: all 1s ease 0s}"+
                           ".pen-child-combox:hover{border-bottom: 1px solid #51A6FF; background-color: #DAF0FF; padding-left: 20px; font-weight: bold; }";
        }
       clsOpts.parent = 'pen-parent-combox';
       clsOpts.child  = 'pen-child-combox'
       return clsOpts;
    }
    return PenCombox;
});

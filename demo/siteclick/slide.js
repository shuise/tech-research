(function($){
	var doc = document.documentElement, body = document.body;
    var snap = [1500, 2000];
    
    var slide = skrollr.init({
	    edgeStrategy: 'set'
    });
    
    var timeout_scroll;
    var global = {
        goingDown : 1,
        sTop : doc.scrollTop || body.scrollTop
    };
    var scrollOpt = {
        duration : 600
    }
    
    body.onscroll = function(e){
        clearTimeout(timeout_scroll);
        var sTop = doc.scrollTop || body.scrollTop;
        global.goingDown = (sTop - global.sTop > 0 ? 1 : 0);
        global.sTop = sTop;
        timeout_scroll = setTimeout(function(){
            for(var i = 0; i < snap.length; i ++){
                var _top = snap[i];
                if(global.goingDown){
                    if(_top > sTop && sTop > 500 && sTop > (snap[i-1] || 0) + 100){
                        slide.animateTo(_top, scrollOpt);
                        break;
                    }
                }else{
                    if(sTop > 500){
                        if(_top > sTop){
                            _top = (snap[i-1] || 0);
                            slide.animateTo(_top, scrollOpt);
                            break;
                        }else if(i == snap.length - 1){
                            _top = snap[i];
                            slide.animateTo(_top, scrollOpt);
                            break;
                        }
                    }
                }
            }
        }, 100);
    };
})(NE);
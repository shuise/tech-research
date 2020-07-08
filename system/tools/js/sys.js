(function($){
    initHelp();
    createRegGo();

    function loadJsonP(asUrl, afCallback){
	    if (!asUrl) {return;}
        if(afCallback){
	        var lsGUID = 'ne' + (new Date()).getTime();
	        asUrl = (asUrl.indexOf("callback=") == -1) ? (asUrl + (asUrl.indexOf("?") != -1 ? "&" : "?") + "callback=" + lsGUID) : asUrl;
	        window[lsGUID] = afCallback;
        }
	    var node = document.createElement('script');
	    node.src = asUrl;
	    document.getElementsByTagName('head')[0].appendChild(node);                                  
    }

    function createRegGo(){
	    var $wrapper = $("#f2e_go_regular");
	    if($wrapper.length == 0){return;}	

        var $msg = $wrapper.find("div.message");
        var $form = $wrapper.find("form");
        
	    $("#btn_go_regular").click(function(){
            var svnpath = $form[0].svnpath.value.replace(/^\s+/, '').replace(/\s+$/, '');
            $msg.html('<br><img src="http://img2.cache.netease.com/auto/projects/club/v1.1/default/images/loadings.gif">');
            $.post("/cgi-bin/tools/go_regular.cgi", {
                "svnpath" : svnpath
            },function(json){
                if(json['status'] == 'success'){
                    var name = json['name'];
                    $msg.html('项目' + name + '创建成功');
                }else if(json.msg){
                    $msg.html('<div class="f2e_error">'+json.msg+'</div>');
                }
            });
        });
    }

    function createCMSGo(){
	    var $wrapper = $("#f2e_go_cms");
	    if($wrapper.length == 0){return;}	

        var $msg = $wrapper.find("div.message");
        var $form = $wrapper.find("form");
        
	    $("#btn_go_cms").click(function(){
            var svnpath = $form[0].svnpath.value.replace(/^\s+/, '').replace(/\s+$/, '');
            $msg.html('<br><img src="http://img2.cache.netease.com/auto/projects/club/v1.1/default/images/loadings.gif">');
            $.post("/cgi-bin/tools/go_cms.cgi", {
                "svnpath" : svnpath
            },function(json){
                if(json['status'] == 'success'){
                    var name = json['name'];
                    $msg.html('项目' + name + '创建成功');
                }else if(json.msg){
                    $msg.html('<div class="f2e_error">'+json.msg+'</div>');
                }
            });
        });
    }

    function cssCopy(){
	    var domFade = function(btn,node){
		    setTimeout(function(){
			    btn.value = "已复制成功";
		    },20);
	    };
	    var toClipboard = function(btn,node) {
		    var txt = node.value ? node.value : node.innerHTML;
		    var clip = new ZeroClipboard.Client();
	    	clip.setHandCursor(true);
		    clip.setText(txt);
		    clip.addEventListener('complete', function (client) {
		        domFade(btn,node);
		    });
		    clip.glue(btn);
	    };

	    var obj = document.getElementById("f2e_css_build");
	    if(!obj){return;}
	    (function(){
		    var links = obj.getElementsByTagName("a");
		    var btns = obj.getElementsByTagName("input");
		    for(var i=0,len=links.length;i<len;i++){
			    toClipboard(btns[i],links[i]);			
		    }
	    })();
    }

    function initHelp(){
        $("h2 span.help").click(function(){
            var $btn = $(this);
            var $div = $btn.closest("h2").nextAll("div.help:first");
            if($btn.hasClass("active")){
                $div.slideUp(300, function(){
                    $btn.removeClass("active");
                });
            }else{
                $div.slideDown(300);
                $btn.addClass("active");
            }
        });
    }
})(NE);
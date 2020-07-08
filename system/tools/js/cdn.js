(function($){
    initHelp();
    cssCompress();
    jsCompress();
    cdnClear();
    cmsPost();

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

    function cdnClear(){
	    var obj = document.getElementById("f2e_api_clear");
	    if(!obj){return;}	

	    var node = obj.getElementsByTagName("textarea")[0];
	    if(!node){return;}

	    node.onpaste = function(){
		    setTimeout(function(){
			    var str = node.value.split(";").join("\n") + "\n";
			    node.value = str;
			    node.style.height = node.scrollHeight + "px";
		    },50);
	    };
	    document.getElementById("clearform").onsubmit = function(){
		    document.getElementById("clearframe").style.display = "block";
	    };
    }

    function jsCompress(){
        var $link = $("#f2e_js_build div.inc_link");
        var $content = $("#f2e_js_build textarea");
        if($content.length == 0) return;
	    $("#btn_jsmerge").click(function(){
            var inc = document.getElementById("inc").value.replace(/^\s+/, '').replace(/\s+$/, '');
            if(inc == '')return;
            $link.html('<br><img src="http://img2.cache.netease.com/auto/projects/club/v1.1/default/images/loadings.gif">');
            $.post("/cgi-bin/tools/jspack_inc.cgi", {
                "inc" : inc
            },function(json){
                if(json['status'] == 'success'){
                    var url = json['file'];
                    $link.html('<a href="'+url+'" target=_blank>处理后的inc文件下载</a>');
                    $.get(url, function(txt){
                        $content.val(txt).slideDown(300);
                        cssCopy();
                    });
                }else if(json.msg){
                    $link.html('<div class="f2e_error">'+json.msg+'</div>');
                    $content.hide();
                }
            });
        });
    }

    function cssCompress(){
        var tbl = document.getElementById("f2e_css_build");
        if(!tbl) return;
	    document.getElementById("btn_cssmerge").onclick = function(){
            var url = document.getElementById("cssurl").value.replace(/^\s+/, '').replace(/\s+$/, '');
            if(url == '')return;
            tbl.innerHTML = '<br><img src="http://img2.cache.netease.com/auto/projects/club/v1.1/default/images/loadings.gif">';
            loadJsonP("http://tools.f2e.netease.com/cgi-bin/tools/css_jsonp.cgi?url="+url, function(json){
                if(json['status'] == 'success'){
                    var str = '<caption>已合并，且自动上传到CDN：</caption>';
                    for(var i = 1; i <= 6; i++){
                        var cdnurl = 'http://img'+i+'.cache.netease.com'+json['url'];
                        str+=['<tr>',
                              '<td><a href="'+cdnurl+'" target="_blank">'+cdnurl+'</a></td>',
                              '<td>上传成功</td>',
                              '<td><input type="button" value="复制地址" /></td>',
                              '</tr>'].join("\n");
                    }
                    tbl.innerHTML = '<table class="f2e_css_build">' + str + '</table>';
                    cssCopy();
                }else if(json.msg){
                    tbl.innerHTML = '<div class="f2e_error">'+json.msg+'</div>';
                }
            });
        };
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
    
    function cmsPost(){
        var tbl = document.getElementById("f2e_cms_post");
        if(!tbl) return;
        var $form = $("#cmsform");
        var $cmsauth = $("#cmsauth");
        var name;
        var password;
        var $name = $form.find("input[name='name']");
        var $password = $cmsauth.find("input[name='password']");
        getpassword();
        $form.submit(function(){
            if($cmsauth.children().length > 0){
                name = $name.val();
                if(!name){
                    alert("请输入发布器帐号");
                    return false;
                }
                password = $password.val();
                if(!password){
                    alert("请输入发布器密码");
                    return false;
                }
                var modelid = $form.find("input[name='model_id']").val();
                var file = $form.find("input[name='svnpath']").val();
                if(!modelid && !file){
                    alert("请输入要发布的模板名和SVN文件名");
                    return false;
                }
                if(file != '' && ! /html?$/i.test(file)){
                    alert("只允许发布html文件");
                    return false;
                }
            }
            tbl.innerHTML = '<br><img src="http://img2.cache.netease.com/auto/projects/club/v1.1/default/images/loadings.gif">';
            return true; 
        });
        window.cmsPostCallback = function(json){
            if(json.status == '0'){ //成功
                savepassword();
                $("#cmsauth").hide();
                tbl.innerHTML = $.template('<table class="f2e_css_build"><caption>发布成功：</caption><tr><td><a href="{url}" target="_blank">{url}</a></td></tr></table>', json);
            }else if(json.status == '1'){ //密码错误
                $("#cmsauth").show();
                tbl.innerHTML = '<div class="f2e_error">'+json.msg+'</div>';
            }else if(json.status == '2'){  //其它错误
                tbl.innerHTML = '<div class="f2e_error">'+json.msg+'</div>';
            }
        };
        function getpassword(){
            if(!window.sessionStorage) return;
            name = sessionStorage['cmsname'];
            password = sessionStorage['cmspassword'];
            if(name && password){
                $("#cmsauth").hide();
                $name.val(name);
                $password.val(password);
            }
        }
        function savepassword(){
            if(!window.sessionStorage) return;
            sessionStorage['cmsname'] = name;
            sessionStorage['cmspassword'] = password;
        }
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
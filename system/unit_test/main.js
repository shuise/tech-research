(function($){
    var once = 0;
    var isWrap = true;
    var snippet_begin, snippet_end;
    if (window.localStorage) {
        if(typeof localStorage.isWrap != 'undefined'){
            isWrap = (localStorage.isWrap == "true");
        }
    }
    if(!window.root_dir){
        window.root_dir = "mods";
    }
    
    var tpl = {
        "item" : '<li class="itm"><a key="{key}" title="{key}" class="itmlnk" href="http://static.f2e.netease.com/testing/spec/{key}" target="demo_frame">{name}</a></li>',
        "dir" : '<li class="itm parent-node" key="{name}"><a>{name}</a><ul class="f-cb sub-menu" style="display:none">{subitems}</ul>'
    }
    var $demowrap = $("#demowrap");
    var $export = $("#export");
    var ifrm = document.getElementById("demo_frame");
    
    var location_hash = parseLocation();
    
    var active_menu_item;
    window.genMenu = function(menu){
        var ul = '';
        for(var i=0, l=menu.length;i<l;i++){
            var item = menu[i];
            if(item.subs){
                item.subitems = subs(tpl.item, item.subs);
                ul += subs(tpl.dir, item);
            }else{
                ul += subs(tpl.item, item);
            }
        }
        $demowrap.html('<ul class="f-cb">'+ul+'</ul>');
        
        $demowrap.find(".parent-node > a").click(function(){
            var $this = $(this);
            $this.parent().toggleClass("opened");
            $this.nextAll("ul").toggle();
        });
        
        $demowrap.find(".itmlnk").click(function(){
            var $this = $(this);
            var key = $this.attr("key");
            if(active_menu_item) active_menu_item.removeClass("crt");
            active_menu_item = $this.parent();
            active_menu_item.addClass("crt");
            ifrm.setAttribute("src", "/system/unit_test/spec/"+key);
            location.hash = "key=" + key;
            return false;
        });
        
        if(location_hash.key){
            var $key_a = $demowrap.find("a[key='"+location_hash.key+"']");
            if($key_a.length > 0){
                $demowrap.find(".itm[key='"+location_hash.key.replace(/\/.*/, '')+"'] > a").click();
                $key_a.click();
            }else{
                ifrm.setAttribute("src", "/system/unit_test/spec/"+location_hash.key);
            }
        }else{
            $demowrap.find(".parent-node:first > a").click();
            $demowrap.find("a[key]:first").click();
        }
    }
    //$.getScript("http://tools.f2e.netease.com/"+window.root_dir+"/.menu.js");
    $.getScript("menu.js");
    
    window.loadDemo = function(json){
        demo_preview();
    };
    
    function subs(temp, data, regexp){
		if(!(Object.prototype.toString.call(data) === "[object Array]")) data = [data];
		var ret = [];
		for(var i=0,j=data.length;i<j;i++){
			ret.push(replaceAction(data[i]));
		}
		return ret.join("");
		function replaceAction(object){
			return temp.replace(regexp || (/\\?\{([^}]+)\}/g), function(match, name){
				if (match.charAt(0) == '\\') return match.slice(1);
				return (object[name] != undefined) ? object[name] : '';
			});
		}
	}
    
    function getifrm(iFrame){
        var iFrameBody;
        if ( iFrame.contentDocument ){ // FF
            iFrameBody = iFrame.contentDocument;
        }
        else if ( iFrame.contentWindow ){ // IE
            iFrameBody = iFrame.contentWindow.document;
        }
        return iFrameBody;
    }
    
    function demo_preview(){
        
    }
    
    function parseLocation(){
        var json = {};
        if(/[\?\#](.+)/.test(location.href)){
            var str = RegExp .$1;
            var patt = /(.+?)=([^&\#]+)/g;
            var result;
            while ((result = patt.exec(str)) != null)  {
                json[result[1]] = result[2];
            }
        }
        return json;
    }
    
})(jQuery);


(function(){
    var $_browsers_list = document.getElementById("browsers_list");
    var left_tab = $_browsers_list.parentNode;
    var $_report_div = document.getElementById("report_div");
    var $_test_date = document.getElementById("test_date");
    var $_test_name = document.getElementById("test_name");
    var $_retest = document.getElementById("retest");
    var $_deltest = document.getElementById("deltest");

    if(typeof work_dir == 'undefined'){
        window.work_dir = "/yice/anonym/tmp/1201010000";
    }
    
    var tpl = {
        'browser' : '<a href="{link}" class="driver {status}" id="{name}" title="{time}">{name}<span class="status">{detail}</span></a>',
        'os' : '<div class="{name}">{list}</div>'
    };
    
    var reload_tries = 0;
    var auto_load = 1;
    var current_file = work_dir + "/test.html";
    reloadTab();
    
    var current_a;
    
    $_test_date.onchange = function(e){
        var time = this.value;
        location.href = "?dir=" + work_dir.replace(/\d+$/, time);
    }
    
    $_retest.onclick = function(e){
        var url = "?retest=" + current_file;
        location.href = url;
    }
    
    $_deltest.onclick = function(e){
        if(confirm("确定要删除当前测试结果吗？")){
            var url = "?deltest=" + work_dir;
            location.href = url;
        }
    }
    
    $_browsers_list.onclick = function(e){
        e = e || window.event;
        var target =  getTarget(e);
        if(target.nodeName.toLowerCase() == 'a'){
            if(hasClass(target, "pending")){
                return false;   
            }
            if(hasClass(target, "driver")){
                if(current_a) removeClass(current_a, "current");
                addClass(target, "current");
                current_a = target;
                auto_load = 0;
                var link = target.getAttribute('href');
                if(link == '#') return false;
                loadTable(link);
                return false;
            }
        }
        return false;
    }
    
    function loadTable(url){
        loadAjax(url, {
            type : 'html',
            callback : function(data){
                $_report_div.innerHTML = data;
                resizeTable();
            }
        })
    }
    
    function getTarget(e){
        var target = window.event ? window.event.srcElement : e ? e.target : null;
        if (!target){return false;}
        //单击一个链接时，safari不把这个链接做为目标，而是把链接里的文本节点做为目标
        while(target.nodeType!=1 && target.nodeName.toLowerCase()!='body'){
            target=target.parentNode;
        }
        return target;
    }
    
    function loadAjax(url, option) {
		var xhr = (window.ActiveXObject) ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();
		try {
			if (option.async !== false) {
				option.async = true;
			}
			xhr.open(option.method || "GET", url, option.async);
			xhr.setRequestHeader("Content-Type", option.contentType || "application/x-www-form-urlencoded");
			xhr.onreadystatechange = function() {
				if (xhr != null && xhr.readyState == 4) {
			        if (xhr.status == 200){
					    if (option.callback) {
						    if (option.type && (option.type.toLowerCase() == 'text' || option.type.toLowerCase() == 'html')) {
							    option.callback(xhr.responseText);
						    } else {
							    option.callback(eval("(" + xhr.responseText + ")"));
						    }
					    }
                    }
				}
			};
			xhr.send(option.data);
		} catch (ex) {
			return;
		}
	}
    
    function hasClass(obj, _class) {
        if(!obj) return false;
        var arr = obj.className.split(" ");
        for(var i = arr.length - 1; i >= 0; i--){
            if(arr[i] == _class){
                return 1;
            }
        }
        return 0;
	}

    function addClass(obj, _class) {
        if(!obj) return;
		if (!hasClass(obj, _class))
			obj.className += (obj.className ? " " : "") + _class;
	}
    
    function removeClass(obj, _class) {
        if(!obj) return;
		if (hasClass(obj, _class))
			obj.className = obj.className.replace(new RegExp("\\b" + _class + "\\b"), "");
	}
    
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
    
    function reloadTab(){
        reload_tries ++;
        loadAjax(work_dir + "/browsers.json", {
            callback : function(json){
                var pending = 0;
                var inited = $_browsers_list.getAttribute("inited");
                if(!inited){
                    var os = {};
                    var html = '';
                }
                $_test_name.innerHTML = subs("<a href='{input}' target='_blank'>{input}</a>", json);
                current_file = json.input;
                
                var data = json.drivers;
                var current_item_name = '';
                for(var i=0; i<data.length;i++){
                    var item = data[i];
                    var arr = item['name'].split(/\//);
                    if(!inited){
                        if(!os[arr[1]]) os[arr[1]] = {'name':arr[1], 'list' : ''};
                        os[arr[1]]['list'] += subs(tpl.browser, item);
                    }else if(item.status != "pending"){
                        var item_a = document.getElementById(item.name);
                        removeClass(item_a, "pending");
                        item_a.getElementsByTagName('span')[0].innerHTML = item.detail;
                        item_a.setAttribute("title", item.time);
                        addClass(document.getElementById(item.name), item.status);
                    }
                    if(item['status'] == 'pending'){
                        pending = 1;
                    }else if(auto_load && (item['status'] == 'pass' || item['status'] == 'fail')){
                        auto_load = 0;
                        loadTable(item.link);
                        current_item_name = item.name;
                    }
                }
                
                if(!inited){
                    for(var key in os){
                        html += subs(tpl.os, os[key]);
                    }
                    $_browsers_list.innerHTML = html;
                    $_browsers_list.setAttribute("inited", 1);
                }
                if(current_item_name){
                    current_a = document.getElementById(current_item_name);
                    addClass(current_a, "current");
                }
                
                if(auto_load && $_report_div.getElementsByTagName('table').length == 0){
                    loadTable(json.input);   //加载用例定义表
                }else{
                    resizeTable();
                }
                
                if(pending && reload_tries < 62) setTimeout(reloadTab, 3000);
            }
        });
    }
    
    function resizeTable(){
        var tab_height = left_tab.offsetHeight;
        var $_table = $_report_div.getElementsByTagName('table');
        if($_table.length > 0){
            var table_height = $_table[0].offsetHeight;
            if(table_height < tab_height){
                $_report_div.style.height = tab_height - 5 + "px";
            }else{
                $_report_div.style.height = 'auto';
            }
        }
    }
    resizeTable();
})()
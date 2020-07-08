define(function(){
    var scope = this, $$ = bowlder;
    var state = scope.state = {};
    var apiPromise;
    var cls = {
        compactlist: "net-compact-newslist",
        compactitem: "net-compact-newsitem"
    }
    scope.navList = [{title:"文章列表"}];
    function getPromise(){
        if(!apiPromise){
            if(state.api == 'yuetu'){
                apiPromise = $$.ajax.require("http://news.163.com/special/00014Q2B/ntes_yuetu_data_test.js",{ //yuetu_channel_data
                    headers : {charset:'gbk'}
                }).then(function(){
                    var yuetu_channel_data = window.yuetu_channel_data;
                    if(!yuetu_channel_data) return; // || !window.yuetu_pc_data
                    $$.each(scope.navList, function(nav){
                        var arr = yuetu_channel_data[nav.id] ? yuetu_channel_data[nav.id].rank : []; //yuetu_pc_data ? yuetu_pc_data[nav.id].sets : 
                        $$.each(arr, function(item){
                            item.title = item.title || item.setname;
                            item.url = item.url || item.seturl;
                            if(item.commentcount) item.tip = '<b>' + item.commentcount + '</b>跟贴';
                            if(item.img || item.cover) item.img = $$.getThumbUrl(item.img || item.cover, 150);

                        });
                        scope.bodyList.push(arr);
                    });
                });
            }else if(state.api == 'open'){
                window.opentj = function(json){
                    var result = [];
                    $$.each(json.result, function(item){
                        if(item.iteminfo){
                            result.push({
                                url: item.iteminfo.url,
                                img: item.iteminfo.imgurl,
                                title: item.iteminfo.title
                            });
                        }
                    });
                    scope.bodyList.push(result);
                }
                apiPromise = $$.ajax.require("http://c.open.163.com/opensg/opensgm.do?count=5&callback=opentj&uuid="+$$.cookie.get("__oc_uuid")+"&pid="+state.pid+"&mid="+state.mid,{
                    headers : {charset:'utf-8'}
                });
            }else if(state.api == 'opensp'){
                window.opensp = function(json){
                    var result = [];
                    $$.each(json.list, function(item){
                        if(item.url){
                            result.push({
                                url: item.url,
                                img: item.picUrl,
                                title: item.name,
                                note: item.desc
                            });
                        }
                    });
                    scope.bodyList.push(result);
                }
                apiPromise = $$.ajax.require("http://c.open.163.com/open/specials.do?callback=opensp&t="+(state.type||"")+"&p=1&ps=10",{
                    headers : {charset:'utf-8'}
                });
            }else if(state.api == 'openls'){
                window.openls = function(json){
                    var result = [];
                    $$.each(json.list, function(item){
                        if(item.url){
                            result.push({
                                url: item.url,
                                img: item.picUrl,
                                title: item.title,
                                note: item.abstracts
                            });
                        }
                    });
                    scope.bodyList.push(result);
                }
                apiPromise = $$.ajax.require("http://c.open.163.com/pack/unitList.do?callback=openls&cate="+(state.cate||"")+"&p=1",{
                    headers : {charset:'utf-8'}
                });
            }else if(state.api == 'jnews'){
                window.xwtjpr = function(arr){
                    $$.each(arr, function(item){
                        item.url = item.url || item.link.replace(/docs\/(\d+)\/\d+\/(\w+)\.html/, '#detail/$1/$2');
                    });
                    scope.bodyList.push(arr);
                }
                apiPromise = $$.ajax.require("http://j.news.163.com/hy/demorecdocapi.s?limit=10&callback=xwtjpr",{
                    headers : {charset:'utf-8'}
                });
            }else if(/^http/.test(state.api)){
                if(/\/$/.test(state.api)){ //ajax html
                    var url = state.api;
                    if(url.indexOf(location.host) == -1) url = "/system/tools/node/get.js.node?charset=gbk&url=" + url;
                    apiPromise = $$.ajax.get(url, {
                        headers : {charset:'gbk'}
                    }).success(function(html){
                        var div = document.createElement("div");
                        div.innerHTML = html;
                        var arr = [];
                        var maxStrLen = window.innerWidth >= 400 ? 35 : 26;
                        $$("li", div).each(function(node){
                            var h3a = $$("h3>a", node)[0];
                            if(h3a){
                                var item = {
                                    url: h3a.getAttribute("href"),
                                    title: h3a.innerHTML.replace(/<.*?>/g, '')
                                }
                                var img = $$("a>img", node)[0];
                                if(img) item.img = img.getAttribute("src");
                                var note = node.querySelector("p");
                                if(note) item.note = note.innerHTML.replace(/<.*?>/g, '').trim();
                                if(item.note.length > maxStrLen) item.note = item.note.replace(/&nbsp;/g, ' ').substr(0,maxStrLen) + '..';
                                arr.push(item);
                            }
                        });
                        scope.bodyList.push(arr);
                    });
                }else{
                    apiPromise = $$.ajax.require(state.api, {
                        headers : {charset:'gbk'}
                    }).then(function(json){
                        var arr = window.newsList || [];
                        var maxStrLen = window.innerWidth >= 400 ? 35 : 26;
                        $$.each(arr, function(item){
                            item.url = item.url || item.link;
                            item.img = item.img || item.pic;
                            item.note = item.note || item.digest;
                            if(item.note.length > maxStrLen){
                                item.note = item.note.replace(/&nbsp;/g, ' ').substr(0,maxStrLen) + '..';
                            }
                            if($$.isDefined(item.count)){
                                item.tip = '<b>'+item.count+'</b>跟贴';
                            }
                        });          
                        scope.bodyList.push(arr);
                    });
                }
            }
        }
        return apiPromise;
    }
    function setList(i){
        if(state.api && getPromise !== true){
            scope.bodyList = [];
            getPromise().then(function(){
                getPromise = true;
                setList(i);
            });
            return;
        }
        scope.list = scope.bodyList[i];
        if(!window.cacheMoreData && scope.list[0] && scope.list[0].apiurl){
            //加载更多图集列表
            window.cacheMoreData = function(arr){
                window.cacheMoreData = null;
                $$.each(arr, function(item){
                    item.title = item.title || item.setname;
                    item.url = item.seturl || item.url;
                    if(item.replynum){
                        item.tip = '<b>' + item.replynum + '</b>跟贴';
                    }
                    if(item.cover){
                        item.img = $$.getThumbUrl(item.cover, 150);
                    }
                });
                scope.list = scope.bodyList[i] = arr;
                scope.$refresh();
            }
            $$.ajax.require(scope.list[0].apiurl);
            scope.list[0].apiurl = null;
        }
        scope.compactCls = "";
        $$.each(scope.list, function(item){
            if(item.cell){
                scope.compactCls = "net-table ";
            }
            item.compactCls = !item.img && !item.note && !item.tip ? cls.compactitem : '';
        });
        scope.$refresh();
        
        scope.$root.find(".intabs").each(function(ul){
            var activeCls = "incurrent";
            var parent = ul.parentNode;
            var $navs = $$(">li", ul);
            var $bodys = $$(".inpanel", parent);
            if($navs.length == $bodys.length){
                $navs.each(function(li, i){
                    var $li = $$(li);
                    $li.bind("click", function(){
                        $navs.removeClass(activeCls);
                        $bodys.removeClass(activeCls);
                        $li.addClass(activeCls);
                        $bodys.eq(i).addClass(activeCls);
                        return false;
                    });
                });
            }
        });
    }
    scope.init = function(widget){
        var initIdx = 0;
        if(state.api == 'yuetu'){
            scope.navList = [
                {id:"0001",title:"新闻"},
                {id:"0005",title:"体育",key:"sports"},
                {id:"0003",title:"娱乐",key:"ent"},
                {id:"0026",title:"女人",key:"lady"},
                {id:"0008",title:"汽车",key:"auto"},
                {id:"0025",title:"财经",key:"money"},
                {id:"0006",title:"旅游",key:"travel"},
                {id:"0011",title:"手机",key:"mobile"}
                /*,
                 {id:"nature",title:"自然"},
                 {id:"food",title:"美食"},
                 {id:"home",title:"家居"}*/
            ];
        }else if(state.api == 'jnews'){
            scope.navList = [
                {title:"新闻推荐"}
            ];
        }else if(state.api == 'open'){
            scope.navList = [
                {title:"相关推荐"}
            ];
        }else if(state.api == 'openls'){
            scope.navList = [
                {title:"最近更新"}
            ];
        }else if(state.api == 'opensp'){
            scope.navList = [
                {title:"全部专题"}
            ];
        }
        var hash = location.hash.replace(/#/, '');
        $$.each(scope.navList, function(item, i){
            if(item.id == hash || item.key == hash) initIdx = i;
        });
        var navWidget = widget.children[0];
        if(navWidget){
            navWidget.ready(function(){
                var navScope = navWidget.scope;
                navScope.callback = function(i){
                    setList(i);
                }
                navScope.state.set(initIdx);
            });
        }
    };
})

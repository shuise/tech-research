define(function(){
    var scope = this, $$ = bowlder;
    var state = scope.state = {};
    var cls = {
        loading: "net-newslist-loading"
    };
    scope.init = function(widget){
        var navWidget = widget.children[0];
        var newsWidget = $$.widget("#" + state.newsid);
        var list = scope.list, channel = state.channel;
        var prefixs = {
            travel: "tridx2014api",
            edu: "edu2014api",
            daxue: "dxhtmlapi"
        };
        navWidget.ready(function(){
            var navScope = navWidget.scope;
            var url_base = "http://" + channel + ".163.com/special/" + (state.prefix || prefixs[channel] + "_");
            navScope.callback = function(i){
                if(state.tabcursor === i) return;
                state.tabcursor = i;
                var url = url_base + (list[i].key || "data") + "/";
                if(url.indexOf(location.host) == -1) url = "/system/tools/node/get.js.node?charset=gbk&url=" + url;
                var loadingTime = +new Date;
                newsWidget.ready(function(){
                    newsWidget.$root.addClass(cls.loading);
                });
                $$.ajax.get(url, {
                    headers: {charset : 'gbk'}
                }).success(function(html){
                    newsWidget.ready(function(){
                        var newsScope = newsWidget.scope;
                        var div = document.createElement("div");
                        div.innerHTML = html;
                        newsScope.list = [];
                        var maxStrLen = window.innerWidth >= 400 ? 35 : 26;
                        $$(".news_one,.list-item,[class*=_list]>li,>li", div).each(function(node, i){
                            var h2a = node.querySelector("h2 a,h3 a") || node.querySelector("a") || node.querySelector("h2,h3") || node;
                            var joinNode = node.querySelector(".join_num,.joinnum,.commentCount");
                            var joinNum = joinNode ? '<b>'+joinNode.outerHTML+'</b>跟贴' : '';
                            var img = node.querySelector("img");
                            var title = h2a.innerHTML || h2a.getAttribute("title") || (img ? (img.getAttribute("alt") || img.getAttribute("title")) : "");
                            var url = h2a ? h2a.getAttribute("href") : "";
                            if(!url) url = "javascript:";
                            var noteNode = node.querySelector("p,.list-main a") || node.querySelector("h3");
                            var note = noteNode && h2a.parentNode != noteNode ? noteNode.innerHTML.replace(/<.*?>/g, '').trim() : '';
                            if(note.length > maxStrLen){
                                note = note.substr(0,maxStrLen) + '..';
                            }
                            if(title){
                                newsScope.list.push({
                                    tip: joinNum,
                                    img: img ? img.getAttribute("src"):'',
                                    title: title,
                                    url: url,
                                    note: note
                                });
                            }
                        });
                        var passTime = (+new Date) - loadingTime;
                        setTimeout(function(){
                            newsScope.$refresh();
                            newsWidget.$root.removeClass(cls.loading);
                        }, 500 - Math.min(500, passTime));
                    });
                });
            }
            if(state.init) navScope.callback(0);
        });
    };
})

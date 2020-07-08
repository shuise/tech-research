define("%body", function(){
    var scope = this, $$ = bowlder, roles;
    var navX = 0, _navX = 0, navSwipable = true, navDiffW, navSwiping;
    function navReset(){
        navSwiping = false;
        if(navX > 0){
            navX = 0;
        }else{
            if(navX < navDiffW){
                navX = navDiffW;
            }
        }
        var $parent = roles.nav.parent();
        $parent[navX === 0 ? "addClass":"removeClass"]("net-noprev")
        [navX == navDiffW ? "addClass":"removeClass"]("net-nonext");
        if(_navX != navX){
            _navX = navX;
            roles.nav.animate({
                translate3d: navX + 'px,0,0'
            }, 200, 'easeOut');
        }
    }
    scope.navPrev = function(){
        navX = _navX + 100;
        if(navX > 0){
            navX = Math.round(0.5*_navX + 0.5*navX);
        }
        _navX = navX;
        roles.nav.animate({
            translate3d: navX + 'px,0,0'
        }, Math.min(250), 'easeOut', navReset);
    }
    scope.navNext = function(){
        navX = _navX - 100;
        navDiffW = (window.innerWidth - 23) - roles.nav[0].offsetWidth;
        if(navX < navDiffW) navX = Math.round(0.5*_navX + 0.5*navX);
        _navX = navX;
        roles.nav.animate({
            translate3d: navX + 'px,0,0'
        }, Math.min(250), 'easeOut', navReset);
    }
    scope.navSwiping = function(){
        if(!navSwipable || navSwiping) return;
        var e = this.$event;
        var dx = e.dx, dy = e.dy;
        var isUp = e.speedX || e.speedY ? Math.abs(e.speedY) > Math.abs(e.speedX) : Math.abs(dy) > Math.abs(dx);
        if(Math.abs(dx) > 4 && !isUp){ //左右移动
            $$.freezeScroll = true;
            if(navX + dx > 0 || navX + dx < navDiffW) dx = dx/2;
            _navX = Math.round(navX + dx);
            roles.nav.css({
                translate3d: _navX + 'px,0,0'
            });
        }
    };
    scope.navSwipe = function(){
        if(!navSwipable || navSwiping) return;
        navSwiping = true;
        var e = this.$event;
        var dx = e.dx, dy = e.dy;
        var during = 200;
        var speed = e.speedX/Math.abs(e.speedX) * Math.min(Math.abs(e.speedX), 5000);
        navDiffW = (window.innerWidth - 23) - roles.nav[0].offsetWidth;
        navX = _navX + speed/16;
        during += Math.abs(speed/8);
        if(navX > 0 || navX < navDiffW){
            navX = _navX*0.8+navX*0.2;
            during -= Math.abs(speed/16);
        }
        _navX = navX;
        roles.nav.animate({
            translate3d: navX + 'px,0,0'
        }, Math.min(during, 800), 'easeOut', navReset);
    };
    scope.init = function(widget){
        var $body = $$("body");
        var cls = {
            fixed: "net-fixed"
        }
        roles = widget.roles;
        
        var $toggle = roles["toggle"];
        if($toggle){
            $toggle.each(function(node){
                var parent = node.parentNode, oht = parent.offsetHeight - 6, _ht = oht;
                var div = $$(">div", parent)[0];
                if(div){
                    var $parent = $$(parent);
                    $$(node).bind("tap", function(){
                        $parent.toggleClass("m-active");
                        $parent.css({height: _ht});
                        _ht = oht == _ht ? oht + div.offsetHeight : oht;
                        $parent.animate({
                            height: _ht
                        }, 500, 'easeIn');
                    });
                }
            });
        }
        //导航条
        if(roles.nav){
            navDiffW = (window.innerWidth - 23) - roles.nav[0].offsetWidth;
            if(navDiffW > 0){
                navSwipable = false;
                roles.nav.parent().addClass("net-nonext");
            }else{
                var $active = roles.nav.find(".m-active");
                if($active[0]){
                    navX = Math.min(0, Math.round(window.innerWidth/2 - $active[0].offsetLeft));
                    roles.nav.animate({
                        translate3d: navX + 'px,0,0'
                    }, 200, 'easeOut', navReset);
                }
            }
        }
        var isfixed = false, headerHt = 48;
        var footer = $$("footer")[0], scrollFreeze = false;
        var bd = $$(".net-bd")[0];
        function winScroll(){
            if($body.css("position") == 'fixed') return;
            var sTop = document.body.scrollTop || document.documentElement.scrollTop;
            var wHt = document.documentElement.clientHeight || window.innerHeight;
            if(!isfixed && sTop >= headerHt){
                isfixed = true;
                $body.addClass(cls.fixed);
            }else if(isfixed && sTop < headerHt){
                isfixed = false;
                $body.removeClass(cls.fixed);
            }
            if(!scrollFreeze && $$.lazys.length && sTop + wHt > footer.offsetTop - 50){
                scrollFreeze = true;
                var div = document.createElement("div");
                div.innerHTML = $$.lazys.shift();
                $$.rootWidget.compile(div);
                var fragment = document.createDocumentFragment(), firstN = div.firstChild;
                while(firstN){
                    fragment.appendChild(firstN);
                    firstN = div.firstChild;
                }
                bd.appendChild(fragment);
                setTimeout(function(){
                    scrollFreeze = false;
                    winScroll();
                }, 400);
            }
        }
        $$(window).bind("scroll", winScroll);
        setTimeout(winScroll, 400);
    }
});
(function(){
    var ua = navigator.userAgent.toLowerCase(), $$ = bowlder;
    var attrPrefix = "x-";
    var host = "";
    var moduleid = 1, plainnum = 0;
    var device = {
        phone: /android|ipod|blackberry|bb\d+|mobile|phone/.test(ua),
        openCourse: /opencourse|vopen/.test(ua)
    };
    var heads = [], htmls = [], foots = [], doms = {};
    var blocks = $$.lazys = [];
    var datas = {}, scriptPromises = [], scripts = [], styles = [];
    var channelMap = {"旅游":"travel", "公开":"open", "科技":"tech", "美食":"travel", "户外":"travel", "娱乐":"ent", "体育":"sports", "财经":"money", "游戏":"game", "家居":"home", "手机":"mobile", "新闻":"news", "公益":"gongyi", "时尚":"fashion", "艺术":"art", "女人":"lady", "订阅":"dy", "亲子":"baby", "汽车":"auto", "酒香":"jiu", "君子":"men", "房产":"house", "博客":"blog", "视频":"v", "教育":"edu", "校园":"daxue", "中小":"edu", "健康":"jiankang", "数码":"digi", "智能":"digi", "收藏":"shoucang"};
    var channel = channelMap[document.title.replace(/.*?网易(..).*/, "$1")];
    var getThumbUrl = $$.getThumbUrl = function(url, width, height) {
        width = width || 10000;
        height = height || 10000;
        if (!/imgsize|ph.126.net/.test(url) && url.indexOf("http://") === 0 && /\.(jpg|png)/i.test(url)) {
            var cimgReg = /^(http:\/\/s\.cimg\.163\.com.*?)\d+x\d+\.auto\.jpg/;
            if (cimgReg.test(url)) {
                url = url.replace(cimgReg, '$1');
            } else {
                url = 'http://s.cimg.163.com/i/' + encodeURIComponent(url.replace(/http:\/\//, '')) + '.';
            }
            url += width + 'x' + height + '.auto.jpg';
        }
        return url;
    }
    if(!channel && /([A-z]+?)\.163.com/.test(location.host)){
        channel = RegExp.$1;
        var existChannel;
        for(var cid in channelMap){
            if(channelMap[cid] == channel) existChannel = true;
        }
        if(!existChannel) channel = "";
    }
    if(!channel) channel = "news";

    var $appWrap, videoid;
    function initOpenapp(param){
        var _width=document.documentElement.scrollWidth;
        var mid_pid=/([A-Z0-9]{9})_([A-Z0-9]{9})/;
        var _matched=location.href.match(mid_pid);
        if(_matched && _matched[1] && _matched[2]){
            var plid=_matched[1];
            var mid=_matched[2];
            function getFrom(){
                var ua=navigator.userAgent;
                var isAndroid = /android|adr/i.test(ua) && !(/windows phone/i.test(ua));
                var isIOS = !isAndroid && /iphone|ipad|ios/i.test(ua);
                var isWeixin = /micromessenger/i.test(ua);
                var isWeibo =  /weibo/i.test(ua);
                var isQQbrowser = /mqqbrowser/i.test(ua);
                var isUCbrowser = /ucbrowser/i.test(ua);
                var platform,place;
                if(isAndroid){
                    platform= /mobile/i.test(ua)?'androidMobile':'androidPad';
                }else if(isIOS){
                    platform= /iphone/i.test(ua)?'iphone':/ipad/i.test(ua)?'ipad':'iosOther';
                }else{
                    platform='other';
                }
                if(isWeixin){
                    place='weixin';
                }else if(isWeibo){
                    place='weibo';
                }else if(isQQbrowser){
                    place='qqBrowser';
                }else if(isUCbrowser){
                    place='ucBrowser';
                }else{
                    place='other';
                }
                return platform+'_'+place;
            }
            var appHref='http://openapi.ws.netease.com/applinks/videoDetail?plid='+plid+'&mid='+mid+'&ua='+getFrom()+'&url='+encodeURIComponent(location.href)+'&callType=video_adapt_bottom';
            var $appdownFooterWrap=$$('<div class="appdown-header" style="position:fixed;bottom:0;left:0;width:100%;z-index:100"><img style="width:100%;display:block;" src="http://open-image.nosdn.127.net/e4cc42c6d00d40729cb3ece0a704f9ff.png"/><a id="j-appOpen" href="'+appHref+'" style="position: absolute;right: 0;top: 0;width: 150px;height: 100%;"></a></div>');
            document.body.appendChild($appdownFooterWrap[0]);
            document.body.style.marginBottom=_width/750*119+'px';
        }
    }
    function initNewsapp(param){
        if(/open\.163/.test(location.host) || $appWrap) return;
        $appWrap = $$('<div class="newsapp-wrap"><div class="newsapp-fix"><span class="newsapp-close"></span></div></div>');
        document.body.appendChild($appWrap[0]);
        var activeCls = "newsapp-active";
        setTimeout(function(){
            $appWrap.addClass(activeCls);
        }, 3000);
        $appWrap.bind("click", function(e){
            if(e.target.className && /close/.test(e.target.className)){
                $appWrap.removeClass(activeCls);
            }else{
                location.href = 'http://m.163.com/newsapp/applinks.html?' + param;
            }
        });
    }
    function safePush(html){
        htmls.push(html);
        if(htmls.length > 5){
            blocks.push(utils.enable(htmls.join("")));
            htmls = [];
        }
    }
    var tmpdiv = document.createElement("div");
    var tagLC = function(node) {return node && node.nodeName ? node.nodeName.toLowerCase() : "";};
    var blockReg = /comment-box|endpage|con2|conimg|col_?[lmr]{1,2}|nav|bankuai|wrap|sect|area|grid|intro|x_scroll|_body|_top|-list|-pic|rank|attitude|history|bd_main|summary|^content|-box|slidebox/i;
    var atomReg = /mainslideData|botnav|wbPic|fn_layout_\d|artNews|titleBar|toplink|nav-con|slugline|picShow|slide-body|tab |js[\-_](scroll|list|tabcge)|lst_img|page_middle_main|top_photo|mod-tab|tabs_|tab-main|tab-area|_tab|[\-_]item|nph_|-nav|tag|yugao_|channel_nav|area-half|side_mod|panels|focus|guest|ui-slide|news_main|pos-rel|area_.*?_channel|^(menu|channel|ul|topic|tabs)$|_li$|fr .*?\d+$|previous_contents/;//review|
    var ignoreLinkReg = /btn_|ctrl|share|weibo|icon|avatar|logo|close|nph|f_left|f_right/i;
    var invalidImgReg = /wrating|ctrl|(btn|_left|_right|shadow|blank|border|_bg_|loading|plus|prev|next)[^\s"']*?\.(gif|jpg|png)|logo\.gif|share|cookie|weibo|-dig-/;
    var skipReg = /nav_channel_s |pdfind|passport_entry|sc-row sc-top|top_search|icon_wrapper|v-marquee |area_top_tab|flag_weekend|flag_country|tridx_channel_main|user_stock_info|calendar|popsel|matchnav|share|weibo|ntes_nav_|ntes-nav$|ntes-domain|v-top|N-nav-|footerbg|gg-|topnav|mod_.*?_channel|area.*?hidden($| )|search|jiathis|END_nav_|mod_vote/i;
    var linkpicReg = /expert|tab_new|interviews|tea_list|test_banner|author/i;
    var medpicReg = /flag_coo_con|cell|mainlist|lst_img/i;
    var addModule = {
        photoset: function(list, title){
            if(!list || !list.length) return;
            if(!schema.hasPopH1 && !htmls.length && heads[heads.length-1] == "</h1></div>"){  //去掉h1标题
                heads.pop();
                heads.pop();
            }
            var html = title ? '<h2>'+title+'</h2>' : '';
            if(list.length == 1){
                html += $$.template.replace('<div class="net-block"><a href="{{url}}"><img src="{{img}}" /></a><div class="picinfo-text-wrap"><div class="picinfo-text"><a href="{{url}}">{{note}}</a></div></div></div>', list[0]);
            }else{
                var prefix = "pics" + (moduleid++);
                datas[prefix] = {list: list};
                list.forEach(function(item,i){item.id = prefix+'_'+i});
                html += '<div class="photoset" ne-module="/modules/photoset/photoset2.js" ne-extend="%'+prefix+'" ne-state="nohash:1;slide:shift;autofit:1;noLoop:1"><div class="ne-photoset">\
      <div class="photoarea" ne-role="wrap photoarea" ne-swipe="photoSwipe()" ne-swiping="photoSwiping()">\
        <div class="photo-wrap" ne-repeat="photo in curList"><a class="photo-wrap-inner" ne-href="{{photo.url}}"><img ne-src="{{photo.img}}" /></a></div>\
      </div>\
      <div class="picinfo clearfix" ne-role="picinfo" style="visibility:hidden">\
        <div class="progress" ne-role="progress">\
          <div class="numerator">{!{state.cursor+1 || 1}}</div>\
          <div class="denominator">{{list.length || 1}}</div>\
        </div>\
        <div class="picinfo-text-wrap">\
          <div class="picinfo-text" ne-html="list[state.cursor].note"></div>\
        </div></div>\
      </div></div>';
            }
            (schema.pushHead ? heads : htmls).push(html);
        },
        taglist: function(list, pushHead){
            var prefix = "tag" + (moduleid++);
            datas[prefix] = {list: list};
            (pushHead ? heads : htmls).push('<div class="net-taglist clearfix" ne-module="" ne-extend="%'+prefix+'"><a ne-repeat="list" href="{{url}}">{!{title}}</a></div>');
        },
        newslist: function(list, compact, quiet){
            $$.each(list, function(item){
                item.compactCls = !item.img && !item.note && !item.tip ? 'net-compact-newsitem' : '';        
            });
            if(!quiet && htmls[htmls.length-1] && htmls[htmls.length-1].indexOf('<div class="net-newslist-wrap') === 0){
                var oData = datas["news" + (moduleid-1)];
                if(oData){
                    if(oData.list.length < 60){
                        oData.list = oData.list.concat(list);
                    }
                    return;
                }
            }
            var prefix = "news" + (moduleid++);
            datas[prefix] = {
                list: list
            };
            var html = '<div class="net-newslist-wrap" ne-module="/modules/hotnews/list.phone.html" ne-extend="%'+prefix+'" ne-id="'+prefix+'"></div>';
            if(quiet) return html;
            safePush(html);
        },
        cols2: function(list, cls){
            if(htmls[htmls.length-1] && htmls[htmls.length-1].indexOf('/list/cols2.html') != -1){
                var oData = datas["cols" + (moduleid-1)];
                if(oData){
                    oData.list = oData.list.concat(list);
                    return;
                }
            }
            var prefix = "cols" + (moduleid++);
            datas[prefix] = {list: list};
            safePush('<div class="net-block '+(cls||"")+'" ne-module="/system/touchall/modules/list/cols2.html" ne-extend="%'+prefix+'" ne-id="'+prefix+'"></div>');
        },
        tie: function(tieInfo){
            var states = [];
            for(var key in tieInfo) states.push(key+':'+tieInfo[key]);
            foots.push('<div class="net-block" ne-module="/modules/ne2015/tie/tie.js" ne-props="skin:touch" ne-state="'+states.join(";")+'" ne-transclude="1"><div class="net-tie-button" ne-tap="openTie()" ne-role="count">查看跟贴 <span class="net-tie-count">({{state.count}})</span></div></div>');
        },
        video: function(mp4, poster){
            poster = poster ? 'poster="'+poster+'"' : '';
            safePush('<div class="net-video"><video width="100%" controls="controls" x-webkit-airplay="allow" src="'+mp4+'" '+poster+'>您的浏览器暂时无法播放此视频.</video></div>');
        }
    }
    var findOne = function(q, context){
        var wrap = (/[\+~]/.test(q) ? context.parentNode : context);
        if(!wrap) return null;
        q = q.replace(/(^\s*|,\s*)/g, '$1#__touchall__ ');
        var _id = context.id;
        context.id = '__touchall__';
        var node = wrap.querySelector(q);
        if(context) _id ? (context.id = _id) : context.removeAttribute("id");
        return node;
    }
    var $ = function(q, fn, context){
        if(!context) return [];
        q = q.replace(/(^\s*|,\s*)/g, '$1#__touchall__ ');
        var _id = context.id;
        context.id = '__touchall__';
        var nodes = context.querySelectorAll(q);
        if(context) _id ? (context.id = _id) : context.removeAttribute("id");
        if($$.isFunction(fn)) $$.each(nodes, fn);
        return nodes;
    };
    var trim = function(s, alt){
        if(alt) s = s.replace(/<img[^>]*?alt="([^"]+)".*?>/i, "$1");
        return s?s.replace(/onclick=".*?"/g, '').replace(/<.*?>/g, '').trim():"";
    }
    var wraps = [],    //相对独立的内容块
        cache4next = [], //可能属于下一内容块的headers，只用于detectMain
        listWraps = []
    var schema = { //html解析方案
        getWraps: function(root, level){ //遍历body前四级结构，返回能处理的容器
            if(!level) level = 1;
            var skiphtml;
            if($$.isString(skiphtml = schema.skipBlock(root))){
                if(skiphtml) wraps.push(skiphtml);
                return 0;
            }
            var rootIsBlock = schema.isBlock(root);
            var incnum = 0;
            if(level < 3){
                $(">textarea", function(node){//主图集
                    if(schema.procGalleryData(node)){
                        incnum ++;
                    }
                }, root);
            }
            var nodes = $(">div,>section,>main,>header,>footer,>table,>h1:not(.hidden),>h2,>h3,>dl,>ul,>ol,>p,>img,>a>img", null, root);
            if(level <= 4 && nodes.length) {
                if(nodes.length == 1 && /^h\d/.test(tagLC(nodes[0]))) return 0;
                var len = wraps.length + nodes.length;
                utils.each.call(nodes, function(node){
                    var tag = tagLC(node);
                    if(/div|section|header|main|footer/.test(tag)){
                        if($$.isString(skiphtml = schema.skipBlock(node))){
                            if(skiphtml){
                                incnum ++;
                                wraps.push(skiphtml);
                            }
                            return;
                        }else if(schema.isAtom(node, level)){// || (len > 15 && schema.isBlock(node)),>[class*=focus]
                            incnum ++;
                            wraps.push(node);
                        }else{
                            incnum += schema.getWraps(node, level+1);
                        }
                    }else{ //直接添加table,h1,h2,ul,p,a
                        if($$.isString(skiphtml = schema.skipBlock(node))){
                            if(skiphtml){
                                incnum ++;
                                wraps.push(skiphtml);
                            }
                        }else{
                            incnum ++;
                            wraps.push(node);
                        }
                    }
                });
            }
            if(incnum === 0 && rootIsBlock){
                wraps.push(root);
                incnum ++;
            }
            return incnum;
        },
        wander: function(wraps, init){ //处理流程
            if(wraps.nodeType) wraps = [wraps];
            utils.each.call(wraps, function(wrap){
                schema.pushHead = false;
                if($$.isString(wrap)){
                    safePush(wrap);
                    return;
                }
                var _counter = moduleid + plainnum;
                var cls = wrap.className, tagName = tagLC(wrap);
                if(wrap.id == 'j-mainslide-data'){
                    schema.detectSlideData($("p", null, wrap));
                    utils.remove(wrap);
                    return;
                }
                if(channel=='open' && cls=='u-ptl-c f-c6'){
                    window.NTES_SHARE_INFO=window.NTES_SHARE_INFO||{};
                    var coverImgNode=wrap.querySelector('img');
                    if(coverImgNode){
                        var coverImg=coverImgNode.getAttribute('x-src');
                        if(schema.smallImg){
                            coverImg=schema.smallImg;
                        }else{
                            if(/imgsize|ph.126.net/.test(coverImg)){
                                coverImg=coverImg.replace(/\d+x\d+x\d+x\d+/,'300x300x1x95');
                            }else{
                                coverImg='http://imgsize.ph.126.net/?enlarge=true&imgurl='+coverImg+'_300x300x1x95.jpg';
                            }
                        }
                        $$("body").insertBefore($$.dom.create('<img style="display:none;" src="'+coverImg+'" />'));
                        window.NTES_SHARE_INFO.pic=coverImg;
                    }
                    var titleNode=wrap.querySelector('h3');
                    if(schema.openMovieTitle){
                        window.NTES_SHARE_INFO.title=schema.openMovieTitle;
                    }else{
                        if(titleNode){
                            var title=titleNode.innerHTML;
                            window.NTES_SHARE_INFO.title=title;
                        }
                    }
                    var descrs=/\u7b80\u4ecb\uff1a<\/span>([\S\s]+)<\/p>/g.exec(wrap.innerHTML)
                    if(bowlder.isArray(descrs) && descrs[1]){
                        var descr=descrs[1];
                        window.NTES_SHARE_INFO.summary=descr;
                    }
                }
                if(/wbPic/.test(cls)){
                    schema.detectLinks([wrap]);
                    utils.remove(wrap);
                    return;
                }
                if(/_itm|wbPic/.test(cls)){
                    listWraps.push(wrap);
                    return;
                }
                if(listWraps.length){
                    schema.detectLinks(listWraps);
                    listWraps = [];
                }
                if(!blocks.length && schema.detectNav(wrap) && (wraps.length > 3 || !wrap.parentNode)){
                    return;
                }
                if(/^(h\d|p)$/.test(tagName)){
                    schema.pushHead = !blocks.length && !schema.hasH1 && tagName == 'h1';
                    schema.copyHTML(wrap, tagName == 'p');
                    schema.pushHead = false;
                    return;
                }
                if(wrap.children.length === 0){
                    if(trim(wrap.innerHTML).length > 50 || tagName == 'img'){
                        schema.copyHTML(wrap, true);
                    }
                    return;
                }
                if(tagName == 'table'){
                    schema.procTable(wrap);
                    return;
                }
                if(channel == 'v'){
                    if(schema.detectVFocus(wrap)) return;
                }
                if(tagName == 'ul' && /imgText|imgTxt/.test(cls)){
                    schema.detectLinks($(">li", null, wrap));
                    return;
                }
                if(/(image-text|test_banner|imgTxt|imgText2r)($| )/.test(cls)){
                    schema.detectLinks([wrap]);
                    return;
                }
                //头条文字新闻
                if(!schema.hasTop){
                    if(/top[\-_]?news/.test(cls) && schema.copyHTML(wrap)){
                        return;
                    }
                    var topnews = $("[class*=_topnews],[class*=top_news],.day_news,.headlines", null, wrap);
                    if(!topnews.length) topnews = $("[class*=topnews_],.mod_bd>.lst_tx_a,.top_con,.area>.grid-u-9>h2,.area>.grid-u-9>p", null, wrap);
                    if(topnews.length){
                        $$.each(topnews, function(node){
                            if(node.querySelector("a")){
                                schema.copyHTML(node);
                            }
                        });
                        schema.hasTop = topnews.length;
                    }
                }
                
                var detected = false;
                if(!schema.hasFocus && !/ep-content|_content|g-mnc/.test(cls)){
                    schema.detectTitle(wrap);
                    detected = true;
                }
                
                var wrapIsAtom = schema.isAtom(wrap), wanderedNodes = [];
                var wrapIsBlock = schema.isBlock(wrap);
                var skiphtml;
                if(!wrapIsAtom){
                    var aLinks = [];
                    $(">h2,>h3,>h4,>h5,>p,>img,>a,>div,>table,>ul,>ol,>dl", function(node){
                        var tag = tagLC(node);
                        if(tag == 'a'){
                            var href = node.getAttribute("href");
                            if(href && !/\/(g|caipiao).163.com|^javascript:/.test(href)){
                                aLinks.push(node);
                            }
                        }else{
                            if(aLinks.length){
                                schema.procDirectA(aLinks);
                                aLinks = [];
                            }
                            if(/^h\d$/.test(tag)){
                                schema.copyHTML(node);
                            }else if(tag == 'p' || tag == 'img'){
                                schema.copyHTML(node, true);
                            }else if(tag == 'ul' && !node.className && !node.querySelector("p,img,em")){
                                if(node.children[0] && trim(node.children[0].innerHTML).length > 6){
                                    schema.copyHTML(node, true);
                                }
                            }else if($$.isString(skiphtml = schema.skipBlock(node, -1))){
                                if(skiphtml) safePush(skiphtml);
                            }else{
                                if(/wgt-tab/.test(node.className)){ //国际新闻ajax列表
                                    var tmp = doms.bodyEl.innerHTML;
                                    if(/importJs\('([^'\s]+.js)/.test(tmp)){
                                        safePush('<div ne-state="api:'+RegExp.$1+'" ne-module="/system/touchall/modules/tabnav/maintabs.js"></div>');
                                        return;
                                    }
                                }
                                
                                if(schema.isAtom(node) || schema.isBlock(node)){
                                    schema.wander(node);
                                    wanderedNodes.push(node);
                                }else if(tag == 'table'){
                                    schema.procTable(node);
                                    wanderedNodes.push(node);
                                }
                            }
                        }
                    }, wrap);
                    if(aLinks.length){
                        schema.procDirectA(aLinks);
                    }
                }
                if(wanderedNodes.length){
                    utils.remove(wanderedNodes);
                }
                //头条焦点图
                var focus = $(".focImg, .top_focus .item,.focusPic .pic,.j-slideImg .pic,.slider-main-img,.focusContent,[class*=topfocus] li img,[class*=top_imgnews] img,.js_focus li,li.focus-normal,.top_link,.slide_list img", null, wrap);
                if(!focus.lenth && /focus/.test(cls)){
                    focus = $(".fh_panel", null, wrap);
                }
                if(!focus.length && blocks.length < 3 + (schema.hasTop || 0) && !schema.hasFocus){
                    var _tmp = /focus|slide-body/.test(wrap.className) ? wrap : wrap.querySelector(".focus_show,.focusPic,.mod_focus,.headslide");
                    if(_tmp){
                        focus = $(".focus-panel img,.focus_panel img,.ficnt>li img,.focus_body li img,.slides img,[class*=content] li img", null, _tmp);
                    }
                }
                if(focus.length){
                    schema.pushHead = !schema.hasFocus && blocks.length < 3 + (schema.hasTop || 0);
                    schema.detectCovers(focus, cls);
                    schema.pushHead = false;
                }
                
                if(!detected) schema.detectTitle(wrap);
                if(focus.length) schema.hasFocus = true;
                if(!wrapIsAtom && wanderedNodes.length === 0) schema.detectHxP(wrap);
                
                if(wrap.parentNode && (wrapIsBlock || wrapIsAtom)){  //wander.processing
                    if(/^lst_imgt/.test(cls)){
                        schema.detectCovers($(">ul>li", null, wrap), cls);
                    }
                    if(/tag/.test(cls)) {
                        schema.detectLinks(wrap.querySelectorAll("a"));
                        return;
                    }
                    if(/banner/i.test(cls)) {
                        schema[/nav/.test(cls) ? "detectLinks" : "detectCovers"](wrap.querySelectorAll("img"));
                        if(!/area/.test(cls)) return;
                    }
                    while(schema.detectMainTab(wrap)){}
                    $$.each(cache4next, function(node){
                        schema.copyHTML(node);
                    });
                    cache4next = [];
                    if(schema.detectAjaxTab(wrap)) return;
                    if(schema.detectSideTab(wrap)) return;
                    if(/contxt/i.test(cls)){
                        schema.copyHTML(wrap);
                        return;
                    }
                    schema.detectVideo(wrap); //视频
                    //封面或图集(中、大图片)
                    schema.detectCovers($(".scroll_cell,.djlm_item,.focus_panel,.mod_slide_focus .panel,.focus,.cell,.v-slider-item,.head-title-img-box", null, wrap), cls, true);
                    schema.detectCovers($(".head-slide .photos,#photo-focus a,.lst_imgtx_b li,>.bigpic,.slide-Text-img", null, wrap), cls);
                    //新闻列表
                    schema.detectLinks(wrap.querySelectorAll(".previous_topic,.v-dot,.go_list>ul>li>a,.recommend_keywords a,[class$=_lst]>ul>li,.round_img"));//.v-playimg
                    schema.detectLinks(wrap.querySelectorAll(".today_box,li[class*=article],.news_one,.rankItem,.news-item,.list-news,[class*=list-item],.userwrap>[class^=user],.hot_list_item,.bigList li,[class*=newslist]>li,.newsList>li,.rankTabPanel>li,[class*=news_list]>li,.video-list>li,.style_item,li[class*=list_item],li[class*=word_item],[class$=atest_item],[class*=list]>dl,.pictext_box"));
                    if(!/day_list/.test(cls)){
                        $(".mod_hot_bbs,.match_trailer,.mod_bbs_active,.mod_blog,[class^=con_],[class^=conimg_],[class^=links_],[class^=link_],.brand_list,.page_bar", schema.copyHTML, wrap); //原封不动复制
                    }
                    schema.detectGallery(wrap); //图集
                    //封面或图集(中、大图片)
                    var nodes = wrap.querySelectorAll(".pic_wrap,.pic_link,.pic_box,.img_box,dd>a>img,.metro-link,.panels .panel li,[class*=slider-list] li,.pos-rel>.left,.pos-rel>.right");
                    if(!nodes.length) nodes = wrap.querySelectorAll(".p_bd .item, .panels .panel,.bd .photo,[class*=single-box],#trigger>li");
                    schema.detectCovers(nodes, cls);
                    schema.detectCovers(wrap.querySelectorAll(".slugline>.rec,li>a>img"), cls, true);
                    //tables
                    $("table", function(table){
                        schema.procTable(table);
                    }, wrap);
                    var tabHds = wrap.querySelectorAll(".tab-hd,.flag_tab");
                    if(tabHds.length == 1){
                        cache4next.push(tabHds[0]);
                        utils.remove(tabHds[0]);
                    }
                    if(!/\bstyle_item\b/.test(cls)){ //citystyle
                        var links = wrap.querySelectorAll("li>a,li>span>a");
                        if(!links.length) links = wrap.querySelectorAll("h3>a,li>img");
                        if(!links.length) links = wrap.querySelectorAll("a>img,a>div>img,dt>img");
                        if(links.length){ //双列封面或普通链接
                            schema.detectCovers(links, cls, !/main|focus/.test(cls));
                        }
                    }
                    if(!wrap.parentNode) return; //detectCovers可能已移除wrap
                    //收集剩余的>ul, >img, p
                    if(tagLC(wrap) == 'ul' && /grade/.test(wrap.parentNode.className)){ //citystyle.html
                        schema.copyHTML(wrap, true);
                        return;
                    }
                    var collects = 0;
                    collects += $(">ul,ul[class*=info],>h2,>h3,>h4,>h5,>p,>img,a>img,a>div>img", function(node){
                        if(ignoreLinkReg.test(node.className)) return;
                        var tag = tagLC(node);
                        if(tag == 'img'){
                            if(tagLC(node.parentNode) == 'a') node = node.parentNode;
                            if(tagLC(node.parentNode.parentNode) == 'a') node = node.parentNode.parentNode;
                        }
                        if(tag == 'ul' && node.children && node.children.length){
                            if(node.querySelector("a,img") || trim(node.innerHTML) > 12){
                                schema.copyHTML(node);
                            }
                        }else if(tag != 'p' || trim(node.innerHTML).length > 5)
                            schema.copyHTML(node, true);
                    }, wrap).length;
                    collects += $("h2,h3,h4,h5,p,div>img,div[class$=info]", function(node){
                        if(ignoreLinkReg.test(node.className)) return;
                        var tag = tagLC(node);
                        if(tag == 'div' && node.querySelector("h2,h3,h4,h5,p,img")) return;
                        if(tag == 'img' && /auinfo/.test(node.parentNode.className)){
                            node = node.parentNode;
                        }
                        if(tag != 'p' || trim(node.innerHTML).length > 5)
                            schema.copyHTML(node, true);
                    }, wrap).length;
                    if(collects === 0){
                        $(".quote", function(node){
                            schema.copyHTML(node, true);
                        }, wrap);
                    }
                    
                    if(moduleid + plainnum - _counter < 2 && wrap.parentNode)
                        schema.postWander(wrap);
                }else if(tagLC(wrap) == 'ul'){
                    schema.copyHTML(wrap);
                }else{
                    schema.detectLinks(wrap.querySelectorAll("div>a,a>div>img,dt>img"));
                    $(">p,>a", function(node){
                        if(trim(node.innerHTML).length)
                            schema.copyHTML(node, true);
                    }, wrap);
                }
            });
        },
        postWander: function(wrap){ //避免页面空白
            var nodes = wrap.querySelectorAll("div>p>a");
            if(!nodes.length) nodes = wrap.querySelectorAll("div>p,li>p");
            if(!nodes.length) nodes = wrap.querySelectorAll(".quote");
            schema.detectLinks(nodes);
        },
        procDirectA: function(aLinks){
            if(aLinks.length > 2){
                schema.detectLinks(aLinks);
            }else{
                $$.each(aLinks, function(node){
                    schema.copyHTML(node, true);
                });
            }
        },
        skipBlock: function(wrap, level){ //完全舍弃该容器
            var tmp, id = wrap.id;
            if(id){
                if(id == 'j-player-bg'){
                    if(/getCurrentMovie ([\s\S]*?m3u8)/.test(doms.html)){
                        var mp4, poster,playInfo,smallImg,movieTitle,
                            m3u8Info = RegExp.$1;
                        if(/(http:\S+\.m3u8)/.test(m3u8Info)){
                            mp4 = RegExp.$1;
                        }
                        if(/image\s*:\s*'(http:.*?\.jpg)/.test(m3u8Info)){
                            poster = RegExp.$1;
                            poster = poster.replace(/['\+\s]/g, '');
                        }
                        movieTitle=m3u8Info.match(/title\s*:\s*['"]?([^'",]*)['"]?,/);
                        if(movieTitle && movieTitle[1]){
                            schema.openMovieTitle=movieTitle[1];
                        }
                        poster = poster ? 'poster="'+poster+'"' : '';
                        playInfo=doms.html.match(/getPlay\s*=\s*function\(\)\s*{\s*return\s*([^;]*);/);
                        if(playInfo && playInfo[1]){
                            smallImg=playInfo[1].match(/image\s*:\s*['"]?(\/[^']*)/);
                            if(smallImg && smallImg[1]) {
                                schema.smallImg = 'http://imgsize.ph.126.net/?enlarge=true&imgurl=http://vimg1.ws.126.net' + smallImg[1] + '.jpg_114x114x1x95.jpg';
                            }
                        }
                        if(mp4){
                            return '<video width="100%" controls="controls" x-webkit-airplay="allow" src="'+mp4.replace(/(\-list)?\.m3u8$/, '.mp4')+'" '+poster+'>您的浏览器暂时无法播放此视频</video>';
                        }
                    }
                }
                if(/share|js-ep-reletag|feedbackdialog|j-playlist-wrap/i.test(id)){
                    utils.remove(wrap);
                    return '';
                }
                if(/authorImg/.test(id)){
                    schema.detectLinks([wrap]);
                    return '';
                }
                if(/^(slides|tab\d+)$/.test(id)){
                    schema.detectCovers(wrap.children);
                    return '';
                }
                if(channel == 'open' && id == 'j-title'){
                    return '<div ne-state="api:openls" ne-module="/system/touchall/modules/tabnav/maintabs.js"></div>';
                }
                if(id == 'content' && wrap.children.length === 0){
                    if(/dataurl\s*=\s*"(.*?)"/.test(doms.html)){
                        return '<div ne-state="api:'+RegExp.$1+'/" ne-module="/system/touchall/modules/tabnav/maintabs.js"></div>';
                    }
                }
            }
            var cls = wrap.className;
            
            if(channel == 'open' && cls == 'u-ptl-tj'){
                utils.remove(wrap);
                var pid, mid;
                if(/name="playid" value="(\S+)"/.test(doms.html)){
                    pid = RegExp.$1;
                }
                if(/name="movieid" value="(\S+)"/.test(doms.html)){
                    mid = RegExp.$1;
                }
                return pid && mid ? '<div ne-state="api:open;pid:'+pid+';mid:'+mid+'" ne-module="/system/touchall/modules/tabnav/maintabs.js"></div>' : '';
            }
            if(cls == 'f-c3 mname'){
                var intro = '';
                $('.u-itrobox', function(node){
                    intro += '<div class="net-block">' + node.innerHTML + '</div>';
                }, wrap);
                utils.remove(wrap);
                return intro;
            }
            if(/imgNews/.test(cls)){
                schema.detectLinks([wrap]);
                return '';
            }
            if(cls == 'title' && findOne(">.link", wrap)){
                utils.remove(wrap);
                return '<h2 class="net-plain clearfix">' + wrap.innerHTML +  '</h2>';
            }
            if(cls == 'player'){
                schema.detectCovers([wrap], cls, true);
                return '';
            }
            if(level == -1 && /list[\-_]item|^user\d+$/.test(cls)){
                return '';
            }
            if(wrap.id == 'endText' || /v-nav1|ep-info|ep-time-soure|mod-title/.test(cls)){
                if(wrap.children.length == 1 && tagLC(wrap.children[0]) == 'table'){
                    return false;
                }
                utils.remove(wrap.querySelectorAll("[class*=share]"));
                return schema.copyHTML(wrap, true, true);
            }
            if(cls == 'rootwrap' && schema.title == '网易悦图_悦享视觉资讯'){ //悦图
                utils.remove(wrap);
                return '<div ne-state="api:yuetu" ne-module="/system/touchall/modules/tabnav/maintabs.js"></div>';
            }
            var prevIsH2;
            if(cls.indexOf("js-xwtj") === 0 && ((prevIsH2 = /<h2/.test(htmls[htmls.length-1])) || schema.hasJnews)){
                if(prevIsH2) htmls.pop();
                utils.remove(wrap);
                if(schema.hasJnews){
                    return '';
                }
                schema.hasJnews = true;
                return '<div ne-state="api:jnews" ne-module="/system/touchall/modules/tabnav/maintabs.js"></div>';
            }
            if(cls == 'middle' && wrap.querySelector(".middle-l>.cont-wrap")){ //图片中心
                utils.remove(wrap);
                var prefix = "photos" + (moduleid++);
                var navs = [
                    {id:"ss",title:"时事速递"},
                    {id:"kk",title:"看客",key:"Insight"},
                    {id:"jx",title:"一周精选",key:"Week"},
                    {id:"ch",title:"策划",key:"Special"},
                    {id:"js",title:"军事",key:"War"},
                    {id:"ts",title:"探索",key:"Discovery"},
                    {id:"zm",title:"媒体精选",key:"Paper"}
                ];
                var bodyList = [];
                if(/var galleryListData = ([\s\S]*?)\s*<\//.test(doms.html)){
                    tmp = $$.expr(RegExp.$1);
                    $$.each(navs, function(nav){
                        var arr = tmp[nav.id] || [];
                        $$.each(arr, function(item, i){
                            item.title = item.title || item.setname;
                            item.url = item.url || item.seturl;
                            if(i === 0 && /photoview\/(\w+)\//.test(item.url)){
                                item.apiurl = "http://pic.news.163.com/photocenter/api/list/0001/"+RegExp.$1+"/0/10/cacheMoreData.json";
                            }
                            if(item.replynum){
                                item.tip = '<b>' + item.replynum + '</b>跟贴';
                            }
                            if(item.cover){
                                item.img = getThumbUrl(item.cover, 150);
                            }
                        });
                        bodyList.push(arr);
                    });
                    datas[prefix] = {
                        navList: navs,
                        bodyList: bodyList
                    };
                    return '<div ne-extend="%'+prefix+'" ne-module="/system/touchall/modules/tabnav/maintabs.js"></div>';
                }
            }
            if(cls == 'box_ctg' && wrap.querySelector("#instantHolder")){ //滚动新闻
                utils.remove(wrap);
                return '<div ne-module="/system/touchall/modules/tabnav/latesttabs.js"></div>';
            }
            if(cls == 'hotTags clearfix'){ //数码列表页
                if(/var dataurl\s*=\s*"\S+?\/special\/(\w+?\-)/.test(doms.bodyEl.innerHTML)){
                    var apiPrefix = RegExp.$1;
                    var prefix = "nav" + (moduleid++);
                    datas[prefix] = {
                        list: [
                            {
                                title: trim(wrap.innerHTML)
                            }
                        ]
                    };
                    var newsid = "news" + moduleid;
                    return '<div class="channel-nav" ne-module="/system/touchall/modules/tabnav/ajaxtabs.js" ne-extend="%'+prefix+'" ne-state="channel:'+channel+';prefix:'+apiPrefix+';newsid:'+newsid+';init:1"></div>' + addModule.newslist([], false, true);
                }
                return '';
            }
            if(cls == 'b_title'){
                utils.remove(wrap);
                return '<h2 class="net-plain">' + trim(wrap.innerHTML, true).replace(/^(&nbsp;|\s)+/, '') + '</h2>';
            }
            if(cls == 'liveshow_mian'){ //直播室
                var $roomid = doms.doc.getElementById("roomid"), roomid;
                utils.remove(wrap);
                if($roomid && (roomid = $roomid.value)){
                    location.href = 'http://3g.163.com/ntes/special/00340BF8/seventlive.html?roomid=' + roomid;
                    //return '<div ne-module="/system/touchall/modules/live/live.js" ne-state="roomid:'+roomid+'" class="net-live"></div>';
                }
                return '';
            }
            if(/^extra-tag($| )/.test(cls)){ //聚合阅读
                utils.remove(wrap);
                return '<div ne-module="/system/touchall/modules/tag163/tag163.js"></div>';
            }
            if(/stock_ajax|stocks_charts_container/i.test(cls)){ //股票信息
                utils.remove(wrap);
                return '<div ne-module="/system/touchall/modules/tabnav/stocktabs.js"></div>';
            }
            if(/fashion_everyone|friend|localNav|associated|brand_zone|link_(title|list)$|cooperation|men_amod_author|listPages|nav_channel clearfix/i.test(cls) || cls == 'links'){ //_title\b|
                utils.remove(wrap.querySelectorAll(".show720"));
                utils.remove(wrap);
                return '<div class="net-plain">'+wrap.outerHTML+'</div>';
            }
            if(/photoList/.test(wrap.id) || skipReg.test(cls)){
                utils.remove(wrap);
                return '';
            }
            return false;
        },
        isBlock: function(wrap){ //判断模块容器
            if(!wrap || !wrap.parentNode) return false;
            var cls = wrap.className;
            if(/flag_tab/.test(cls)) return false; //留给MainTab处理
            if(/item|list-news/.test(cls) && wrap.querySelectorAll("li").length < 3) return false; //列表项不作为模块
            var result = /div|section|header|footer|ul/.test(tagLC(wrap)) && blockReg.test(cls) && !/share|tie/i.test(cls);
            if(cls == 'page' || cls == 'clearfix') result = true;
            if(!result && wrap.querySelector("h1,h2,h3,p,ul,table,.quote,.titlebar,[id^=video],a img,[class*=tags]")) result = true;
            if(!result && !cls && findOne(">p", wrap)) result = true;
            return result;
        },
        isAtom: function(wrap, level){ //level表示处于getWraps阶段
            var cls = wrap.className;
            if(/flag_tab/.test(cls)) return false; //留给MainTab处理
            if(level && /layout-|insect_|banner/.test(cls)) return true; //保证首屏焦点图的提取
            if(level && !/area-sub|article_side/.test(cls) && findOne(">[class^=list-],>ul,>ol,>[class*=_itm],>[class*=focus],>[id^=video],>#js_Movie", wrap)) return true; //
            if(findOne(".main_left", wrap)) return false; //需要进一步细分
            if(atomReg.test(cls)) return true;
            if(/^(ul|ol)$/.test(tagLC(wrap)) && findOne(">li",wrap)) return true;
            if((typeof level == 'undefined'||level > 2) && /[-_]list|box/.test(cls) && !/area.*?main|exam_list|mod_column_list|box_(page|main|aside)|box-area|wrap_box/.test(cls) && !wrap.querySelector("[class*=mod_]")) return true;
            return false;
        },
        procTable: function(wrap){ //处理table
            if(!wrap.parentNode || wrap.querySelector("#kaola01")) return;
            if((wrap.parentNode.className == 'ranklist' || wrap.className == 'date_tbb date_tb' || !wrap.querySelector("table,div,img,h2")) && wrap.querySelectorAll("tr").length > 2){
                schema.copyHTML(wrap, true);
                return;
            }
            var coverlinks = [];
            $("table", function(table){
                var nodes;
                if(table.querySelector("table")) return;
                if(schema.detectVideo(table)) return;
                if(!table.querySelector("div,img,h2") && table.querySelectorAll("tr").length > 2){
                    schema.copyHTML(table, true);
                    return;
                }else if((nodes = table.querySelectorAll("tr,td")).length == 2){
                    var picsize = schema.checkImgSize(nodes[0]);
                    if(picsize == -1){
                        coverlinks.push(nodes[0]);
                        utils.remove(table);
                    }else{
                        schema.copyHTML(nodes[0], true);
                        return;
                    }
                }else if(table.querySelectorAll("a>img").length == 1 && !table.querySelector("td>h3,script")){
                    table.netdelete = 1;
                    coverlinks.push(table);
                    utils.remove(table);
                    //schema.copyHTML(table, true);
                    return;
                }
            }, wrap);
            var picLinkCache = [], txtLinks = [];
            utils.each.call(wrap.querySelectorAll("td,th"), function(node){
                //待detectLinks处理
                var parentLink = picLinkCache[picLinkCache.length - 1];
                if(parentLink && node.parentNode == parentLink){
                    return;
                }
                if(/men_slide/.test(node.className)){
                    if(!/men_foot2/.test(node.children[0].className)){
                        schema.wander(node.children);
                    }
                    return;
                }
                var tmp = node.innerHTML.replace(/(&nbsp;|\s|<br.*?>)+/ig, '').replace(/(<p>\s*<\/p>|<div>\s*<\/div>)+/ig, '');
                if(tmp === '' || trim(tmp) == '更多') return;
                if(node.querySelector('table')) return;
                if(schema.detectVideo(node)) return;
                if(schema.detectGallery(node)) return;
                if(schema.detectMainTab(node)) return;
                if(/NTES|wbshare|-dig-|tieanywhere/.test(tmp)) return;
                schema.detectCovers($(".top_focus .item,.js_focus li,.focus_show .focus_panel,.focusPic .pic", null, node), node.className); //.focus_body li,

                var hasMidPic;
                $("img", function(img){
                    var imgsize = schema.checkImgSize(img);
                    if(imgsize == -2){ //忽略小图标
                        return;
                    }
                    if(imgsize == -1){ //小图
                        var parentTr = node.parentNode;
                        if(parentTr.children.length == 2){
                            picLinkCache.push(parentTr);
                            hasMidPic = true;
                            return;
                        }
                    }
                    if(imgsize <= 0){ //中图，使用双列显示
                        hasMidPic = true;
                        coverlinks.push(node.className == 'pink' || findOne(">p",node) ? node : img);
                    }
                }, node);
                if(hasMidPic){
                    return;
                }else{
                    if(coverlinks.length){
                        schema.coverList(coverlinks);
                        coverlinks = [];
                    }
                }
                if(node.children.length == 1 && tagLC(node.children[0]) == 'a'){
                    txtLinks.push(node.children[0]);
                }else{
                    var clses = ['td-content'];
                    if(node.className){
                        clses.push(node.className);
                    }
                    if(node.querySelectorAll("a>img").length == 1 && !node.querySelector("p")){
                        clses.push('net-center');
                    }
                    utils.clean(node);
                    tmp = node.innerHTML.trim();
                    if(!invalidImgReg.test(tmp.replace(/>[\s\S]*?</, ''))){
                        htmls.push('<div class="'+clses.join(" ")+'">'+node.innerHTML+'</div>');
                    }
                }
            });
            if(txtLinks.length){
                schema.detectLinks(txtLinks);
            }
            if(picLinkCache.length){
                schema.detectLinks(picLinkCache);
            }
            if(coverlinks.length){
                schema.coverList(coverlinks);
            }
        },
        detectPopList: function(wrap){
            var ol = wrap.querySelector("input~ol, input~ul"),
                hasPop = false;
            if(ol){
                var input = ol.previousSibling;
                while(input && input.nodeType != 1){
                    input = input.previousSibling;
                }
                if(input){
                    heads.push('<span class="net-toggle" ne-role="toggle">'+input.value+'</span>');
                    var taglist = [];
                    $("a", function(node){
                        taglist.push({
                            title: node.innerHTML,
                            url: node.getAttribute("href") || "javascript:"
                        });
                    }, ol);
                    if(taglist.length){
                        addModule.taglist(taglist, true);
                    }
                    utils.remove(ol);
                    hasPop = true;
                }
            }
            return hasPop;
        },
        detectVFocus: function(node){ //针对v.163.com分裂型的焦点图
            if(node.id == 'focusImage'){
                var imgs = node.querySelectorAll(".v-focusimg-panels img,a>img");
                var links = node.querySelectorAll("li>a");
                var infos = node.querySelectorAll(".v-focusimg-info ul");
                if(imgs.length && imgs.length == links.length){
                    var list = [];
                    $$.each(imgs, function(img, i){
                        var link = links[i], info = '';
                        if(infos[i]){
                            info = '<p>' + trim(infos[i].innerHTML) + '</p>';
                        }
                        list.push({
                            img: utils.getImgSrc(img),
                            url: link.getAttribute("href"),
                            note: '<h3>'+link.getAttribute("title")+'</h3>'+info
                        });
                    });
                    addModule.photoset(list);
                    utils.remove(node);
                    return true;
                }
            }
            return false;
        },
        detectHxP: function(wrap){
            var links = [], nodes = [];
            $(">h3,[class^=nav],>h4,>p,.title", function(node){//>li>h3,
                var tag = tagLC(node);
                if(/^h\d/.test(tag)){
                    if(links.length){
                        schema.detectLinks(links);
                        links = [];
                    }
                    schema.copyHTML(node);
                }else{
                    if(!$("a", function(a){
                        links.push(a);
                    }, node).length){
                        if(links.length){
                            schema.detectLinks(links);
                            links = [];
                        }
                        schema.copyHTML(node, true);
                    }
                }
                nodes.push(node);
            }, wrap);
            if(links.length){
                schema.detectLinks(links);
            }
            utils.remove(nodes);
        },
        detectTitle: function(wrap){ //寻找唯一的模块标题
            var h1 = wrap.querySelector("h1");
            var h2 = $(">h2:not(.tab-hd),.ttl,.hd h2,[class*=tit]>h2,h5.titlebar,.title_c,.title>.link,.big_title", null, wrap);// [class*=title] h2, [class*=title] h3,
            if(h2.length === 0) h2 = wrap.querySelectorAll("h2:not(.tab-hd)");
            if(h2.length === 0) h2 = wrap.querySelectorAll("h3,.hd>a");
            if(h2.length === 0 && h1) h2 = [h1];
            if(h2.length === 0) h2 = $("[class$=-title],>[class$=_title],.item_head", null, wrap);
            if(h2.length === 0 && /^b\d*1$/.test(wrap.className) && wrap.children.length == 1){ //数码频道
                var child = wrap.children[0];
                if(tagLC(child) == 'a'){
                    htmls.push('<h2 class="net-plain">' + trim(child.innerHTML, true) + '</h2>');
                    utils.remove(wrap);
                    return;
                }
            }
            var parent = h2.length == 1 ? h2[0].parentNode : null;
            if(parent && /nph_|imgText|author/.test(parent.className)) parent = null;
            if(parent && !/dd/.test(tagLC(parent))){ //mod_hd|
                if(/slide-ctrl|fn.*?tab/.test(h2[0].className)) return;
                utils.clean(h2[0]);
                if(h1){
                    if(h1.id == 'h1title'){
                        var info = findOne("+.info", h1); //2012版来源
                        schema.copyHTML(h1);
                        if(info && (info = info.querySelector("span"))){
                            safePush('<div class="net-block ep-info">'+info.innerHTML+'</div>');
                        }
                        return;
                    }
                    if(!schema.hasH1 && !blocks.length){
                        schema.pushHead = true;
                        schema.hasH1 = true;
                    }
                    var tmp = h2[0].innerHTML;
                    var htmlArr = schema.pushHead ? heads : htmls;
                    htmlArr.push("<div class='net-h1-wrap'><h1 class='net-plain'>"+tmp.replace(/<img[^>]*?alt="([^"]+)".*?>/i, "$1"));
                    schema.hasPopH1 = schema.detectPopList(wrap);
                    if(!schema.hasPopH1 && /^网易.{2,4}$/.test(trim(tmp))){
                        heads.pop();
                        schema.copyHTML(findOne("~[class*=crumb]", h1), true);
                    }else{
                        htmlArr.push("</h1></div>");
                    }
                    utils.remove(h1);
                    var hx = findOne("+h3", h2[0]); //面包屑链接
                    if(hx) utils.remove(hx);
                }else{ //没有h1
                    if(tagLC(parent) == 'a' && parent.querySelector("img")){
                        schema.detectLinks([parent]);
                        return;
                    }
                    if(parent.className == 'hd'){
                        schema.copyHTML(parent);
                    }else{
                        var tag = tagLC(h2[0]);
                        if(tag == 'a'){
                            htmls.push('<h2 class="net-plain clearfix">' + h2[0].outerHTML +  '</h2>');
                        }else{
                            if(/编辑的话/.test(h2[0].innerHTML)){
                                schema.preword = {
                                    title: h2[0].innerHTML,
                                    count: 0
                                };
                            }else{
                                schema.copyHTML(h2[0], tag == 'div');
                            }
                        }
                    }
                }
                utils.remove(h2);
            }else if(h1){
                schema.copyHTML(h1);
            }
        },
        detectAjaxTab: function(wrap){ //类似旅游首页的ajax栏目切换
            var prefix, newsid;
            var cls = wrap.className;
            if(/news_main|js_tab_|page_middle_main/i.test(cls)){//ajax导航列表
                prefix = "nav" + (moduleid++);
                datas[prefix] = {};
                var subnavList = datas[prefix].list = [];
                $("#news_tabs a,.tab-main-4 a,.hd a,a.nav_item", function(node, i){
                    if(i<6){
                        subnavList.push({
                            title: utils.enable(node.innerHTML),
                            key: node.getAttribute("data-channel") || node.parentNode.getAttribute("_api") || node.getAttribute("fddata")
                        });
                    }
                }, wrap);
                if(subnavList.length){
                    var newslist = wrap.querySelectorAll(".news_one,.list-item,[class*=_list]>li");
                    newsid = "news" + moduleid;
                    htmls.push('<div class="channel-nav" ne-module="/system/touchall/modules/tabnav/ajaxtabs.js" ne-extend="%'+prefix+'" ne-state="channel:'+channel+';newsid:'+newsid+'"></div>');
                    schema.detectLinks(newslist);
                    return true;
                }
            }
            return false;
        },
        detectVideo: function(wrap){ //提取视频
            var hasVideo = false;
            $("#js_Movie,[id^=video],>script,>center>script", function(node){
                var videoWrap = node.parentNode;
                if(hasVideo || !videoWrap || !videoWrap.parentNode) return;
                var script, tmp;
                var _scripts = videoWrap.querySelectorAll("script");
                if(tagLC(node) == 'script'){
                    if(_scripts.length > 2) return;
                    tmp = node.innerHTML.trim();
                }else{
                    $$.each(_scripts, function(node){
                        if(!node.getAttribute("src")){
                            tmp += node.innerHTML.trim();
                        }
                    });
                }
                if(tmp){
                    if(/"(http:[^\s"]+?\.mp4)"/.test(tmp)){
                        hasVideo = true;
                        var mp4 = RegExp.$1, cover = "";
                        if(/"?coverpic"?\s*:\s*"(\S+?)"/.test(tmp)){
                            cover = RegExp.$1;
                        }else if(/coverpic=(http:\S+?)[&"]/.test(tmp)){
                            cover = RegExp.$1;
                        }
                        utils.remove(videoWrap);
                        addModule.video(mp4, cover);
                        var title = wrap.querySelector("h2,h3,p");
                        if(title){
                            htmls.push('<h3 class="net-center">'+title.innerHTML+'</h3>');
                            utils.remove(title);
                        }
                        if(/vid\s*:\s*"(\w+)"/.test(tmp)){
                            videoid = RegExp.$1;
                        }
                    }
                }
            }, wrap);
            if(!hasVideo){
                var downbtn = wrap.querySelector("li[_vsrc]"), mp4, cover;
                if(downbtn && (mp4 = downbtn.getAttribute("_vsrc"))){
                    var flashvar = downbtn.getAttribute("_flashvars");
                    if(/coverpic=(.*?)&/.test(flashvar)){
                        cover = RegExp.$1;
                    }
                    addModule.video(mp4, cover);
                    var title = downbtn.getAttribute("title");
                    if(title){
                        htmls.push('<h3 class="net-center">'+title+'</h3>');
                    }
                    hasVideo = true;
                }
            }
            return hasVideo;
        },
        procGalleryData: function(node){
            var hasGallery = false;
            if(/photoList|gallery-data/.test(node.id || node.name)){
                hasGallery = true;
                plainnum ++;
                var photoWrap = node.parentNode;
                var h1 = findOne(">h1", photoWrap);
                var h2 = photoWrap.querySelector("h2");
                var p = photoWrap.querySelector("p");
                if(h2){
                    htmls.push("<h3 class='net-gallery-title'>"+h2.innerHTML+"</h3>");
                    utils.remove(h2);
                }
                var list = [];
                utils.each.call(node.value.split(/<\/li>|"id":\s*"\d/), function(li){
                    if(/<h2>(.*?)<\/h2>[\s\S]*?"img">(.*?)</.test(li)){
                        var note = trim(RegExp.$1), src = RegExp.$2;
                        if(!note && /<p>(.*?)<\/p/.test(li)){
                            note = trim(RegExp.$1);
                        }
                        list.push({
                            img: src,
                            note: note || (p ? trim(p.innerHTML) : "")
                        });
                    }
                    else if(/"oimg":\s*"(\S+?)"[\s\S]*?"note":\s*"(.*?)"/.test(li)) list.push({
                        img: RegExp.$1,
                        note: trim(RegExp.$2) || (p ? trim(p.innerHTML) : "")
                    });
                });
                if(list.length){
                    addModule.photoset(list);
                }
                if(h1){
                    heads.push('<div class="net-block">' + h1.outerHTML + '</div>');
                    utils.remove(h1);
                }else{
                    var recm = photoWrap.querySelector(".endpage-btm");
                    if(recm){
                        wraps.push(recm);
                    }
                    utils.remove(photoWrap);
                }
            }
            return hasGallery;
        },
        detectGallery: function(wrap){ //提取内嵌图集信息(textarea)
            var hasGallery = false;
            $("textarea", function(node){
                if(schema.procGalleryData(node)){
                    hasGallery = true;
                }
            }, wrap);
            return hasGallery;
        },
        procTie: function(node){ //提取跟贴信息
            var tmp = node.parentNode.innerHTML, tieInfo = {count:0}, hasTie = false;
            if (/"#tieArea"\),\s*"(\S+)",\s*"(\S+)"|threadId = "(\S+)"[\s\S]+?boardId = "(.*?)"/.test(tmp)) {
                hasTie = true;
                tieInfo.docId = RegExp.$1 || RegExp.$3;
                tieInfo.boardId = RegExp.$2 || RegExp.$4;
                if (/tieCount.*?"innerHTML",\s*(\d+)/.test(tmp)) {
                    tieInfo.count = RegExp.$1;
                } else if (/replyCount = (\d+)/.test(tmp)) {
                    tieInfo.count = RegExp.$1;
                } else if (/joincount:\s*(\d+)/.test(tmp)) {
                    tieInfo.count = RegExp.$1;
                }
                addModule.tie(tieInfo);
            }else if(/"docId"\s*:\s*"([^"]*)"/.test(tmp) &&( window.isShowComments===undefined || window.isShowComments===true)){
                hasTie = true;
                tieInfo.docId = RegExp.$1;
                addModule.tie(tieInfo);
            }
            return hasTie;
        },
        detectTie: function(wrap){ //检测跟贴容器
            var hasTie = false;
            if (wrap.id == 'tieArea') {
                hasTie = schema.procTie(wrap);
            }else if(wrap.id == 'comment-jssdk-target'){
                hasTie = schema.procTie(wrap);
            }
            $("#tieArea", function(node) {
                hasTie = schema.procTie(node) || hasTie;
                utils.remove(node);
            }, wrap);
            $("#comment-jssdk-target", function(node){
                hasTie = schema.procTie(node) || hasTie;
                utils.remove(node);
            }, wrap);
            return hasTie;
        },
        checkImgSize: function(node, strict, cls){ //-2:无图或小图标, -1:小图, 0:中图， 1:大图
            //if(!strict && /focus_photo/.test(cls)) return 1;
            if(cls == 'day_list'){
                strict = false;
            }
            var img = tagLC(node) == 'img' ? node : node.querySelector("img");
            var iconW = 45, //< iconW: 可忽略的图标 -2
                smallW = 120, //< smallW: 小图 -1
                mediumW = 290, //< mediumW: 双栏中图 0
                imgW;
            var src = utils.getImgSrc(img);
            if(!img || !src || src.indexOf("http") !== 0 || invalidImgReg.test(src) || (imgW = parseInt(img.getAttribute("width") || img.getAttribute("height"))) <= iconW){
                return -2;
            }
            var parentCls = img.parentNode ? img.parentNode.className : '';
            if(imgW < smallW || /logo|attention/.test(src) || (!imgW && /left|right/.test(parentCls))){
                return -1;
            }
            if(img.className == 'imgBg01' && imgW < mediumW){
                return -1;
            }
            if(/imagebg/.test(parentCls)){
                strict = false;
            }
            if(imgW <= mediumW || (strict && !imgW) || /item[\-_]box/.test(parentCls)){
                return 0;
            }
            if(/[\._](\d{2,3})x(\d+)/.test(src) && parseInt(RegExp.$1) < mediumW){
                return 0;
            }
            return 1;
        },
        detectCovers: function(nodes, cls, strict){
            if(/imgList-margin-2 hidden/.test(cls)){
                utils.remove(nodes);
                return;
            }
            var piclinks = [];
            for(var i = 0; i < nodes.length; i ++){
                if(tagLC(nodes[i]) != 'ul' || !nodes[i].querySelector('li')){
                    piclinks.push(nodes[i]);
                }
            }
            if(piclinks.length){
                var picsize = schema.checkImgSize(piclinks[0], strict, cls);
                if(linkpicReg.test(cls) || linkpicReg.test(piclinks[0].className) || picsize <= -1){ //小图用新闻列表
                    schema.detectLinks(piclinks);
                }else if(medpicReg.test(cls) || (!strict && medpicReg.test(piclinks[0].className)) || picsize < 1){ //中图用双列封面
                    schema.coverList(piclinks, cls);
                }else{ //大图用图集
                    schema.photosetList(piclinks);
                }
            }
        },
        detectNav: function(wrap){ //频道或栏目导航
            if(schema.hasNav) return false;
            var html = '', nav, cls = wrap.className, tmp;
            if(/nav|menu|bread/i.test(cls) && !/blog-/.test(cls)){
                nav = wrap;
            }else{
                nav = wrap.querySelector(".nav_main,.v-area .left,.v-nav-left,.ntes_cnav_link,.sec-nav-channel,.ep-crumb");
            }
            if(!nav){
                nav = wrap.querySelector("[class*=_menu],[class*=subnav],[class*=_nav],.nav-channel>.nav,.nav_channel>.c1,.banner_list,.nav-list,.crumb");
            }
            if(!nav && !/channel/.test(cls)){
                return false;
            }
            
            var navLinks = nav ? nav.querySelectorAll("a") : $("h1~a", null, wrap);
            if(navLinks.length){
                var actived;
                $$.each(navLinks, function(node, i){
                    var href = node.getAttribute("href") || "";
                    if(!actived && href && href.indexOf(location.href.replace(/[\?#].*/, '').replace(/\/$/, '')) != -1){
                        actived = true;
                        node.classList.add("m-active");
                    }
                    tmp = node.outerHTML;
                    if(i > 29 || node.id || /\/t\.163\.com/.test(tmp) || !href || /^(#|javascript)/.test(href) || !trim(tmp)) return;
                    schema.hasNav = true;
                    html += tmp;
                });
                if(html){
                    //删除div.breadcrumbs，替换为div.net-nav
                    heads.splice(0,1,'<div class="net-nav net-noprev" ne-swiping="navSwiping()" ne-swipe="navSwipe()"><i class="net-nav-prev" ne-tap="navPrev()"></i><div class="net-nav-links" ne-role="nav">' + utils.enable(html) + '</div><i class="net-nav-next" ne-tap="navNext()"></i></div>');
                    utils.remove(nav);
                }
            }
            return schema.hasNav;
        },
        detectMainTab: function(wrap){ //频道或栏目导航，导航居顶
            var list = [], bodyList = [];
            var navWrap = wrap.querySelector(".tabs,.sld_ctrl,.tabNav,.slide-ctrl") || wrap.querySelector("[class*=tab-hd],.flag_tab ul,.hd_tab,.menu>ul,.tab-title>ul,ul#anmenu"),
                bodyWrap = wrap.querySelector(".panels,.mod_bd,.bd") || wrap.querySelector("[class*=tab-bd]");
            var navs = navWrap ? navWrap.children : wrap.querySelectorAll(".mod_hd,.mod-tab-trigger,.bbs_rank .brand,.fn_tab");
            if(!navs.length && cache4next[0]){
                navs = cache4next[0].children;
                cache4next.shift();
            }
            var bodys = bodyWrap ? bodyWrap.querySelectorAll(".mod-tab-panel,.panel,.clickhot_list") : $(".anList,.tab-panel,.tabContents,.panel,.news_panel,.slide-con,[class*=flag_tab_content],ul[class*=ranklist],.stage .list_t", null, wrap);
            if(!bodyWrap && !bodys.length){
                bodys = $(">ul", null, wrap);
            }
            if(bodyWrap && !bodys.length){
                bodys = navWrap ? bodyWrap.children : [bodyWrap];
            }
            if(!navs.length || !bodys.length){ //数读首页
                navs = wrap.querySelectorAll(".blog-nav>li");
                if(navs.length){
                    utils.each.call(navs, function(node){
                        if(list.length >= 6) return;
                        var h3 = node.querySelector("h3,h4,h5");
                        if(h3){
                            bodyList[list.length] = [];
                            list.push({
                                title: trim(h3.innerHTML, true)
                            });
                        }
                    });
                    bodyList[list.length] = [];
                    var tmp = doms.html.replace(/[\s\S]*?ohnofuchlist/, '');
                    var patt = /"url":"(.*?)"[\s\S]*?"title":'(.*?)'[\s\S]*?"img":"(.*?)"[\s\S]*?"comment":(.*?)[\s\S]*?"keyword":'([^']+)'/g, result;
                    var count = 0;
                    while ((result = patt.exec(tmp)) != null) {
                        var item = {
                            url: result[1],
                            title: result[2],
                            img: result[3],
                            tip: '<b>'+result[4]+'</b>跟贴',
                            note: result[5]
                        }
                        bodyList[0].push(item);
                        var match = false;
                        $$.each(result[5].split(/,|、| /), function(key){
                            for(var i = 1; i < list.length; i ++){
                                if(key == list[i].title){
                                    bodyList[i].push(item);
                                    match = true;
                                }
                            }
                        });
                        if(!match){
                            bodyList[list.length].push(item);
                        }
                        if(++count > 200) break;
                    }
                    bodyList[0].splice(50);
                    list.push({
                        title: "其他"
                    });
                    var prefix = "maintab" + (moduleid++);
                    datas[prefix] = {
                        navList: list,
                        bodyList: bodyList
                    };
                    safePush('<div class="clearfix" ne-module="/system/touchall/modules/tabnav/maintabs.js" ne-extend="%'+prefix+'"></div>');
                    utils.remove(navs);
                    return list.length;
                }
                return 0;
            }
            if(navWrap && /flag_yimin_ctrl2/.test(navWrap.parentNode.className)){
                utils.remove(navWrap);
                utils.remove(bodys);
                return 1;
            }
            var listQuery = ".list-item,.list-news,.hot_list_item,.list_item,.lst_tx_a li,>li,[class*=_lst]>ul>li,>ul>li,>ol>li,.list-main>li,.photo_info,.u_list li";
            if(navs.length > 1 && navs.length == bodys.length && navs[0] != bodys[0] && trim(navs[0].innerHTML) && findOne(listQuery+",tr,>p,>h3,>dl", bodys[0])){
                utils.remove(wrap.querySelectorAll("script"));
                utils.each.call(navs, function(node){
                    var title = node.querySelectorAll("a").length>1 ?
                            node.innerHTML.replace(/href="\S+"/, '')
                            : trim(node.innerHTML, true);
                    list.push({
                        title: title || node.getAttribute("title") || ""
                    });
                });
                utils.each.call(bodys, function(node){
                    var hasSubPanel = node.querySelector(".inpanel"), nodes;
                    if(!hasSubPanel){
                        var query = /anList/.test(node.className) ? 'ul[class^=anlist]>li' : listQuery;
                        nodes = $(query, null, node);
                        if(!nodes.length){
                            nodes = $("tr", null, node);
                        }
                    }
                    if(nodes && nodes.length){
                        bodyList.push(schema.detectLinks(nodes, true));
                    }else{
                        bodyList.push([{
                            html: utils.enable(node[tagLC(node) == 'a' ? 'outerHTML' : 'innerHTML'])
                        }]);
                        utils.remove(node);
                    }
                });
                var prefix = "maintab" + (moduleid++);
                datas[prefix] = {
                    navList: list,
                    bodyList: bodyList
                };
                if(htmls.length){
                    htmls[htmls.length-1] = htmls[htmls.length-1].replace(/(<h\d class="net)-plain/, "$1-block");
                }
                safePush('<div class="clearfix" ne-module="/system/touchall/modules/tabnav/maintabs.js" ne-extend="%'+prefix+'"></div>');
                if(navWrap){
                    utils.remove(navWrap);
                }
                else utils.remove(navs);
                utils.remove(bodyWrap);
            }
            return list.length;
        },
        detectSideTab: function(wrap){ //频道或栏目导航，导航居左
            var list = [];
            var rows = $(".row", function(node, i){
                var h3 = node.querySelector("h3");
                var links = node.querySelectorAll("div>a,li>a");
                if(h3 && links.length > 3){
                    var item = {
                        title: trim(h3.innerHTML),
                        links: utils.map.call(links, function(node){
                            return {
                                url: node.getAttribute("href"),
                                title: trim(node.innerHTML)
                            }
                        })
                    };
                    list.push(item);
                }
            }, wrap);
            if(!rows.length){
                if(/tabs_con/.test(wrap.className)){
                    wrap = wrap.parentNode;
                }
                var nav = wrap.querySelector(".tabs_nav"), navs;
                if(nav && (navs = nav.children).length > 1){
                    var body = wrap.querySelector(".tabs_content"), bodys;
                    if(body && (bodys = body.children).length){
                        utils.each.call(bodys, function(node, i){
                            var title = trim(navs[i].innerHTML);
                            var links = $("div>a,li>a", null, node);
                            if(title && links.length){
                                var item = {
                                    title: title,
                                    links: utils.map.call(links, function(node){
                                        return {
                                            url: node.getAttribute("href"),
                                            title: trim(node.innerHTML)
                                        }
                                    })
                                };
                                list.push(item);
                            }
                        });
                    }
                }
            }
            if(list.length){
                var prefix = "tabs" + (moduleid++);
                datas[prefix] = {list: list};
                var title = wrap.querySelector("h2");
                if(title){
                    htmls.push('<div class="net-h2">'+title.innerHTML+'</div>');
                }
                safePush('<div class="net-tabnav clearfix" ne-module="/system/touchall/modules/tabnav/tabnav.html" ne-extend="%'+prefix+'"></div>');
            }else if(rows.length){
                schema.detectLinks(rows);
            }
            return list.length;
        },
        coverList: function(nodes, cls){ //双列封面
            var list = [], maxLen = 0, hasImg = false, hasNote = false;
            var linkNodes = [], oldWrap, _nodes = [];
            utils.each.call(nodes, function(node, i){
                if(!node.netdelete && !node.parentNode)return;
                if(tagLC(node) == 'img') node = node.parentNode;
                if(ignoreLinkReg.test(node.className+(node.id||''))) return;
                var alen;
                if(tagLC(node) == 'a' && ((alen = $(">a", null, node.parentNode).length)!=nodes.length || alen == 1)){
                    node = node.parentNode;
                    if(/li|dl/.test(tagLC(node.parentNode)) && $(">a,>dd", null, node.parentNode).length==1) node = node.parentNode;
                    if(node.querySelector(".joinnum, p")){
                        linkNodes.push(node);
                        return;
                    }
                    if(oldWrap == node) return;
                    oldWrap = node;
                }
                if(/\/g.163.com/.test(node.getAttribute("href") || "")){
                    utils.remove(node);
                    return;
                }
                _nodes.push(node);
                if(i>29) return;
                if(node.parentNode && ignoreLinkReg.test(node.parentNode.className)) return;
                utils.remove(node.querySelectorAll("script"));
                utils.clean(node);
                var html = tagLC(node) == 'a' ? node.outerHTML : node.innerHTML;
                if(html.length > 1){
                    if(!hasImg && node.querySelector("img")){
                        hasImg = true;
                    }
                    if(!hasImg || node.children.length > 2){
                        hasNote = true;
                    }
                    maxLen = Math.max(maxLen, trim(html).length);
                    if(hasImg || trim(html)){
                        list.push({
                            itemHTML: utils.enable(html)
                        });
                    }
                }
            });
            utils.remove(_nodes);
            if(linkNodes.length){
                schema.detectLinks(linkNodes);
            }
            if(list.length){
                if(!hasImg && maxLen > 10){
                    cls = "net-oneline";
                }else if(!hasNote){
                    cls = (cls ? cls + " " : "") + "net-linewrap";
                }
                addModule.cols2(list, cls);
            }
        },
        detectSubList: function(wrap, item){
            var nodes = $(".in-photoset a img", null, wrap);
            var list = schema.detectLinks(nodes, true, true);
            if(list.length){
                item.sublist = list;
            }
        },
        detectSlideData: function(nodes){
            if(!nodes || !nodes.length) return;
            var list = [];
            $$.each(nodes, function(node, i){
                var spans = node.querySelectorAll("span");
                if(spans.length > 1){
                    var cursor = 0,
                        note = '网易公开课';
                    if(spans[0].innerHTML.indexOf("http") == -1){
                        note = spans[0].innerHTML;
                        cursor ++;
                    }
                    var src = spans[3+cursor] && spans[3+cursor].innerHTML;
                    list.push({
                        img: spans[1+cursor].innerHTML,
                        url: spans[cursor].innerHTML,
                        note: src ? '<img src="'+src+'" />' : note
                    });
                }
            });
            addModule.photoset(list);
        },
        detectLinks: function(nodes, quiet, allowNoText){ //图文列表(不确定有图), nodes是链接或容器
            if(!nodes || !nodes.length){
                return [];
            }
            var txtlist = [],
                compact = true,
                isTag = true;
            var imglist = [],
                _nodes = [];
            var oldWrap;
            utils.each.call(nodes, function(node, i){
                if(!node.netdelete && !node.parentNode) return;
                var tag = tagLC(node);
                if(tag == 'li' && node.querySelector("ul")) return;
                var wrap = node, cls = node.className,
                    parentAs;
                if(/^(a|dt|dd|li|h3)$/.test(tagLC(wrap.parentNode)) || (wrap.parentNode.children.length == 1 && !/ul|ol|dl/.test(tagLC(wrap.parentNode)))){
                    wrap = wrap.parentNode;
                    if(tagLC(wrap) == 'a'){
                        node = wrap;
                        if(/\/(g|reg|t).163.com/.test(wrap.getAttribute("href") || "")){
                            if(/^(|dt|dd|li)$/.test(tagLC(wrap.parentNode))){
                                wrap = wrap.parentNode;
                            }
                            _nodes.push(wrap);
                            return;
                        }
                    }
                    if(/^(a|dt|dd|li)$/.test(tagLC(wrap.parentNode))){
                        wrap = wrap.parentNode;
                    }
                }
                if(tagLC(wrap) == 'a'){
                    node = wrap;
                    if(/\/(g|reg|t).163.com/.test(wrap.getAttribute("href") || "")){
                        _nodes.push(wrap);
                        return;
                    }
                    if(wrap.parentNode && /^row/.test(wrap.parentNode.className)){
                        wrap = wrap.parentNode;
                    }
                }
                var wrapTag = tagLC(wrap);
                if(/^(a|dt|dd|h3)$/.test(wrapTag) && (((parentAs = $(">" + wrapTag, null, wrap.parentNode)).length != nodes.length && parentAs.length < 3) || parentAs.length == 1)){ //避免nodes同一父容器的情形
                    wrap = wrap.parentNode;
                    wrapTag = tagLC(wrap)
                    cls += ' ' + wrap.className;
                }
                _nodes.push(wrap);
                if(!wrap.parentNode) return;
                if(ignoreLinkReg.test(cls + wrap.parentNode.className)) return;
                if(oldWrap == wrap) return;
                oldWrap = wrap;
                //if(wrapTag == 'li' && tag == 'li' && !wrap.querySelector("img,h2,h3,h4") && wrap.querySelector("a")){
                if(wrapTag == 'li' && !/<[^a]/i.test(wrap.innerHTML.replace(/<(\/|span|em).*?>/ig, '')) && $(">a",null,wrap).length && trim(wrap.innerHTML).length > 10){
                    isTag = false;
                    var span = findOne(">span.time", wrap);
                    if(span){
                        wrap.appendChild(span);
                    }
                    txtlist.push({
                        links: utils.enable(wrap.innerHTML)
                    });
                    return;
                }
                if(tagLC(wrap) == 'tr'){
                    isTag = false;
                    var tds = '';
                    utils.clean(wrap);
                    $("td,th", function(node){
                        tds += '<div class="net-cell">'+utils.enable(node.innerHTML)+'</div>';
                    }, wrap);
                    txtlist.push({
                        cell: tds
                    });
                }else{
                    var h2a = wrap.querySelector("h2 a:not([href='']),h3 a:not([href=''])") || wrap.querySelector("a:not([href=''])") || wrap.querySelector("h2,h3") || node;
                    var url = wrap.getAttribute("pageurl") || (h2a ? h2a.getAttribute("href") : "");
                    var img = wrap.querySelector("img");
                    if(img) utils.remove(img);
                    var title = h2a.innerHTML.trim() || h2a.getAttribute("title") || (img ? (utils.getImgAlt(img) || img.getAttribute("title")) : "");
                    if(!title){
                        if(tagLC(h2a) == 'a'){
                            h2a = wrap.querySelector("h2,h3");
                        }
                        if(h2a){
                            title = trim(h2a.innerHTML, true);
                        }
                        
                        if(!title){
                            h2a = wrap.querySelectorAll("a:not([href=''])")[1] || wrap.querySelector("span");
                        }
                        if(h2a){
                            title = trim(h2a.innerHTML, true) || h2a.getAttribute("title");
                            if(!url){
                                url = h2a.getAttribute("href");
                            }
                        }
                    }else if(/<h\d>(.+?)<\/h\d/.test(title)){
                        title = RegExp.$1;
                    }
                    if(title) title = trim(title, true);
                    else if(!allowNoText && tag == 'img' && wrap.children.length == 1){
                        if(!/pic_one/.test(wrap.className)){
                            schema.copyHTML(wrap);
                        }
                        return;
                    }
                    
                    var joinNode = wrap.querySelector(".join_num,.joinnum,.commentCount");
                    var tip = joinNode ? '<b>'+joinNode.outerHTML.replace(/<\/?span.*?>/g, '')+'</b>跟贴' : '';
                    var note = '';
                    var maxStrLen = window.innerWidth >= 400 ? 35 : 26;
                    if(!img) maxStrLen += 10;
                    $("p", function(p){
                        var tmp = trim(p.innerHTML);
                        if(tmp && tmp != title && tmp.length > note.length) note = tmp;
                    }, wrap);
                    if(!note){
                        var noteQuery = ".list-main a,span[class$=_info]";
                        var noteNode = wrap.querySelector(noteQuery) || wrap.querySelector("h3,.price,[class*=digest],a:last-child");
                        if(noteNode && noteNode.parentNode == h2a){
                            utils.remove(h2a);
                            noteNode = wrap.querySelector(noteQuery);
                        }
                        if(noteNode && (!h2a || h2a.parentNode != noteNode)){
                            if(/span|a/.test(tagLC(noteNode)) && /_info|price/.test(noteNode.className)){
                                tip = noteNode.innerHTML;
                            }else{
                                note = trim(noteNode.innerHTML);
                            }
                        }
                        if(!note){
                            $(">span.ant", function(node, i){
                                if(i==2) tip = trim(node.innerHTML);
                                if(i>=2) return;
                                note += trim(node.innerHTML) + " ";
                            }, wrap);
                        }
                    }
                    if(!title) title = note;
                    if(title == note) note = "";
                    if(note){
                        note = note.replace(/&nbsp;/g, '');
                        if(note.length > maxStrLen){
                            note = note.substr(0,maxStrLen) + '..';
                        }else if(!tip && note.length < 15 && /^\d+\D{0,5}$/.test(note)){
                            tip = note;
                            note = '';
                        }else if(note.length < 10 && title.indexOf(note) > -1){
                            note = '';
                        }
                    }
                    var item = {
                        tip: tip,
                        title: title,
                        url: url,
                        note: note
                    };
                    if(!allowNoText)
                        schema.detectSubList(wrap, item);
                    if((img || url && !/^#/.test(url)) && (allowNoText || title)){
                        if(img){
                            var picsize = schema.checkImgSize(img);
                            if(picsize > -2){
                                if(!item.note) item.note = item.title;
                                item.img = utils.getImgSrc(img);
                                if(picsize >= 0) item.img = getThumbUrl(item.img, 150);
                                if(imglist.length < 30) imglist.push(item);
                            }
                        }
                        if(!item.img){
                            compact = compact && !note && !tip;
                            if(title.length > 8) isTag = false;
                            if(title.length > 0 && txtlist.length < 30){
                                txtlist.push(item);
                            }
                        }
                    }
                }
            });
            if(imglist.length && !quiet){
                addModule.newslist(imglist);
            }
            if(txtlist.length && !quiet){
                if(isTag && txtlist.length > 2 && compact){
                    addModule.taglist(txtlist);
                }else{
                    addModule.newslist(txtlist, compact);
                }
            }
            utils.remove(_nodes);
            return imglist.length ? (quiet ? imglist.concat(txtlist) : imglist) : txtlist;
        },
        copyHTML: function(wrap, outer, quiet){ //清除样式后使用原有结构
            if(channel == 'open' && wrap && wrap.id == 'j-title'){
                htmls.push('<div ne-state="api:opensp" ne-module="/system/touchall/modules/tabnav/maintabs.js"></div>');
                utils.remove(wrap);
                return '';
            }
            if(!wrap || invalidImgReg.test(wrap.outerHTML.replace(/>[\s\S]*?</, '')) || !wrap.parentNode || !wrap.parentNode.parentNode){
                return;
            }
            var tag = tagLC(wrap), html = '';
            if(tag != 'img' && wrap.innerHTML.replace(/&nbsp;|\s|<\/?(tr|br|td|p).*?>/ig, '').trim() === '') {
                return '';
            }
            if(tag == 'img' && wrap.className){
                if(/_pc( |$)/.test(wrap.className) || /\/f2e\/.*?\.png$/.test(utils.getImgSrc(wrap))){
                    utils.remove(wrap);
                    return '';
                }
            }
            if(tag == 'ul' && wrap.innerHTML.trim().replace(/\s+/g, '').replace(/<li.*?>/g, '').length/wrap.children.length < 14) return;
            utils.clean(wrap);
            if(tag == 'a' || tag == 'img' || $$.isNumber(outer) || outer || wrap.id == 'h1title'){
                if(schema.preword){
                    var $img = $('img', null, wrap);
                    if($img[0]){
                        schema.preword.img = $img[0].getAttribute('x-src');
                        utils.remove(wrap);
                        return '';
                    }else if(tag == 'a'){
                        schema.preword.note = wrap.innerHTML;
                        schema.preword.url = wrap.getAttribute('href');
                        addModule.newslist([schema.preword]);
                        schema.preword = null;
                        utils.remove(wrap);
                        return '';
                    }
                    if(++schema.preword.count > 2){
                        schema.preword = null;
                    };
                }
                if(ignoreLinkReg.test(wrap.className)) return;
                if(tag == 'img' && tagLC(wrap.parentNode) == 'a'){
                    wrap = wrap.parentNode;
                }
                utils.removeAttr(wrap, "width height");
                utils.removeAttr(wrap.querySelectorAll("td,th"), "width height align");
                html = wrap.outerHTML;
                if(/sayno_endtext/.test(wrap.className)){
                    html = html.replace(/<\/?(table|tr|td|th|tbody).*?>/g, '');
                }
                if(/h[345]/.test(tag)){
                    if(trim(html).length > 20){
                        html = html.replace(/(<\/?)h[345]( |>)/g, "$1p$2");
                    }
                }
                if(/h[23]/.test(tag)){
                    html = html.replace(/(<h\d[^>]*?) class="\w*more\w*"/, '$1');
                }
                var $list = findOne("+.tab_list", wrap);
                if($list) {
                    html += $list.outerHTML;
                    utils.remove($list);
                }
                html = '<div class="net-block' +
                    (tag == 'table' && wrap.querySelector("p") ? ' net-block-p' : '') +
                    '">'+html+'</div>';
                html = utils.enable(html);
                if(quiet !== true && trim(html) != '关注我们'){
                    (schema.pushHead ? heads : htmls).push(html);
                }
            }else{
                var $more, more;
                if(tag == 'h2' || tag == 'h3'){
                    $more = findOne("+[class*=more],+.entry,+span.tle", wrap);
                    if($more) more = trim($more.innerHTML.replace(/&nbsp;/g, ''));
                }
                var tmp = wrap.innerHTML;
                if(tag == 'h1'){
                    tmp = tmp.replace(/<img[^>]*?alt="([^"]+)".*?>(<br.*?$)?/i, "$1");
                }
                if(!more && !blocks.length && htmls.length < 2 && (heads[heads.length-1]||"").indexOf(trim(tmp, true)) != -1){ //避免重复的标题导航
                    html = '';
                }else if(!/^(彩票|跟帖)$|logo/.test(trim(tmp))){
                    if(/h[23]/.test(tag)){
                        tmp = tmp.replace(/(<h\d[^>]*?) class="\w*more\w*"/, '$1');
                        if(tag == 'h2' && trim(tmp).length > 60) tag = 'h3';
                    }
                    if(schema.hasH1 && tag == 'h1') tag = 'h2';
                    html = '<'+tag+' class="net-plain clearfix">'+tmp.replace(/<br.*?>/ig,'')+($more?$more.outerHTML : '')+'</'+tag+'>';
                    html = utils.enable(html);
                    if(quiet !== true){
                        (schema.pushHead ? heads : htmls).push(html);
                    }
                    if($more){
                        utils.remove($more);
                    }
                }
            }
            utils.remove(wrap);
            plainnum ++;
            return html;
        },
        photosetList: function(nodes){ //提取多张图做成图集展示
            var list = [];
            utils.each.call(nodes, function(node, i){
                var img, alen;
                if(tagLC(node) == 'img'){
                    img = node;
                    node = node.parentNode;
                }else img = node.querySelector("img");
                if(!img || /about/i.test(node.className)) return;
                var picsize = schema.checkImgSize(img);
                if(picsize < 0) return;
                if(tagLC(node) == 'a'){
                    if(/\/(baoxian|g).163.com/.test(node.getAttribute("href") || "")){
                        utils.remove(node);
                        return;
                    }
                    if(((alen = $(">a",null, node.parentNode).length) != nodes.length || alen == 1) &&
                       (alen == 1 || alen != node.parentNode.children.length))
                        node = node.parentNode;
                }
                if(ignoreLinkReg.test(node.className)) return;
                
                var wrap = node, title = "", note = "", url;
                if(wrap.parentNode){
                    if(/dd|dt/.test(tagLC(wrap))){
                        wrap = wrap.parentNode;
                        var dt = wrap.querySelector("dt");
                        if(dt){
                            note += trim(dt.innerHTML) + " ";
                            utils.remove(dt);
                        }
                    }else if(/li/.test(tagLC(wrap.parentNode)) || /info/.test(wrap.parentNode.className)){
                        wrap = wrap.parentNode;
                    }
                }
                if(!wrap.parentNode || !wrap.parentNode.parentNode) return;
                if(/banner/.test(wrap.parentNode.className)){ //???
                    wrap = wrap.parentNode;
                }
                var titleNode = wrap.querySelector("h1,h2") || wrap.querySelector("h3") || wrap.querySelector("[class*=title]");
                var aNode = wrap.querySelector("a:not([href=''])") || wrap;
                if(aNode) url = aNode.getAttribute("href");
                if(titleNode) title = trim(titleNode.innerHTML);
                if(!title && img) title = utils.getImgAlt(img) || img.getAttribute("title");
                if(/^(pic|cover)\d*$/.test(title)) title = '';
                $("span,dd,p", function(node){
                    note += trim(node.innerHTML);
                }, wrap);
                if(!title) title = note;
                if(title == note) note = "";
                if(!title){
                    $("a", function(a){
                        if(!title) title = trim(a.innerHTML);
                    }, wrap);
                }
                var src = utils.getImgSrc(img);
                if(src) list.push({
                    img: src,
                    url: url || 'javascript:',
                    note: (title ? '<h3>'+title+'</h3><p>'+note+'</p>' : '')
                });
                utils.remove(wrap);
            });
            if(list.length){
                if(list.length > 1){
                    $$.each(list, function(item){
                        if(item.note === '') item.note = "<p>左右滑动图片进行切换</p>";
                    });
                }
                addModule.photoset(list);
            }
        }
    };
    var scriptSpliter = /(<script[\s\S]*?>)/gi,
        disableRes = {
            style: ' media="x-media"',
            script: ' type="text/x-script"'
        },
        tagEscapeRegs = {};
    var utils = {
        each: [].forEach,
        map: [].map,
        getImgAlt: function(img){
            var alt = img.getAttribute("alt");
            if(alt && /^pic\S+$/.test(alt)) alt = "";
            return alt;
        },
        getImgSrc: function(img){
            return img ? img.getAttribute("data-original-src") || img.getAttribute("srcurl") || img.getAttribute("data-src") || img.getAttribute(attrPrefix + "src") : '';
        },
        clean: function(wrap){ //清除style, img宽高
            var imgs = wrap.querySelectorAll('img');
            if(!imgs.length && tagLC(wrap) == 'img') imgs = [wrap];
            if(imgs.length){
                utils.each.call(imgs, function(img){
                    var src = utils.getImgSrc(img);
                    if(src){
                        img.setAttribute(attrPrefix + "src", utils.getImgSrc(img));
                    }
                });
                utils.removeAttr(imgs, "width height align");
            }
        },
        remove: function(nodes, prevCls){
            if(!nodes) return;
            if(nodes.nodeType) nodes = [nodes];
            utils.each.call(nodes, function(node){
                var parent = node.parentNode;
                if(parent){
                    if(prevCls){ //删除连带的标题
                        var _node = node.previousSibling;
                        if(_node && _node.nodeType != 1) _node = _node.previousSibling;
                        if(_node && _node.className && _node.className.indexOf(prevCls) > -1){
                            parent.removeChild(_node);
                        }
                    }
                    parent.removeChild(node);
                }
            });
        },
        removeAttr: function(nodes, names){
            if(nodes.nodeType) nodes = [nodes];
            names.split(/\s+/).forEach(function(name){
                utils.each.call(nodes, function(node){
                    node.removeAttribute(name);
                });
            });
        },
        keys: function (obj) {
            var result = [];
            for (var key in obj) obj.hasOwnProperty(key) && result.push(key);
            return result;
        },
        values: function (obj) {
            var result = [];
            for (var key in obj) obj.hasOwnProperty(key) && result.push(obj[key]);
            return result;
        },
        disable: function (html, prefix) {
            var n = (function () {
                return function (t, n, a) {
                    var lowercaseTagName = n.toLowerCase();
                    var result = "<" + lowercaseTagName + (disableRes[lowercaseTagName] || "") + a.replace(tagEscapeRegs[lowercaseTagName], " " + (prefix || attrPrefix) + "$1") + ">"
                    return result;
                }
            })();
            return html.split(/(<!--[\s\S]*?-->)|(?=<\/script)/i).map(function (t) {
                if(t){
                    if(/^<!--/.test(t)){
                        return t;
                    }else{
                        var e = t.split(scriptSpliter);
                        e[0] = e[0].replace(escapePropReg, n);
                        e[1] && (e[1] = e[1].replace(escapePropReg, n));
                        return e.join("");
                    }
                }else{
                    return "";
                }
            }).join("");
        },
        enable: function (html, prefix) {
            var n = new RegExp("\\s" + (prefix || attrPrefix) + "(" + utils.keys(escapeTags).join("|") + ")", "gi");
            return html.replace(n, " $1").replace(escapeResReg, "")
        }
    }
    var escapeResReg = new RegExp(utils.values(disableRes).join("|"), "g"),
        escapeProps = {
            img: ["src"],
            source: ["src"],
            script: ["src", "type"],
            link: ["href"],
            style: ["media"]
        },
        escapePropReg = new RegExp("<(" + utils.keys(escapeProps).join("|") + ")([\\s\\S]*?)>", "gi"),
        escapeTags = {};
    for (var key in escapeProps) if (escapeProps.hasOwnProperty(key)) {
        var propArr = escapeProps[key];
        propArr.forEach(function (t) {
            escapeTags[t] = true
        });
        tagEscapeRegs[key] = new RegExp("\\s+((?:" + propArr.join("|") + ")\\s*=\\s*(?:('|\")[\\s\\S]+?\\2))", "gi")
    }
    function parseScript(node) { //统计代码等保留script
        if(node.getAttribute("x-type") == 'text/t-css'){
            //自定义适配样式
            styles.push(node.innerHTML);
            return;
        }
        var tmp = node.outerHTML;
        if(/analytics.163.com|neteaseTracker|wrating/.test(tmp) && !/sns/.test(tmp)){
            var src = node.getAttribute("x-src");
            if(src){
                scriptPromises.push($$.ajax.require(src));
            }else{
                tmp = node.innerHTML.trim();
                if(tmp){
                    scripts.push(tmp.replace(/vjTrack/, 'vjEventTrack'));
                }
            }
        }else if(/NTES_SHARE_INFO/.test(tmp)){ //微信适配代码
            var script = document.createElement("script");
            script.innerHTML = node.innerHTML.replace(/document.write[\s\S]*/, '');
            document.body.appendChild(script);
        }
    }
    function parseHTML(wrap) { //提取有用的html
        return wrap ? [].map.call(wrap.childNodes, function (node) {
            var tagName = tagLC(node);
            if(tagName == 'script'){
                return "";
            }
            return "#comment" == tagName ? "" : node.outerHTML || node.nodeValue;
        }).join("") : "";
    }
    function Parser(){ //提取内容信息
        var doms, doc = document, body = document.body;
        var head = doc.getElementsByTagName("head")[0];
        var plaintext = body.querySelector("plaintext");
        if(plaintext){
            var origHead = parseHTML(head);
            var raw = {
                headContent: "",
                bodyContent: origHead + plaintext.textContent
            };
            var headReg = /<!--(?:[\s\S]*?)-->|(<\/head\s*>|<body[\s\S]*$)/gi,
                tmp = raw.bodyContent, h;
            while ((h = headReg.exec(tmp))) if (h[1]) {
                raw.headContent = tmp.slice(0, h.index);
                if(/^[\s\S]*(<head(?:[^>'"]*|'[^']*?'|"[^"]*?")*>)([\s\S]*)$/i.test(raw.headContent)){
                    raw.headContent = RegExp.$2;
                }
                if ("/" != h[1][1]) {
                    raw.bodyContent = h[0];
                    if(/^((?:[^>'"]*|'[^']*?'|"[^"]*?")*>)([\s\S]*)$/.test(raw.bodyContent)){
                        raw.bodyContent = RegExp.$2;
                    }
                    break;
                }
                raw.bodyContent = tmp.slice(h.index + h[1].length)
            }
            if(!h && !raw.headContent){
                raw.headContent = origHead;
                raw.bodyContent = plaintext.textContent;
            }
            doms = this.precompile(raw);
            doc = doms.doc;
            body = doms.bodyEl;
        }else{
            attrPrefix = "";
        }
        schema.title = doc.title;
        schema.shortTitle = doc.title.replace(/[-_][^_]*$/, '');
        schema.isIndex = !(/_/.test(doc.title) || /163.com\/\w/.test(location.href));
        heads.push('<div class="breadcrumbs clearfix"><a href="/"><i class="genericon genericon-home"></i> '+schema.shortTitle+'</a>' + (schema.isIndex ? ' / 首页':'') + '</div>');
        utils.remove(doc.querySelectorAll("iframe,object,.nav-logo,[class*=_ad_],[class$=_ad],[class$=-ad],[class^=ad-],.ad,[class^=gg],[class^=ep-share],[class^=ntshare],#layout-t,#layout-love,#layout-yuehui,.ntes_nav_wrap,.fa13_schel,[class*=ctrl-tabs],.price-tend,.head .contnet1,.ds-tab,[id^=ds_],#progress+#overlay,#float_menu,.nph_layout_htp,[class$=arrow],[class^=focus_ctrl],#loginWin2")); //删除广告、分享等无需适配的模块
        if(channel == "open"){
            utils.remove(doc.querySelectorAll("#j-appdown,#j-confirmBox,#j-feedbackTip,#j-loginDialog,.m-footer,ul.u-nav2,.m-subnav"));
        }
        var epRight = doc.getElementById("epContentRight");
        if(epRight){
            utils.remove(epRight.querySelectorAll("#side_video_wrap,#js-specheader,#js-epTabMarket,#side_rdtj_wrap,#js-epTabDS,#side_blogbbs_head,#side_blogbbs_body,#side_jctj_imglst"), "ep-title-2");
        }
        if(channel == 'art'){
            utils.remove(doc.querySelectorAll(".area>.auction"));
        }else if(channel == 'shoucang'){
            utils.remove(doc.querySelectorAll(".right.w300"));
        }else if(channel == 'open'){
            utils.remove(doc.querySelectorAll("table.sign"));
        }
        schema.detectTie(body); //提取跟帖信息
        utils.removeAttr(doc.querySelectorAll("[style]"), "style");
        $(".area-sub", function(node){
            node.parentNode.appendChild(node);
        }, body);
        schema.getWraps(body);
        //console.log(wraps);
        schema.wander(wraps, true);
        if(moduleid + plainnum < 2) schema.postWander(body);
        $("script", parseScript, doms.headEl);
        $("script", parseScript, body);
        doms = null;
    }
    Parser.prototype = {
        precompile: function(raw){//生成临时页面用来提取数据
            var doc = doms.doc = document.implementation.createHTMLDocument(""),
                html = doms.htmlEl = doc.documentElement,
                head = doms.headEl = html.firstChild,
                body = doms.bodyEl = html.lastChild;
            //禁止js/css/images
            doms.html = body.innerHTML = utils.disable(raw.bodyContent);
            try {
                head.innerHTML = utils.disable(raw.headContent);
            } catch (e) {
            }
            return doms;
        },
        body: function(){
            if(htmls.length){
                blocks[blocks.length] = utils.enable(htmls.join(""));
                htmls = null;
            }
            var search = location.search ? location.search + '&_pc=1' : '?_pc=1';
            var home = /(view|data)\.163\.com/.test(location.host) ? 'http://news.163.com' : '/';
            var thisYear = (new Date).getFullYear();
            return '<div class="page net-general">\
      <header class="net-hd">\
        <h1><a href="'+home+'" class="logo logo-'+channel+'">网易</a></h1>\
        <a class="nav-panel-toggle" ne-tap="bowlder.emit(\'sidebar.nav.show\')">\
        <i class="genericon genericon-menu"></i>\
      </a>\
      </header>\
        <div class="net-bd">' +
                heads.join("") + (blocks.shift() || "") +
                '</div><footer class="net-ft">' +
                foots.join("") +
                '<div class="net-back-pc"><a href="'+search+'" target="_self">电脑版</a></div>\
        <p class="copyright">©1997-'+thisYear+' 网易公司版权所有 <span class="icp">ICP证粤B2-20090191</span></p>\
      </footer>\
      <div class="sidebar-wrap m-hide" ne-module="/system/touchall/modules/sitenav/sitenav.html" ne-plugin="/m/plugins/sidebar.js" ne-plugin-state="name:nav;position:right;event:tap"></div>\
      <div class="ntshare-wrap sidebar-wrap m-hide" ne-module="/products/photoset/mobile/modules/share/share.js" ne-plugin="/m/plugins/sidebar.js" ne-plugin-state="name:share;position:down;event:tap"></div>\
    </div>';
        }
    };
    function render(parser){
        $$("base,link,style").remove();
        var link = document.createElement("link"), head = document.head;
        link.rel = "stylesheet";
        link.href = host+"/system/touchall/touchall.css";
        head.appendChild(link);
        if(!document.querySelector("meta[name=viewport]")){
            var mt = document.createElement("meta");
            mt.setAttribute("name", "viewport");
            mt.setAttribute("content", "width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no");
            head.appendChild(mt);
        }
        document.title = schema.title;
        var html = parser.body(), body = document.body;
        body.setAttribute("ne-module", "%body");
        body.setAttribute("ne-plugin", "/m/plugins/gesture.js");
        body.className = "net-" + channel;
        body.style.cssText = "";
        if(host) $$.debug = host;
        for(var key in datas){
            define('%'+key, datas[key]);
        }
        setTimeout(function(){ //wait for module defines
            body.innerHTML = html;
            $$.rootWidget.compile();
            $$.$q.all(scriptPromises).then(function(){
                $$.emit('devilfish.ready');
                var str = scripts.join(";");
                if(str){
                    var script = document.createElement("script");
                    script.innerHTML = str;
                    document.body.appendChild(script);
                }
                str = styles.join("\n");
                if(str){
                    var style = document.createElement("style");
                    style.innerHTML = str;
                    document.head.appendChild(style);
                }
                if(!/newsapp/.test(ua)){
                    if(videoid && location.href.indexOf(videoid) > -1){
                        initNewsapp("vid=" + videoid);
                    }else if(/\d{2}\/\d{4}\/\d{2}\/(\w{10,})\.html/.test(location.href)){
                        initNewsapp("docid=" + RegExp.$1);
                    }else{
                        initNewsapp("url=" + encodeURIComponent(location.href));
                    }
                }
                if(!device.openCourse && /^http:\/\/open\.163\.com\/movie/.test(location.href)){
                    initOpenapp();
                }
            });
        }, 200);
    }
    if(device.phone && /163.com/.test(location.host)){
        $$.ready(function(){
            render(new Parser);
        });
    }
})();

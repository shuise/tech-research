/**
 *  @time       2015-09-01
 *  @author     wang_zhen@corp
 *  @require    NE库 http://img1.cache.netease.com/f2e/lib/js/ne.js
 *  @tips       为包含 .js_share 类名的元素进行点击事件绑定，使用该元素的属性 data-type 的值 或 类名 .js_share_{type} 的后缀进行分享渠道区分
 *  @type       新浪微博  ： "sina" 、 "weibo"、 "sinawb"
 *              人人网    ： "rr" 、 "renren"
 *              有道云笔记： "yodao" 、 "youdao" 、 "ydCloud"
 *              QQ空间    ： "qzone" 、 "qqZone"
 *              易信      ： "yx" 、 "yixin"
 *              易信图片  ： "yx_image" 、 "yixin_image"
 *              Lofter    ： "163" 、 "lofter"
 *              网易热    ： "hot163" 、 "163hot" 、 "hot" 、 无type
 *  @document   /component/share_sns/share.html            
 */

// js方法
;(function () {

    // 函数{params}，用于读取、设置及删除url中的参数。{url} 源url，{para} key，{value} 值，返回操作后的url。support by NE.para。
    var params = {
        // 设置参数
        set: function(link, para, value, anchor) {
            var url = NE.string.trim(link);
            var paras = para + "=" + value;
            var v = this.get(url, para);
            var _url = "";
            if (v === "") {
                if (url.substring(url.length - 1) == anchor) {
                    _url = url + paras;
                } else {
                    _url = url + (url.indexOf(anchor) == -1 ? anchor : "&") + paras;
                }
            } else {
                _url = url.replace("&" + para + "=" + v, "&" + paras);
                _url = _url.replace(anchor + para + "=" + v, anchor + paras);
            }
            return _url;
        },
        // 获取参数
        get: function(link, para, anchor) {
            var value = "",
                _p = para + "=";
            var url = link.split("#!")[0] || "";
            if (url.indexOf("&" + _p) > -1) {
                value = url.split("&" + _p)[1].split("&")[0];
            }
            if (url.indexOf(anchor + _p) > -1) {
                value = url.split(anchor + _p)[1].split("&")[0];
            }
            return value;
        },
        // 移除参数
        remove: function(link, para, anchor) {
            if (!para) {
                return link;
            }
            var v = this.get(link, para);
            if (link.indexOf('&' + para + '=' + v) > -1) {
                link = link.replace('&' + para + '=' + v, '');
            } else if (link.indexOf(anchor + para + '=' + v + '&') > -1) {
                link = link.replace(para + '=' + v + '&', '');
            } else {
                link = link.replace(anchor + para + '=' + v, '');
            }
            return link;
        }
    };

    // 函数{getStyle}，用于获取dom对象的计算后样式
    function getStyle(obj, attr) {
        return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj, false)[attr];
    }

    // 函数{getImg}，用于获取页面中第一张宽和高都大于300px的图片
    function getImg() {
        for (var i = 0, aImg = document.getElementsByTagName("img"); i < aImg.length; i++) {
            if (parseInt(getStyle(aImg[i], "width"), 10) > 300 && parseInt(getStyle(aImg[i], "height"), 10) > 300) {
                return aImg[i].src;
            }
        }
        return "http://img1.cache.netease.com/f2e/news/res/img/share.png"; //易信无图片会失效
    }

    // 获取页面OpenGraph信息，存入og对象
    var og = {},
        aMetas = document.getElementsByTagName("meta");
    for (var i = 0; i < aMetas.length; i++) {
        if(aMetas[i].getAttribute("property") == "og:url"){
            og.url = aMetas[i].getAttribute("content");
        }else if(aMetas[i].getAttribute("property") == "og:title"){
            og.title = aMetas[i].getAttribute("content");
        }else if(aMetas[i].getAttribute("property") == "og:image"){
            og.image = aMetas[i].getAttribute("content");
        }else if(aMetas[i].getAttribute("property") == "og:site_name"){
            og.source = aMetas[i].getAttribute("content");
        }else if(aMetas[i].getAttribute("property") == "og:description"){
            og.description = aMetas[i].getAttribute("content");
        }
    };

    // 定义自动分享内容 优先级：js_share_config内容 > og标签内容 > 默认内容(location.href、doc.title) > 空
    var shareParam = {}, js_share_config = window.js_share_config || {};
    shareParam.url   = js_share_config.url || og.url || window.location.href;
    shareParam.title = js_share_config.title || og.title || document.title || "";
    shareParam.description = js_share_config.description || og.description || "";
    shareParam.pic = js_share_config.pic || og.image || "";
    shareParam.appid = js_share_config.appid || "";

    // 点击事件绑定，使用全局变量 js_share_unbind 控制是否绑定
    !window.js_share_unbind && NE(".js_share").length && NE(".js_share").bind("click", function(){

        // 定义默认点击分享内容，优先级：点击按钮的data-属性 > 定义过的自动分享内容
        var type = this.getAttribute("data-type") || this.className.split("js_share_")[1] || "lofter",
            link = this.getAttribute("data-url") || shareParam.url,
            title= this.getAttribute("data-ttl") || shareParam.title,
            description = this.getAttribute("data-desc") || shareParam.description,
            pic  = this.getAttribute("data-pic") || shareParam.pic,
            origin=this.getAttribute("data-source") || js_share_config.source || og.source || "",
            sign = this.getAttribute("data-anchor") || js_share_config.anchor || "",
            apk  = this.getAttribute("data-appkey") || js_share_config.appkey || "",
            ralateUid  = this.getAttribute("data-uid") || js_share_config.uid || "";

        shareto(type, link, title, description, pic, origin, sign, apk, ralateUid);
    });

    // 生成二维码
    if(!window.js_share_unbind && NE(".js_share_qrcode").length && typeof QRCode === "function"){
        var qrcode = NE(".js_share_qrcode"), 
            js_share_qrcode,
            qr_size = parseInt(js_share_config.qr_size, 10) || 120;
        var qrurl = shareParam.url;         

        // 设置默认标记为#，分享渠道标记及分享次数均显示于此标记之后。可根据需要修改为?
        var qranchor = "#";
        if (js_share_config.anchor === "?") {
            qranchor = "?";
        }

        // 处理分享数
        var ntes_weinxin_count = isNaN(parseInt(params.get(qrurl, "ntes_share_count", qranchor), 10)) ? 0 : parseInt(params.get(qrurl, "ntes_share_count", qranchor), 10);
        ntes_weinxin_count += 1;

        // 设置分享数
        qrurl = params.set(qrurl, "ntes_share_count", ntes_weinxin_count, qranchor);

        // 设置分享渠道 weixin
        qrurl = params.set(qrurl, "ntes_share", "sns_weixin", qranchor);

        setTimeout(function(){
            for (var i = 0; i < NE(".js_share_qrcode").length; i++) {
                js_share_qrcode = new QRCode(NE(".js_share_qrcode")[i], {
                    width: qr_size,
                    height:qr_size
                });

                js_share_qrcode.makeCode(qrurl)
            };
        }, 500);
    }

    // 复写微信分享，使用全局变量 js_share_unwechat 控制是否复写
    if(!window.js_share_unwechat){
        // 分享到微信
        var shareFriend = function() {
            WeixinJSBridge.invoke('sendAppMessage', {
                "appid": shareParam.appid,
                "img_url": shareParam.pic,
                "img_width": "300",
                "img_height": "300",
                "link": shareParam.url,
                "desc": shareParam.description,
                "title": shareParam.title
            }, function(res) {
                //_report('send_msg', res.err_msg);
            })
        }

        var shareTimeline = function() {
            WeixinJSBridge.invoke('shareTimeline', {
                "img_url": shareParam.pic,
                "img_width": "300",
                "img_height": "300",
                "link": shareParam.url,
                "desc": shareParam.description,
                "title": shareParam.title
            }, function(res) {
                //_report('timeline', res.err_msg);
            });
        }

        var shareWeibo = function () {
            WeixinJSBridge.invoke('shareWeibo', {
                "content": shareParam.description,
                "url": shareParam.url,
            }, function(res) {
                //_report('weibo', res.err_msg);
            });
        }
        // 当微信内置浏览器完成内部初始化后会触发WeixinJSBridgeReady事件。
        document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
            // 发送给好友
            WeixinJSBridge.on('menu:share:appmessage', function(argv) {
                shareFriend();
            });
            // 分享到朋友圈
            WeixinJSBridge.on('menu:share:timeline', function(argv) {
                shareTimeline();
            });
            // 分享到微博
            WeixinJSBridge.on('menu:share:weibo', function(argv) {
                shareWeibo();
            });
        }, false);
    }

    // 分享函数
    function shareto(type, link, title, description, pic, origin, sign, apk, ralateUid) {

        // 定义分享内容
        var js_share_config = window.js_share_config || {},
            _type = type || "hot163", // 默认分享到网易热
            url = link || js_share_config.url || window.location.href,
            ttl = title || js_share_config.title || document.title || "",
            desc = description || js_share_config.description || "",
            loft_desc, picture, _url;

        // 设置默认标记为#，分享渠道标记及分享次数均显示于此标记之后。可根据需要修改为?
        var anchor = "#", _anchor = sign || js_share_config.anchor || "#";
        if (_anchor === "?") {
            anchor = "?";
        }

        // 定义分享点击相关统计
        var nxkey = Math.random().toString().substr(2,6),
            nxtype;
        var clickLog = function(ntype){
            var nurl = window.location.protocol.replace(":","") + '://snstj.' + window.location.host + window.location.pathname + '?snstj_' + ntype,
                tjurl= 'http://analytics.163.com/ntes?_nacc=snstj&_nvid=VISITOR_CLIENT_NO_COOKIE_SUPPORT&_nvtm=0&_nvsf=0&_nvfi=0&_nlag=&_nlmf=0&_nres=&_nscd=&_nstm=0&_nurl=' + nurl + ntype + '&_ntit=' + encodeURIComponent(ttl) + '&_nref=&_nfla=&_nssn=&_nxkey=' + nxkey + '&_end1';
            if(typeof neteaseTracker === "function"){
                neteaseTracker( false, nurl, "", "snstj" );
                console.log(typeof neteaseTracker)
            }else{                
                var img = new Image();
                img.src = tjurl;
                console.log(typeof img)
            }
        }

        // 处理分享数
        var ntes_share_count = isNaN(parseInt(params.get(url, "ntes_share_count", anchor), 10)) ? 0 : parseInt(params.get(url, "ntes_share_count", anchor), 10);
        ntes_share_count += 1;

        // 设置分享数
        url = params.set(url, "ntes_share_count", ntes_share_count, anchor);

        // 设置图片picture
        if (pic){
            loft_desc = '<img src="' + pic + '">' + desc;
            picture = pic;
        } else if (js_share_config.pic && js_share_config.pic != "") {
            loft_desc = '<img src="' + js_share_config.pic + '">' + desc;
            picture = js_share_config.pic;
        } else {
            loft_desc = desc;
            picture = getImg();
        }

        // Lofter source
        var siteConf = {
          "auto": {
            "name": "网易汽车",
            "apk": "3619578257",
            "uid": "2293532401"
          },
          "bbs": {
            "name": "网易论坛",
            "apk": "603437721",
            "uid": "1929329727"
          },
          "blog": {
            "name": "网易博客",
            "apk": "603437721",
            "uid": "1929329727"
          },
          "book": {
            "name": "网易读书",
            "apk": "603437721",
            "uid": "1929329727"
          },
          "daxue": {
            "name": "网易校园",
            "apk": "405912016",
            "uid": "1712102637"
          },
          "digi": {
            "name": "网易数码",
            "apk": "515790538",
            "uid": "1929329727"
          },
          "edu": {
            "name": "网易教育",
            "apk": "3453163099",
            "uid": "1712102637"
          },
          "ent": {
            "name": "网易娱乐",
            "apk": "2935209169",
            "uid": "2674977220"
          },
          "fashion": {
            "name": "网易时尚",
            "apk": "603437721",
            "uid": "2678435373"
          },
          "play": {
            "name": "网易游戏",
            "apk": "886946399",
            "uid": "1871103515"
          },
          "gongyi": {
            "name": "网易公益",
            "apk": "3492075339",
            "uid": "1929329727"
          },
          "house": {
            "name": "网易房产",
            "apk": "1228447084",
            "uid": "2121786037"
          },
          "home": {
            "name": "网易家居",
            "apk": "1915520969",
            "uid": "2295046842"
          },
          "jiankang": {
            "name": "网易健康",
            "apk": "603437721",
            "uid": "5341241739"
          },
          "jiu": {
            "name": "网易酒香",
            "apk": "2706186385",
            "uid": "3194595594"
          },
          "lady": {
            "name": "网易女人",
            "apk": "1411153063",
            "uid": "2696068553"
          },
          "love": {
            "name": "网易花田",
            "apk": "2946569561",
            "uid": "2213659842"
          },
          "m": {
            "name": "网易应用",
            "apk": "603437721",
            "uid": "1929329727"
          },
          "manhua": {
            "name": "网易漫画",
            "apk": "603437721",
            "uid": "1929329727"
          },
          "media": {
            "name": "网易传媒",
            "apk": "603437721",
            "uid": "1929329727"
          },
          "men": {
            "name": "网易君子",
            "apk": "3831755683",
            "uid": "3755283417"
          },
          "mobile": {
            "name": "网易手机",
            "apk": "3009011254",
            "uid": "2088265107"
          },
          "money": {
            "name": "网易财经",
            "apk": "3369952587",
            "uid": "1974561081"
          },
          "news": {
            "name": "网易新闻",
            "apk": "603437721",
            "uid": "1929329727"
          },
          "nie": {
            "name": "网易游戏助手",
            "apk": "603437721",
            "uid": "1929329727"
          },
          "pet": {
            "name": "网易宠物",
            "apk": "603437721",
            "uid": "1929329727"
          },
          "shoucang": {
            "name": "网易收藏",
            "apk": "603437721",
            "uid": "1929329727"
          },
          "sports": {
            "name": "网易体育",
            "apk": "618670090",
            "uid": "2757394263"
          },
          "t": {
            "name": "网易微博",
            "apk": "603437721",
            "uid": "1929329727"
          },
          "tech": {
            "name": "网易科技",
            "apk": "3628156158",
            "uid": "1905687615"
          },
          "travel": {
            "name": "网易旅游",
            "apk": "2026652209",
            "uid": "1663688317"
          },
          "v": {
            "name": "网易视频",
            "apk": "603437721",
            "uid": "1929329727"
          }
        }
        var splitHost = location.host.split("."),
            sitekey = splitHost[splitHost.length - 3],
            source = origin || js_share_config.source || (siteConf[sitekey] && siteConf[sitekey].name) || '网易',
            appkey = apk || js_share_config.appkey || (siteConf[sitekey] && siteConf[sitekey].apk) || '603437721',
            uid = ralateUid || js_share_config.uid || (siteConf[sitekey] && siteConf[sitekey].uid) || '1929329727',
            charset = 'utf-8';

        // 生成点击统计url
        // function clickLogUrl(tj_type){
        //     return 'http://analytics.163.com/ntes?_nacc=snstj&_nvid=VISITOR_CLIENT_NO_COOKIE_SUPPORT&_nvtm=0&_nvsf=0&_nvfi=0&_nlag=&_nlmf=0&_nres=&_nscd=&_nstm=0&_nurl=' + nurl + tj_type + '&_ntit='+ntit+'&_nref=&_nfla=&_nssn=&_nxkey='+nxkey+'&_end1';
        // }

        switch (_type) {

            // 新浪微博
            case "sina":
            case "weibo":
            case "sinawb":
                url = params.set(url, "ntes_share", "sns_weibo", anchor);
                _url = "http://service.weibo.com/share/share.php?appkey=" + appkey + "&ralateUid=" + uid + "&url=" + encodeURIComponent(url) + "&pic=" + picture + "&title=" + encodeURIComponent(ttl) + " " + encodeURIComponent(desc);

                nxtype = "weibo";
            break;

            // 人人网
            case "rr":
            case "renren":
                url = params.set(url, "ntes_share", "sns_renren", anchor);
                _url = "http://widget.renren.com/dialog/share?resourceUrl=" + encodeURIComponent(url) + "&title=" + encodeURIComponent(ttl) + "&pic=" + picture + "&description=" + encodeURIComponent(desc);

                nxtype = "renren";
            break;

            // 有道云笔记
            case "yodao":
            case "youdao":
            case "ydCloud":
                url = params.set(url, "ntes_share", "sns_youdao", anchor);
                _url = "http://note.youdao.com/memory/?url=" + encodeURIComponent(url) + "&title=" + encodeURIComponent(ttl) + "&pic=" + picture + "&product=" + encodeURIComponent("网易新闻") + "&summary=" + encodeURIComponent(desc);

                nxtype = "youdao";
            break;

            // qq空间
            case "qzone":
            case "qqZone":
                url = params.set(url, "ntes_share", "sns_qqZone", anchor);
                _url = "http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=" + encodeURIComponent(url) + "&title=" + encodeURIComponent(ttl) + "&pics=" + picture + "&desc=" + encodeURIComponent(desc);
                
                nxtype = "qzone";
            break;

            // 易信
            case "yx":
            case "yixin":
                url = params.set(url, "ntes_share", "sns_yixin", anchor);
                _url = "https://open.yixin.im/share?appkey=yxb7d5da84ca9642ab97d73cd6301664ad&type=webpage&title=" + encodeURIComponent(ttl) + "&url=" + encodeURIComponent(url) + "&pic=" + picture + "&desc=" + encodeURIComponent(desc);  
                //

                nxtype = "yixin";
            break;

            // 易信图片
            case "yx_image":
            case "yixin_image":
                url = params.set(url, "ntes_share", "sns_yixin", anchor);
                _url = "https://open.yixin.im/share?appkey=yxb7d5da84ca9642ab97d73cd6301664ad&type=image&title=" + encodeURIComponent(ttl) + "&url=" + encodeURIComponent(url) + "&pic=" + picture + "&desc=" + encodeURIComponent(desc);
                
                nxtype = "yixin";
            break;

            // Lofter
            case "163":
            case "lofter":
                url = params.set(url, "ntes_share", "sns_lofter", anchor);
                _url = "http://www.lofter.com/sharetext/?from=163&title=" + encodeURIComponent(ttl) + "&source=" + encodeURIComponent(source) + "&sourceUrl=" + encodeURIComponent(url) + "&charset=" + charset + "&content=" + encodeURIComponent(loft_desc);

                nxtype = "lofter";
            break;

            // 网易热  
            case "hot163":
            case "163hot":
            case "hot":
                url = params.set(url, "ntes_share", "sns_hot163", anchor);
                _url = "http://hot.163.com/share.html?url=" + encodeURIComponent(url) + "&title=" + encodeURIComponent(ttl) + "&image=" + encodeURIComponent(picture);

                nxtype = "hot163";
            break;

            // 默认 Lofter
            default:
                url = params.set(url, "ntes_share", "sns_lofter", anchor);
                _url = "http://www.lofter.com/sharetext/?from=163&title=" + encodeURIComponent(ttl) + "&source=" + encodeURIComponent(source) + "&sourceUrl=" + encodeURIComponent(url) + "&charset=" + charset + "&content=" + encodeURIComponent(loft_desc);

                nxtype = "lofter";
            break;

        }
        try {
            window.open(_url);
            clickLog(nxtype);
        } catch (e) {}
    }

    // 分享到微信

    // 暴露方法
    window.shareto = shareto;
})();

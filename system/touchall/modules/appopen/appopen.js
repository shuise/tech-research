define(function(){
    if (typeof window.openCourse !== 'object') {
        window.openCourse = {};
    }

    if(typeof window.openCourse.open !=='function'){
        var ua = navigator.userAgent.toLowerCase(),
            locked = false,
            domLoaded = document.readyState==='complete',
            delayToRun;

        function customClickEvent() {
            var clickEvt;
            if (window.CustomEvent) {
                clickEvt = new window.CustomEvent('click', {
                    canBubble: true,
                    cancelable: true
                });
            } else {
                clickEvt = document.createEvent('Event');
                clickEvt.initEvent('click', true, true);
            }

            return clickEvt;
        }

        function getAndroidVersion() {
            var match = ua.match(/android\s([0-9\.]*)/);
            return match ? match[1] : false;
        }

        var noIntentTest = /aliapp|360 aphone|weibo|windvane|ucbrowser|baidubrowser/.test(ua);
        var hasIntentTest = /chrome|samsung|honor/.test(ua);
        var isAndroid = /android|adr/.test(ua) && !(/windows phone/.test(ua));
        var canIntent = !noIntentTest && hasIntentTest && isAndroid;
        var openInIfr = /weibo|m353/.test(ua);
        var inWeibo = ua.indexOf('weibo')>-1;

        if (ua.indexOf('m353')>-1 && !noIntentTest) {
            canIntent = false;
        }

        // 是否在 webview 下
        var inWebview = '';
        if (inWebview) {
            canIntent = false;
        }

        /**
         * 打开app
         * @param   {object}    params  唤起app的参数设置
         * @param   {string}    jumpUrl 唤起app后，android下要跳转到的URL；
         */
        openCourse.open = function (params) {
            domLoaded = document.readyState==='complete';
            if (!domLoaded && (ua.indexOf('360 aphone')>-1 || canIntent)) {
                var arg = arguments;
                delayToRun = function () {
                    openCourse.open.apply(null, arg);
                    delayToRun = null;
                };
                return;
            }

            // 唤起锁定，避免重复唤起
            if (locked) {
                return;
            }
            locked = true;

            var o;
            // 参数容错
            if (typeof params==='object') {
                o = params;
            } else {
                o = {
                    params:{
                        url:encodeURIComponent(location.href)
                    },
                    jumpUrl:''
                };
            }

            var _params = '';
            //_params = 'url='+o.params['url'];
            _params = 'plid='+ o.params['plid']+"&mid="+ o.params['mid'];
            // 唤起scheme
            var schemePrefix;
            schemePrefix = schemePrefix || 'neteaseVopen';

            if (!canIntent) {    //ios下
                var openUrl = schemePrefix + '://videoDetail?' + _params;
                var cur_url = window.location.href;

                /*            if ( ua.indexOf('qqbrowser') > -1 || ( ua.indexOf('safari') > -1 && ua.indexOf('os 9_') > -1 ) ) {
                 if(ua.indexOf('qqbrowser') > -1){      //ios9  qq浏览器使用iframe唤起方式
                 var ifr = document.createElement('iframe');
                 ifr.src = openUrl;
                 ifr.style.display = 'none';
                 document.body.appendChild(ifr);
                 }else if(ua.indexOf('safari') > -1 && ua.indexOf('os 9_') > -1){
                 var openSchemeLink = document.getElementById('openSchemeLink');
                 if (!openSchemeLink) {
                 openSchemeLink = document.createElement('a');
                 openSchemeLink.id = 'openSchemeLink';
                 openSchemeLink.style.display = 'none';
                 document.body.appendChild(openSchemeLink);
                 }
                 openSchemeLink.href = openUrl;
                 // 执行click
                 setTimeout(function(){
                 openSchemeLink.dispatchEvent(customClickEvent());
                 },1000);
                 }
                 } */
                if(ua.indexOf('safari') > -1 && ua.indexOf('os 9_') > -1 && ua.indexOf('qqbrowser') < 0){
                    var openSchemeLink = document.getElementById('openSchemeLink');
                    if (!openSchemeLink) {
                        openSchemeLink = document.createElement('a');
                        openSchemeLink.id = 'openSchemeLink';
                        openSchemeLink.style.display = 'none';
                        document.body.appendChild(openSchemeLink);
                    }
                    openSchemeLink.href = openUrl;
                    // 执行click
                    setTimeout(function(){
                        openSchemeLink.dispatchEvent(customClickEvent());
                    },1000);
                } else {
                    var ifr = document.createElement('iframe');
                    ifr.src = openUrl;
                    ifr.style.display = 'none';
                    document.body.appendChild(ifr);
                }
            } else {
                // android 下 chrome 浏览器通过 intent 协议唤起app
                var intentUrl = 'intent://videoDetail?'+_params+'#Intent;scheme='+schemePrefix+';package=com.netease.vopen;end';

                var openIntentLink = document.getElementById('openIntentLink');
                if (!openIntentLink) {
                    openIntentLink = document.createElement('a');
                    openIntentLink.id = 'openIntentLink';
                    openIntentLink.style.display = 'none';
                    document.body.appendChild(openIntentLink);
                }
                openIntentLink.href = intentUrl;
                // 执行click
                setTimeout(function(){
                    openIntentLink.dispatchEvent(customClickEvent());
                },1000);
            }

            // 延迟移除用来唤起app的IFRAME并跳转到下载页
            var _delayTime= !canIntent && ( ua.indexOf('qqbrowser') > -1 || ( ua.indexOf('safari') > -1 && ua.indexOf('os 9_') > -1 ) )?5000:1000;
            setTimeout(function () {
                location.href = 'http://open.163.com/appdownload/mobile';
            }, _delayTime);


            // 唤起加锁，避免短时间内被重复唤起
            setTimeout(function () {
                locked = false;
            }, 2500)
        };
        if (!domLoaded) {
            document.addEventListener('DOMContentLoaded', function () {
                domLoaded = true;
                if (typeof delayToRun === 'function') {
                    delayToRun();
                }
            }, false);
        }
    }
});
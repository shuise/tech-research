addToHomeConfig = {
  disableLoading: false,
  message: '添加"手机网易网"快捷方式到桌面。请按 %icon 然后点选<strong>添加至主屏幕</strong>。'
}
scrollTo(0, 1);

var tpl = {};

var commonFun = {
  importJs : function(a, b, c) {
    var d;
    d = document.createElement('script');
    d.src = a;
    c && (d.charset = c);
    d.onload = function(e) {
      this.onload = this.onerror = null;
      this.parentNode.removeChild(this);
      b && b(!0, d.src);
    };
    d.onerror = function() {
      this.onload = this.onerror = null;
      this.parentNode.removeChild(this);
      b && b(!1);
    };
    document.head.appendChild(d);
  },

  /**
   * [热度指数四舍五入保留一位小数]
   */
  round : function (number,Digit){
    with(Math){
        return round(number / 9999 * pow(10,Digit)) / pow(10,Digit) + "万";
    }
  }
}
/**
 * [预加载图片和广告]
 */
;(function(X) {
  document.getElementById('mask').style.display = 'none';
  X('.m-news,.hide,footer').css({
    display: 'block'
  });

  //判断是否为锤子浏览器置入的url
  var url_flag = window.location.search.split("=")[1]
  if(url_flag != "smartisan") {
    //头部广告
    var bannerTopUrl = "http://3g.163.com/touch/advertise/adlist/00340BC8/0-10.html",
        windowWidth = document.documentElement.clientWidth;
    window.newAdvertiseList00340BC8 = function(data) {
      window.newAdvertiseList00340BC8 = null
      if (!data) return;
      var banner_href = '<a href="<#=imgUrl#>"><img class="img1" width="100%" src="<#=img1#>"/><img class="img2" width="100%" src="<#=img2#>"/></a>',
          tmp = "",
          dataCon = data["00340BC8"];
      if (dataCon.length != 0) {
        var suiJi = Math.floor(Math.random() * dataCon.length),imgsrc;
        dataCon = dataCon[suiJi];
        imgsrc = dataCon.imgsrc.split('||');
        tmp = NTUI.simpleParse(banner_href, {
          img1: imgsrc[0],
          img2: imgsrc[1] || imgsrc[0],
          imgUrl: dataCon.url
        });
        setTimeout(function(){
          X(".top-gg")[0].innerHTML = tmp;
          if(!!imgsrc[1]){
            X(".top-gg").css({
              "display": "block",
              "height": 240 / 640 * windowWidth + 'px'
            });
            X('.top-gg .img1').on('load',function(){
              var that = X(this)
              that.css({opacity: 1})
              setTimeout(function(){
                X(".top-gg").css({
                  "display": "block",
                  "height":  100 / 640 * windowWidth + 'px'
                })
                X('.top-gg').one('webkitTransitionEnd', function(){
                  X('.top-gg .img1').css({opacity: 0}).one('webkitTransitionEnd', function(){
                    X(this).hide()
                    X('.top-gg .img2').css({display: 'block'})
                    setTimeout(function(){X('.top-gg .img2').css({opacity: 1})}, 0)
                  })
                })
              }, 3500)
            })
          }else{
            X('.top-gg').show()
            X('.top-gg img').css({opacity: 1})
          }
        },1500);
      }
    }
    NTUI.importJs(bannerTopUrl);

    //视频广告
    ;(function(){
      var videoAdsUrl = "http://3g.163.com/touch/advertise/adlist/00340UIP/0-10.html";

      window.newAdvertiseList00340UIP = function(data) {
        window.newAdvertiseList00340UIP = null
        if (!data) return;
        var sinPic = '<div class="title"><#=title#></div><div class="sin-pic-holder"><a href="<#=imgUrl#>"><img class="single-pic" src="<#=imgSrc1#>" /></a></div>',
            ads_video = '<div class="title"><#=title#></div><div class="video-holder"><video id="video" style="display: none;width: 100%;" src="<#=stitle#>"></video><img class="single-pic" src="<#=imgSrc1#>" /></div>',
            ads_pics = '<div class="title"><#=title#></div><div class="plu-pics-holder"><div class="plu-pic"><a href="<#=videoSrc#>"><img src="<#=imgSrc1#>" /><img src="<#=imgSrc2#>" /><img src="<#=imgSrc3#>" /></a></div></div>',
            tmp = "",
            dataCon = data["00340UIP"];
        if(dataCon.length != 0){
          var suiJi = Math.floor(Math.random() * dataCon.length),imgsrc;
          dataCon = dataCon[suiJi];
          imgsrc = dataCon.imgsrc.split('||');
          if(imgsrc.length == 1){
            if(dataCon.stitle != ""){
              tmp = NTUI.simpleParse(ads_video, {
                title: dataCon.title,
                stitle: dataCon.stitle,
                imgSrc1: imgsrc[0]
              });
            }else{
              tmp = NTUI.simpleParse(sinPic, {
                imgSrc1: imgsrc[0],
                title: dataCon.title,
                imgUrl:dataCon.url,
                digest: dataCon.digest
              });
            }
          }else{
            tmp = NTUI.simpleParse(ads_pics, {
              imgSrc1: imgsrc[0],
              imgSrc2: imgsrc[1],
              imgSrc3: imgsrc[2],
              title: dataCon.title,
              imgUrl:dataCon.url,
              digest: dataCon.digest
            });
          }

          $(".m-f-d")[0].innerHTML = tmp;
        }
        // 视频广告处理
        ;(function(X){
          var video = X('#video')
          var ua = navigator.userAgent
          var img = X('.video-holder').find('img')
          if(ua.match(/android.*UCBrowser/i)){
            img.hide()
            video.attr('poster', img.attr('src')).show()
          }
          X('.video-holder').click(function(){
            video.show()
            video[0].play()
            video[0].webkitRequestFullscreen();
          })
          if(video[0]){
            video[0].onend = video[0].onpause = function(){
              video.hide()
            }
            document.onwebkitfullscreenchange = function(){
              video.hide()
            }
          }
        })($);
      }

      NTUI.importJs(videoAdsUrl);
    }());

    //浮层广告
    ;(function() {

      var fucengUrl = "http://3g.163.com/touch/advertise/adlist/00340BGR/0-1.html",
          fuceng_num = 0;

      window.newAdvertiseList00340BGR = function(data) {
        if (!data || !data["00340BGR"] || data["00340BGR"].length <= 0) return;
        var fuceng_href = '<a href="<#=imgUrl#>" class="u-layer-link"><img class="u-layer-con" src="<#=imgSrc#>"/></a>',
            tmp = "",
            dataCon = data["00340BGR"][0];
        fuceng_num = data["00340BGR"].length;
        tmp = NTUI.simpleParse(fuceng_href, {
          imgSrc: dataCon.imgsrc,
          imgUrl: dataCon.url
        });
        $(".u-layer-wrapper").prepend($(tmp));
        $('.u-layer-wrapper .close').click(function(){
          $('.u-layer-wrapper').hide()
        })
      }
      NTUI.importJs(fucengUrl);

      function readCookie(name) {
        var nameEQ = name + "=",
            ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0) == ' ') c = c.substring(1, c.length);
          if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
      }

      function addLoadEvent(fun) {
        var oldOnload = window.onload;
        if (typeof window.onload != "function") {
          window.onload = fun;
        } else {
          window.onload = function() {
            oldOnload();
            fun();
          }
        }
      };

      function funAd() {
        var wrapper = $(".u-layer-wrapper")
        if (fuceng_num > 0) {
          var dateEl = new Date(),
              expireTime_one = 1,
              expireTime_ten = 10;
          if (readCookie("add_show_count") !== "1" && readCookie("add_show_count") !== "2") {
            //first time enter
            dateEl.setTime(dateEl.getTime() + expireTime_ten * 60 * 1000); // ten minutes
            document.cookie = "add_show=1;expires=" + dateEl.toGMTString() + ";";
            dateEl.setTime(dateEl.getTime() + expireTime_one * 24 * 60 * 60 * 1000); // one day
            document.cookie = "add_show_count=1;expires=" + dateEl.toGMTString() + ";";
            wrapper.show()
            setTimeout(function(){
              wrapper.addClass('active')
            }, 0)
          } else if (readCookie("add_show") !== "1" && readCookie("add_show_count") == "1") {
            //second time enter
            wrapper.show()
            setTimeout(function(){
              wrapper.addClass('active')
            }, 0)
            var dateEl = new Date();
            dateEl.setTime(dateEl.getTime() + expireTime_one * 24 * 60 * 60 * 1000); // one day
            document.cookie = "add_show_count=2;expires=" + dateEl.toGMTString() + ";";
          } else {
            $(".u-layer-wrapper").css("display", "none");
          };
          $(".u-layer-wrapper")[0].addEventListener("webkitTransitionEnd", function() {
            var that = this;
            setTimeout(function() {
              $(that).css("display", "none");
            }, 3000);
          }, false);
        } else {
          $("#f").css("display", "none");
        }
      };
      addLoadEvent(funAd);
      $(".u-layer-shut").click(function() {
        $(".u-layer-wrapper").css("display", "none");
      });
    }());

    // qq浏览器广告
    var isQqbrowser = navigator.userAgent.match(/MQQBrowser/ig),
      isUcbrowser = navigator.userAgent.match(/UCBrowser/ig);
    if (!isUcbrowser) {
      NTUI.importJs("http://3g.163.com/touch/advertise/adlist/00340F0R/0-1.html");
    }
    window.newAdvertiseList00340F0R = function(data) {
      if(!data["00340F0R"][0]){
        return
      }
      tpl.qqbrowserTpl = '<a href="<#=url#>"><#=title#></a>';
      var str = NTUI.simpleParse(tpl.qqbrowserTpl, {
        url: data["00340F0R"][0]["url"],
        title: data["00340F0R"][0]["title"]
      });
      X("#text-link01").addClass("u-wzGg g-p20");
      X("#text-link01").html(str);
    }
  }else{
    X(".u-layer-wrapper,.top-gg,.u-wzGg,.gg-yd,.middle-a-d,.m-news iframe").hide();
  }

})($);

/**
 * [要文头图/轮播图]
 */
;(function(X) {
  // 适配新闻类别 图集 专题等
  X('#m-focusImage [data-type="news"], .m-newsfocus a, .m-focusImage [data-type="news"]').each(function() {
    var link = X(this),
        subtitle = link.attr('data-subtitle'),
        from = link.attr('data-from'),
        imgs = link.attr('data-img'),
        photoSet = subtitle.split('|'),
        _height = X("#m-focusImage").height() * 2;
    // 头图
    if (imgs) {
      imgs = imgs.split('||');
      var img = "http://s.cimg.163.com/i/"+imgs[0].replace('http://', '') + ".640x" + _height + ".jpg";
      setTimeout(function(){
        link.find('img').attr('src', img);
      },1500);
    }
    if (!subtitle) {
      return
    }
    // 图集
    if (photoSet.length > 1) {
      var setid = photoSet[1];
      var channelid = photoSet[0].slice(-4)
      setid && link.attr('href', 'http://3g.163.com/touch/photoview.html?qd=' + from + '&setid=' + setid + '&channelid=' + channelid);
    }
    // 专题
    if (subtitle.length == 14 && subtitle[0].toLowerCase() == 's') {
      link.attr('href', 'http://3g.163.com/ntes/special/00340EPA/wapSpecialModule.html?qd=' + from + '&sid=' + subtitle)
    }
    // 直播室
    if (subtitle.length == 5 && typeof +subtitle == 'number') {
      link.attr('href', 'http://3g.163.com/ntes/special/00340BF8/seventlive.html?qd=' + from + '&roomid=' + subtitle)
    }
  })

  var i = 0,
      len = X('#m-focusImage a').length,
      html = '';
  for (; i < len; i++) {
    if (i == 0) {
      html += '<li class="current"></li>';
    } else {
      html += '<li></li>';
    }
  }
  X('#m-focusImage .u-ctrls ul').html(html);

  // 图集滑动
  function SlidePhoto(node) {
    var photoCtrls = node.find('.u-ctrls li');
    var gallerySlide = new NTUI.slide(node.find('.u-gallery')[0], {
      onTouchEnd: function(e, cp) {
        photoCtrls.removeClass('current');
        photoCtrls[cp].className = 'current';
      }
    });

  }

  //滑动
  X.each($('.slider'), function(i, n) {
    new SlidePhoto($(n));
  })
  //new SlidePhoto("#indexPhoto");
  //要闻头图
  //
  if (X('#m-focusImage a').length < 2) {
    X('#m-focusImage .u-ctrls').hide();
  } else {
    new SlidePhoto(X('#m-focusImage'));
  }

})($);

/**
 * [模块公共功能]
 */
;(function(X) {

  //tab选项卡
  function SliderTab(node,eml1,eml2) {
    var photoCtrls = node.find(eml1);
    this.photoCtrls = photoCtrls;
    var that = this
    this.tabSlide = new NTUI.slide(node.find(eml2)[0], {
      onTouchEnd: function(e, cp) {
        photoCtrls.removeClass('on');
        photoCtrls[cp].className = 'on';
        photoCtrls[cp].click();
      }
    });
    this.photoCtrls.on('click', function(e){
      X(this).siblings().removeClass('on');
      X(this).addClass('on');
      var index = X(this).index()
      that.tabSlide.slideToPage(index)
      if (index == 3){
        X(this).parents('.newsList').find('.index-piclist').eq(index + 1).removeClass('mask-bg')
      }
    })
  }
  //图片
  new SliderTab(X('.picture-tab'),'.u-pic-tab li','.u-photo-list');
  //体育
  new SliderTab(X('.sport-tab'),'.u-tab li','.u-list');
  //趣闻
  new SliderTab(X('.photo-tab'),'.u-tab li','.u-list');
  //原创
  new SliderTab(X('.special-tab'),'.u-tab li','.u-list');

  // 导航展开
  X('.m-newsNav2').click(function(e) {
    if (!$(this).hasClass('u-newsNav-toolbar')) {
      if (e.target.tagName !== 'A') {
        $(this).addClass('u-newsNav-toolbar');
      }
    } else {
      $(this).removeClass('u-newsNav-toolbar');
    }
  })
  // 公共模块底部tab选项卡
  var len = 0,f = 0,cq = 0;
  X('.u-tab li').click(function(){
    var btnText = X(this)[0].textContent,
        t = X(this).index(),
      _btnStr = X(this).parents('.newsList').find('.pageBtn')[0];

    _btnStr.textContent = "进入" + btnText + "栏目";
    var docid = X(this).parents('.newsList').find('.u-list ul').eq(t).attr("docid");
    if(btnText == "NBA"){
      _btnStr.href = "http://3g.163.com/touch/nba"
    }else if(btnText == "要闻"){
      _btnStr.textContent = "进入体育频道"
      _btnStr.href = "http://3g.163.com/touch/sports?qd=gionee";
    }else if(btnText == "编辑精选"){
      _btnStr.textContent = "进入原创频道"
      _btnStr.href = "http://3g.163.com/touch/exclusive/?qd=gionee"
    }else if(btnText == "轻松一刻"){
      _btnStr.href = "http://3g.163.com/ntes/special/0034073A/touchlist.html?docid=A9O2HAB6jiying&title=轻松一刻&qd=gionee"
    }else if(btnText == "大国小民"){
      _btnStr.href = "http://3g.163.com/ntes/special/0034073A/touchlist.html?docid=B2TCDCIRbzhang&title=大国小民&qd=gionee"
    }else if(btnText == "深夜畅聊"){
      _btnStr.href = "http://3g.163.com/ntes/special/0034073A/touchlist.html?docid=A9O2L9KIjiying&title=深夜畅聊&qd=gionee"
    }else if(btnText == "中超"){
      _btnStr.href = "http://3g.163.com/ntes/special/0034073A/touchlist.html?docid=9ARJL5K0bjwangjian&title=中超&qd=gionee"
    }else if(btnText == "国际足球"){
      _btnStr.href = "http://3g.163.com/ntes/special/0034073A/touchlist.html?docid=9ARJLF58bjwangjian&title=国际足球&qd=gionee"
    }else if(btnText == "网易哒哒"){
      _btnStr.textContent = "进入网易哒哒频道"
      _btnStr.href = "http://d.news.163.com/?dada3g&qd=gionee"
    }else if(btnText == "网易热"){
      _btnStr.textContent = "进入网易热频道"
      _btnStr.href = "http://hot.163.com/?qd=gionee"
    }else if(btnText == "段子"){
      _btnStr.textContent = "进入网易哒哒频道"
      _btnStr.href = "http://d.news.163.com/?dada3g&qd=gionee"
    }else{
      _btnStr.href = "http://3g.163.com/ntes/special/0034073A/touchlist.html?docid=" + docid + "&qd=gionee&title=" + btnText;
    }
  });

  //图片底部tab
  X('.u-pic-tab li').click(function(){
    var t = X(this).index();
    //获取数据接口
    var eml,topicId,portUrl,emls;
    if(t > 0 && this.dataset.loaded != 1){

      topicId = this.dataset.topicid
      eml = $(this).parents('.newsList').find('.index-piclist')
      eml.each(function(index, el) {
        if($(el).attr("data-topicid") == topicId){
          emls = el
        }
      });
      portUrl = 'http://c.3g.163.com/photo/api/jsonp/list/0096/' + topicId + '.json';
      commonPhotoList(emls,portUrl,t + 1);
    }
    this.dataset.loaded = 1
  });

  var url_flag = window.location.search.split("=")[1];//获取置入锤子浏览器的url参数标志
  if(url_flag != "smartisan") {
    //视频
    new SliderTab(X('.video-tab'),'.u-video-tab li','.u-pic-list');
    //视频底部tab
    X('.u-video-tab li').click(function(){
      var t = X(this).index();
      //获取数据接口
      var eml,topicId,portUrl;
      if(t > 0 && this.dataset.loaded != 1){

        topicId = this.dataset.topicid
        eml = $(this).parents('.newsList').find('.index-piclist[data-topicid=' + topicId + ']')
        portUrl = 'http://c.m.163.com/nc/video/list/' + topicId + '/n/0-10.html?callback=abc';
        commonVideoList(eml,portUrl,t + 1);
      }
      this.dataset.loaded = 1
    });
  }

})($);

/**
 * [财经模块]
 */
;(function(D) {
  //股票指数
  if ($(".stockWrapper").attr('data-open') != 'true') {
    $(".stockWrapper").css({
      'text-align': 'center'
    })
    return
  }

  var stocks = ['0000001', 'hkHSI', 'US_DOWJONES'],
    stockNames = ['上证指数', '恒生指数', '道琼斯'],
    stockWrapper = $(".stockWrapper"),
    str = "",
    per, isUp, isUpM,
    stockLinks = ['http://m.money.163.com/stock/', 'http://m.money.163.com/hkstock/', 'http://m.money.163.com/usstock/'];
  Number.prototype.toPercent = function() {
    return (Math.round(this * 10000) / 100).toFixed(2) + '%';
  }
  setTimeout(function(){
    D.ajax({
      type: 'GET',
      url: 'http://api.money.126.net/data/feed/' + stocks[0] + ',' + stocks[1] + ',' + stocks[2],
      dataType: 'jsonp',
      success: function(data) {
        // 上证指数、深证指数、恒生指数
        for (x in stocks) {
          if (data[stocks[x]].percent > 0) {
            isUp = 'class="bgred"'; //红色背景
            isUpM = '+'; //加号
          } else {
            isUp = '';
            isUpM = '';

          }
          per = (data[stocks[x]].percent.toPercent());
          str += '<dl class="stock"><dt><a href="' + stockLinks[x] + '">' + data[stocks[x]].price + '</a></dt><dd ' + isUp + '><a class="dig" href="' + stockLinks[x] + '">' + stockNames[x] + isUpM + per + '</a></dd></dl>';
        }
        stockWrapper.html(str);
      },
      error: function() {
        stockWrapper.html("数据错误");
      }
    });
  },1500);
})($);

/**
 * [娱乐模块]
 */
;(function(X) {
  //娱乐图集
  var func = window.photosetlist || function(){};
  window.photosetlist = function(data){
    func(data)
    var arr = []
    if(data[0].seturl.match(/54GK0096/)){
      for (i = 5; i < 7; i++) {
        tpl.photoList = '<div class="u-mask"><a href="http://3g.163.com/touch/photoview.html?qd=gionee&setid=<#=setid#>"><img src="<#=src#>"><span class="title"><#=setname#></span></a></div>';
        arr.push(NTUI.simpleParse(tpl.photoList, {
          src: data[i].clientcover,
          setname: data[i].setname,
          setid: data[i].setid,
          rnum: data[i].replynum
        }));
      }
      X('#entPhoto').html(arr.join(''));
    }
  }
  commonFun.importJs('http://c.3g.163.com/photo/api/jsonp/list/0096/54GK0096.json');
})($);

/**
 * [热搜模块]
 */

/**
 * [图片模块]
 */
;(function(X) {

  X("#selection a").each(function(){
    var link = X(this),
        subtitle = link.attr('data-subtitle'),
        from = link.attr('data-from'),
        imgs = link.attr('data-img'),
        photoSet = subtitle.split('|');
    if (imgs) {
      imgs = imgs.split('||');
      var img = "http://s.cimg.163.com/i/"+imgs[0].replace('http://', '') + ".320x196.jpg";
      setTimeout(function(){
        link.find('img').attr('src', img);
      },1500);
    }
    if (!subtitle) {
      return
    }
    // 图集
    if (photoSet.length > 1) {
      var setid = photoSet[1];
      var channelid = photoSet[0].slice(-4)
      setid && link.attr('href', 'http://3g.163.com/touch/photoview.html?qd' + from + '.1&setid=' + setid + '&channelid=' + channelid);
    }
    // 专题
    if (subtitle.length == 14 && subtitle[0].toLowerCase() == 's') {
      link.attr('href', 'http://3g.163.com/ntes/special/00340EPA/wapSpecialModule.html?qd=' + from + '.1&sid=' + subtitle)
    }
    // 直播室
    if (subtitle.length == 5 && typeof +subtitle == 'number') {
      link.attr('href', 'http://3g.163.com/ntes/special/00340BF8/seventlive.html?qd=' + from + '.1&roomid=' + subtitle)
    }
  });
  //图集
  commonPhotoList = function(eml,urlStr,t) {
    var func = window.photosetlist || function(){};
    window.photosetlist = function(data){
      func(data)
      var arr = [],_num
      var list = "/" + urlStr.slice(-13,-5) + "/"
      if(data[0].seturl.match(list)){
        X(eml).eq(0).removeClass('mask-bg')
        for (i = 0; i < 4; i++) {
          tpl.photoList = '<div class="u-mask"><a href="http://3g.163.com/touch/photoview.html?qd='+ t +'&setid=<#=setid#>"><img src="<#=imgsrc#>"><span class="title"><#=setname#></span></a></div>';
          arr.push(NTUI.simpleParse(tpl.photoList, {
            imgsrc: "http://s.cimg.163.com/i/"+data[i].clientcover.replace('http://', '') + ".320x196.jpg",
            setname: data[i].setname,
            setid: data[i].setid,
            rnum: data[i].replynum
          }));
        }
        X(eml).html(arr.join(''));
      }
    }
    commonFun.importJs(urlStr);
  };

  commonPhotoList('#hotNew','http://c.3g.163.com/photo/api/jsonp/list/0096/54GI0096.json','1');

})($);

/**
 * [体育模块]
 */
;(function(X) {
  //体育赛事
  window.jsonp = function(data) {
    window.jsonp = null
    if (data.data && data.data.length > 0) {
      var tpl = '<a href="http://caipiao.163.com/static/news/matchList.htm"><table><tr><td colspan="3" class="title"><#=leagueName#></td></tr><tr><td><img src="<#=hostLogoUrl#>"></td><td class="middle"><#=score#></td><td><img src="<#=visitLogoUrl#>"></td></tr><tr><td><#=hostName#></td><td><span class="status"><#=statusDesc#></span></td><td><#=visitName#></td></tr></table></a>';
      var item = {};
      var arr = [];
      var length = 2
      if(data.data.length == 1){
        length = 1
      }
      if(!data.data || data.data.length == 0){
        X('#sportsData').hide();
        return
      }
      for (var i = 0; i < length; i++) {
        item = data.data[i];
        if (item.score == '' || item.score == "-:-") {
          item.score = '<span class="time">' + item.startTime.substr(5) + '</span>';
        } else {
          item.score = '<span class="score">' + item.score + '</span>';
        }
        arr.push(NTUI.simpleParse(tpl, item));
      }
      X('#sportsData').html(arr.join(''));
    }else{
      X('#sportsData').hide();
    }
  }
  NTUI.importJs('http://caipiao.163.com/static/news/entrance.jsonp.htm');
})($);

/*置入锤子手机浏览器的网易新闻首页去掉视频、bobo、房产、读小说和应用模块*/
;(function(X){
  var url_flag = window.location.search.split("=")[1];//获取置入锤子浏览器的url参数标志
  if(url_flag != "smartisan") {
    /**
     * [BOBO模块]
     */
    ;(function(X) {
      NTUI.importJs('http://www.bobo.com/spe-data/api/anchors-hot-temp.htm', function(data) {
        var arr = [];
        var item;
        var live = '';
        if (anchorHot) {
          for (var i = 0; i < 2; i++) {
            item = anchorHot[i];
            if (item.live == 'true') {
              live = '<span class="zhibo">直播</span>';
            } else {
              live = '';
            }
            arr.push('<a href="http://www.bobo.com/special/bobo_live/?roomId=' + item.roomId + '&userNum=' + item.userNum + '&f=163.3g"><span class="img"><img src="http://imgsize.ph.126.net/?imgurl=' + item.cover + '_180x120x1x85.ph">' + live + '<span class="count"><span>' + item.followedCount + '</span></span></span><span class="title">' + item.nick + '</span><span class="longth">' + item.duration + '</span></a>');
          }
          $('#bobo').html(arr.join(''));
        }
      });
    })($);

    /**
     * [房产模块]
     */

    ;(function(X) {
      var tpl = {
        list: '<li class="g-p20"><a href="<#=murl#>"><#=title#><span> <#=joincount#> 跟贴</span></a></li>',
        bottom: '<a class="pageBtn cateEntry" href="<#=url#>"><#=title#></a>',
        subtitle: '<a href="<#=url#>" class="subtitle"><#=title#></a>',
        banner: '<a class="all" href="<#=url#>"> <div><span><#=title#></span><br><span class="gray"><#=enTitle#></span></div> </a>'
      }
      NTUI.importJs('http://ip.ws.126.net/ipquery', function() {
        var city = 'qg'
        if (window.lo === '北京市') {
          city = 'bj'
        }
        if (window.lo === '上海市') {
          city = 'sh'
        }
        if (window.localAddress.city === '广州市') {
          city = 'gz'
        }
        if (window.localAddress.city === '深圳市') {
          city = 'sz'
        }
        NTUI.importJs('http://m.house.163.com/' + city + '/xf/web/getCMSNews.html')
        NTUI.importJs('http://m.house.163.com/' + city + '/xf/web/get3gButtons.html')
        var listHtml = bottomHtml = topHtml = bannerHtml = '';
        var i = 0;
        window.news = function(data) {
          window.news = null;
          data.forEach(function(item) {
            listHtml += NTUI.simpleParse(tpl.list, item)
          })
          i++;
          appendHtml();
        }
        window.buttons = function(data) {
          window.buttons = null;

          if(data.bottom){
            bottomHtml = NTUI.simpleParse(tpl.bottom, data.bottom)
          }

          var itemHtml = '',
            dropDown = '',
            dropDown2 = '';
          if(data.top){
            data.top.forEach(function(item, i) {
              if (i < 2) {
                itemHtml += NTUI.simpleParse(tpl.subtitle, item)
              }
              if (i < 3) {
                dropDown += NTUI.simpleParse('<li><a href="<#=url#>"><#=title#></a></li>', item)
              }
              if (i > 2) {
                dropDown2 += NTUI.simpleParse('<li><a href="<#=url#>"><#=title#></a></li>', item)
              }
            })
          }
          topHtml = '<nav class="m-newsNav m-newsNav2"><div class="u-newsNav-close"><a class="title">房产</a>' + itemHtml + '</div><div class="u-newsNav-open"><ul>' + dropDown + dropDown2 + '</ul></div></nav>';
          if(data.bannner){
            data.banner.forEach(function(item) {
              bannerHtml += NTUI.simpleParse(tpl.banner, item)
            })
          }
          i++;
          appendHtml();
        }

        function appendHtml() {
          if (i != 2) {
            return
          }
          var totalHtml = topHtml + '<section class="newsList"><ul class="clearfix"><li><div class="u-newsBtn clearfix">' + bannerHtml + '</div><ul class="newsPage">' + listHtml + '</ul></li></ul>' + bottomHtml + '</section>'
          X('.h-news').prepend(totalHtml)
          X('.h-news .m-newsNav').on('click', function(e) {
            this.classList.toggle('u-newsNav-toolbar')
          })
        }
      })
    })($);

    /**
     * [视频模块]
     */
    ;(function(X) {
      // 格式化秒数到时间格式
      var formatTime = function(len){
          var h = 0,i = 0,s = parseInt(len);
          if(s > 60){
              i = parseInt(s / 60);
              s = parseInt(s % 60);
              if(i > 60) {
                  h = parseInt(i/60);
                  i = parseInt(i%60);
              }
          }
          var zero=function(v){
              return (v>>0)<10?"0"+v:v;
          };
          return [zero(i),zero(s)].join(":");
      };

      commonVideoList = function(eml,urlStr,t) {
        var func = window.abc || function(){};
        window.abc = function(data){
          func(data)
          var arr = []
          var list = urlStr.split("/")[6]
          var tipicId = JSON.stringify(data).slice(2,11)
          if(list == tipicId){
            X(eml).eq(0).removeClass('mask-bg')
            for (i = 0; i < 4; i++) {
              tpl.photoList = '<div class="u-mask"><a href="http://3g.163.com/ntes/special/0034073A/wechat_article.html?ly=3gindex'+ t +'&no=1&videoid=<#=videoId#>" target="_blank"><img src="<#=cover#>">  <span class="title"><#=title#></span><div class="play"><span><i></i><#=length#></span></div></a></div>';
              arr.push(NTUI.simpleParse(tpl.photoList, {
                videoId: data[list][i].vid,
                cover: "http://s.cimg.163.com/i/"+data[list][i].cover.replace('http://', '')+".320x163.jpg",
                title: data[list][i].title,
                length: formatTime(data[list][i].length),
                mp4_url: data[list][i].mp4_url
              }));
            }
            X(eml).html(arr.join(''));
          }
        }
        commonFun.importJs(urlStr);
      };

      commonVideoList('#miracle','http://c.m.163.com/nc/video/list/VAP4BFE3U/n/0-10.html?callback=abc','1');
    })($);

    /**
     * [应用模块]
     */
    ;(function(X) {
      try {
        new NTUI.OpenApp('openApp', "");
      } catch (e) {}
      //应用模块tab
      var appViews = X('.apps-view-4>div'),
        appNavs = X('.apps nav li');
      appNavs.click(function(e) {
        if (this.className !== 'current') {
          appNavs.removeClass('current');
          appViews.removeClass('current');
          this.className = 'current';
          appViews[this.getAttribute('index')].className = 'current';
        }
      });
      //读取应用数据
      var appHolder = X('.apps-view-4>div>ul'),
        platform = 'other',
        isAndroid = navigator.userAgent.match(/android/ig),
        appUrl = 'http://3g.163.com/touch/app/cpsSoftware/30.html';
      var appLi = '<a href="http://3g.163.com/m/android/social_contact/software/<#=id#>.html"><img src="<#=icon#>"/><span><#=name#></span></a>';
      window.appList = function(d) {
        window.appList = null
        if (!d) return;
        var i = j = 0,
          apps, app, tmp;
        tmp = '';
        for (j = 0; j < d.length; j++) {
          if (j % 10 === 0) {
            tmp += '<li>'
          }
          app = d[j];
          tmp += NTUI.simpleParse(appLi, {
            icon: app.icon,
            id: app.id,
            name: app.name
          });
          //if(j%4===3){tmp+='</li>'}
        }
        appHolder[0].innerHTML = tmp;
        var appCtrls = X(".apps-view-4 .u-ctrls li");
        new NTUI.slide(appViews[0], {
          wrapperW: window.innerWidth * 0.92,
          onTouchEnd: function(e, cp) {
            appCtrls.removeClass('current');
            appCtrls[cp].className = 'current';
          }
        });
        X('.apps').css({
          display: 'block'
        });
      }
      if (isAndroid) {
        X('.apps').css({
          display: 'block'
        });
        //var titleHolder = X('.apps>nav li span');
        //titleHolder[0].innerHTML = '下载精彩应用';
        NTUI.importJs(appUrl);
      }
    })($);


  }else{
    X(".video-news,.bobo,.h-news,.read-novel,.apps").hide();
    X(".lottery-news").css({
      marginBottom: '0',
      border: 'none'
    });
  }
})($);

/**
 * [家居模块]
 */
;(function(X) {
  var homeDesignUrl = "http://m.home.163.com/home/mobile/interface/3gtouch/news/1/8.html?callback=homeDesign";
  window.homeDesign = function(data) {
    window.homeDesign = null
    var listHtml="";
    var banner_href = '<li class="g-p20"><a href="http://m.home.163.com/home/mobile/static/news_detail.shtml?docid=<#=docid#>"><#=title#><span> <#=commentcount#> 跟贴</span></a></li>';
      data.forEach(function(item) {
        if(item.title.length > 22){
          item.title = item.title.slice(0, 20) + '...'
        }
        listHtml += NTUI.simpleParse(banner_href, item)
      });
      X(".home-design")[0].innerHTML = listHtml;
    }
  NTUI.importJs(homeDesignUrl);
})($);

/**
 * [趣闻模块]
 */
;(function(X) {

  var daDaUrl = "http://d.news.163.com/dada3g?callback=fun";
  window.fun = function(data) {
    window.fun = null
    var listHtml="",title,commentCount;
    var banner_href = '<li class="g-p20"><a href="http://3g.163.com/touch/article.html?docid=<#=docId#>&qd=gionee"><div><#=title#></div><span> <em><#=commentCount#></em> 跟帖</span></a></li>';
      data.data.forEach(function(item) {
        if(item.title.indexOf("<em") != "-1") {
          title = item.title.split(">")[1].split("<")[0]
        }else{
          title = item.title
        }
        commentCount = parseInt(item.commentCount);
        if(commentCount > 9999) {
          item.commentCount = commonFun.round(commentCount,1)
        }
        listHtml += NTUI.simpleParse(banner_href, item)
      });
      X(".dada").html(listHtml);
    }
  NTUI.importJs(daDaUrl);

  var duanZiUrl = "http://cont.3g.163.com/getChanList?callback=duanzi&size=40";
  window.duanzi = function(data) {
    window.duanzi = null
    var listHtml="",upTimes,num = 0;
    X(".duanzi").removeClass('mask-bg');
    var banner_href = '<li class="g-p20"><a href="http://3g.163.com/touch/article.html?docid=<#=docid#>&qd=gionee"><div><#=title#></div><span> <em><#=upTimes#></em> 热度</span></a></li>';
    data['段子'].forEach(function(item,index) {
      if (item.title.length < 12) {
        return;
      }
      num ++
      upTimes = parseInt(item.upTimes);
      if(upTimes > 9999) {
        item.upTimes = commonFun.round(upTimes,1)
      }
      if(num > 8){
        return;
      }else{
        listHtml += NTUI.simpleParse(banner_href, item)
      }
    });
    X(".duanzi").html(listHtml);
  }
  NTUI.importJs(duanZiUrl);

  var _hot = X(".u-list").find('.hot a');
  _hot.each(function(index, el) {
    var list = el.innerHTML,
      title = list.replace(/^\s*/,"").split("<span>")[0].replace(/^\s+|\s+$/g,''),
      len = title.length;
    if(len < 10){
      el.innerHTML = title + " ←_←点开查看"
    }else{
      el.innerHTML = title
    }
  });
  var hots = X(".u-list").find('.hot li'),_random,
    _span = document.createElement("span"),
    _s;
  hots.each(function(index,el){
    _random = Math.floor(Math.random() * 1000) + 100
    _s = document.createElement("span");
    el.appendChild(_s)
    el.lastChild.textContent = _random + " 热度"
  });

})($);

/**
 * [搜索模块]
 */
;(function(X) {
  var searchForm = X('#searchForm');
  var searchBtn = X('#searchBtn');
  var engineBtn = X('.js-toggle');
  var engineList = X('.engine-list');
  var engines = {
    ntes: {
      class: 'ntes',
      name: '',
      action: 'http://3g.163.com/ntes/special/0034073A/touchSearch.html?qd=index',
      text: '站内搜索'
    },
    sm: {
      class: 'sm',
      name: 'q',
      action: 'http://m.yz.sm.cn/s?qd=wm669070',
      text: '搜&nbsp;&nbsp;索'
    }
  };
  var engine = {
    class: 'sm',
    name: 'q',
    action: 'http://m.yz.sm.cn/s?qd=wm669070',
    text: '搜&nbsp;&nbsp;索'
  };
  X('.u-searchform .search-text').focus(function() {
    X(this).val('');
  })
  engineBtn.click(function() {
    X(this).find('.engine-list').toggleClass('active');
  });
  engineList.click(function(e) {
    engine = engines[e.target.dataset.engine];
    var that = this;
    X(this)
      .parent().find('.engine-text').html(engine.text)
      .parents('form').attr('action', engine.action)
      .find('.search-text.' + engine.class).addClass('show').attr('name', engine.name)
      .siblings().removeClass('show').attr('name', '');

    setTimeout(function() {
      X(that).removeClass('active')
        .find('li.' + engine.class).addClass('hide')
        .siblings().removeClass('hide');
    }, 0)


  })
  searchBtn.click(function() {
    if (engine.class == 'sm') {
      searchForm.attr('target', '_blank');
      try {
        neteaseTracker(false, 'http://click.3g.163.com/search', '', 'wapclick');
      } catch (e) {}
    } else {
      searchForm.removeAttr('target');
    }
    doSearch();
  });
  searchForm.submit(function() {
    doSearch();
    return false;
  });

  function doSearch() {
      var ls = window.localStorage;
      var ntesValue = X('.search-text.ntes').val();
      if (ls) {
        ls.setItem('3g.163.touch.searchvalue', ntesValue);
        searchForm[0].submit();
      }
    }
    // 热词
  setTimeout(function(){
  X.ajax({
    dataType: 'jsonp',
    url: 'http://api.m.sm.cn/rest?method=tools.hot&start=1&qd=wm280141',
    success: function(data) {
      var result = []
      for (var i = 2; i >= 0; i--) {
        var index = Math.floor(Math.random() * data.length);
        result.push(data[index])
        data.splice(index, 1)
      }
      X('.u-searchform .search-text.sm').val(result[0].title)
      X('.u-searchform .hot-words a').each(function(n) {
        X(this).text(result[n + 1].title);
        if (/^http/.test(result[n + 1].url)) {
          X(this).attr('href', result[n + 1].url)
        } else {
          X(this).attr('href', 'http://m.yz.sm.cn/' + result[n + 1].url)
        }
      })

    }
  });
  },1500);
})($);
/**
 * [游戏模块]
 */
;(function(X) {
  X.ajax({
    dataType: 'jsonp',
    url: 'http://m.163.com/newsgamecenter/newsapp_android/gamemodule.json.html',
    jsonpCallback: 'wapFootApp',
    success: function(data) {
      if (!data || !data.softList) {
        return
      }
      if(!navigator.userAgent.match(/iphone|ipod|ipad/ig)){
        X('#game .newsList ul').eq(0).before("<div class=\"clearfix\" style=\"padding: 10px 1.8%;border-bottom: 1px solid #E8E8E8;\"><a class=\"game-link\" target=\"_blank\" href=\"" + data.softList[0].outLink + "\"><img src=\"" + data.softList[0].imgs + "\"/></a>\n<a class=\"game-link\" target=\"_blank\" href=\"" + data.softList[1].outLink + "\"><img src=\"" + data.softList[1].imgs + "\"/></a></div>");
      }

    }
  })
})($);





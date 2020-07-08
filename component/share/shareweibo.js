function Weiboshare (tapi){ 
	var _tapi = {
		"t163" : 'http://t.163.com/article/user/checkLogin.do?link={url}&source={source}&info={title}{url}&images={pic}&togImg={togImg}&{date}',
        "tsina" : 'http://service.weibo.com/share/share.php?url={url}&title={title}&pic={pic}',
	    "tsohu" : 'http://t.sohu.com/third/post.jsp?url={url}&title={title}&content={charset}&pic={pic}',
	    "tqq" : 'http://v.t.qq.com/share/share.php?title={title}&url={url}&site={source}&pic={pic}',
	    "qzone" : 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url={url}&title={title}summary={digest}&site={source}&pics={pic}',
	    "kaixin001" : 'http://www.kaixin001.com/repaste/bshare.php?rtitle={title}&rcontent={digest}&rurl={url}',
	    "douban" : 'http://www.douban.com/recommend/?url={url}&title={title}',
		"renren" : 'http://share.renren.com/share/buttonshare.do?link={url}',
		"msn" : 'http://profile.live.com/badge?url={url}&title={title}',
		"dream" : 'http://dream.163.com/share/link/?url={url}&title={title}'
    }
	tapi = tapi || {};
    this.tapi = copy(tapi,_tapi);    
}

Weiboshare.prototype.getParams = function(opt){	
	var _opt = {
		"title" : document.title, //页面title标题
		"url" : location.href, //分享的页面地址
		"digest" : "", //摘要
		"pic" : "", //自定义图片
		"source" : '网易', //来源
		"sourceLink": "http://www.163.com", //来源域名
		"charset" : "utf-8", //编码
		"width" : 700, //分享弹框页的宽
		"height" : 680, //分享弹框页的高
		"customIcon" : false,  //是否自定义图标内容，false否，ture自定义
		"togImg" : true,
		"date" : new Date().getTime()
	};
	opt = opt || {};
	opt = copy(opt,_opt);
	opt.title = encodeURIComponent(opt.title);
	opt.url = encodeURIComponent(opt.url);
	opt.sourceLink = encodeURIComponent(opt.sourceLink);
	opt.charset = encodeURIComponent(opt.charset);

	var _left = (window.screen.availWidth - opt.width) / 2;
	var _top = (window.screen.availHeight - opt.height) / 2;

	this.windowConfig = 'width=' + opt.width + ', height=' + opt.height + ', top=' + opt._top + ', left=' + opt._left + ', toolbar=no, menubar=no, scrollbars=no, location=yes, resizable=no, status=no';
	this.opt = opt;
}

Weiboshare.prototype.createShare = function(obj,data,temp){
    var _data = {
		"weibo_title" : "分享：",
		"weibo":
		[
			{"_class" : "t163", "name" : "网易微博"},
			{"_class" : "tsina", "name" : "新浪微博"},
			{"_class" : "tsohu", "name" : "搜狐微博"},
			{"_class" : "tqq", "name" : "腾讯微博"},
			{"_class" : "qzone", "name" : "腾讯空间"},
			{"_class" : "kaixin001", "name" : "开心网"},
			{"_class" : "douban", "name" : "豆瓣"},
			{"_class" : "renren", "name" : "人人"},
			{"_class" : "msn", "name" : "msn"},
			{"_class" : "dream", "name" : "梦幻人生"}
		]
	};

	var nametemp = "";
	var namestr = "";
	var html = "";
	var node = null;

	temp = temp || ['<a href="javascript:;" title="分享到{name}" class="{_class}" _class="{_class}">{name}</a>'].join('');
	nametemp = ['<h3>{weibo_title}</h3>'].join('');
	
	data = data || {};
	data = copy(data,_data);
	
	if(data.weibo_title != ""){
		namestr = substitute(nametemp, data);
	}

	html = [namestr,
			'<div class="weibolist">',
				substitute(temp, data.weibo),
			'</div>'].join('');

	obj.innerHTML = html;
	this.data = data;
}

Weiboshare.prototype.addEvent = function(obj){
	var target = null;
	var _class = "";
	var url = "";
	
	var tapi = this.tapi;
	var opt = this.opt;
	var windowConfig = this.windowConfig;

	obj.onclick = function(event){
		var e = event || window.event;
        var _target = e.target || e.srcElement;
            
		_class = _target.getAttribute("_class");
		if(_class == ""){return false;}

		url = substitute(tapi[_class], opt);
		window.open(url , '_blank' , windowConfig);
	
		stopDefault(e);
	}
}


/*
*init()  参数1:id; 参数2:微博; 参数3: 微博自定义参数; 参数4:微博模版
*/
Weiboshare.prototype.init = function(obj,data,opt,temp){
	this.createShare(obj,data,temp);
	this.getParams(opt);
	this.addEvent(obj);
}


function substitute(template, data, regexp){
  if(!(Object.prototype.toString.call(data) === "[object Array]")){
    data = [data]
  }
  var ret = [];
  for(var i=0,j=data.length;i<j;i++){
    ret.push(replaceAction(data[i]));
  }
  return ret.join("");
  
  function replaceAction(object){
    return template.replace(regexp || (/\\?\{([^}]+)\}/g), function(match, name){
     if (match.charAt(0) == '\\') return match.slice(1);
     return (object[name] != undefined) ? object[name] : '';
    });
  }
}

function stopDefault(e){
	if(e && e.preventDefault){
		e.preventDefault();
	}else{
		window.event.returnValue = false;
	}

	return false;
}

function copy(a,b){
	for (var p in b){
		if (a[p] == 'undefined' || a[p] == null){
			a[p] = b[p];
		}
	}
	return a;
}









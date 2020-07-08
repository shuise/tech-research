function share(data,urls,tpl){
	var _urls = {
		"t163" : 'http://t.163.com/article/user/checkLogin.do?link={link}&source={source}&info={title}{link}&images={pic}&{date}',
        "weibo" : 'http://service.weibo.com/share/share.php?url={link}&title={title}&pic={pic}',
	    "qzone" : 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url={link}&title={title}summary={digest}&site={source}&pics={pic}',
	    "douban" : 'http://www.douban.com/recommend/?url={link}&title={title}',
		"renren" : 'http://share.renren.com/share/buttonshare.do?link={link}',
    };

    urls = urls || {};
    urls = copy(urls,_urls);

	var _data = {
		"title" : document.title, //页面title标题
		"link" : location.href, //分享的页面地址
		"digest" : "", //摘要
		"pic" : [], //自定义图片
		"source" : "网易", //来源
		"sourceLink": "http://www.163.com", //来源域名
		"charset" : "utf-8", //编码
		"width" : 700, //分享弹框页的
		"height" : 680, //分享弹框页的高
		"customIcon" : false,  //是否自定义图标内容，false否，ture自定义
		"date" : new Date().getTime()
	};

	data = data || {};
	data = copy(data,_data);
	data.title = encodeURIComponent(data.title);
	data.link = encodeURIComponent(data.link);
	data.sourceLink = encodeURIComponent(data.sourceLink);
	data.charset = encodeURIComponent(data.charset);
	data.pic = data.pic[0] || "";

	var _tpl = '<a href="#{channel}" title="分享到{name}" class="ne_share_{channel}" _channel="{channel}">{name}</a>';

	this.tpl = tpl || _tpl;
	this.urls = urls;
	this.data = data;
}

share.prototype.createUI = function(obj,channels){
	var tpl = this.tpl;
	var urls = this.urls;
	var _channels = [
		{"channel" : "t163", "name" : "网易微博"},
		{"channel" : "weibo", "name" : "新浪微博"},
		{"channel" : "qzone", "name" : "腾讯空间"},
		{"channel" : "douban", "name" : "豆瓣"},
		{"channel" : "renren", "name" : "人人"}
	];

	channels = channels || _channels;
	for(var i = 0,len = channels.length; i<len; i++){
		var channel = channels[i].channel;
		if(channels[i].url){
			urls[channel] = channels[i].url;
		}
	}
	obj.innerHTML = substitute(tpl,channels);
}

share.prototype.send = function(obj,channel){
	var data = this.data;
	var urls = this.urls;
	var left = window.screen.availWidth/2 - data.width/2;
	var top = window.screen.availHeight/2 - data.height/2;

	var popConfig = 'width=' + data.width + ', height=' + data.height
					+ ', top=' + top + ', left=' + left + ','
					+ ' toolbar=no, menubar=no, scrollbars=no, location=yes, resizable=no, status=no';

	for(var key in data){
		data[key] = obj.getAttribute("_" + key) || data[key];
	}
	var url = urls[channel];
	if(url){
		url = substitute(url,data);
		window.open(url , 'newwindow' , popConfig);
		return false;
	}
}

share.prototype.addEvents = function(obj){
	var _this = this;
	obj.onclick = function(event){
		var e = event || window.event;
        var target = e.target || e.srcElement;

		channel = target.getAttribute("_channel");
		if(channel){
			_this.send(obj,channel);
			return false;
		}
	}
}

share.prototype.init = function(obj,channels,callback){
	this.createUI(obj,channels);
	this.addEvents(obj);
	callback && callback();
}



//基础方法
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

function copy(a,b){
	for (var p in b){
		if (a[p] == 'undefined' || a[p] == null){
			a[p] = b[p];
		}
	}
	return a;
}

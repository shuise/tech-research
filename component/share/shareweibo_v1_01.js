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
    this.tapi = this.copy(_tapi,tapi);    
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
		"postData" : true,
		"date" : new Date().getTime()
	};
	opt = opt || {};
	this.copy(_opt,opt);
	_opt.title = encodeURIComponent(_opt.title);
	_opt._url = _opt.url;
	_opt.digest = encodeURIComponent(_opt.digest);
	_opt.source = encodeURIComponent(_opt.source);
	_opt.sourceLink = encodeURIComponent(_opt.sourceLink);
	_opt.charset = encodeURIComponent(_opt.charset);

	var _left = (window.screen.availWidth - _opt.width) / 2;
	var _top = (window.screen.availHeight - _opt.height) / 2;

	this.windowConfig = 'width=' + _opt.width + ', height=' + _opt.height + ', top=' + _opt._top + ', left=' + _opt._left + ', toolbar=no, menubar=no, scrollbars=no, location=yes, resizable=no, status=no';
	if(_opt.postData){
		this._static = this.postCount({
			cmpt_id:"share"
		})
	}	
	this.opt = _opt;
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
	nametemp = '<h3>{weibo_title}</h3>';
	
	data = data || {};
	this.copy(_data,data);

	if(_data.weibo_title != ""){
		namestr = this.substitute(nametemp, _data);
	}

	html = [namestr,
			'<div class="weibolist">',
				this.substitute(temp, _data.weibo),
			'</div>'].join('');

	obj.innerHTML = html;
	this.data = _data;
}

Weiboshare.prototype.addEvent = function(obj){
	var self = this;
	var target = null;
	var _class = "";
	var url = "";
	
	var tapi = self.tapi;
	var opt = self.opt;
	var windowConfig = self.windowConfig;

	obj.onclick = function(event){
		var e = event || window.event;
        var _target = e.target || e.srcElement;
            
		_class = _target.getAttribute("_class");
		if(_class ==null){return false;}
		if(self.opt.postData){
			var _search = getSearch(opt._url);
			var _hash = getHash(opt._url);
			var _url = opt._url.replace(/([#\?].*)?$/,""); 
			if(_search!=""){
				var param = getParamByUrl(_search);
				param.f2e_share = _class;
				var query = [];
				for(var key in param){
					query.push(key+"="+param[key]);
				}				
				_search ="?"+query.join("&"); 
			}else{
				_search ="?f2e_share="+_class;
				 
			}
			opt.url=encodeURIComponent(_url+_search+_hash);
		}
		url = self.substitute(tapi[_class], opt);
		window.open(url , '_blank' , windowConfig);
	
		self.stopDefault(e);
		if(self.opt.postData&&self._static){					
			var _info = {
				send_now:true,
				pageUrl:location.href,
				shareType:_class
			};			
			self._static.dcSend(_info);
		}
		
	}
	function getParamByUrl(url){
		var rhash = /[?&]([^&=]+)=([^&=]+)/ig,
			a = rhash.exec(url),
			param = {};		
		while (a) {
			param[a[1]] = a[2];
			a = rhash.exec(url);
		}		
		return param;				
	}
	
	function getSearch(url){
		var Reg = /(\?[^#]*)/;
		if(Reg.test(url)){
			return RegExp.$1;
		}
		return "";	
	}	
	function getHash(url){
		var Reg = /(#.*)$/;	
		if(Reg.test(url)){
			return RegExp.$1;
		}
		return "";	
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
//复制object
Weiboshare.prototype.copy = function(a,b){
	for (var p in b){
		a[p] = b[p];
	}
	return a;
}

Weiboshare.prototype.substitute = function(template, data, regexp){
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

Weiboshare.prototype.stopDefault = function(e){
	if(e && e.preventDefault){
		e.preventDefault();
	}else{
		window.event.returnValue = false;
	}

	return false;
}
//统计代码
Weiboshare.prototype.postCount = function(cfg){
	
	return new postCount(cfg);
	
	function postCount(cfg){
		var t = this
		t.dcDatas = t.dcDatas || [];
		//t.countArray = t.countArray || [];
		t._cfg = cfg || {};	
		t._init = false;			
		//发送方法		
		t.dcSend = function(args){
			//存储数据
			t.dcDatas.push(args);
			//检测发送条件,达到要求，发送
			if(args.send_now || getDcDatas(t.dcDatas).length >= 1500){
				//无数据时不请求
				t.dcSendnow();
			}			
			if(!t._init&&!args.send_now){
				//20分钟无动作，自动提交
				setInterval(function(){t.dcSendnow();},1000*60*20);	
				//关闭时，提交
				window.onbeforeunload = function(){
					t.dcSendnow();
				}
				t._init = true;
			}						
		}
		t.dcSendnow = function (){
			if(t.dcDatas.length ==0){
				return false;
			}
			var actionUrl = t._cfg.actionUrl || "http://project.f2e.netease.com:88/b.gif?id=f2e";
			var argsCommon = {
				cmpt_id : t._cfg.cmpt_id,
				batch_value : getDcDatas(t.dcDatas)
			}
			for(var para in argsCommon){
				actionUrl += "&" + para + "=" + argsCommon[para];
			}	
			var imgObj = new Image();
				imgObj.src = actionUrl;	
			//t.countArray.push(imgObj);
			t.dcDatas = [];			
		}	
		//整合批量数据
		function getDcDatas(data){
			var arr = [];
			for(var i = 0,len = data.length;i<len;i++){
				delete data[i].send_now;
				arr[i] = jsonStringify(data[i]);
			}
			return '[' + arr.join(',') + ']';
		}
		function jsonStringify(data){
			if((data === null) || (data == undefined)){
				return "";
			}
			if(window.JSON && JSON.stringify){
				return JSON.stringify(data);
			}
			switch (data.constructor) {
				case String:
					return '"' + data.replace(/(["\\])/g, '\\$1') + '"';
				case Array:
					var _tmp = [];
					for(var i=0;i<data.length;i++){
						_tmp.push(jsonStringify(data[i]));
					}
					return '[' + _tmp.join(",") + ']';
				case Object:
					var lxStr = [];
					for (var p in data) 
						if (typeof(data[p]) != "function") {
							lxStr.push(jsonStringify(p) + ':' + jsonStringify(data[p]));
						}
					return '{' + lxStr.join(',') + '}';
				case Number:
					if (isFinite(data)) {
						break;
					}
				case Function:
					return '""';
				case Boolean:
					return data;
			}
			return String(data);
		}	
	}	
}










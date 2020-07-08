//是否是数组
var isArray = Array.isArray || function (obj) {
	return Object.prototype.toString.call(obj) === '[object Array]';
};

//a中是否含c
function _indexOf(a, c) {
	if (a.indexOf) return a.indexOf(c);
	var d = a.length;
	if (d) for (var b = 0; b < d; b++) if (a[b] === c) return b;
	return -1;
}

//判断是否有class
function hasClass(obj,_class){
	return _indexOf(obj.className.split(" "),_class)>-1;
}

//添加class
function addClass(obj,_class) {
	if(!hasClass(obj,_class)) obj.className +=  (obj.className?" ":"") + _class;
}

//移除class
function removeClass(obj,_class) {
	if(hasClass(obj,_class)) obj.className = (" " + obj.className + " ").replace(" " + _class + " "," ").replace(/^\s+$/, '').replace(/\s+$/, '');
}

function $_(id){
	return document.getElementById(id);
}


/**
	参数说明
	config = {
		'isReverse':false,  //是否倒序播放
		'isAd':true,  //第一个视频是否播放广告
		'vBody': NTES.one('.video_body .video_con',vsrcNode),  //视频区
		'vCtrl':NTES.one('.video_ctrls',vsrcNode),  //视频列表区
		'vLists':NTES('.video_ctrls li',vsrcNode),  //视频列表
		'vListTag':'li',  //视频列表标签
		'vWidth':'650', //播放视频宽
		'vHeight':'556' //播放视频高
	} 

*/

function setVideoPlay(config){
	var isReverse = config.isReverse,  //是否逆序
		isAd = config.isAd,  //是否播放广告
		vBody = config.vBody,  //视频播放区
		vInfo = config.vInfo,  //播放视频信息
		vCtrl = config.vCtrl,  //视频播放列表区
		vLists = config.vLists,  //视频播放列表
		vListTag = config.vListTag,   //播放列表的tagname
		vHeight = config.vHeight,
		vWidth = config.vWidth,
		isContinue, //是否连续播放
		UA = navigator.userAgent,
		isIe = UA.toLowerCase().indexOf('msie') != -1,  //是否ie
		vId,
		playingId,
		_self = this;
		
	//设置播放视频信息函数
	this.setVinfo = function(){}

	function _init(){
		var vLists_len = vLists.length;
		if(vLists_len>0){
			if(isReverse){vId = vLists[vLists_len-1].id}
			else{vId = vLists[0].id}
		}
		flashPlayer(vId);
		if(!playingId) return;
		buildList(playingId);
		callPlay();
	}
	_init();
	
	function flashPlayer(vId){
		var curV = $_(vId),
			node = curV,
			flashvars = curV.getAttribute("flashvars"),
			format = curV.getAttribute("format"),
			player = (format && /xml$/.test(format) ? "http://swf.ws.126.net/v/ljk/mp4player/newmp4player_0718.swf" : "http://v.163.com/swf/video/NetEaseFlvPlayerV2_0628.swf"),
			str = "";
			
		if(!curV){
			if(window.continuePlay){ window.continuePlay(); }
			return;
		}
		
		if(!isAd){
			flashvars = flashvars.replace(/advID=.*?&/i, 'advID=&');
		}else{
			isAd = false;
		}
		
		if(playingId){
			removeClass($_(playingId), "current");
		}
		addClass(curV, "current");
		playingId = vId;
		
		if (isIe){
			str = '<object  classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="'+vWidth+'" height="'+vHeight+'" id="FPlayer" ><param value="#000000" name="bgcolor"><param value="true" name="allowFullScreen"><param value="always" name="allowscriptaccess"><param name="allownetworking" value="all" /><param name="wmode" value="opaque"><param value="'+player+'"   name="movie"><param value="'+flashvars+'"  name="flashvars"></object>';
		}else{
			str = '<object width="'+vWidth+'" height="'+vHeight+'" id="FPlayer" data="'+player+'" type="application/x-shockwave-flash"><param value="#000000" name="bgcolor"><param value="true" name="allowFullScreen"><param value="always" name="allowscriptaccess"><param name="wmode" value="opaque"><param name="allownetworking" value="all" /><param value="'+flashvars+'"  name="flashvars"></object>';
		}
		vBody.innerHTML = str;
		
		_self.setVinfo(curV);
	}
	
	function buildList(vId){
		window.playList = [];
		var node = $_(vId);
		if(!node) return;
		if(isReverse){
			while((node = node.previousSibling)){
				if(node.nodeName.toLowerCase() == vListTag){
					var id = node.id;
					if(id && node.getAttribute("flashvars")){
						window.playList.push(id);
						
					}
				}
			}
		}else{
			while((node = node.nextSibling)){
				if(node.nodeName.toLowerCase() == vListTag){
					var id = node.id;
					if(id && node.getAttribute("flashvars")){
						window.playList.push(id);
					}
				}
			}
		}
	}
	
	function callPlay(){
		for(var i = 0, vLists_len = vLists.length; i<vLists_len; i++){
			vLists[i].onclick = function(e){
				var id = this.id;
				if(id && this.getAttribute("flashvars")){
					flashPlayer(id);
					buildList(id);
					return false;
				}
				return true;
			}
			
		}
		
	}
	
	//视频接口，播放完自动调用（必须是全局函数）
	window.continuePlay = function () {
		if(isArray(window.playList)){
			var videoId = window.playList.shift();
			if(videoId){
				flashPlayer(videoId);
			}else{
				isContinue = false;
			}
		}
	};
}
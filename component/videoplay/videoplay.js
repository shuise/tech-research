/**
 *  videoPlay
 *	author  				bjlyzhong
 *	create date    				2013.3.6
 *	last modified date		2013.8.2	
 *	version v1.0.1
 *	
 *	@nodes{
 *		vBox(视频联播)
 *		vShow(视频展示区),
 *	 	vLists(视频列表),
 *	 	vInfo(视频信息)
 *	}
 *	@options{
 *		curIndex : 0, //当前索引，默认值为0
 *		selectedClass : "current", //选中的类名，默认值为current
 *		switchEvent : "click", //切换触发事件，默认值click
 *		isContinue : false, //是否连续播放，默认值false
 *		flashvarsKey : "_flashvars", //flashvars的参数名，默认值为_flashvars
 *		infoTemp : ['<h2 class="video_info_title"><a target="_blank" href="{vsrc}">{vtitle}</a></h2>',
					'<div class="video_info_digest">',
					'	<p>{vdigest}...<a class="details" target="_blank" href="{vsrc}">[详细]</a></p>',
					'</div>'].join(""), //{vsrc}-视频连接 {vtitle}-视频标题 {vdigest}-视频摘要 
 *		onHandle : function(index,curVideo,vShow){}
 *	}
 *	@videoParams{
 *		vWidth : 650, //默认值
 *		vHeight : 556, //默认值
 *		id : "", //默认值
 *		classid : "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000", //默认值
 *		bgcolor : "#000000", //默认值
 *		allowFullScreen : true, //默认值
 *		allowscriptaccess : "always", //默认值
 *		allownetworking : "all", //默认值
 *		wmode : "opaque", //默认值
 *		player : "http://v.163.com/swf/video/NetEaseFlvPlayerV2_1116.swf", //默认值
 *		type : "application/x-shockwave-flash" //默认值
 *	}
 *	
 */

function videoPlay(nodes,options,videoParams){
	// 默认参数
	var dNodes = {
			vShow : "",
			vLists : ""
		};
	var	dOptions = {
			curIndex : 0,
			selectedClass : "current",
			switchEvent : "click",
			isContinue : false,
			flashvarsKey : "_flashvars",
			infoTemp : ['<h2 class="video_info_title"><a target="_blank" href="{vsrc}">{vtitle}</a></h2>',
					'<div class="video_info_digest">',
					'	<p>{vdigest}...<a class="details" target="_blank" href="{vsrc}">[详细]</a></p>',
					'</div>'].join("")
		};

	var	dVparams = {
			vWidth : "100%",
			vHeight : "100%",
			id : "FPlayer",
			classid : "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
			bgcolor : "#000000",
			allowFullScreen : "true",
			allowscriptaccess : "always",
			allownetworking : "all",
			wmode : "opaque",
			player : "http://v.163.com/swf/video/NetEaseFlvPlayerV3.swf",
			type : "application/x-shockwave-flash"
		};

	// 辅助方法
	var param = CMPT.tools.param,  
		addEvent = CMPT.tools.addEvent,
		isIE = CMPT.tools.isIE,
		$_ = CMPT.tools.$_;

	// 用户参数
	var uNodes = param(dNodes,nodes),
		uOptions = param(dOptions,options),
		uVparams = param(dVparams,videoParams),
		continueFlag = uOptions.isContinue;
	
	// 初始化参数
	uOptions.total = uNodes.vLists.length;
	for(var i = 0 ; i < uOptions.total; i++){
		if(CMPT.tools.hasClass(uNodes.vLists[i],uOptions.selectedClass)){
			uOptions.curIndex = i;
		}
	}

	// 调用播放前一个
	function prev(){
		var index;
		if(uOptions.curIndex - 1 >=0){
			index = uOptions.curIndex - 1;
			vPlay(index);
		}else{
			index = uOptions.curIndex;
			if(continueFlag){uOptions.isContinue = false;}
		}
	}

	// 调用播放后一个
	function next(){
		var index;
		if(uOptions.curIndex + 1 < uOptions.total){
			index = uOptions.curIndex + 1;
			vPlay(index);
		}else{
			index = uOptions.curIndex;
			if(continueFlag){uOptions.isContinue = false;}
		}
	}

	// 播放函数
	function vPlay(index){
		var curVideo = uNodes.vLists[index],
			vShow = uNodes.vShow,
			flashVars = curVideo.getAttribute(uOptions.flashvarsKey),
			str="";
		var isIe = isIE();

		if(isIe){
			str = ['<object classid="'+uVparams.classid+'" width="'+uVparams.vWidth+'" height="'+uVparams.vHeight+'" id="'+uVparams.id+'" >',
					'<param value="'+uVparams.bgcolor+'" name="bgcolor" />',
					'<param value="'+uVparams.allowFullScreen+'" name="allowFullScreen" />',
					'<param value="'+uVparams.allowscriptaccess+'" name="allowscriptaccess" />',
					'<param value="'+uVparams.allownetworking+'" name="allownetworking" />',
					'<param value="'+uVparams.wmode+'" name="wmode" />',
					'<param value="'+uVparams.player+'" name="movie" />',
					'<param value="'+flashVars+'" name="flashvars" />',
					'</object>'].join("");
		}else{
			str = ['<object width="'+uVparams.vWidth+'" height="'+uVparams.vHeight+'" id="'+uVparams.id+'" data="'+uVparams.player+'" type="'+uVparams.type+'">',
					'<param value="'+uVparams.bgcolor+'" name="bgcolor" />',
					'<param value="'+uVparams.allowFullScreen+'" name="allowFullScreen" />',
					'<param value="'+uVparams.allowscriptaccess+'" name="allowscriptaccess" />',
					'<param value="'+uVparams.wmode+'" name="wmode"/>',
					'<param value="'+uVparams.allownetworking+'" name="allownetworking" />',
					'<param value="'+flashVars+'" name="flashvars" />',
					'</object>'].join("");
		}

		CMPT.tools.removeClass(uNodes.vLists[dOptions.curIndex],uOptions.selectedClass);
		CMPT.tools.addClass(uNodes.vLists[index],uOptions.selectedClass)
		vShow.innerHTML = str;
		if(uNodes.vInfo){
			setvInfo(uNodes.vInfo,index);
		}
		
		uOptions.onHandle && uOptions.onHandle(index,curVideo,vShow);	

		uOptions.curIndex = index;
		if(continueFlag){uOptions.isContinue = true;}
	}

	// 设置视频信息
	function setvInfo(vInfoBox,index){
		var cCtrl = uNodes.vLists[index];

		var replaceAc = CMPT.tools.replaceAc;

		var infoData = {
			vsrc : cCtrl.getAttribute('_vsrc'),
			vtitle : cCtrl.getAttribute('_vtitle'),
			vdigest : cCtrl.getAttribute('_vdigest')
		}			
		vInfoBox.innerHTML = replaceAc(uOptions.infoTemp,infoData);
	}

	// 添加事件
	function addEvents(){
		if (uNodes.vLists && uNodes.vLists.length && uOptions.switchEvent) {
			var change = function(event, index){
				var e = event || window.event;
				if(e.preventDefault){
					e.preventDefault();
				}else{
					e.returnValue = false;
				}
				if(index == uOptions.curIndex) return;
				vPlay(index);
			}			
			for (var i = uOptions.total - 1; i >= 0; i--) {
				addEvent(uNodes.vLists[i], uOptions.switchEvent, change, new Number(i));
			}	
		}	
	}

	// 视频联播函数(由flash播放器提供的接口)
	window.continuePlay = function () {
		if(uOptions.isContinue){
			next();
		}
	}

	// 初始化
	function init(){
		addEvents();
		vPlay(uOptions.curIndex);
	}

	return {
		nodes : uNodes,
		options : uOptions,
		vParams : uVparams,
		vPlay : vPlay,
		setvInfo : setvInfo,
		prev : prev,
		next : next,
		init : init
	};

}

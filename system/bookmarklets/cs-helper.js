(function(){
	var producs = { 
		"IM 即时通讯-基础功能" : "http://www.rongcloud.cn/product/im#basic-function", 
		"IM 即时通讯-特色功能" : "http://www.rongcloud.cn/product/im#features-function", 
		"IM 即时通讯-特点与优势" : "http://www.rongcloud.cn/product/im#character-advantages", 
		"IM 即时通讯-用户案例" : "http://www.rongcloud.cn/product/im#cases", 
		"IM 即时通讯-价格介绍" : "http://www.rongcloud.cn/product/im#prices", 
		"IM 即时通讯-文档资料" : "http://www.rongcloud.cn/product/im#docs", 
		"直播聊天室-功能介紹" : "http://www.rongcloud.cn/product/live#basic-function", 
		"直播聊天室-文档资料" : "http://www.rongcloud.cn/product/live#docs", 
		"音视频-功能介绍" : "http://www.rongcloud.cn/product/netcall#basic-function", 
		"音视频-特点与优势" : "http://www.rongcloud.cn/product/netcall#character-advantages", 
		"音视频-案例" : "http://www.rongcloud.cn/product/netcall#cases", 
		"音视频-价格咨询" : "http://www.rongcloud.cn/product/netcall#prices", 
		"音视频-文档资料" : "http://www.rongcloud.cn/product/netcall#docs", 
		"安全审核-功能介绍" : "http://www.rongcloud.cn/product/antispam#basic-function", 
		"安全审核-特色功能" : "http://www.rongcloud.cn/product/antispam#features-function", 
		"安全审核-在线测试" : "http://www.rongcloud.cn/product/antispam#online-test", 
		"安全审核-特点与优势" : "http://www.rongcloud.cn/product/antispam#character-advantages", 
		"安全审核-客户案例" : "http://www.rongcloud.cn/product/antispam#cases", 
		"客服-开放接入" : "http://www.rongcloud.cn/product/cs#open-access", 
		"客服-高效管理" : "http://www.rongcloud.cn/product/cs#efficient-management", 
		"客服-特点与优势" : "http://www.rongcloud.cn/product/cs#character-advantages", 
		"客服-客户案例" : "http://www.rongcloud.cn/product/cs#cases", 
		"客服-合作沟通" : "http://www.rongcloud.cn/product/cs#cooperation", 
		"价格-公有云" : "http://www.rongcloud.cn/pricing#public-cloud", 
		"价格-专有云" : "http://www.rongcloud.cn/pricing#proprietary-cloud", 
		"价格-海外云" : "http://www.rongcloud.cn/pricing#overseas-cloud", 
		"价格-私有云" : "http://www.rongcloud.cn/pricing#private-cloud", 
		"价格-融云客服业务" : "http://www.rongcloud.cn/pricing#custom", 
		"价格-音视频业务" : "http://www.rongcloud.cn/pricing#audio", 
		"价格-桌面版解决方案" : "http://www.rongcloud.cn/pricing#solution", 
		"价格-短信业务" : "http://www.rongcloud.cn/pricing#sms", 
		"价格-融云反垃圾业务" : "http://www.rongcloud.cn/pricing#antispam", 
		"价格-红包业务" : "http://www.rongcloud.cn/pricing#redpacket", 
		"价格-特色功能" : "http://www.rongcloud.cn/pricing#spe", 
		"价格-基础功能" : "http://www.rongcloud.cn/pricing#free", 
		"案例客户评价" : "http://www.rongcloud.cn/customer#appraise", 
		"融云案例墙" : "http://www.rongcloud.cn/customer#logo-wall", 
		"融云 SDK 下载" : "http://www.rongcloud.cn/downloads#sdk", 
		"融云解决方案" : "http://www.rongcloud.cn/downloads#solution",  
		"四大部署模式-公有云" : "http://www.rongcloud.cn/deployment#public-cloud", 
		"四大部署模式-私有云" : "http://www.rongcloud.cn/deployment#private-cloud", 
		"四大部署模式-专有云" : "http://www.rongcloud.cn/deployment#proprietary-cloud", 
		"四大部署模式-海外云" : "http://www.rongcloud.cn/deployment#overseas-cloud"	
	};

	var anwers = [
		"您好，欢迎咨询，请问有什么可以帮您的？",
		"具体的技术问题请通过开发者后台提交工单处理，谢谢。",
		"请详细描述您的具体需求。"
	];

	/*
	智齿客服界面嵌入业务模块
	*/
	var t = document.getElementById("chatlist");
	if(!t){
		return false;
	}

	var nodeP = null;
	var inputBox = document.getElementById("js-sendMessage");
    var nodes = t.getElementsByTagName("div");
    for(var i=0,len=nodes.length;i<len;i++){
        if(nodes[i].className == "botTextBox js-botTextBox"){
            nodeP = nodes[i];
        }
    }

    var inputPlaceholder = null;
    var nodes2 = t.getElementsByTagName("span");
    for(var i=0,len=nodes2.length;i<len;i++){
        if(nodes2[i].className == "inputPlaceholder js-inputPlaceholder"){
            inputPlaceholder = nodes2[i];
        }
    }

    if(nodeP == null || inputBox == null){
    	return false;
    }

    var _cls = "text-align:left;width:480px;border:1px solid #ccc;background:#fff;z-index:100000;padding:10px;position:absolute;bottom:0;right:0;";
    var btn = "display:inline-block;background:#333;color:#fff;border-radius:3px;padding:5px;margin:1em 0.5em 0 0;cursor:pointer;";

    var links = '<div style="' + _cls + 'display:none;" id="exstions-links-detail">';
    for(var name in producs){
    	links += '<span style="' + btn + '" title="' + producs[name] + '">' + name + '</span>';
    }
    links += '</div>';

    var messages = '<div style="' + _cls + 'display:none;" id="exstions-answer-detail">';
    for(var i=0,len=anwers.length;i<len;i++){
    	messages += '<span style="' + btn + '">' + anwers[i] + '</span><br>';
    }
    messages += '</div>';

    var exstions = ['<div style="width:200px;text-align:right;position:absolute;right:10px;top:15px;font-size:12px;line-height:1.6;">',
    				'	<span class="exstions-answer">快捷回复</span>',
    				'	<span class="exstions-link">产品链接</span>',
    				links,
    				messages,
    				'</div>'].join("");

    var target = document.createElement("div");
    	target.innerHTML = exstions;
    nodeP.appendChild(target);

    var linksD = document.getElementById("exstions-links-detail");
    var answerD = document.getElementById("exstions-answer-detail");

    target.onclick = function(event){
    	var e = event || window.event;
    	var element = e.target || e.srcElement;
    	if(element.className == "exstions-answer"){
    		answerD.style.display = "block";
    	}
    	if(element.className == "exstions-link"){
    		linksD.style.display = "block";
    	}
    }

    answerD.onclick = function(event){
    	var e = event || window.event;
    	var element = e.target || e.srcElement;
    	if(element.tagName.toLowerCase() == "span"){
    		setContent(element.innerHTML);
    		answerD.style.display = "none";
    	}
    }

    linksD.onclick = function(event){
    	var e = event || window.event;
    	var element = e.target || e.srcElement;
    	if(element.tagName.toLowerCase() == "span"){
    		setContent(element.innerHTML + ": " + element.title);
    		linksD.style.display = "none";
    	}
    }

    function setContent(content){
    	inputPlaceholder.innerHTML = " ";
    	inputBox.innerHTML = content;
    }
})();

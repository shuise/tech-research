function postCount(args,cfg){
	postCount.dcDatas = postCount.dcDatas || [];
	postCount.countArray = postCount.countArray || [];
	
	//检测发送条件
	if(args.send_now || getDcDatas(postCount.dcDatas).length >= 1500){
		dcSend();
	}
	var t = setInterval(dcSend,cfg.interval || 30*1000);
	
	window.onbeforeunload = dcSend;
	
	//存储数据
	postCount.dcDatas.push(args);
			
	//发送方法		
	function dcSend(){
		//无数据时不请求
		if(postCount.dcDatas.length ==0){
			return false;
		}
		var cfg = cfg || {};
		var actionUrl = cfg.actionUrl || "http://project.f2e.netease.com:88/a.gif?id=f2e";
		var argsCommon = {
			user_id : cfg.user_id,
			batch_value : getDcDatas(postCount.dcDatas)
		};
		if(cfg.cmpt_id){
			argsCommon.cmpt_id = cfg.cmpt_id;
		}
		for(var para in argsCommon){
			actionUrl += "&" + para + "=" + argsCommon[para];
		}	
		var imgObj = new Image();
			imgObj.src = actionUrl;	
		postCount.countArray.push(imgObj);
		postCount.dcDatas = [];	
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
			return '[' + data.map(jsonStringify).join(',') + ']';
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
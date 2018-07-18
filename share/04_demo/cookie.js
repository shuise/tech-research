function log(info){
	window.console && console.log(info);	
}



var NECookie = {

	Get : function(name){
		var cv = document.cookie.split("; ");
		var cva = [], temp;
		for(i=0; i<cv.length; i++){
		   temp = cv[i].split("=");
		   cva[temp[0]] = unescape(temp[1]);
		}
		if(name) return cva[name];
		else return cva;
	},

	Set : function(name, value, expires, path, domain, secure){
		if(!name || !value || name == "" || value == "") return;
		if(expires){
		   //如果是数字则换算成GMT时间，当前时间加上以秒为单位的expires
		   if(/^[0-9]+$/.test(expires)){
			    var today = new Date();
			    expires = new Date(today.getTime()+expires*1000).toGMTString();
		   }
		}
		var cv = name+"="+escape(value)+";"
		         + ((expires) ? " expires="+expires+";" : "")
		         + ((path) ? "path="+path+";" : "")
		         + ((domain) ? "domain="+domain+";" : "")
		         + ((secure && secure != 0) ? "secure" : "");
		//判断Cookie总长度是否大于4K 绝大部分浏览器最大值
		if(cv.length < 4096){
		   document.cookie = cv;
		   return true;
		}else{
		   return;
		}
	},

	Del : function(name, path, domain){
		if(!name ||　name == "") return;
		if(!this.Get(name)) return;
		document.cookie = name+"=;"
		                    + ((path) ? "path="+path+";" : "")
		                    + ((domain) ? "domain="+domain+";" : "")
		                    + "expires=Thu, 01-Jan-1970 00:00:01 GMT;";
		return true;
	}
} 
window.CMPT = {};
(function(N){
	N.tools = {
		addEvent : function(node,eventType,handler,args){
			if(node.attachEvent){
				node.attachEvent("on"+eventType,function(e){
					handler(e,args);
				});
			}else if(node.addEventListener){
				node.addEventListener(eventType,function(e){
					handler(e,args);
				})
			}else{
				node["on"+eventType] = handler(args);
			}
		},

		check : function(node,className){
			var t = this;
			if(node.nodeType !== 1 || typeof className !== "string"){
				return false;
			}
			return true;
		},

		hasClass : function(node,className){
			var t = this;
			if(t.check(node,className)){
				return (" " + node.className + " ").indexOf(" " + className + " ") != -1;
			}else{
				return false;
			}
		},

		addClass : function(node,className){
			var t = this;
			if(t.check(node,className)){
				node.className = node.className ? " " : "" + className;
			}
		},

		removeClass : function(node,className){
			var t = this;
			if(t.check(node,className)){
				node.className = node.className.replace(RegExp("\\b" + className + "\\b","g"),"");
			}
		},

		$_ : function(id){
			return document.getElementById(id);
		},

		isIE : function(){
			var UA = navigator.userAgent;
			return UA.toLowerCase().indexOf('msie') != -1 ; //是否ie
		},

		param : function(defJson,userJson){
			for(var key in userJson){
				if(typeof userJson[key] != undefined){
					if(typeof defJson[key] != undefined){
						defJson[key] = userJson[key];
					}else{
						defJson.key = userJson[key];
					}
				}
			}
			return defJson;
		},

		// 替换
		replaceAc : function(temp,data,regexp){
			return temp.replace(regexp || (/\\?\{([^}]+)\}/g), function(match, name){
				if (match.charAt(0) == '\\') return match.slice(1);
				return (data[name] != undefined) ? data[name] : '';
			});
		},

		substitute : function(temp, data, regexp){
			if(!(Object.prototype.toString.call(data) === "[object Array]")) data = [data];
			var ret = [];
			for(var i=0,j=data.length;i<j;i++){
				ret.push(replaceAction(data[i]));
			}
			return ret.join("");
			function replaceAction(object){
				return temp.replace(regexp || (/\\?\{([^}]+)\}/g), function(match, name){
					if (match.charAt(0) == '\\') return match.slice(1);
					return (object[name] != undefined) ? object[name] : '';
				});
			}
		}
	}
})(CMPT);


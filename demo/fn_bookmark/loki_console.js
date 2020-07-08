/*! LOKI_CONSOLE v0.1 | (c) 2016 | rmb.rocks/license */
var LOKI_CONSOLE = {};
LOKI_CONSOLE.element = {};
LOKI_CONSOLE.stringifyLog = function(a){
	// true,123,"abc",[1,2,"d"],{a:1},function?
	// boolean,number,string,object,function,undefined
	var type = (typeof a).toLowerCase();
	var str = "";
	switch (type){
		case "boolean":
			str+=a.toString();
		break;
		case "number":
			str+=a;
		break;
		case "string":
			str+=a;
		;break;
		case "object":
			/* old code oh...shit
			if(a == null){
				str += "null";
			}else if(a.toString().toLowerCase() == "[object object]"){
				str+="{";
				var j=0;
				for(var k in a){
					if(j!=0){
						str+=","
					}
					str+=k+":"+LOKI_CONSOLE.stringifyLog(a[k]);
					j++;
				}
				str+="}";
			}else{
				str += "[";
				for(var i=0;i<a.length;i++){
					if(i!=0){
						str+=","
					}
					str+=LOKI_CONSOLE.stringifyLog(a[i]);
				}
				str+="]";
			}
			*/
			str += JSON.stringify(a);
		;break;
		case "function":
			str += a.toString()||"function()";
		;break;
		case "undefined":
			str += "undefined";
		;break;
		case "default":;
	}
	return str;
}
LOKI_CONSOLE.log = function(msg,type){
	var type = type || "log";
	var logitem = document.createElement("li");
	var loginput = document.createElement("input");
	logitem.className = type;
	loginput.value = LOKI_CONSOLE.stringifyLog(msg);
	loginput.readonly="true";
	loginput.type="text";
	logitem.appendChild(loginput);
	LOKI_CONSOLE.element.f2e_console_log.appendChild(logitem);
	// LOKI_CONSOLE.element.f2e_console_log.scrollTo(0,1000000);
}
LOKI_CONSOLE.run =function(){
	LOKI_CONSOLE.log(LOKI_CONSOLE.element.f2e_console_input.value,'code');
	try{
		var result = eval(LOKI_CONSOLE.element.f2e_console_input.value);
		LOKI_CONSOLE.log(result,'log');
	}catch(msg){
		LOKI_CONSOLE.log(""+msg,'log');
	}
	LOKI_CONSOLE.element.f2e_console_input.value="";
}
LOKI_CONSOLE.clear =function(){
	LOKI_CONSOLE.element.f2e_console_log.innerHTML="";
}
LOKI_CONSOLE.init =function(){
	var box = document.getElementById("f2e_console");
	if(!box){
		box = document.createElement("div");
		box.id = "f2e_console";
		box.className = "theme_dark";
		box.innerHTML = '<style> #f2e_console{position: fixed; left: 0; bottom: 0; width: 100%; font-size: 20px; line-height: 20px; z-index: 100000; } #f2e_console_log{list-style: none;margin:0;padding: 0;height: 100px;overflow-y: auto;overflow-x:hidden;} #f2e_console_log input{width: 100%;border:none;background: transparent;color: inherit;line-height: inherit;} #f2e_console_log li{padding-left: 20px;list-style: none;} #f2e_console_log .code{} #f2e_console_log .code::before{content: ">";position: relative;font-size: 15px;left: -16px;display: block;width: 0;height: 0;top:2px;} #f2e_console_log .log{} #f2e_console_input{margin:0; padding:5px 1% 5px 20px;width:96%; width: calc(99% - 20px); height: 60px; display: block; } #f2e_console_bar{margin: 10px 20px;text-align: center;} #f2e_console_bar input{font-size: 16px; padding: 0 4px; border-radius: 5px; border:none; margin-left:10px; } #f2e_console_run{} #f2e_console_clear{} .theme_dark#f2e_console{background: #14171a;} .theme_dark #f2e_console_log li{border-bottom: 1px solid #44474a;} .theme_dark #f2e_console_log .code{color:#35aee2;} .theme_dark #f2e_console_log .log{color:#757873;} .theme_dark #f2e_console_input{border: 1px solid #24272a; background: #242c33; color:#fff; } .theme_dark #f2e_console_bar input{color:#35aee2; background:#242c33; } .theme_light#f2e_console{background: #ebe8e5;} .theme_light #f2e_console_log li{border-bottom: 1px solid #bbb8b5;} .theme_light #f2e_console_log .code{color:#ca511d;} .theme_light #f2e_console_log .log{color:#8a878c;} .theme_light #f2e_console_input{border: 1px solid #dbd8d5; background: #dbd3cc; color:#000; } .theme_light #f2e_console_bar input{color:#ca511d; background:#dbd3cc; } </style> <ul id="f2e_console_log"> <li class="code"><input type="text" value="console.log(\'欢迎使用Loki Console\')" readonly="true"></li> <li class="log"><input type="text" value="欢迎使用Loki Console" readonly="true"></li> </ul> <textarea name="f2e_console_input" id="f2e_console_input"></textarea> <div id="f2e_console_bar"> <input type="button" value="Log" onclick="LOKI_CONSOLE.quickinput(\'console.log\')"> <input type="button" value="Id" onclick="LOKI_CONSOLE.quickinput(\'document.getElementById\')"> <input type="button" value="Tag" onclick="LOKI_CONSOLE.quickinput(\'document.getElementById\')"> <input type="button" value="Selector" onclick="LOKI_CONSOLE.quickinput(\'document.querySelectorAll\')"> <br> <input type="button" value="执行" id="f2e_console_run" onclick="LOKI_CONSOLE.run()"> <input type="button" value="清屏" id="f2e_console_clear" onclick="LOKI_CONSOLE.clear()"> <input type="button" value="明" onclick="LOKI_CONSOLE.themelight()"> <input type="button" value="暗" onclick="LOKI_CONSOLE.themedark()"> <input type="button" value="上" onclick="LOKI_CONSOLE.posup()"> <input type="button" value="下" onclick="LOKI_CONSOLE.posdown()"> </div>';
		document.body.appendChild(box);
	}
	console.log = LOKI_CONSOLE.log;
	LOKI_CONSOLE.element.f2e_console=document.getElementById("f2e_console");
	LOKI_CONSOLE.element.f2e_console_log=document.getElementById("f2e_console_log");
	LOKI_CONSOLE.element.f2e_console_input=document.getElementById("f2e_console_input");
}
LOKI_CONSOLE.quickinput=function(fn){
	LOKI_CONSOLE.element.f2e_console_input.value+=fn+'("")';
}
LOKI_CONSOLE.themelight=function(){
	LOKI_CONSOLE.element.f2e_console.className = LOKI_CONSOLE.element.f2e_console.className.replace("theme_dark","theme_light");
}
LOKI_CONSOLE.themedark=function(){
	LOKI_CONSOLE.element.f2e_console.className = LOKI_CONSOLE.element.f2e_console.className.replace("theme_light","theme_dark");
}
LOKI_CONSOLE.posup=function(){
	LOKI_CONSOLE.element.f2e_console.style.top="0";
	LOKI_CONSOLE.element.f2e_console.style.bottom="auto";
}
LOKI_CONSOLE.posdown=function(){
	LOKI_CONSOLE.element.f2e_console.style.top="auto";
	LOKI_CONSOLE.element.f2e_console.style.bottom="0";
}
window.LOKI_CONSOLE=window.LOKI_CONSOLE||LOKI_CONSOLE;
window.LOKI_CONSOLE.init();
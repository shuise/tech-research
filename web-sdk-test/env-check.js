(function(){
	/*
	检测代码建议放在SDK加载之后，init运行之前。
	*/

	//protocal
	(function(){
		var url = location.href;
		if(url.indexOf("http://") == -1 && url.indexOf("https://") == -1){
			alert("集成页面一定要在http(s)协议下运行");
		}else{
			console.log("location.protocal ok");
		}
	})();

	//WebSocket
	checkFunctionPure("WebSocket");


	//localStorage
	supportStorage();


	//todo more
	function browser(){
		//above IE8
	}

	function supportStorage(){
		var store = window.localStorage;
		if(!store){
			alert("浏览器不支持 localStorage")
			return false;
		}
		
		var key = "test" + new Date().getTime();
		store[key] = "test";
		if(store[key] == "test"){
			store.removeItem(key);
			console.log("localStorage ok");
		}else{
			alert("浏览器禁用了 localStorage，请开启");
		}
	}
	// function _isStorageSupported (storage) {
 //        var supported = false;
 //        if (storage && storage.setItem ) {
 //            supported = true;
 //            var key = '__' + Math.round(Math.random() * 1e7);
 //            try {
 //                storage.setItem(key, key);
 //                storage.removeItem(key);
 //            } catch (err) {
 //                supported = false;
 //            }
 //        }
 //        return supported;
 //    }

	function checkFunctionPure(funcName){
		var d = document, w = window;
		var id = "RongCloudCloud-API-Test" + new Date().getTime;
		var iframe = d.getElementById(id);
		if(!iframe){
			iframe = d.createElement("iframe");
			iframe.id = id;
			iframe.style.display = "none";
			d.body.appendChild(iframe);
		}
		var funcPure = iframe.contentWindow[funcName];
		var funcNow = w[funcName];

		if(funcPure.toString() == funcNow.toString()){
			console.log(funcName + " ok");
		}else{
			alert(funcName + " is broken");
		}
		//function WebSocket() { [native code] }
	}
})();
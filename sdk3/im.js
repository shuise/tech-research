var RongIMLib3 = {};

/*
1=未init; 
2=init 未 connect； 
3=connecting；
4=connected
*/
var status = 1;	

var getMessageList = [];
var tokenIncorrectList = [];
var readyList = [];
var errorList = [];

RongIMLib3.init = function(callback){
	if( status == 1){
		var appKey = RongIMLib3.config.appKey;
		RongIMClient.init(appKey);

		RongIMLib3.instance = RongIMClient.getInstance();
	}
	//同步方法、貌似也不需要回调，主要看后续业务逻辑如何处理
	status = 2;
	callback && callback(RongIMLib3);
}

/*
callbacks = {
	ready : function(currentUser){
	
		},
	getMessage : function(message){
		
		},
	tokenIncorrect : function(token){
	
		},
	error : function(errorCode){
	
		}
}
*/ 
RongIMLib3.connect = function(callbacks){
	if( status == 1){
		RongIMLib3.init();
	}
	if( status == 1 || status == 2 || status == 3){
		//临时防止报错的恶心代码
		getMessageList.push(callbacks.getMessage || function(){});
		tokenIncorrectList.push(callbacks.tokenIncorrect || function(){});
		readyList.push(callbacks.ready || function(){});
		errorList.push(callbacks.error || function(){});
	}
	if( status == 4){
		callbacks.ready && callbacks.ready(RongIMLib3.currentUser);
		return;
	}
	// 连接状态监听器
	RongIMClient.setConnectionStatusListener({
		onChanged: function (status) {
			// console.log(status);
		    switch (status) {
		        case RongIMLib.ConnectionStatus["CONNECTED"]:
		        case 0:
		        	console.log("连接成功")
		            break;

		        case RongIMLib.ConnectionStatus["CONNECTING"]:
		        case 1:
		        	console.log("连接中")
		            break;

		        case RongIMLib.ConnectionStatus["DISCONNECTED"]:
		        case 2:
		        	console.log("当前用户主动断开链接")
		            break;

		        case RongIMLib.ConnectionStatus["NETWORK_UNAVAILABLE"]:
		        case 3:
		        	console.log("网络不可用")
		            break;

		        case RongIMLib.ConnectionStatus["CONNECTION_CLOSED"]:
		        case 4:
		        	console.log("未知原因，连接关闭")
		            break;

		        case RongIMLib.ConnectionStatus["KICKED_OFFLINE_BY_OTHER_CLIENT"]:
		        case 6:
		        	//知道被哪个端踢下来会实用
		        	console.log("用户账户在其他设备登录，本机会被踢掉线")
		            break;

		        case RongIMLib.ConnectionStatus["DOMAIN_INCORRECT"]:
		        case 12:
		        	//提供一个从当前地址获取安全域名的方法会很友好
		        	console.log("当前运行域名错误，请检查安全域名配置")
		            break;
		    }
		}
	});


	RongIMClient.setOnReceiveMessageListener({
		// 接收到的消息
		onReceived: function (message) {
			console.log(message);
			for(var i=0,len=getMessageList.length; i<len; i++){
				getMessageList[i](message);
			}
		}
	});

	//开始链接
	var token = RongIMLib3.config.token;
	status = 3;
	RongIMClient.connect(token, {
		onSuccess: function(userId) {
			status = 4;
			var userInfo = {
				id : userId
			};
			RongIMLib3.currentUser = userInfo;
			for(var i=0,len=readyList.length; i<len; i++){
				readyList[i](userInfo);
			}
		},
		onTokenIncorrect: function() {
			console.log('token无效');
			for(var i=0,len=tokenIncorrectList.length; i<len; i++){
				tokenIncorrectList[i](token);
			}
		},
		onError:function(errorCode){
			console.log(errorCode);
			for(var i=0,len=errorList.length; i<len; i++){
				errorList[i](errorCode);
			}
		}
	}, '');
}

RongIMLib3.getMessage = function(callback){
	if( status != 4){
		RongIMLib3.connect({
			getMessage : callback
		});
		return;
	}
	getMessageList.push(callback || function(){});
}

RongIMLib3.sendMessage = function(conversationType, targetId, content, callbacks){
	if( status != 4){
		RongIMLib3.connect({
			ready : function(currentUser){
				var instance = RongIMLib3.instance;
				var msg = new RongIMLib.TextMessage(content);
				instance.sendMessage(conversationType, targetId, msg, callbacks);
			}
		});
	}
}



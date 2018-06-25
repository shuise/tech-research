//对 SDK 的调用封装

;(function(RongIM){
	/* 外部依赖
	RongIMLib
	RongIMClient = RongIMLib.RongIMClient
	window
	*/ 

	var instance = null;
	var currentUser = {};

	var config = null;

	var setConfig = function(){
		config = RongIM.config;
	}

	/*
	1=未init; 
	2=init 未 connect； 
	3=connecting；
	4=connected
	*/
	var status = 1;
	var statusDesc = {
		1 : "未初始化",
		2 : "初始化结束，开始链接",
		3 : "链接中",
		4 : "链接成功"
	};

	var receiveMessageList = RongIM.receiveMessageList || [];
	var tokenIncorrectList = RongIM.tokenIncorrectList || [];
	var readyList = RongIM.readyList || [];
	var errorList = RongIM.errorList || [];

	var init = function(callback){
		setConfig();

		if( status == 1){
			status = 2;

			var appKey = config.appKey;
			RongIMClient.init(appKey);

			instance = RongIMClient.getInstance();
		}
		//同步方法、貌似也不需要回调，主要看后续业务逻辑如何处理
		callback && callback();
	}

	/*
	callbacks = {
		ready : function(currentUser){
		
			},
		receiveMessage : function(message){
			
			},
		tokenIncorrect : function(token){
		
			},
		error : function(errorCode){
		
			}
	}
	*/ 
	var connect = function(callbacks){
		setConfig();

		callbacks = callbacks || {};

		if( status == 1){
			init();
		}
		if( status == 1 || status == 2 || status == 3){
			//临时防止报错的恶心代码
			callbacks.receiveMessage && receiveMessageList.push(callbacks.receiveMessage);
			callbacks.tokenIncorrect && tokenIncorrectList.push(callbacks.tokenIncorrect);
			callbacks.ready && readyList.push(callbacks.ready);
			callbacks.error && errorList.push(callbacks.error);
		}
		if( status == 4){
			callbacks.ready && callbacks.ready(currentUser);
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
				for(var i=0,len=receiveMessageList.length; i<len; i++){
					receiveMessageList[i](message);
				}
			}
		});

		//开始链接
		var token = config.token;
		status = 3;
		RongIMClient.connect(token, {
			onSuccess: function(userId) {
				status = 4;
				var userInfo = {
					id : userId
				};
				currentUser = userInfo;
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

	var receiveMessage = function(callback){
		if( status != 4){
			connect({
				receiveMessage : callback
			});
			return;
		}
		receiveMessageList.push(callback || function(){});
	}

	var sendMessage = function(conversationType, targetId, content, callbacks){
		if( status != 4){
			connect({
				ready : function(currentUser){
					sendText();
				}
			});
		}else{
			sendText();
		}

		function sendText(){
			var msg = new RongIMLib.TextMessage(content);
			instance.sendMessage(conversationType, targetId, msg, callbacks);
		}
	}
	RongIM.status = status;
	RongIM.statusDesc = statusDesc;
	RongIM.init = init;
	RongIM.connect = connect;
	RongIM.receiveMessage = receiveMessage;
	RongIM.sendMessage = sendMessage;

	window.RongIM = RongIM;
})(window.RongIM = window.RongIM || {});
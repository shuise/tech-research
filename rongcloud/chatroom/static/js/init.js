var rongConfig = {
	chatRoomId: "chatRoomId-001",// 聊天室 Id,可任意指定，能区分不同聊天室即可
};

rongConfig.sendMessageToChatroom = function(messageContent,type){
	messageContent = type+'?'+messageContent;
	var content = {
		content:messageContent,
		extra:"RongCloud"
	};

	var conversationtype = RongIMLib.ConversationType.CHATROOM; // 私聊
	var msg = new RongIMLib.TextMessage(content);
	instance.sendMessage(conversationtype, rongConfig.chatRoomId, msg, {
        onSuccess: function (message) {
            console.log("发送聊天室消息成功");
            var userName = message.senderUserId;
            var messageType = message.content.content.split('?')[0];
            var userMessage = message.content.content.split('?').slice(1).join('?');
            userMessage = RongIMLib.RongIMEmoji.symbolToHTML(userMessage);
            
        	domobj.showMessage({name:userName,message:userMessage,type:messageType});
        },
        onError: function (errorCode,message) {
            console.log(errorCode);
            console.log(message);
        }
    });
};
rongConfig.startEnterChatroom = function(callbacks){
	var count = 0;// 拉取最近聊天最多 50 条。
	instance.joinChatRoom(rongConfig.chatRoomId,count, {
		onSuccess: function() {
            console.log("加入聊天室成功");
            callbacks.send_message();
		},
		onError: function(error) {
            console.log("加入聊天室失败");
		}
	});
};
rongConfig.getToken = function(newUserId){
	// 在url上添加参数'?userId=xxx'可以切换用户。目前xxx的值可以为chatRoomUser_1-chatRoomUser_5，只支持5个用户,不输参数默认为chatRoomUser_1。
	// user = [
	// 	{userId:'chatRoomUser_1',name:'小明'},
	// 	{userId:'chatRoomUser_2',name:'小红'},
	// 	{userId:'chatRoomUser_3',name:'小刚'},
	// 	{userId:'chatRoomUser_4',name:'小志'},
	// 	{userId:'chatRoomUser_5',name:'小强'}
	// ]
	var token;
	switch (newUserId) {
        case '':
        	token = 'khUY46zy9YfkCrvvzXqjgqOKujdAa9vCggP5lhny8RB9jESfOeTP3Y4y/hmC0JNtwIn17FAdyFku+uyhJG5XoPj2YmBMtvc0';
            break;
        case 'chatRoomUser_1':
        	token = 'khUY46zy9YfkCrvvzXqjgqOKujdAa9vCggP5lhny8RB9jESfOeTP3Y4y/hmC0JNtwIn17FAdyFku+uyhJG5XoPj2YmBMtvc0';
            break;
        case 'chatRoomUser_2':
        	token = 'SvUb1E4b45p3V1zzGxTpmeDVO65TqPEq/oc1GT9tx6adX/Oe4f3Gpwjs02KbWTaKj1RynYAEr3lSlaeAqEHyaGQ9XN2ZajQ5QAPhuTPKGdk=';
            break;
        case 'chatRoomUser_3':
            token = 'GB/hZ9rV7gYHVTKmeYvqDqWhm18AYWdL6puaK6TgZz9v+zUoMTZfqfpg9lnOG1SC+kgvn9UhICJhn5GMxBJzPcOrMK+I0k+A';
            break;
        case 'chatRoomUser_4':
            token = '7gNQ435kC2X2b7Vsrr8/jhhk/uhL8Kv6pF6CR8FvYjFvKXtLRe060qFXbVw6gUdh3XpcUjT4TkMeOJIiPVm7tTcuYYtqh/qTMKxUDdNFNqk=';
            break;
        case 'chatRoomUser_5':
            token = 'dajAiow5mhExDKDim2Ga2KOKujdAa9vCggP5lhny8RB9jESfOeTP3Y1llrl5eHPswIn17FAdyFku+uyhJG5XoMK72EGdmtYx';
            break;
        default:
        	token = '';
        	break;
    }
    return token;
}
var init = function(params,callbacks){
	var appKey = params.appKey;
	var token = params.token;
	//加入聊天室后，可以用任意一个发送消息的方法发送消息，只需要conversationType为CHATROOM
	RongIMLib.RongIMClient.init(appKey);
	//公有云初始化
	RongIMLib.RongIMClient.init(appKey);
	instance = RongIMClient.getInstance();
	//初始化表情库
	RongIMLib.RongIMEmoji.init();
	domobj.showEmoji(RongIMLib.RongIMEmoji.emojis);
	// 连接状态监听器
	RongIMClient.setConnectionStatusListener({
		onChanged: function (status) {
		    switch (status) {
	            //链接成功
	            case RongIMLib.ConnectionStatus.CONNECTED:
	                console.log('链接成功');
	                break;
	            //正在链接
	            case RongIMLib.ConnectionStatus.CONNECTING:
	                console.log('正在链接');
	                break;
	            //重新链接
	            case RongIMLib.ConnectionStatus.DISCONNECTED:
	                alert('断开连接');
	                break;
	            //其他设备登录
	            case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
	                alert('其他设备登录');
	                break;
	              //网络不可用
	            case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
	              alert('网络不可用');
	              break;
	            }	
		}
	});
	// 消息监听器
 	RongIMClient.setOnReceiveMessageListener({
	    // 接收到的消息
	    onReceived: function (message) {
	    	console.log("新消息，类型为：" + message.messageType);
	    	console.log(message);
	    	//接受到的消息打印到聊天室
	    	var userName = message.senderUserId;
	    	var messageType = message.content.content.split('?')[0];
            var userMessage = message.content.content.split('?').slice(1).join('?');
            console.log(userMessage);
            userMessage = RongIMLib.RongIMEmoji.symbolToHTML(userMessage);
        	domobj.showMessage({'name':userName,'message':userMessage,'type':messageType});

	        // 判断消息类型
	        switch(message.messageType){
	            case RongIMClient.MessageType.TextMessage:
	                   // 发送的消息内容将会被打印
	                console.log(message.content.content);
	                break;
	            case RongIMClient.MessageType.VoiceMessage:
	                // 对声音进行预加载                
	                // message.content.content 格式为 AMR 格式的 base64 码
	                RongIMLib.RongIMVoice.preLoaded(message.content.content);
	                break;
	            case RongIMClient.MessageType.ImageMessage:
	                // do something...
	                break;
	            case RongIMClient.MessageType.DiscussionNotificationMessage:
	                // do something...
	                break;
	            case RongIMClient.MessageType.LocationMessage:
	                // do something...
	                break;
	            case RongIMClient.MessageType.RichContentMessage:
	                // do something...
	                break;
	            case RongIMClient.MessageType.DiscussionNotificationMessage:
	                // do something...
	                break;
	            case RongIMClient.MessageType.InformationNotificationMessage:
	                // do something...
	                break;
	            case RongIMClient.MessageType.ContactNotificationMessage:
	                // do something...
	                break;
	            case RongIMClient.MessageType.ProfileNotificationMessage:
	                // do something...
	                break;
	            case RongIMClient.MessageType.CommandNotificationMessage:
	                // do something...
	                break;
	            case RongIMClient.MessageType.CommandMessage:
	                // do something...
	                break;
	            case RongIMClient.MessageType.UnknownMessage:
	                // do something...
	                break;
	            default:
	                // 自定义消息
	                // do something...
	        }
	    }
	});
	//开始链接
	RongIMClient.connect(token, {
		onSuccess: function(userId) {
			console.log("链接成功，用户id：" + userId);
			callbacks.enterChatroom();
		},
		onTokenIncorrect: function() {
			console.log('token无效');
		},
		onError:function(errorCode){
		  var info = '';
		  switch (errorCode) {
		    case RongIMLib.ErrorCode.TIMEOUT:
		      info = '超时';
		      break;
		    case RongIMLib.ErrorCode.UNKNOWN_ERROR:
		      info = '未知错误';
		      break;
		    case RongIMLib.ErrorCode.UNACCEPTABLE_PaROTOCOL_VERSION:
		      info = '不可接受的协议版本';
		      break;
		    case RongIMLib.ErrorCode.IDENTIFIER_REJECTED:
		      info = 'appkey不正确';
		      break;
		    case RongIMLib.ErrorCode.SERVER_UNAVAILABLE:
		      info = '服务器不可用';
		      break;
		  }
		  console.log(info);
		}
	});
}

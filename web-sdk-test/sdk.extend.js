(function(RongIMClient){
	function init(params,success,fail){
		RongIMLib.RongIMClient.init(params.appKey, null, params.config);

		// 连接状态监听器
		RongIMClient.setConnectionStatusListener({
			onChanged: function (status) {
			    switch (status) {
			        case RongIMLib.ConnectionStatus.CONNECTED:
			        	instance = RongIMClient.getInstance();
			        	success(instance);
			            break;
			        case RongIMLib.ConnectionStatus.CONNECTING:
			            showTips('正在链接');
			            break;
			        case RongIMLib.ConnectionStatus.DISCONNECTED:
			            reconnect();
			            break;
			        // case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
			        //     showTips('其他设备登录');
			        //     break;
			        // case RongIMLib.ConnectionStatus.DOMAIN_INCORRECT:
			        //     showTips('域名不正确');
			        //     break;
			        // case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
			        // 	break;
			        default:
			        	fail && fail(RongIMLib.ConnectionStatus);
			        }
			}
		});

		/*
		文档：http://www.rongcloud.cn/docs/web.html#3、设置消息监听器

		注意事项：
			1：为了看到接收效果，需要另外一个用户向本用户发消息
			2：
		*/
		RongIMClient.setOnReceiveMessageListener({
			// 接收到的消息
			onReceived: function (message) {
			    // 判断消息类型
	            // showResult("新消息",message,start);

			    switch(message.messageType){
			        case RongIMClient.MessageType.TextMessage:
			        	/*
			        	显示消息方法： 
			        	消息里是 原生emoji
			        	RongIMLib.RongIMEmoji.emojiToHTML(message.content.content);
			            */
			            break;
			        case RongIMClient.MessageType.VoiceMessage:
			            // 对声音进行预加载                
			            // message.content.content 格式为 AMR 格式的 base64 码
			            break;
			        case RongIMClient.MessageType.ImageMessage:
			           // message.content.content => 图片缩略图 base64。
			           // message.content.imageUri => 原图 URL。
			           break;
			        case RongIMClient.MessageType.DiscussionNotificationMessage:
			           // message.content.extension => 讨论组中的人员。
			           break;
			        case RongIMClient.MessageType.LocationMessage:
			           // message.content.latiude => 纬度。
			           // message.content.longitude => 经度。
			           // message.content.content => 位置图片 base64。
			           break;
			        case RongIMClient.MessageType.RichContentMessage:
			           // message.content.content => 文本消息内容。
			           // message.content.imageUri => 图片 base64。
			           // message.content.url => 原图 URL。
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
			            // do something...
			    }
			}
		});

		//开始链接
		RongIMClient.connect(params.token, {
			onSuccess: function(userId) {
				showTips("链接成功，用户id：" + userId);
			},
			onTokenIncorrect: function() {
				//console.log('token无效');
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
			  showTips(info);
			}
		});
	}

	function reconnect(){
		//docs   http://www.rongcloud.cn/docs/api/js/RongIMClient.html

		RongIMClient.reconnect({
			onSuccess: function(userId) {
			},
			onTokenIncorrect: function() {
				//console.log('token无效');
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
			  showTips(info);
			}
		});
	}

})(RongIMClient);
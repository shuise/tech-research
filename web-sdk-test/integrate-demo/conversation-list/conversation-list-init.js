function init() {
    var infos, appKey, token;
    //模拟用户登录后获取用户信息 token 等
    $.getJSON('conversation-list.json', function (data) {
        if (data) {
            //假设 user1 登录
            infos = data;
            appKey = data.userInfos['user1'].appKey;
            token = data.userInfos['user1'].userToken;
        }
    }).then(function () {

        //公有云初始化
        RongIMLib.RongIMClient.init(appKey);


        //连接状态监听器
        RongIMClient.setConnectionStatusListener({
            onChanged: function (status) {
                switch (status) {
                    case RongIMLib.ConnectionStatus.CONNECTED:
                        console.log("链接成功 ");
                        break;
                    case RongIMLib.ConnectionStatus.CONNECTING:
                        console.log('正在链接');
                        break;
                    case RongIMLib.ConnectionStatus.DISCONNECTED:
                        console.log('断开连接');
                        break;
                    case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
                        console.log('其他设备登录');
                        break;
                    case RongIMLib.ConnectionStatus.DOMAIN_INCORRECT:
                        console.log('域名不正确');
                        break;
                    case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
                        console.log('网络不可用');
                        break;
                }
            }
        });


        RongIMClient.setOnReceiveMessageListener({
            // 接收到的消息
            onReceived: function (message) {
                // 判断消息类型
                console.log("新消息，类型为：" + message.messageType);

                console.log(message);

                switch (message.messageType) {
                    case RongIMClient.MessageType.TextMessage:
                        break;
                    case RongIMClient.MessageType.VoiceMessage:
                        break;
                    case RongIMClient.MessageType.ImageMessage:
                        break;
                    case RongIMClient.MessageType.DiscussionNotificationMessage:
                        break;
                    case RongIMClient.MessageType.LocationMessage:
                        break;
                    case RongIMClient.MessageType.RichContentMessage:
                        break;
                    case RongIMClient.MessageType.InformationNotificationMessage:
                        break;
                    case RongIMClient.MessageType.ContactNotificationMessage:
                        break;
                    case RongIMClient.MessageType.ProfileNotificationMessage:
                        break;
                    case RongIMClient.MessageType.CommandNotificationMessage:
                        break;
                    case RongIMClient.MessageType.CommandMessage:
                        break;
                    case RongIMClient.MessageType.UnknownMessage:
                        break;
                    default:
                    // do something...
                }
            }
        });


        //开始链接
        RongIMClient.connect(token, {
            onSuccess: function (userId) {
                console.log("链接成功，用户id：" + userId);
                getConversationList(infos);
            },
            onTokenIncorrect: function () {
                //console.log('token无效');
            },
            onError: function (errorCode) {
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


    });


}

init();
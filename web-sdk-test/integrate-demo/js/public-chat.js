/**
 * Created by wangchengkuo on 17/4/12.
 */
function getPublicChat(_options) {
    var options = {
        props: ['stat'],
        template: 'public/public-chat.html',
        methods: {
            goPublicList: function () {
                this.stat.currentView = 'publicList';
            },
            goPublicInfo: function () {
                this.stat.currentView = 'publicInfo';
            },
            goPublicArticle: function () {
                this.stat.currentView = 'publicArticle';
            },
            sendMsg: function () {
                var text = this.stat.sendMsgVal || 'hello';
                this.stat.sendMsgVal = '';
                var msg = new RongIMLib.TextMessage({content: text, extra: "公众号"});
                var conversationtype = RongIMLib.ConversationType.PUBLIC_SERVICE;
                var targetId = this.stat.currentPublic.publicServiceId;
                RongIMClient.getInstance().sendMessage(conversationtype, targetId, msg, {
                        // 发送消息成功
                        onSuccess: function (message) {
                            //message 为发送的消息对象并且包含服务器返回的消息唯一Id和发送消息时间戳
                            console.log("Send successfully");
                            $('#message-content').val('');
                            renderMsg('my-msg', text);
                        },
                        onError: function (errorCode, message) {
                            var info = '';
                            switch (errorCode) {
                                case RongIMLib.ErrorCode.TIMEOUT:
                                    info = '超时';
                                    break;
                                case RongIMLib.ErrorCode.UNKNOWN_ERROR:
                                    info = '未知错误';
                                    break;
                                case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
                                    info = '在黑名单中，无法向对方发送消息';
                                    break;
                                case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
                                    info = '不在讨论组中';
                                    break;
                                case RongIMLib.ErrorCode.NOT_IN_GROUP:
                                    info = '不在群组中';
                                    break;
                                case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
                                    info = '不在聊天室中';
                                    break;
                                default :
                                    info = '未知';
                                    break;
                            }
                            console.log('发送失败:' + info);
                        }
                    }
                );
            }
        }
    };
    return common.getComponent(options);
}
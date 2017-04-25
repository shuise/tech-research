function getConversationList(app) {

    //同步会话列表
    RongIMClient.getInstance().getConversationList({
        onSuccess: function (conversation) {
            //console.log(conversation);
            if (conversation.length) {
                var infos;
                $.getJSON('conversation-list.json',function (data) {
                    infos=data;
                }).then(function () {
                    app.stat.currentUserInfo = infos["userInfos"]["user1"];
                }).then(function () {
                    conversation.forEach(function (item) {
                        if (item.conversationType === 1) {
                            //私聊
                            item["userInfo"] = infos["userInfos"][item.latestMessage.senderUserId]

                        } else if (item.conversationType === 3) {
                            //群组
                            item["userInfo"] = infos["groupInfos"][item.latestMessage.targetId]
                        }

                    });
                    //console.log(conversation);
                    app.stat.conversationList = conversation;
                });

            }
        },
        onError: function (error) {
            // do something...
        }
    }, null);


}

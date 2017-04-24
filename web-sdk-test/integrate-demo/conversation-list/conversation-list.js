function getConversationList(infos) {

    //初始化 vue
    var conversationListVue = initVue();
    //console.log(conversationListVue);
    conversationListVue.stat.currentUserInfo = infos["userInfos"]["user1"];

    //同步会话列表
    RongIMClient.getInstance().getConversationList({
        onSuccess: function (conversation) {
            //console.log(conversation);
            if (conversation.length) {
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
                conversationListVue.stat.conversationList = conversation;
            }
        },
        onError: function (error) {
            // do something...
        }
    }, null);


}

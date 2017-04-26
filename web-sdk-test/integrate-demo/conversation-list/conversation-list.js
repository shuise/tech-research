function getMockData(url, params, callback) {
    //url 处理 '/user/get_user'

    $.getJSON('conversation-list.json', function (data) {


        var userInfos = {};

        params.forEach(function (item) {
            if (item.conversationType === 1) {
                userInfos[item.id] = data['userInfos'][item.id];
            } else if (item.conversationType === 3) {
                userInfos[item.id] = data['groupInfos'][item.id];
            }
        });

        callback(userInfos)
    });
}


function transConversations(conversation, callback) {

    if (conversation.length) {

        //获取需要查询用户列表
        var conversationUsers = [], userInfos;
        conversation.forEach(function (item) {
            conversationUsers.push({conversationType: item.conversationType, id: item.latestMessage.targetId});
        });

        //获取用户信息
        getMockData("/user/get_user", conversationUsers, function (data) {
            userInfos = data;

            conversation.forEach(function (item) {

                item["userInfo"] = userInfos[item.latestMessage.targetId];

            });

            callback(conversation);
        });


    }

}

function renderConversationView(conversation,instance) {

    return new Vue({
        el: '#conversationListPage',
        data: {
            stat: {
                currentView: 'conversationList',
                currentUserInfo: {
                    "id": "user1",
                    "nickname": "产品",
                    "region": "86",
                    "phone": "13269772701",
                    "portraitUri": "http://img.duoziwang.com/2016/12/08/18594927932.jpg"
                },
                conversationList: conversation
            }
        },
        components: {
            conversationList: {
                props: ['stat'],
                template: '#conversationList',
                methods: {
                    /*removeConversation: function (conversationType, targetId, index) {
                        var that = this;
                        RongIMClient.getInstance().removeConversation(conversationType, targetId, {
                            onSuccess: function (bool) {
                                //删除会话成功。
                                console.log(bool);
                                //删除本地数据
                                that.stat.conversationList.splice(index, 1);
                            },
                            onError: function (error) {
                                // error => 删除会话的错误码
                                console.log(error);
                            }
                        });
                    },*/
                    removeThisConversation:function (conversationType, targetId, index ) {
                        var that = this;
                        removeConversation(instance, conversationType, targetId, index, function () {
                            that.stat.conversationList.splice(index, 1);
                        })
                    },
                    clearConversation: function () {
                        var conversationTypes = [RongIMLib.ConversationType.PRIVATE, RongIMLib.ConversationType.GROUP];
                        RongIMClient.getInstance().clearConversations(conversationTypes, {
                            onSuccess: function (bool) {
                                // 清除会话成功
                                console.log(bool);
                            },
                            onError: function (error) {
                                // error => 清除会话错误码。
                            }
                        });
                    }
                }
            }
        }
    });
}

function removeConversation(instance, conversationType, targetId, index,callback) {
    instance.removeConversation(conversationType, targetId, {
        onSuccess: function () {
            callback();
        },
        onError: function (error) {
            // error => 删除会话的错误码
            console.log(error);
        }
    });
}
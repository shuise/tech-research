function getMockData(url,params,callback) {
    //url 处理 '/user/get_user'
    //params userId
    var opt;
    if(url === '/user/get_user'){
        opt = 'userInfos'
    }else if(url === '/user/get_group'){
        opt = 'groupInfos'
    }
    $.getJSON('conversation-list.json',function (data) {
        callback(data[opt][params])
    });
}


function transConversations(conversation,callback) {

    if (conversation.length) {

        conversation.forEach(function (item) {
            if (item.conversationType === 1) {
                //私聊
                var userId=item.latestMessage.senderUserId;
                getMockData("/user/get_user",userId,function (data) {
                    item["userInfo"] = data;
                })

            } else if (item.conversationType === 3) {
                //群组
                var targetId=item.latestMessage.targetId;
                getMockData("/user/get_group",targetId,function (data) {
                    item["userInfo"] = data;
                })
            }

        });

        callback(conversation);
    }

}

function renderConversationView(conversation) {

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
                methods:{
                    removeConversation:function (conversationType,targetId,index) {
                        var that=this;
                        RongIMClient.getInstance().removeConversation(conversationType,targetId,{
                            onSuccess:function(bool){
                                //删除会话成功。
                                console.log(bool);
                                //删除本地数据
                                that.stat.conversationList.splice(index,1);
                            },
                            onError:function(error){
                                // error => 删除会话的错误码
                                console.log(error);
                            }
                        });
                    },
                    clearConversation:function () {
                        var conversationTypes = [RongIMLib.ConversationType.PRIVATE,RongIMLib.ConversationType.GROUP];
                        RongIMClient.getInstance().clearConversations(conversationTypes,{
                            onSuccess:function(bool){
                                // 清除会话成功
                                console.log(bool);
                            },
                            onError:function(error){
                                // error => 清除会话错误码。
                            }
                        });
                    }
                }
            }
        }
    });
}

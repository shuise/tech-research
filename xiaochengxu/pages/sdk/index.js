var RongIMLib = require("../sdk.js");
var RongIMClient = RongIMLib.RongIMClient;


function init(callbacks){	
    var appKey = "8w7jv4qb78a9y";
    var token = "ZThhLI1Xa1BX5EMREAdArWSH6ouuI8NT/fNmMkzF+4IOKIoFvbsi6JnH8QmnSltLkCcsK8vOgKl3IZgfbxFiWg==";

    console.log("begin 8w7jv4qb78a9y");


	//公有云
	RongIMLib.RongIMClient.init(appKey);
	var instance = RongIMClient.getInstance();

	// 连接状态监听器
	RongIMClient.setConnectionStatusListener({
		onChanged: function (status) {
			console.log(status);
			console.log("setConnectionStatusListener");
		    switch (status) {
		        case RongIMLib.ConnectionStatus.CONNECTED:
		            callbacks.getInstance && callbacks.getInstance(instance);
		            break;
		        }
		}
	});


	RongIMClient.setOnReceiveMessageListener({
		// 接收到的消息
		onReceived: function (message) {
		    // 判断消息类型
		    console.log("新消息: " + message.targetId);
            console.log(message);
            callbacks.receiveNewMessage && callbacks.receiveNewMessage(message);
		}
	});

	//开始链接
	RongIMClient.connect(token, {
		onSuccess: function(userId) {
			callbacks.getCurrentUser && callbacks.getCurrentUser({userId:userId});
			console.log("链接成功，用户id：" + userId);
		},
		onTokenIncorrect: function() {
			//console.log('token无效');
		},
		onError:function(errorCode){
		  console.log("=============================================");
		  console.log(errorCode);
		}
	});
}


var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {
        id : "not init",
        name : "name"
    }
  },
  //事件处理函数
  bindViewTap: function() {
    // wx.navigateTo({
    //   url: '../logs/logs'
    // })
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    init({
        getInstance : function(instance){

        },
        getCurrentUser: function(userInfo){
            //更新数据
            that.setData({
                userInfo:{
                    id : userInfo.userId
                }
            })
        },
        receiveNewMessage : function(message){

        }
    });
  }
})
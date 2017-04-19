var RongIMLib = require("../../sdk.js");
var RongIMClient = RongIMLib.RongIMClient;
var utils = require('../../../utils/util.js');

var userInfo = {
    1 : 'http://7xogjk.com1.z0.glb.clouddn.com/Tp6nLyUKX1466570511241467041',
    2 : 'http://7xogjk.com1.z0.glb.clouddn.com/6LTeWiKdO1466687530424623047'
}

function bindUserInfo(message, pageInstance){
    var direction = message.messageDirection;
    if (direction == 1) {
        message.senderUserId = pageInstance.data.userInfo.id;
    }
    message.avater = userInfo[direction];
}

function init(options, callbacks){	
    var appkey = options.appkey;
    var token = options.token;
	//公有云
	RongIMLib.RongIMClient.init(appkey);
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

var app = getApp();
Page({
  data: {
    motto: 'Hello World',
    userInfo: {
        id : "not init",
        name : "name"
    },
    messageList: [],
    targetId: '',
    content: ''
  },
  sendMessage: function(){
    var that = this;
    
    var conversationType = RongIMLib.ConversationType.PRIVATE,
        targetId = that.data.targetId;

    var msg = new RongIMLib.TextMessage({content: that.data.content});
    that._im.sendMessage(conversationType, targetId, msg, {
        onSuccess: function (message) {
            var list = that.data.messageList;
            bindUserInfo(message, that);
            list.push(message);
            that.setData({
                messageList: list
            });
        },
        onError: function (error,message) {
            console.error(error);
        }
    });

  },
  bindInput: function(e){
    this.setData({
      content: e.detail.value
    });
  },
  navigateBack: function(){
    //删除缓存，临时做法。
    utils.cache.removeAll();

    this._im.disconnect();
    
    var url = '../index';
    wx.redirectTo({
      url: url
    });
  },
  onLoad: function (options) {
    console.log(options.appkey);
    console.log(options.token);
    var that = this

    that.setData({
        targetId: options.targetId
    });

    init(options, {
        getInstance : function(instance){
            that._im = instance;
        },
        getCurrentUser: function(userInfo){
            that.setData({
                userInfo:{
                    id : userInfo.userId
                }
            });
        },
        receiveNewMessage : function(message){
            var list = that.data.messageList;
            bindUserInfo(message, that);
            list.push(message);
            that.setData({
                messageList: list
            });
        }
    });
  }
})
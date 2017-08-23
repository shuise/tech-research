var RongIMLib = require("../../sdk.js");
var emoji = require("../../../emoji/emoji.js");
var RongIMClient = RongIMLib.RongIMClient;
var utils = require('../../../utils/util.js');
var config = require('../../config.js');

emoji.init();

console.log(emoji.names);
var emojis = emoji.emojis;

var FileType = RongIMLib.FileType;

var JSONUtil = {
  stringify: JSON.stringify,
  parse: JSON.parse
};

//加入聊天室后，可以用任意一个发送消息的方法发送消息，只需要conversationType为CHATROOM
var chatRoomId = "chatRoomId-008"; // 聊天室 Id,可任意指定，能区分不同聊天室即可
var count = 10; //拉取最近的会话内容（最近 n ( n <= 50 )条）
var conversationtype = RongIMLib.ConversationType.PRIVATE;
var targetId = "";

var _callbacks = {};

var apiTest = {
  getConversationList: function () {
    var conversationTypes = null;  //具体格式设置需要补充
    var limit = 10; //获取会话的数量
    RongIMClient.getInstance().getConversationList({
      onSuccess: function (list) {
        console.log("getConversationList")
        console.log(list)
        if (list.length > 0) {
          var conversation = list[0];
          var targetType = conversation.conversationType;
          var id = conversation.targetId;
          RongIMClient.getInstance().removeConversation(targetType, id, {
            onSuccess: function (result) {
              console.log("获取会话后，删除会话成功", targetType + '--' + id);
            },
            onError: function (error) {
              // error => 清除会话错误码。 
              console.log("删除会话失败");
              console.log(error)
            }
          });
        }
      },
      onError: function (error) {
        console.log("getConversationList error")
        console.log(error)
      }
    }, conversationTypes, limit);
  },
  getHistroyMessage: function () {
    var timestrap = null; //0, 1483950413013

    RongIMClient.getInstance().getHistoryMessages(conversationtype, targetId, timestrap, count, {
      onSuccess: function (list, hasMsg) {
        console.log("获取历史消息成功");
        console.log(list);
      },
      onError: function (error) {
        console.log("获取历史消息失败");
        console.log(error);
      }
    });
  },
  removeConversation: function () {
    RongIMClient.getInstance().removeConversation(conversationtype, targetId, {
      onSuccess: function (result) {
        console.log("删除会话成功");
      },
      onError: function (error) {
        // error => 清除会话错误码。 
        console.log("删除会话失败");
        console.log(error)
      }
    });
  },
  enterChatroom: function () {
    RongIMClient.getInstance().joinChatRoom(chatRoomId, count, {
      onSuccess: function () {
        console.log("加入聊天室成功");
      },
      onError: function (error) {
        console.log("加入聊天室失败");
        console.log(error)
      }
    });
  },
  getChatroomInfo: function () {
    /*
    需确认 当前用户 已加入聊天室
    */
    var order = RongIMLib.GetChatRoomType.REVERSE;// 排序方式。
    var memberCount = 10; // 获取聊天室人数 （范围 0-20 ）

    RongIMClient.getInstance().getChatRoomInfo(chatRoomId, memberCount, order, {
      onSuccess: function (chatRoom) {
        // chatRoom => 聊天室信息。
        // chatRoom.userInfos => 返回聊天室成员。
        // chatRoom.userTotalNums => 当前聊天室总人数。
        console.log("获取聊天室信息成功");
        console.log(chatRoom);
      },
      onError: function (error) {
        console.log("获取聊天室信息失败");
        console.log(error)
      }
    });
  },
  sendMessageToChatroom: function () {
    var content = {
      content: "hello，time：" + new Date().getTime(),
      extra: "chatroom"
    };

    var conversationtype = RongIMLib.ConversationType.CHATROOM; // 私聊
    var msg = new RongIMLib.TextMessage(content);

    RongIMClient.getInstance().sendMessage(conversationtype, chatRoomId, msg, {
      onSuccess: function (message) {
        console.log("发送聊天室消息成功");
        console.log(message);
      },
      onError: function (errorCode, message) {
        console.log("发送聊天室消息失败");
        console.log(errorCode);
      }
    });
  },
  quitChatroom: function () {
    RongIMClient.getInstance().quitChatRoom(chatRoomId, {
      onSuccess: function () {
        console.log("退出聊天室成功");
      },
      onError: function (error) {
        console.log("退出聊天室失败");
        console.log(error);
      }
    });
  }
}

var connectCallback = {
  onSuccess: function (userId) {
    _callbacks.getCurrentUser && _callbacks.getCurrentUser({ userId: userId });
    console.log("链接成功，用户id：" + userId);

    //API test
    for (var funcName in apiTest) {
      apiTest[funcName]();
    }
  },
  onTokenIncorrect: function () {
    //console.log('token无效');
  },
  onError: function (errorCode) {
    console.log(errorCode);
  }
};

var userInfo = {
  1: 'http://7xogjk.com1.z0.glb.clouddn.com/Tp6nLyUKX1466570511241467041',
  2: 'http://7xogjk.com1.z0.glb.clouddn.com/6LTeWiKdO1466687530424623047'
}

function bindUserInfo(message, pageInstance) {
  var direction = message.messageDirection;
  if (direction == 1) {
    message.senderUserId = pageInstance.data.userInfo.id;
  }
  message.avater = userInfo[direction];
}

function init(options, callbacks) {
  _callbacks = callbacks; 
  targetId = options.targetId;
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
  RongIMClient.connect(token, connectCallback);
}

var sendMessage = (params, callback) => {
  callback = callback || utils.noop;
  var {targetId, type, context, msg} = params;
  var data = context.data;
  context._im.sendMessage(type, targetId, msg, {
    onSuccess: (message) => {
      var list = data.messageList;
      bindUserInfo(message, context);
      list.push(message);
      context.setData({
        messageList: list
      });
    },
    onError: (error, message) => {
      console.error(error);
    }
  });
};

var getFileKey = (path) => {
  return path.substring(9);
};

var uploadFile = (params, callback) => {
  var {path, im, type} = params;
  var upload = (token) => {
    var key = getFileKey(path);
    var formdata = {
      token: token,
      key: key
    };
    var url = config.uploadURL;
    wx.uploadFile({
      url: url, 
      filePath: path,
      name: 'file',
      formData: formdata,
      success: function (res) {
        console.log(res);
        var data = res.data
        callback(data);
      }
    });
  };
  im.getFileToken(type, {
    onSuccess: (ret) => {
      var token = ret.token;
      upload(token);
    },
    onError: (error) => {
      console.error('getFileToken error' + error);
    }
  });
};

var getFileUrl = (params, callback) => {
  var {info, im, type} = params;
  var {name, oriname} = info;
  im.getFileUrl(type, name, oriname, {
    onSuccess: (ret) => {
      var error = null;
      callback(error, ret);
    },
    onError: (error) => {
      console.error('getFileUrl error' + error);
    }
  });
};
var getBase64Image = (params, callback) => {
  var domain = config.getBase64URL;
  var url = params.url;
  wx.request({
    url: domain,
    method: 'POST',
    data: {
      url: url
    },
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      var error = null;
      var data = res.data;
      callback(error, data.base64);
    }
  });
};
var createImage = (params) => {
  var {context, url} = params;
  var {targetId} = context.data;
  getBase64Image(params, (error, base64) => {
      var msg = new RongIMLib.ImageMessage({content:base64, imageUri: url});
      var params = {
        context: context,
        type: RongIMLib.ConversationType.PRIVATE,
        targetId: targetId,
        msg: msg
      };
      sendMessage(params);
  });
};
var sendImage = (params) => {
  var {context} = params;
  var im = context._im;
  params = {
    im: im,
    type: FileType.IMAGE
  };
  wx.chooseImage({
    count: 1, // 默认9
    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    success: function (res) {
      var path = res.tempFilePaths[0];
      params.path = path;
      uploadFile(params, (info) => {
        params.info = JSONUtil.parse(info);
        params.info['oriname'] = '';
        getFileUrl(params, (error, ret) => {
          var params = {
            context: context,
            url: ret.downloadUrl
          };
          createImage(params);
        });
      });
    }
  });
};

var sendFile = (context) => {
 //TODO
};

var app = getApp();
Page({
  data: {
    motto: 'Hello World',
    userInfo: {
      id: "not init",
      name: "name"
    },
    messageList: [],
    targetId: '',
    content: ''
  },
  sendImage: function() {
    var context = this;
    var params = {
      context: context
    };
    sendImage(params);
  },
  disconnect: function(){
    var context = this;
    var im = context._im;
    im.disconnect();
  },
  reconnect: function(){
    RongIMClient.reconnect(connectCallback);
  },
  sendFile: function() {
    sendFile(this);
  },
  sendMessage: function() {
    var context = this;

    var {content, targetId} = context.data;
    var msg = new RongIMLib.TextMessage({content: content});
    var params = {
      context: context,
      type: RongIMLib.ConversationType.PRIVATE,
      targetId: targetId,
      msg: msg
    };
    sendMessage(params);
  },
  bindInput: function(e) {
    this.setData({
      content: e.detail.value
    });
  },
  navigateBack: function() {
    var context = this;
    context._im.disconnect();
    //删除缓存，临时做法。
    utils.cache.removeAll();
    var url = '../index';
    wx.redirectTo({
      url: url
    });
  },
  onLoad: function (options) {
    console.log(options.appkey);
    console.log(options.token);
    var that = this;

    that.setData({
      targetId: options.targetId
    });

    init(options, {
      getInstance: function (instance) {
        that._im = instance;
      },
      getCurrentUser: function (userInfo) {
        that.setData({
          userInfo: {
            id: userInfo.userId
          }
        });
      },
      receiveNewMessage: function (message) {
        message.content.content =  emoji.unicodeToEmoji(message.content.content);
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
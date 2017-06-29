var RongIMLib = require("../../sdk.js");
var RongIMClient = RongIMLib.RongIMClient;
var utils = require('../../../utils/util.js');
var config = require('../../config.js');

var FileType = RongIMLib.FileType;
var JSONUtil = {
  stringify: JSON.stringify,
  parse: JSON.parse
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
    onSuccess: function (userId) {
      callbacks.getCurrentUser && callbacks.getCurrentUser({ userId: userId });
      console.log("链接成功，用户id：" + userId);
    },
    onTokenIncorrect: function () {
      //console.log('token无效');
    },
    onError: function (errorCode) {
      console.log(errorCode);
    }
  });
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
  navigateBack: () => {
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
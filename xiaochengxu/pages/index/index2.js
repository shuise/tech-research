var RongIMClient = require('../../utils/RongCloud.js')

var app = getApp()


const appKey = "8w7jv4qb78a9y";
const token = "qyN3mb4PjM+ZXDOdW4f8KpltMLEfik9DxpqXaALr0RGROd6gPSiwQtBYfRPwWMBLjb+Q/sj37frDI5cUnfVAKg==";

RongIMClient.init(appKey,token,function(instance){
  Page({
  data: {
    motto: 'Hello World',
  },
  //事件处理函数
  bindViewTap: function() {
    // wx.navigateTo({
    //   url: '../logs/logs'
    // })
  },
  onLoad: function () {
    this.setData({
      motto : "RongCloud",
      userInfo: {
        avatarUrl : "http://admin.rongcloud.cn/assets/images/logo.jpg",
        nickName : instance.appKey
      }
    });
  }
})

});
//index.js
//获取应用实例


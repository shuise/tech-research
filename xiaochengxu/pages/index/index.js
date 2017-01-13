var utils = require('../../utils/util.js')

console.log("utils");
console.log(utils);
console.log(utils.file);
console.log(utils.image);

var app = getApp();

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
        nickName : "name"
      }
    });
  }
})
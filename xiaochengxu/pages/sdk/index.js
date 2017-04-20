var utils = require("../../utils/util.js");

var appkey = '8luwapkvucoil';

var tester1 = '';
var tester2 = '';

var app = getApp()
Page({
  data: {
    motto: 'RongCloud',
    icon: 'http://7xogjk.com1.z0.glb.clouddn.com/Tp6nLyUKX1466570117209114014',
    appkey: appkey,

    tester1: {
      token: 'G1cgTtWLZ0tijNlrkVZA5220V27XsDF2Dx+bgnMVAZh1TCNfZRDk/zFt049K+CeupVho6nIQ4rU5gAHyBuzlHg9TIq6kcYNI',
      targetId: 'tester2'
    },

    tester2: {
      token: 'ecphvouqF0rUu/48mSBguW20V27XsDF2Dx+bgnMVAZh1TCNfZRDk/4zXSvMRRLRO/X7/kENIB25S/KS4CyGL7w9TIq6kcYNI',
      targetId: 'tester1'
    }
  
  },
  //事件处理函数
  naviTo: function(e) {
    
    var data = e.target.dataset;

    var appkey = data.appkey,
        token = data.token,
        targetId = data.targetId;

    var urlTpl = './chat/chat?appkey={0}&token={1}&targetId={2}',
        url = utils.stringFormat(urlTpl, [appkey, token, targetId]);

    wx.redirectTo({
      url: url
    });

  }
})
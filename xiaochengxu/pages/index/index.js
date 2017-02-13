var utils = require("../../utils/util.js");

console.log("utils");
console.log(utils);

var url1 = "http://www.rongcloud.cn/docs/assets/img/logo_s.png";
var url2 = "http://rongcloud.cn/images/newVersion/log_wx.png?2016";
var pageData = {
    motto: 'test cache ',
    userInfo: {
      avatarUrl: url1
    }
  }
//index.js
//获取应用实例
var app = getApp();

Page({
  data: pageData,
  //事件处理函数
  downDoc : function(){

    var cache = utils.cache;

    cache.set("a","11");
    cache.set("aa","111");
    cache.set("aab","1111");

    console.log("cache.get");
    console.log(cache.get("aa"));

    console.log("cache.search");
    console.log(cache.search("aa"));
    console.log(cache.search("ab"));


    console.log("remove+ search");
    cache.remove("aab");
    console.log(cache.search("aa"));
    console.log(cache.search("ab"));

    //下载文档
    var doc = "http://code.rongcloud.cn/system/files/JavaScript%20Secrets%20Ninja.pdf";
    utils.file.download(doc,{
      success : function(filePath){
        utils.file.open(filePath);
      }
    });
  },
  bindViewTap: function() {
    // wx.navigateTo({
    //   url: '../logs/logs'
    // })

    var _g = this;
    utils.image.select({count:1},{
      success : function(filePath){
        
        console.log(filePath);

        //本地显示
        _g.setData({
          userInfo :{
            avatarUrl : filePath
          }
        });

        //本地url规则
        var surl = "wxfile://tmp_1329212908o6zAJsy-U0dzYKHWfNH1FcfxlFWg1484291690589.jpg";
        // utils.image.preview(filePath,surl);


        //预览，必须为服务器url
        var urls = [url1,url2];

        wx.previewImage({
              // current: surl, // 当前显示图片的http链接
              urls: urls // 需要预览的图片http链接列表
          });


        utils.request({
          method : "POST",
           url : "http://f.rongcloud.cn/xiaochengxu/utils/ajax.php?a=1",
           data : {
              b : 2,
              c : 3
           }
        },{
          success : function(data){
            console.log(data);
          }
        });



        //upload
        // utils.file.upload(filePath,{
        //   url : "http://f.rongcloud.cn/xiaochengxu/utils/post.php",
        //   method : "POST"
        // },{
        //   success: function(res){
        //     console.log(res);
        //   },
        //   fail : function(res){
        //     console.log(res);
        //   }
        // });


      }
    });
  },
  onLoad: function () {
    pageData.userInfo.nickname = "onload";
  }
})

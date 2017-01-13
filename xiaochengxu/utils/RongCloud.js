//https://github.com/easemob/webim-weixin-xcx/blob/master/utils/strophe.js 

function RongIMClient() {
    return {
        version : "2.2.4",
        init : function(appKey, token, main){
        	main({
        		appKey : appKey,
        		token : token
        	});
        }
    }
}

wx.setStorageSync(1,1);

wx.setStorageSync(122,1);

const res = wx.getStorageInfoSync();
const keys = res.keys;

console.log(keys)
console.log(new Array())
console.log(Array.forEach)

module.exports = RongIMClient()


/* socket
https://mp.weixin.qq.com/debug/wxadoc/dev/api/network-socket.html?t=2017112#wxconnectsocketobject

wx.connectSocket({
  url: 'test.php',
  data:{
    x: '',
    y: ''
  },
  header:{ 
    'content-type': 'application/json'
  },
  method:"GET"
})




https://mp.weixin.qq.com/debug/wxadoc/dev/api/data.html?t=2017112#wxsetstorageobject
wx.setStorage(OBJECT)

wx.setStorage({
  key:"key",
  data:"value"
})
*/ 
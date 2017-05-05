window.onload = function(){ 
     /*
        微信浏览器播放语音问题
        参考：http://www.css88.com/archives/6002
    */
    //判断是否为微信浏览器
    var isWeChatBrowser =  function (){
        var ua = window.navigator.userAgent.toLowerCase();
        if(ua.match(/MicroMessenger/i) == 'micromessenger'){
            return true;
        }
        else{
            return false;
        }
    }
    var isWeChat = isWeChatBrowser();

    if(isWeChat) {
        wx.config({
            // 配置信息
        });
        wx.ready(function () {
            play(); //播放语音消息方法
        });
    }


    /*
        ios Safari等浏览器播放语音问题
        参考：
        https://segmentfault.com/a/1190000007864808
        http://rawgit.com/ufologist/50b4f2768126089c3e11/raw/9a7688a2bac7b556d9998a89a2b972b09fd4263b/fake-autoplay-audio-ios-safari.html
    */
    //判断是否为 ios 浏览器
    var isIOSBrowser = function (){
        var isIOSBrowserRes = (/i(Phone|P(o|a)d)/.test(navigator.userAgent));

        return isIOSBrowserRes;
    }
    var isIOSBrowserRes = isIOSBrowser();
    if(isIOSBrowserRes) {
        //在safri on iOS 里面明确指出等待用户的交互动作后才能播放 audio，也就是说如果没有得到用户的 action 就播放的话就会被safri拦截
        document.getElementById('play').addEventListener("touchstart",function(event){
            play(); //播放语音消息方法
            window.removeEventListener('touchstart',play, false);
            event.stopPropagation();
        });
    }
};
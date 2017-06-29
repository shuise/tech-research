var Voice = (function(win, RongIMVoice) {
	RongIMVoice.init();

	var Player = RongIMVoice.Player;
	/*
        微信浏览器播放语音问题
        参考：http://www.css88.com/archives/6002
    */
	//判断是否为微信浏览器
	var isWeChat = (function() {
		var userAgent = navigator.userAgent.toLowerCase();
		return userAgent.match(/MicroMessenger/i) == 'micromessenger';
	})();

	/*
        iOS Safari等浏览器播放语音问题
        参考：
        https://segmentfault.com/a/1190000007864808
        http://rawgit.com/ufologist/50b4f2768126089c3e11/raw/9a7688a2bac7b556d9998a89a2b972b09fd4263b/fake-autoplay-audio-ios-safari.html
    */
    //判断是否为 iOS 浏览器
    var isiOS = (/i(Phone|P(o|a)d)/.test(navigator.userAgent));

   	var app = (function(){
   		var app = {
   			config: function(){ },
   			ready: function(callback){
   				callback();
   			}
   		};
   		if (isWeChat) {
   			app = wx;
   		}
   		return app;
   	})();

    var getBrowser = function(){
    	var browser = 'pc';
    	if (isiOS || isWeChat) {
    		browser = 'app';
    	}
    	return browser;
    };

    var playItem = {
    	app: function(params, callback){
    		
    		var element = params.element;
    		var voice = params.voice;

    		app.config({ });
	        app.ready(function () {
	           element.on("touchstart",function(){
	                Player.play(voice, callback);
	                element.unbind("touchstart");
	           });
	        });
    	},
    	pc: function(params, callback){
    		
    		var voice = params.voice;

    		Player.play(voice, callback);
    	}
    };

	var play = function(params, callback) {
		var browser = getBrowser();
		playItem[browser](params, callback);
	};

	var pause = function() {
		RongIMVoice.Player.pause();
	}

	return {
		play: play,
		pause: pause
	};
})(window, RongIMVoice);
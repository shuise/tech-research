(function (global, factory,namespace) {
    if(typeof exports === 'object' && typeof module !== 'undefined'){
    	module.exports = factory();
    }else if(typeof define === 'function' && define.amd){
    	define(factory);
    }else{
    	global[namespace] = factory();
    }
})(window, function(){
    /*
    emojiData = {
        "emoji unicode" : {
            "en" : "english name" //for not support emoji+image
            "cn" : "chinese name" //same as en
            "background" : "image url"  //for not support emoji-charactor
            "position" : "background-position=[10,10],px"
        }
    }
    */
    var emoji = {
        "u1F600":{"en":"grinning","zh":"\u72DE\u7B11","tag":"\uD83D\uDE00","bp":"0px 0px"},
        "u1F601":{"en":"grin","zh":"\u9732\u9F7F\u800C\u7B11","tag":"\uD83D\uDE01","bp":"-22px 0px"},
        "u1F602":{"en":"joy","zh":"\u6B22\u4E50","tag":"\uD83D\uDE02","bp":"-44px 0px"}
    };

    /*support emoji list*/
    var supportWhiteList = {
        "Win" : { 
            "Chrome41+" : true,  /* Chrome 41 开始支持 Emoji 显示（全平台) */
            "Firefox50+" : true,    /*Firefox 50 开始支持 emoji 支持 */
            "Chrome" : false,
            "Firefox" : false,
            "MSIE" : false,
            "Opera" : true,
            "Safari" : true,
            "QQBrowser" : true,
            "UCBrowser" : true,
        },
        "Mac" : {
            "Chrome41+" : true,
            "Firefox50+" : true, 
            "Chrome" : false,
            "Firefox" : false,
            "Opera" : true,
            "Safari" : true,
        },
        "Android" : true,
        "iPhone" : true,
    };

    /*auto detect*/
	var isSupportEmoji = (function() {
        var canvas = document.createElement('canvas');
        if (!canvas.getContext || !canvas.getContext('2d') || typeof canvas.getContext('2d').fillText !== 'function') {
            return false;
        }
        var ctx = canvas.getContext('2d');
        ctx.textBaseline = 'top';
        ctx.font = '32px Arial';
        ctx.fillText('😀', 0, 0);
        return ctx.getImageData(16, 16, 1, 1).data[0] !== 0;
    })();

    /*same as key in data*/
	function getEN(){

	}

	function getCN(){

	}

	function show(emojiUnicode) {

    }

    /*
    config = {
        emojiData : emojiData,
        image : "base image url",
        size : "big/middle/little/20px",
        show : "auto/emoji/image" 
    }
    */
    function init(config) {

    }

	return {
		play : play,
		stop : stop,
		init : init
	};
}, "RongIM")
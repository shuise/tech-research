"use strict";

;(function (global, factory,namespace) {
    if(typeof exports === 'object' && typeof module !== 'undefined'){
    	module.exports = factory();
    }else if(typeof define === 'function' && define.amd){
    	define(factory);
    }else{
    	global[namespace] = factory();
    }
})(window, function(){
	var isSupportFlash = (function(){
	    var version = "", n = navigator; 
	    if (n.plugins && n.plugins.length) {
	        for (var ii = 0; ii < n.plugins.length; ii++) {
	              if (n.plugins[ii].name.indexOf('Shockwave Flash') != -1) { 
	                  version = n.plugins[ii].description.split('Shockwave Flash ')[1];
	                  version = version.split(' ').join('.');
	                  break; 
	             } 
	        } 
	    }else if (window.ActiveXObject) { 
	        var swf = new ActiveXObject('ShockwaveFlash.ShockwaveFlash'); 
	        if(swf) {
	            VSwf=swf.GetVariable("$version");
	            flashVersion=parseInt(VSwf.split(" ")[1].split(",")[0]);
	            version = VSwf.toLowerCase().split('win').join('').split(',').join('.');
	        }
	    }
	    return version != ""; 
	})();

	var isSupportAudio = (function(){
		// return window.Audio + "" === "function HTMLAudioElement() { [native code] }";
        return false;
	})();

    if(!isSupportAudio && !isSupportFlash){
        alert("浏览器不支持Audio，也不支持flash，请安装flash");
        return;
    }

    var isAndroidWeixin = /android/i.test(navigator.userAgent) && /MicroMessenger/i.test(navigator.userAgent);

    var element = {};
    /*
    voice base64,amr
    */

    var voice = null;

    function Player(_voice,callback){
        voice = _voice;
        if (isSupportAudio) {
            return createAudioPlayer(callback);
        }else if(isSupportFlash){
            return createFlashPlayer(callback);
        }else{

        }
    }

    function createFlashPlayer(callback){
        var id = "player";
        var containter = "rongcloud-flashContent";
    
        // var swfobject = "//cdn.ronghub.com/swfobject-2.0.0.min.js";
        var playerSWF = "http://web.devtalk.im/tech-research/web-sdk-test/player-2.0.1.swf";

        var node = document.createElement("div");
            node.setAttribute("id", containter);
        document.body.appendChild(node);
        
        var swfVersionStr = "11.4.0";

        var params = {
            quality : "high",
            bgcolor : "#ffffff",
            allowscriptaccess : "sameDomain",
            allowfullscreen : "true"
        };

        var attributes = {
            id : id,
            name : id,
            align : "middle"
        };

        console.log(swfobject);
        console.log(swfobject.embedSWF);

        swfobject.embedSWF(playerSWF, containter, "1", "1", swfVersionStr, null, {}, params, attributes,function(){
                setTimeout(function(){
                    flashPlayer(id,callback);
                }, 2000);
        }); //异步
    }

    window.RongIMLib = {
        RongIMVoice: function(duration){
            console.log(duration);
        }
    };
    function flashPlayer(id,callback){
        // var player = eval("window['" + id + "']");
        // console.log(player);
        // player.play = function(){
        //     player.doAction("init", voice);
        // }
        // player.stop = function(){
        //     player.doAction("stop");
        // }
        
        // callback(player);
        console.log('================');
        window.tmp = document.getElementById(id);
        tmp.doAction('init', voice);
        console.log('----------------------');
    }


    function createAudioPlayer(callback) {
        var player = new Audio();
        amr2wav(voice,function(voiceWAV){
            player.src = voiceWAV;

            player.controls = true;
            document.body.appendChild(player);    

            callback(player);
        });
    }

    /*
	function play(data, duration) {
        if (isSupportAudio) {
            player.doAction("init", data)
        } else {
            var key = data.substr(-10);
            if (element[key]) {
                element[key].play();
            }
            onCompleted(duration);
        }
    };

	function stop(base64Data) {
        if (isSupportAudio) {
            player.doAction("stop");
        } else {
            if (base64Data) {
                var key = base64Data.substr(-10);
                if (element[key]) {
                    element[key].pause();
                    element[key].currentTime = 0;
                }
            } else {
                for (var key_1 in element) {
                    element[key_1].pause();
                    element[key_1].currentTime = 0;
                }
            }
        }
    }
    */
    
    function amr2wav(voice,callback){
        var blob = base64ToBlob(voice, "audio/amr");
        var reader = new FileReader();
        reader.onload = function(e) {
            var data = new Uint8Array(e.target.result);
            var samples = AMR.decode(data);
            var pcm = PCMData.encode({
                sampleRate: 8000,
                channelCount: 1,
                bytesPerSample: 2,
                data: samples
            });
            var voice2 = "data:audio/wav;base64," + btoa(pcm);
            callback(voice2);
        };
        reader.readAsArrayBuffer(blob);
    }

    // function preLoaded(base64Data, callback) {
    //     var str = base64Data.substr(-10);
    //     if (element[str]) {
    //         callback && callback();
    //         return;
    //     }
    //     if(isAndroidWeixin) {
    //         var audio = new Audio();
    //         audio.src = "data:audio/amr;base64," + base64Data;
    //         element[str] = audio;
    //         callback && callback()
    //     }else if (isSupportAudio) {
    //         if (str in element) {
    //             return;
    //         }
    //         var blob = base64ToBlob(base64Data, "audio/amr");
    //         var reader = new FileReader();
    //         reader.onload = function(e) {
    //             var data = new Uint8Array(e.target.result);
    //             var samples = AMR.decode(data);
    //             var pcm = PCMData.encode({
    //                 sampleRate: 8000,
    //                 channelCount: 1,
    //                 bytesPerSample: 2,
    //                 data: samples
    //             });
    //             var audio = new Audio();
    //             audio.src = "data:audio/wav;base64," + btoa(pcm);
    //             element[str] = audio;
    //             callback && callback();
    //         };
    //         reader.readAsArrayBuffer(blob);
    //     }else{

    //     }
    // }
    
    function onprogress() {
    }

    function onCompleted(duration) {
        var count = 0;
        var timer = setInterval(function() {
            count++;
            onprogress();
            if (count >= duration) {
                clearInterval(timer)
            }
        }, 1000);
        if (isSupportAudio) {
            player.doAction("play")
        }
    }

    function base64ToBlob(base64Data, type) {
        var mimeType = {};
        if (type) {
            mimeType[type] = type;
        }
        base64Data = base64Data.replace(/^(.*)[,]/, "");
        var sliceSize = 1024;
        var byteCharacters = atob(base64Data);
        var bytesLength = byteCharacters.length;
        var slicesCount = Math.ceil(bytesLength / sliceSize);
        var byteArrays = new Array(slicesCount);
        for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
            var begin = sliceIndex * sliceSize;
            var end = Math.min(begin + sliceSize, bytesLength);
            var bytes = new Array(end - begin);
            for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
                bytes[i] = byteCharacters[offset].charCodeAt(0)
            }
            byteArrays[sliceIndex] = new Uint8Array(bytes)
        }
        return new Blob(byteArrays, mimeType)
    }

	return {
		Player : Player
	};
}, "RongIMVoice")
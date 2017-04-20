(function (global, factory,namespace) {
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
	    return version; 
	})();

	var isSupportAudio = (function(){
		return window.Audio + "" == "function HTMLAudioElement() { [native code] }";
	})();


    //callback(progress)
	function play(file,callback){

	}

	function stop(){

	}

	function preLoad(base64Data, callback) {
        var str = base64Data.substr(-10),
            me = this;
        if (me.element[str]) {
            callback && callback();
            return
        }
        if (/android/i.test(navigator.userAgent) && /MicroMessenger/i.test(navigator.userAgent)) {
            var audio = new Audio();
            audio.src = "data:audio/amr;base64," + base64Data;
            me.element[str] = audio;
            callback && callback()
        } else {
            if (!me.notSupportH5) {
                if (str in me.element) {
                    return
                }
                var blob = base64ToBlob(base64Data, "audio/amr");
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
                    var audio = new Audio();
                    audio.src = "data:audio/wav;base64," + btoa(pcm);
                    me.element[str] = audio;
                    callback && callback()
                };
                reader.readAsArrayBuffer(blob)
            }
        }
    }

    function base64ToBlob(base64Data, type) {
        var mimeType;
        if (type) {
            mimeType = {
                type: type
            }
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
		play : play,
		stop : stop,
		preLoad : preLoad
	};
}, "RongIM")
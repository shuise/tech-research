(function(){
    var isArray = Array.isArray || function (obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    };
    
    var toParam = function(obj){
        var param = [];
        for(var key in obj){
            param.push(key+"="+encodeURIComponent(obj[key]));
        }
        return param.join("&");
    };
    
    var Monitor = function(base, cfg){
        this.base = base || {};
        var _base = {
            id: 'f2e'/*,
            nid: '',
            uid: ''*/
        };
        for(var key in _base){
            if(typeof this.base[key] == 'undefined') this.base[key] = _base[key];   
        }
        this.cfg = cfg || {};
        var _cfg = {
            baseUrl : "http://project.f2e.netease.com:88/c.gif",
            wait : 1000
        };
        for(var key in _cfg){
            if(typeof this.cfg[key] == 'undefined') this.cfg[key] = _cfg[key];   
        }
        this.info = [];
        this.response = [];
        if(this.cfg.busy){
            this.busyLog();
        }
    };
    
    Monitor.prototype.busyLog = function(time){
        var that = this;
        time = time || 100;
        var start = (new Date()).getTime();
        this.timeout_b = setTimeout(function(){
            that.response.push((new Date()).getTime() - start);
            that.busyLog(time);
        }, time);
    };
    
    Monitor.prototype.domload = function(callback){
        if (window.addEventListener) {
		    document.addEventListener( "DOMContentLoaded", callback, false );
        } else if ( document.attachEvent ) {
			document.attachEvent( "onreadystatechange", callback);
        }
    };
    
    Monitor.prototype.load = function(callback){
        if (window.addEventListener) {
            window.addEventListener("load", callback, false);
        } else {
            if (window.attachEvent) {
                window.attachEvent("onload", callback);
            }
        }
    };
    
    Monitor.prototype.performance = function(){
        var that = this;
        function html5collect(){
            if (window.performance && window.performance.timing) {
                var timing = {};
                var navStart = window.performance.timing.navigationStart || 0;
                var diff;
                for(var key in window.performance.timing){
                    diff = window.performance.timing[key] - navStart;
                    if(diff > 0){
                        timing[key] = diff;
                    }
                }
                that.collect(timing);
            }
        }
        that.domload(function(){
            that.timer("domload");
        });
        that.load(function(){
            that.timer("load");
            if(that.cfg.wait){
                setTimeout(function(){
                    html5collect();
                    that.send();
                }, that.cfg.wait);                
            }else{
                setTimeout(function(){
                    html5collect();
                },500);
            }
        });
    };
    
    Monitor.prototype.timer = function(name){
        if(window._ntes_const && window._ntes_const.stime){
            var info = {};
            info[name] = (new Date()).getTime() - window._ntes_const.stime.getTime();
            this.collect(info);
        }
    };
    
    Monitor.prototype.collect = function(info){
        if(!isArray(info)){
            info = [info];   
        }
        this.info = this.info.concat(info);
    };
    
    Monitor.prototype.send = function(){
        var url = this.cfg.baseUrl;
        url += '?' + toParam(this.base);
        for(var i = 0, len = this.info.length; i < len; i++){
            url += '&' + toParam(this.info[i]);
        }
        if(this.timeout_b){
            clearTimeout(this.timeout_b);
            url += '&busy=' + this.response.splice(0,100).join("~");
        }
	    var imgObj = new Image();
	    imgObj.src = url;
        this.info = [];
    };
    
    if(!window.NTES) window.NTES = {};
    window.NTES.Monitor = Monitor;
    
})();
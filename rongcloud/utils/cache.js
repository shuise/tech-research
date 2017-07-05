'use strict'
;export var cache = (function(){
    var keyNS = "rongcloud-im-";

    function get(key){
        key = keyNS + key;

        if(!isKeyExist(key)){
            return undefined;   //key不存在
        }
        var val =  localStorage.getItem(key) || sessionStorage.getItem(key);
      		val = JSON.parse(val);

        if(val != null && val.hasOwnProperty("type") && val.hasOwnProperty("data")){
            return val.data;
        }

        return undefined;
    }

    //isPersistent
    function set(key,val,isTemp){
        var _store = localStorage;
        if(isTemp){
            _store = sessionStorage;
        }

        key = keyNS + key;
        var type = (typeof val);
        val = {
            data : val,
            type : type
        };

        _store[key] = JSON.stringify(val);
    }

    function remove(key){
        key = keyNS + key;
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
    }

    function isKeyExist(key){
        //不能用返回值判断，因为可以写入""和0
        return localStorage.hasOwnProperty(key) || sessionStorage.hasOwnProperty(key);
    }

    return {
        get : get,
        set : set,
        remove : remove
    }
})();
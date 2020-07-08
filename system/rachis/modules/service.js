define(["/modules/storage/mongo.js"], function(storage){
    var scope = this, $$ = bowlder;
    scope.dir = "modules";
    var confLib = "developer.163.com/f2e/rachis/projects";
    function libName(subdir){
        return "developer.163.com/f2e/" + scope.dir + (subdir ? "/" + subdir : "");
    }
    storage.serverAddr = function(key, path){
        key = key ? key = '_id=' + key + '&' : '';
        return "/system/bowlder/mgallery/node/mongoproxy.js.node?" + key + (path ? "path=" + path : "");
    }
    scope.getItem = function(key){
        return storage.getItem(key, libName());
    }
    scope.setItem = function(key, json){
        return storage.setItem(key, json, libName());
    }
    scope.getConf = function(key){
        return storage.getItem(key, confLib);
    }
    scope.setConf = function(key, json){
        return storage.setItem(key, json, confLib);
    }
    scope.setDetail = function(key, json){
        return storage.setItem(key, json, libName('detail'));
    }
    scope.removeItem = function(key){
        return storage.removeItem(key, libName());
    }
    scope.getList = function(pattern, options){
        return storage.getList(pattern, options, libName());
    }
});

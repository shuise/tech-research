// 获取项目信息
var fs = require('fs');
var querystring = require('querystring');
var pathUtil = require('path');
var mkdirp = require('mkdirp');
var isFile = function(fullpath){
    return fs.existsSync(fullpath) && fs.statSync(fullpath).isFile();
};
var isDir = function(fullpath){
    return fs.existsSync(fullpath) && fs.statSync(fullpath).isDirectory();
};

var CONFDIR = pathUtil.join(__dirname, "../conf").replace(/\\/g, '/');
var TMPLDIR = CONFDIR + "/template";
var WORKDIR = CONFDIR.replace(/\/system\/rachis.*/, '');

exports.get = function(req, res){
    var body = '', options = req._parsedUrl;

    var params = querystring.parse(options.query);
    var path = params.path;
    var dir = WORKDIR + '/' + path.replace(/^\//, '');
    var fileTree = {};
    if(!fs.existsSync(dir)){
        exit("目录不存在");
    }else{
        var success = true, msg = {}, modules = [];
        var projectJson = dir + "/project.json";
        if(fs.existsSync(projectJson)){
            var tmp = fs.readFileSync(projectJson);
            msg = JSON.parse(tmp);
        }
        var moduleDir = dir + "/modules/";
        if(fs.existsSync(moduleDir)){
            fs.readdirSync(moduleDir).forEach(function(dir){
                var moduleJson = moduleDir + dir + '/module.json';
                if(fs.existsSync(moduleJson)){
                    var tmp = fs.readFileSync(moduleJson);
                    var arr = JSON.parse(tmp);
                    arr.forEach(function(item){
                        item.url = moduleJson.replace(/[^/]*?$/, item.mod).replace(/.*?\/system/, '/system/bowlder/mgallery/index.shtml#/detail/system');
                    });
                    modules = modules.concat(arr);
                }else{
                    var mod;
                    if(fs.existsSync(moduleDir + dir + '/' + dir + '.js')){
                        mod = dir + '.js';
                    }else if(fs.existsSync(moduleDir + dir + '/' + dir + '.html')){
                        mod = dir + '.html';
                    }
                    if(mod) modules.push({
                        title: dir + '/' + mod,
                        mod: mod
                    });
                }
            });
        }
        res.writeHead(200, {'Content-Type': 'application/json;charset=utf8'});
        res.end(JSON.stringify({success:!!success, options: msg, modules: modules})); 
    }
    
    function exit(msg, success){
        res.writeHead(200, {'Content-Type': 'application/json;charset=utf8'});
        res.end(JSON.stringify({success:!!success, msg:msg}));
    }
};

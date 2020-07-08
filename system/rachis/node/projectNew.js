// 创建项目框架，project.json
var fs = require('fs');
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
var HEADFOOTDIR = CONFDIR + "/headfoot";
delete require.cache[require.resolve(CONFDIR + '/channels.js')];
var channels = require(CONFDIR + '/channels.js');
var x84 = 8;

function validateFile(file){
    if(file.indexOf(".svn") != -1) return false;
    if(file.indexOf(".xml") != -1) return false;
    if(file.substr(0, 1) == '.') return false;
    return true;
}
function readHeadFoot(options){ //加载headfoot/下的通用头尾
    if(options.headFoot){
        loadDir(HEADFOOTDIR + '/' + options.headFoot);
    }
    loadDir(HEADFOOTDIR + "/default");

    function loadDir(dir){ //options.HeadInc, options.FootInc, options.Stat
        if(isDir(dir)){
            fs.readdirSync(dir).forEach(function(name){
                if(/(\S+)\.html/.test(name)){
                    var key = RegExp.$1;
                    if(!options[key]){
                        var html = fs.readFileSync(dir + "/" + name).toString();
                        options[key] = template(html, options);
                    }
                }
            });
        }
    }
};
function genModuleTree(mod, tree){
    var dir = mod._id,
        files = mod.files;
    var fname = dir.replace(/\/+$/, '').replace(/.*\//, '');
    var fileBase = 'modules/' + dir.replace(/\/*$/, '/') + fname;
    var mFile = '';
    if(files.css && !fs.existsSync(fileBase + '.css')){
        tree[fileBase + '.css'] = '';
        mod._id = null;
    }
    if(files.html){
        mFile = fileBase + '.html';
        if(!fs.existsSync(mFile)){
            tree[mFile] = files.css ? '<link rel="stylesheet" href="@'+fname+'.css" media="screen" />' : '';
        }
    }
    if(files.js){
        mFile = fileBase + '.js';
        if(!fs.existsSync(mFile)){
            var nullhtml  = '';
            if(!files.html) nullhtml = 'scope.html = "";\n        ';
            var js = 'define(\n\
    [],\n\
    function(){\n\
        var scope = this, $$ = bowlder;\n\
        '+nullhtml+'scope.init = function(widget){\n\
\n\
        };\n\
    });'
            tree[mFile] = js;
        }
    }
    mod._id = mFile;
}
function readDir(dir, options){
    var reg = new RegExp('^' + dir + '/');
    var tree = {};
    var modules = [];
    readHeadFoot(options);
    var commonModules = options.commonModules || [];
    var selfModules = options.selfModules || [];
    var commonPlugins = options.commonPlugins;
    var copyModule = options.copyModule;
    var cols12 = false;
    var deps = [],
        depsParams = [];
    commonPlugins.forEach(function(plugin){
        var pluginId = plugin._id;
        if(!pluginId) return;
        if(/cols12/.test(pluginId)) cols12 = true;
        deps.push(pluginId);
        if(!/\.js$/.test(pluginId)) return;
        depsParams.push(pluginId.replace(/.*\/|\.\w+$/g, ''));
    });
    var moduleTpl = '<div ne-module="{_id}"'+(cols12?' class="cols12-{x84}"':'')+'></div>';
    commonModules.forEach(function(mod){
        if(copyModule && /\/(\w+)\/(\w+)(\.\w+)$/.test(mod._id)){ //复制到当前项目
            var path = RegExp.$1,
                fname = RegExp.$2,
                postfix = RegExp.$3,
                _id = 'modules/' + path + '/' + fname + postfix;
            var moduleDir = WORKDIR + mod._id.replace(/[^\/]+$/, '');
            fs.readdirSync(moduleDir).forEach(function(name){
                if(/\.(js|css|s?html?|md)/.test(name)){
                    tree['modules/' + path + '/' + name] = fs.readFileSync(moduleDir + name).toString();
                }
            });
            mod._id = _id;
        }
        modules.push(template(moduleTpl, mod));
    });
    selfModules.forEach(function(mod){
        genModuleTree(mod, tree);
        if(mod._id){
            modules.push(template(moduleTpl, mod));
        }
    });
    
    if(!options.mngMode || options.overWrite){
        if(cols12){
            for(var i = 0, len = modules.length; i < len; i ++){
                if(i%2 == 0) modules[i] = '<div class="cols12">\n      '+modules[i];
                if(i%2 == 1 || i == len-1) modules[i] = (i%2?'  ':'')+modules[i]+'\n    </div>';
            }
        }
        options.modules = modules.join("\n    ") || '&nbsp;';
        options.depends = JSON.stringify(deps);
        options.dependsParams = depsParams.join(", ");
        lsr(dir);
    }
    return tree;
    function lsr(_dir){
        if(!isDir(_dir)) return;
        fs.readdirSync(_dir).forEach(function(name){
            if(!validateFile(name)) return;
            var fullpath = _dir + "/" + name;
            if(isFile(fullpath)){
                tree[template(fullpath.replace(reg, ''), options)]
                    = template(fs.readFileSync(fullpath).toString(), options);
            }else{
                tree[fullpath.replace(reg, '')] = true;
                lsr(fullpath);
            }
        });
    }
};

exports.post = function(req, res){
    var body = '', options;
    req.on('data', function (data) {
        body += data;
    });
    req.on('end', function () {
        options = JSON.parse(body);
        
        var channelName = options.channelName;
        options.channelPath = channelName;
        var todir = WORKDIR + '/' + options.projectPath.replace(/(^\/|\/$)/g, '');
        var fileTree = {};
        if(options.mngMode && !options.overWrite && !fs.existsSync(todir)){
            exit("目录不存在");
            return;
        }else{
            if(!options.overWrite && !options.mngMode && fs.existsSync(todir)){
                exit("目录已经存在");
                return;
            }
            if(!options.projectName){
                options.projectName = todir.replace(/.*\//, '');
            }
            if(channelName){
                for(var i = 0, len = channels.length; i < len; i ++){
                    var item = channels[i];
                    if(item.value == channelName){
                        options.channelLabel = item.label;
                        options.channelId = item.channelid;
                        break;
                    }
                }
            }
            var type = options.projectType;
            var fromdir = TMPLDIR + '/' + type;
            checkDir(fromdir);
            fileTree = readDir(fromdir, options); //根据模板目录生成新项目目录树
        }
        if(/nej/.test(type)){
            options.projectJson.nej = true;
        }
        fileTree["project.json"] = JSON.stringify(options.projectJson, null, '  ');
        writeDir(todir, fileTree, options.mngMode);
    });
    
    function writeDir(dir, tree, adm){
        for(var file in tree){
            var content = tree[file];
            var workfile = dir + "/" + file;
            if(typeof content === 'boolean'){ //目录
                if(!fs.existsSync(workfile)){
                    mkdirp.sync(workfile);
                }
            }else{ //文件
                checkDir(workfile.replace(/[^\/]*?$/, ''), true);
                if(typeof content == 'string'){
                    fs.writeFileSync(workfile, content.replace(/\r/g, ''));
                }
            }
        }
        exit("项目已经"+(adm ? "更新" : "生成")+"到 " + dir, true);
    };
    
    function checkDir(dir, generate){
        if(!dir){
            exit("目录不能为空");
            return;
        }
        if(fs.existsSync(dir)){
            var stats = fs.statSync(dir);
            if(!stats.isDirectory()){
                exit(dir + " 不是目录");
                return;
            }
        }else{
            if(generate){
                mkdirp.sync(dir);
            }else{
                exit(dir + " 不存在");
                return;
            }
        }
    };
    function exit(msg, success){
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({success:!!success, msg:msg}));
    }
};

function template(temp, data, regexp){
    if(!Array.isArray(data)) data = [data];
    var ret = [];
    for(var i=0,j=data.length; i < j; i++){
	    ret.push(replaceAction(data[i]));
    }
    x84 = x84 == 8 ? 4 : 8;
    return ret.join("");
    function replaceAction(object){
	    return temp.replace(regexp || (/[\\\$]?\{([^}]+)\}/g), function(match, name){
	        if (match.charAt(0) == '\\') return match.slice(1);
	        if (match.charAt(0) == '\$') return match;
            var _val = match;
            if(name == 'x84') return x84;
            if(/(\S+)\|(\S*)/.test(name)){
                name = RegExp.$1;
                _val = RegExp.$2;
            }
            var nameCap = name.substr(0, 1).toLowerCase() + name.substr(1);
	        return (object[name] != undefined) ? object[name] : (object[nameCap] != undefined ? object[nameCap] : _val);
	    });
    }
}

define(["../../conf/template/list.js", "../../conf/headfoot/list.js", "../../conf/channels.js", "../service.js"], function(projectTypes, headFoots, channels, service){
    var scope = this, $$ = bowlder;
    var state = scope.state = {
        showAdvanced: true,
        mngMode: false
    };
    var options = scope.options = {};
    scope.confs = {
        projectTypes: projectTypes,
        headFoots: headFoots,
        channels: channels
    };
    service.dir = 'plugins';
    service.getList(".", {sort:'-cites'}).success(function(list){
        for(var i = list.length-1; i >= 0; i --){
            var item = list[i];
            if(/sports/.test(item._id)) list.splice(i, 1);
        }
        scope.availablePlugins = list;
        var tabs = {};
        $$.each(list, function(module){
            var cate = module.cate;
            if(cate){
                if(!tabs[cate]){
                    tabs[cate] = [];
                }
                tabs[cate].push(module);
            }
        });
        list.navs = [];
        list.bodys = [];
        $$.each(tabs, function(body, nav){
            list.navs.push(nav);
            list.bodys.push(body);
        });
        scope.$refresh();
    });
    service.dir = 'modules';
    service.getList(".", {sort:'-cites'}).success(function(list){
        for(var i = list.length-1; i >= 0; i --){
            var item = list[i];
            if(/sports/.test(item._id)) list.splice(i, 1);
        }
        scope.availableModules = list;
        if(state.mngMode) updateCommonModules();
        var tabs = {};
        $$.each(list, function(module){
            var cate = module.cate;
            if(cate){
                if(!tabs[cate]){
                    tabs[cate] = [];
                }
                tabs[cate].push(module);
            }
        });
        list.navs = [];
        list.bodys = [];
        $$.each(tabs, function(body, nav){
            list.navs.push(nav);
            list.bodys.push(body);
        });
        scope.$refresh();
    });
    var _projectType = 'special';
    var _options = {
        overWrite : false,
        copyModule: false,
        mngMode: false,
        channelName : localStorage.getItem("channel") || '',
        projectName : '',
        _projectName : '限小写英文、数字、下划线',
        headFoot : "channel2013",
        projectJson : {
            syncFull : true,
            skipRes : false
        },
        commonModules: [],
        selfModules: [],
        commonPlugins: []
    };
    _options.projectPath = _options.channelName ? _options.channelName + '/': '';
    scope.$watch("options.projectType", function(v){
        state.isBowlder = /bowlder/i.test(v || '');
    });
    scope.resetProject = function(){
        if(state.mngMode){
            location.hash = '#/create';
        }else{
            newProject();
        }
    }
    function updateCommonModules(){
        var usedModules = {};
        $$.each(options.commonModules, function(mod){
            usedModules[mod._id] = 1;
        });
        $$.each(scope.availableModules, function(module){
            module.checked = !!usedModules[module._id];
        });
    }
    function newProject(){
        scope.q = localStorage.getItem("lastProjectPath") || '';
        scope.result = {};
        $$.extend(true, options, _options);
        if(!options.projectType) options.projectType = _projectType;
        updateCommonModules();
        $$.each(scope.availablePlugins, function(module){
            module.checked = false;
        });
    };
    scope.search = function(e){
        if(e.keyCode == '9'){ //Tab
            e.preventDefault();
            scope.q = localStorage.getItem("lastProjectPath") || '';
        }else if(e.keyCode == '13'){ //Enter
            var path = scope.q;
            if(!path || /^\s*$/.test(path)) return;
            e.target.blur();
            location.hash = '#/manage/' + path.replace(/^\/+/, '');
        }
    };
    scope.configCommon = function(module){
        return false;
    }
    scope.checkCommon = function(module){
        options.commonModules.push(module);
        module.checked = true;
        scope.$refresh();
    }
    scope.uncheckCommon = function(module){
        var idx = options.commonModules.indexOf(module);
        if(idx > -1) options.commonModules.splice(idx, 1);
        module.checked = false;
        scope.$refresh();
    }
    scope.checkCommonPlugin = function(module){
        options.commonPlugins.push(module);
        module.checked = true;
        scope.$refresh();
    }
    scope.uncheckCommonPlugin = function(module){
        var idx = options.commonPlugins.indexOf(module);
        if(idx > -1) options.commonPlugins.splice(idx, 1);
        module.checked = false;
        scope.$refresh();
    }
    scope.nameInput = function(e){ //项目名，只限[a-z0-9_]
        var code = e.keyCode;
        var funcKey = {37:1, 39:1, 46:1, 8:1, 116:1};
        if(funcKey[code] || (code >= 65 && code <= 90)){
            return;
        }
        if((code == 47 || code == 35 || code == 173 || code == 189) && e.shiftKey){
            return;
        }
        if(code >= 48 && code <= 57 && !e.shiftKey){
            return;
        }
        e.preventDefault();
    };
    scope.pathVerify = function(e){
        if(e.keyCode == '32' || e.keyCode == '9'){
            e.preventDefault();
        }
    };
    scope.pathClick = function(){
        if(state.mngMode){
            window.open("/" + options.projectPath);
        }
    };
    scope.addSelfMod = function(){
        $$.emit("pop.selfMod");
    }
    scope.save = function(){
        if(!/dev.f2e.163.com|127.0.0.1/.test(location.host)){
            alert("请在dev.f2e.163.com或127.0.0.1下进行操作");
            return;
        }
        var path = options.projectPath;
        var name = options.projectName;
        if(!name){
            if(!/\/\w/.test(path)){
                alert("请输入项目名称");
                return;
            }
        }else if(/[^a-z_0-9]/.test(name)){
            alert("项目名称只限小写英文、数字、下划线");
            return;
        }else if(!options.channelName){
            alert("请选择所属频道");
            return;
        }
        localStorage.setItem("channel", options.channelName);
        $$.ajax.post("node/projectNew.js.node", options).success(function(json){
            scope.result = json;
            delete options._projectName;
            delete options.overWrite;
            options.mngMode = true;
            service.setConf(path, options);
            localStorage.setItem("lastProjectPath", options.projectPath);
            scope.$refresh();
        });
    }
    scope.routeInit = function(params){
        var path = params.path;
        state.mngMode = !!path;
        if(path){
            service.getConf(path).success(function(json){
                localStorage.setItem("lastProjectPath", path);
                $$.extend(true, options, json);
                options.overWrite = false; //不允许覆盖主文件
                updateCommonModules();
                scope.$refresh();
            });
        }else{
            newProject();            
        }
    }
    scope.init = function(widget){
        widget.watch("options.projectName", function(name){
            if(!$$.isDefined(name)) return;
            var path = options.projectPath;
            delete options.mngMode;
            if(/\w\/\w+\//.test(path)){
                options.projectPath = path.replace(/[^\/]*?$/, name);
            }else if(options.channelName){
                options.projectPath =
                    (options.channelName ? options.channelName + '/' : '')
                    + name;
            }
        });
        widget.watch("options.projectPath", function(path){
            if(!$$.isDefined(path)) return;
            if(!options.projectName){
                //项目名placeholder
                if(/\/(\w+)$/.test(path)){
                    options._projectName = RegExp.$1;
                }else{
                    options._projectName = _options._projectName;
                }
            }
            var reg = /^\/?(frontend\/)?/;
            if(reg.test(path)){
                options.projectPath = path = path.replace(reg, '');
            }

            var channelPath = options.projectPath.replace(/^\//, '').replace(/\/.*/, '');
            if(!channelPath){
                options.channelName = '';
            }else if($$.isArray(scope.confs.channels)){
                for(var i = 0, len = scope.confs.channels.length; i < len; i ++){
                    var channel = scope.confs.channels[i];
                    if(channel.value == channelPath){
                        options.channelName = channel.value;
                        break;
                    }
                }
            }
        });
        widget.watch("options.channelName", function(channel){
            if(!$$.isDefined(channel)) return;
            var path = options.projectPath;
            if(/\w\/\w+\//.test(path)){
                options.projectPath = path.replace(/^\w+\//, channel + '/');
            }else{
                options.projectPath =
                    (channel ? channel + '/' : '')
                    + options.projectName;
            }
        });
        $$.on("selfMod.insert", function(module){
            options.selfModules.push(module);
            scope.$refresh();
        });
    };
});

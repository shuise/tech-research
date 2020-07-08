;
(function($) {
    /*
	demo：http://upload.photo.163.com/test/testAnonyUpload.html
	后端代理接口：郭令宇
	*/

    function createForm(data, callback, target) {
        var _form = document.createElement("form");
        _form.action = data.url;
        _form.target = data.target;
        _form.method = data.method || "POST";
        _form.className = data.classname || "uploadform";
        if (data.enctype) {
            _form.enctype = data.enctype;
            _form.encoding = 'multipart/form-data';
        }

        if (target) {
            appendCover(_form, target);
        } else {
            appendHidden(_form);
        }

        var params = data.params || {};
        for (var key in params) {
            var _input = document.createElement('input');
            _input.name = key;
            _input.className = key;
            _input.value = params[key];
            if (key == "filedata") {
                _input.type = "file";
                _input.style.cssText = "position:absolute;right:0;opacity:0;filter:alpha(opacity=0);cursor:pointer;";
            } else {
                _input.type = "hidden";
            }
            _form.appendChild(_input);
        }
        callback && callback(_form);
    }

    function postForm(_form, flag) {
        // console.log(_form.elements["filedata"].files);
        _form.submit();
        if (flag) {
            _form.parentNode.removeChild(_form);
        }
    }

    function appendHidden(node) {
        var body = $("body")[0];
        var target = document.createElement('div');
        target.style.cssText = "position:absolute;top:-10000px;width:0;height:0;overflow:hidden;";
        body.appendChild(target);
        return target.appendChild(node);
    }

    function appendCover(node, target) {
        var width = $(target).realWidth() + "px";
        var height = $(target).realHeight() + "px";
        node.style.cssText = "opacity:0;filter:alpha(opacity=0);position:relative;";
        node.style.width = width;
        node.style.height = height;
        node.style.marginTop = "-" + height;
        $(target).append(node);
    }

    function uploadImg(node, callback) {
        var iframe = $("#uploadFrame")[0];
        if (!iframe) {
            iframe = document.createElement("iframe");
            iframe.id = iframe.name = "uploadFrame";
            appendHidden(iframe);
        }
        var name = "f2e_" + new Date().getTime();
        var data = {
            "url": /netease/.test(location.href) ? "http://active.ws.netease.com/http/upload/image" : "http://upload.developer.163.com/upload/image",
            "classname": "uploadform",
            "target": "uploadFrame",
            "enctype": "multipart/form-data",
            "params": {
                "filedata": "",
                "photodesc": "",
                "bucketName": "hot-pic",
                "callback": name
            }
        };
        window[name] = callback;
        createForm(data, function(_form) {
            var _node = $(".filedata", _form)[0];
            // _node.type = "file";  // 此处ie8及以下不能设置input的type属性，故只能在创建节点的时候设置好
            // _node.setAttribute("type","file");
            if (node.getAttribute("_multiple") && node.getAttribute("_multiple") == "multiple") {
                _node.multiple = "multiple";
            }
            _node.onchange = function() {
                if (this.value != "") {
                    postForm(_form, false);
                    this.value = "";
                }
            }
        }, node);
    }

    $.uploadImg = uploadImg;

})(jQuery)
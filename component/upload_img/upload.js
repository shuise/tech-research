/*
demo：http://upload.photo.163.com/test/testAnonyUpload.html
后端代理接口：郭令宇
*/
NE.load.createForm = function(data,callback,target){
    var _form = document.createElement("form");
    _form.action = data.url;
    _form.target = data.target;
    _form.method = data.method || "POST";
    if(data.enctype){
    	_form.enctype = data.enctype;
    }

    if(target){
    	NE.dom.appendCover(_form,target);
    }else{
    	NE.dom.appendHidden(_form);
    }

    var params = data.params || {};
    for(var key in params) {
        var _input = document.createElement('input');
        _input.name = key;
        _input.id = key;
        _input.value = params[key];
        _form.appendChild(_input);
    }
    callback && callback(_form);
}

NE.load.postForm = function(_form,flag){
    _form.submit();
    if(flag){
    	_form.parentNode.removeChild(_form);
    }
}

NE.dom.appendHidden = function(node){
	var body = NE.$("body")[0];
    var target = document.createElement('div');
        target.style.cssText = "position:absolute;top:-10000px;width:0;height:0;overflow:hidden;";
    body.appendChild(target);
    return target.appendChild(node);
}

NE.dom.appendCover = function(node,target){
	NE.dom.after(node,target);
	var width = target.clientWidth + "px";
	var height = target.clientHeight + "px";
	node.style.cssText = "position:relative;overflow:hidden;opacity:0;_filter:alpha(opacity=0);";
	node.style.width = width;
	node.style.height = height;
	node.style.marginTop = "-" + height;
}

NE.uploadImg = function(node,callback){
	var iframe = NE.$("#uploadFrame");
	if(!iframe){
		iframe = document.createElement("iframe");
		iframe.id = iframe.name = "uploadFrame";
		NE.dom.appendHidden(iframe);
	}
	var name = "f2e_" + new Date().getTime();
	var data = {
		"url" : "http://upload.buzz.163.com/image_upload",
		"target" : "uploadFrame",
		"enctype" : "multipart/form-data",
		"params" : {
			"Filedata" : "",
			"photodesc" : "",
			"callback" : name
		}
	};
	window[name] = callback;
	NE.load.createForm(data,function(_form){
		var _node = NE.$("#Filedata");
			_node.type = "file";

			if(node != null){
				_node.style.width = node.clientWidth;
				_node.style.height = node.clientHeight;
			}
		_node.onchange = function(){
			NE.load.postForm(_form,false);
		}	
	},node);
}

NE.uploadImgData = function(imageData,callback){
	var iframe = NE.$("#uploadFrame");
	if(!iframe){
		iframe = document.createElement("iframe");
		iframe.id = iframe.name = "uploadFrame";
		NE.dom.appendHidden(iframe);
	}
	var name = "f2e_" + new Date().getTime();
	var data = {
		"url" : "http://upload.buzz.163.com/image_upload?imagedatatype=base64",
		// "url" : "http://test.163.com/component/upload_img/trans.php",
		"target" : "uploadFrame",
		"params" : {
			"imagedata" : imageData,
			"callback" : name
		}
	};
	window[name] = callback;
	NE.load.createForm(data,function(form){
		NE.load.postForm(form,true);
	});
}
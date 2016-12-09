var upload = (function(){
	function _upload(file, callbacks, option){
		option = option || {};
		// TODO 适配 XMLHttpRequest
		var xhr = new XMLHttpRequest();
		xhr.upload.onprogress = function(event){
			callbacks.update(event);
		};
		
		// TODO 适配 upload
	    xhr.onreadystatechange = function () {
	        if (xhr.readyState == 4 && xhr.status == 200) {
           	 	if (xhr.responseText) {
           	 		callbacks.success(JSON.parse(xhr.responseText));
           	 	}else{
           	 		callbacks.fail && callbacks.fail();
           	 	}
	        }
	    };
	    var url = option.url || "default url";
	    xhr.open("POST", url, true);

	    var formData = new FormData();
	    	formData.append("file", file);

	    xhr.send(formData);

	    //todo 分片
	}

	function uploadFile(file,callbacks){
		_upload(file,{
			update : function(event){
				// var progress = size/total;
				var progress = Math.random();
				callbacks.update && callbacks.update(progress);
			},
			success : function(response){
				// var url = response.url;
				var url = "http://pic1.58cdn.com.cn/mis/pic/n_v1bl2lwko53uvfrgtd5eba.jpg";
				callbacks.success && callbacks.success(url);
			},
			fail : function(response){
				alert("fail");
			}
		});
	}

	function uploadImg(file,callbacks){
		_upload(file,{
			update : function(event){
				// var progress = size/total;
				var progress = Math.random();
				callbacks.update && callbacks.update(progress);
			},
			success : function(response){
				// var url = response.url;
				var url = "http://test-10011010.file.myqcloud.com/798443817865859072/346%E4%B8%AA%E6%88%B7%E7%B1%8D%E6%B4%BE%E5%87%BA%E6%89%80%E5%92%8C%E9%A6%96%E6%89%B9%E5%8A%9E%E7%90%86%E6%9A%82%E4%BD%8F%E7%99%BB%E8%AE%B0%E6%B5%81%E7%AE%A1%E7%AB%99%E5%90%8D%E5%8D%95.doc";
				callbacks.success && callbacks.success(url);
			},
			fail : function(response){
				alert("fail");
			}
		});
	}

	return {
		uploadImg : uploadImg,
		uploadFile : uploadFile
	}
})();
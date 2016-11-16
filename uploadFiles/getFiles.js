var getFiles = (function(){
	function groupFiles(fileList){
		var data = {
			files : [],
			imgs : []
		};
		for(var i=0,len=fileList.length;i<len;i++){
			var fileType = fileList[i].type;
				fileList[i].blobUrl = getBlobUrl(fileList[i]);
				fileList[i].size = fileList[i].size/1000*1000;  //字节转化为M
			if (fileType.indexOf('image') == -1) {
				data.files.push(fileList[i]);
			}else{
				data.imgs.push(fileList[i]);
			}                       
		}
		return data;
	}

	function getFilesByDrag(drapArea,callback){
		drapArea.addEventListener('dragover', function(e) {                    
			e.stopPropagation();                    
			e.preventDefault();                
		}, false);                

		drapArea.addEventListener('drop', handleDrop, false);                                

		function handleDrop(e) {  
			e.stopPropagation();　　                
			e.preventDefault();                                        
			var fileList  = e.dataTransfer.files;　　//获取拖拽文件 
			fileList = groupFiles(fileList); 
			callback(fileList);
		}
	}
	function getFilesBySelect(fileDom,callback){
		fileDom.onchange = function(e){
			var fileList = this.files;
			fileList = groupFiles(fileList); 
			callback(fileList);
		}
	}	

	function getBlobUrl(file){
		var url = "";
		if(window.createObjectURL){
			url = window.createObjectURL(file);
		}else if(window.createBlobURL){
			url = window.createBlobURL(file);
		}else if(window.URL && window.URL.createObjectURL){
			url = window.URL.createObjectURL(file);     //chrome,firefox
		}else if(window.webkitURL && window.webkitURL.createObjectURL){
			url = window.webkitURL.createObjectURL(file);   //safari
		} 
		return url;
	}

	function getBase64File(file,callback) {
		var reader = new FileReader();
		reader.readAsDataURL(file);

		reader.onload = function(evt){
			callback(evt.target.result);
		}
	}

	return {
		getBlobUrl : getBlobUrl,
		getBase64File : getBase64File,
		bySelect : getFilesBySelect,
		byDrag : getFilesByDrag
	};
})();
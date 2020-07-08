NE.getFile = function(file,callback,type){
  var reader = new FileReader();
  if(type == "text"){
      reader.readAsText(file, "utf-8");   //UTF-16
    }else if(type == "dataUrl"){
      reader.readAsDataURL(file);
    }else if(type == "arrayBuffer"){
      reader.readAsArrayBuffer(file);
    }else if(type == "binary"){
      reader.readAsBinaryString(file);
    }

  reader.onload = function(evt){
    var result = {
      "type" : type,
      "data" : evt.target.result,
      "size" : evt.total,	//字节数
      "blobUrl" : getBlobUrl(file)
    }
    callback && callback(result);
  }
} 

NE.getBlobUrl = function(file){
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
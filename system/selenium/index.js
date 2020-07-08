(function(){
    var file = document.getElementById("yiche_upload_file");
    var form = document.getElementById("yiche_upload_form");
    var $_cloud_sc = document.getElementById("cloud_sc")
    var $_cloud_a = document.getElementById("cloud_a");

    $_cloud_a.onclick = function(){
        if(hasClass($_cloud_sc, "hover")){
            removeClass($_cloud_sc, "hover");
        }else{
            addClass($_cloud_sc, "hover");
        }
    };

    file.onchange = function(){
        form.submit();
    };
    
    function hasClass(obj, _class) {
        if(!obj) return false;
        var arr = obj.className.split(" ");
        for(var i = arr.length - 1; i >= 0; i--){
            if(arr[i] == _class){
                return 1;
            }
        }
        return 0;
	}

    function addClass(obj, _class) {
        if(!obj) return;
		if (!hasClass(obj, _class))
			obj.className += (obj.className ? " " : "") + _class;
	}
    
    function removeClass(obj, _class) {
        if(!obj) return;
		if (hasClass(obj, _class))
			obj.className = obj.className.replace(new RegExp("\\b" + _class + "\\b"), "");
	}
    
})()
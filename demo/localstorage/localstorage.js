(function(){

window.tools_localStorage = {
	storageObject : null,
    init:function(){
    	var t = this;
    	if(window.localStorage){
    		t.storageObject = window.localStorage;
    	}else{
    		t.storageObject = tools_userData;
    	}		
    },
    setItem : function(key, value) { 
    	var t = this;  
    	t.storageObject.setItem(key, value);        	 
    },
    getItem: function(key) {
    	var t = this;  
    	return t.storageObject.getItem(key); 
    },
    removeItem : function(key) {
    	var t = this;  
    	t.storageObject.removeItem(key);      	
    }
};

var tools_userData = {
	userdata_inpt : null,
	init : function(){
		var t= this;
		if(t.userdata_inpt==null){
			try{
				t.userdata_inpt = document.createElement("input");
				t.userdata_inpt.type="hidden";
				t.userdata_inpt.style.display="none";
				t.userdata_inpt.addBehavior("#default#userData");
				document.body.appendChild(t.userdata_inpt);	
				t.userdata_inpt.load("tools_userData");//存放在tools_userData空间下							
			}catch(e){
				return false;
			}		
		}
		return true;
	},
	setItem : function(k,v){
		var t = this;
		if(t.init()){
			var o = t.userdata_inpt;
			o.setAttribute(k,v);
			o.save("tools_userData");
		}
	},
	getItem : function(k){
		var t = this;
		if(t.init()){
			var o = t.userdata_inpt;
			return o.getAttribute(k);
		}
		return null;		
	},
	removeItem : function(k){
		var t = this;
		if(t.init()){
			var o = t.userdata_inpt;
			o.removeAttribute(k);
			o.save("tools_userData");
		}	
	}
}	
})();


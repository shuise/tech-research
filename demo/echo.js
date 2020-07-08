addEventListener("message",function(e){
	setTimeout(function(){
		postMessage("workers say: John is away.");
	},2000)
},true);
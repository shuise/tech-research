const os = require('os');

function printOS(){
	for(var prop in os){
		console.log(prop);
		if(typeof os[prop] == "function"){
			console.log(os[prop]());
		}else{
			console.log(os[prop]);
		}
	}
}

// printOS();
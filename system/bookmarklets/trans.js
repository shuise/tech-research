(function(){
	var _link = location.href;
	var _host = location.host;
	var devs = ["dev.f2e.163.com","dev.f2e.netease.com"];
	var qas = ["qa.developer.163.com","static.f2e.netease.com"];

	if(_host == devs[0]){
		location.href = _link.replace(_host,qas[0]);
	}
	if(_host == devs[1]){
		location.href = _link.replace(_host,qas[1]);
	}
	if(_host == qas[0]){
		location.href = _link.replace(_host,devs[0]);
	}
	if(_host == qas[1]){
		location.href = _link.replace(_host,devs[1]);
	}
})();
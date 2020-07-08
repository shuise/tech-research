function areaSelect(target,callback,config,tpl,data){
	var tpl = tpl || {
		"head" : '<select name="{name}" id="{id}">',
		"repeat" : '<option value="{code}">{name}</option>',
		"foot" : '</select>'
	};
	var config = config || {
			provice : {"name":"ne_provice","id":"ne_provice","value":"110000"},
			city : {"name":"ne_city","id":"ne_city","value":"110000"}
		};
	var data = data || window.areacode;

	var subs = NE.template.replace;
	var $ = NE.$;

	var provs = data.province;
	var citys = data.city;

	// NE.trace(provs);
	// NE.trace(citys);

	var _prov = config.provice;
	var _city = config.city;
		target.innerHTML = subs(tpl.head,_prov) + tpl.foot + subs(tpl.head,_city) + tpl.foot;

	var sels = $("select",target);
	var _prov_dom = sels[0];
	var _prov_value = _prov.value;
	var _city_dom = sels[1];
	var _city_value = _city.value;

	var result = {provice:_prov_value,city:_city_value};

	// _prov_dom.innerHTML = subs(tpl.repeat,provs);
	_prov_dom.length = 0;
	for (var i = 0, len = provs.length; i < len; i++) {
		opt = document.createElement('option');
		opt.setAttribute('value', provs[i]["code"]);
		opt.appendChild(document.createTextNode(provs[i]["name"]));

	    _prov_dom.appendChild(opt);
	}

	_prov_dom.value = _prov_value;
	createCity(_prov_value);

	_prov_dom.onchange = function(){
		_prov_value = this.value;
		createCity(_prov_value);
		_callback();
	}

	_city_dom.onchange = function(){
		result.city = this.value;
		_callback();
	}

	function _callback(){
		result.provice = _prov_dom.value;
		result.city = _city_dom.value;
		result.text = [_prov_dom.options[_prov_dom.selectedIndex].innerHTML,_city_dom.options[_city_dom.selectedIndex].innerHTML];
		callback(result);
	}
	function createCity(p_value){
		var cityData = citys[p_value];
		// var cityHTML =  subs(tpl.repeat,cityData);
		// _city_dom.innerHTML = cityHTML;
		_city_dom.length = 0;
		for (var i = 0, len = cityData.length; i < len; i++) {
		    var option = new Option(cityData[i]["name"], cityData[i]["code"]);
		    option.innerHTML = cityData[i]["name"];//坑爹的ie不支持

		    _city_dom.appendChild(option);
		}
	}
}
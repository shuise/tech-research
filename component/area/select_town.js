function areaSelect(target,callback,config,tpl,data){
	var tpl = tpl || {
		"head" : '<select name="{name}" id="{id}">',
		"repeat" : '<option value="{code}">{name}</option>',
		"foot" : '</select>'
	};
	var config = config || {
			provice : {"name":"ne_provice","id":"ne_provice","value":"110000"},
			city : {"name":"ne_city","id":"ne_city","value":"110000"},
			town : {"name":"ne_town","id":"ne_town"}
		};
	var data = data || window.areacode;

	var subs = NE.template.replace;
	var $ = NE.$;

	var provs = data.province;
	var citys = data.city;
	var towns = data.area || "";

	// NE.trace(provs);
	// NE.trace(citys);

	var _prov = config.provice;
	var _city = config.city;
	var _town = config.town;
		target.innerHTML = subs(tpl.head,_prov) + tpl.foot 
						+ subs(tpl.head,_city) + tpl.foot
						+ subs(tpl.head,_town) + tpl.foot;
	var sels = $("select",target);
	var _prov_dom = sels[0];
	var _prov_value = _prov.value;
	var _city_dom = sels[1];
	var _city_value = _city.value;
	var _town_dom = sels[2];
	var _town_value = _town.value || "";


	var result = { provice: _prov_value, city: _city_value, town: _town_value };

	_prov_dom.length = 0;
	for (var i = 0, len = provs.length; i < len; i++) {
	    var option = new Option(provs[i]["name"], provs[i]["code"]);
	    option.innerHTML = provs[i]["name"];//坑爹的IE不支持

	    _prov_dom.appendChild(option);
	}

	_prov_dom.value = _prov_value;

	createCity(_prov_value);
	createTown(_city_value);

	_prov_dom.onchange = function(){
		_prov_value = this.value;
		createCity(_prov_value);

		createTown(_city_dom.value);
		_callback();
	}

	_city_dom.onchange = function(){
		result.city = this.value;
		_city_value = this.value;
		createTown(_city_value);
		_callback();
	}

	_town_dom.onchange = function(){
		result.town = this.value;
		_callback();		
	}

	function _callback(){
		var pText = _prov_dom.options[_prov_dom.selectedIndex].innerHTML;
		var cText = _city_dom.options[_city_dom.selectedIndex].innerHTML
		var tText = _town_dom.options[_town_dom.selectedIndex].innerHTML
		result.provice = _prov_dom.value;
		result.city = _city_dom.value;
		result.text = [pText,cText,tText];
		callback(result);
	}
	function createCity(p_value){
	    var cityData = citys[p_value];
	    _city_dom.length = 0;
	    for (var i = 0, len = cityData.length; i < len; i++) {
	        opt = document.createElement('option');
			opt.setAttribute('value', provs[i]["code"]);
			opt.appendChild(document.createTextNode(provs[i]["name"]));

	        _city_dom.appendChild(opt)
	    }
	}
	function createTown(c_value){
	    if (!c_value) { return false; }
	    _town_dom.length = 0;
		var townData = towns[c_value];
		for (var i = 0, len = townData.length; i < len; i++) {
		    var option = new Option(townData[i]["name"], townData[i]["code"]);
		    option.innerHTML = townData[i]["name"];//坑爹的IE不支持

		    _town_dom.appendChild(option)
		}
	}
}
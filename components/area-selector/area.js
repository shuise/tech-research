Vue.component('areaSelcetor', {
	template: ['<span>',
			'    <select v-model="provinceId" v-on:change="provinceSelected()">',
			'        <option value="" selected>请选择省</option>',
			'        <option v-for="item in provinces" v-bind:value="item.code">{{ item.name }}</option>',
			'    </select> ',
			'    <select v-model="cityId" v-on:change="citySelected()">',
			'        <option value="" selected>请选择市</option> ',
			'        <option v-for="item in cities" v-bind:value="item.code">{{ item.name }}</option>',
			'    </select>',
			'    <select v-model="localId" v-on:change="localSelected()">',
			'        <option value="" vv-model="localId" selected>请选择区、县</option>',
			'        <option v-for="item in locals" v-bind:value="item.code">{{ item.name }}</option>',
			'    </select>',
			'</span>'].join(""),
	props: ['areas', 'val', 'changed'],
	model: {
	},
	data: function(){
		var areas = this.areas;
		var val = this.val;
			val = val.split("-");

		var provinceId = val[0] || "";
		var cityId = val[1] || "";
		var localId = val[2] || "";

		return {
			provinceId: provinceId,
			cityId: cityId,
			localId: localId,
			provinces: areas.provinces,
	        cities: areas.cities[provinceId] || [],
	        locals: areas.locals[cityId] || []
		};
	},
	methods: {
		provinceSelected: function(){
			var provinceId = this.provinceId;
			this.cities = this.areas.cities[provinceId];
			this.cityId = "";
			this.localId = "";
			this.change();
		},
		citySelected: function(){
			var cityId = this.cityId;
			this.locals = this.areas.locals[cityId];
			this.localId = "";
			this.change();
		},
		localSelected: function(){
			this.change();
		},
		change: function(){
			var provinceId = this.provinceId;
			var cityId = this.cityId;
			var localId = this.localId;
			var val = [provinceId, cityId, localId].join("-");

			//返回值
			this.$emit('changed', val)
		}
	}
});

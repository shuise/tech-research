Vue.component('mutiSelcetor', {
	template: ['<span>',
			'<select v-for="(data, index) in datas" v-model="data.model" v-on:change="selected(index)">',
			'    <option>请选择 {{ data.model }}</option>',
			'    <option v-for="item in data.list" v-bind:value="item.code">{{ item.name }}</option>',
			'</select></span>'].join(""),

	props: ['data', 'val', 'changed'],
	model: {},
	data: function(){
		var value = this.data.value.split("-");
		var config = this.data.v;
		var datas = new Array(config.length);

		var _data = {}, models = [];
		for(var i=0; i<config.length; i++){
			_data['v' + i] = value[i] || '';
			datas[i] = {model: 'v' + i};
			if(i>0 && value[i]){
				// console.log(config[i][value[i-1]])
				datas[i].list = config[i][value[i-1]];
			}
		}
		datas[0].list = config[0];
		_data.datas = datas;
		console.log(_data);
		return _data;
	},
	methods: {
		selected: function(level){
			// console.log(this.data)
			// console.log(this.$data)
			var depth = this.$data.datas.length;
			if(level < depth-1){
				this.$data.datas[level+1].list = this.data.v[level][this.$data['v'+(level + 1)]];
				console.log(level)
				console.log(this.$data['v'+(level + 1)])
				console.log(this.data.v[level])
				console.log(this.data.v[level][this.$data['v'+(level + 1)]])
			}
			this.change();
		},
		change: function(){
			var levels = this.$data.datas.length;
			var value = [];
			for(var i=0;i<levels;i++){
				value.push(this.$data['v' + i]);
			}
			//返回值
			this.$emit('changed', value.join('-'))
		}
	}
});

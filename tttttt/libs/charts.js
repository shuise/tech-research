function drawTrends(id){
	var data = getTrends([100,280,400]);
	var option = {
	    title: {
	        text: '45天趋势图'
	    },
	    tooltip: {
	        trigger: 'axis'
	    },
	    legend: {
	        data:['注单','转入','转出']
	    },
	    grid: {
	        left: '2%',
	        right: '2%',
	        bottom: '2%',
	        containLabel: true
	    },
	    toolbox: {
	        feature: {
	            // saveAsImage: {}
	        }
	    },
	    xAxis: {
	        type: 'category',
	        boundaryGap: false,
	        data: getArrPlus(45)
	    },
	    yAxis: {
	        type: 'value'
	    },
	    series: [
	        {
	            name:'注单',
	            type:'line',
	            stack: '总量',
	            data: data["1"]
	            // data:[130,130,180,150, 232, 201, 154, 190, 330, 410,150, 232, 201, 154, 190, 330, 410,150, 232, 201, 154, 190, 330, 410,150, 232, 201, 154, 190, 330, 410,150, 232, 201, 154, 190, 330, 410,150, 232, 201, 154, 190, 330, 410]
	        },
	        {
	            name:'转入',
	            type:'line',
	            stack: '总量',
	            data: data["2"]
	            // data:[320, 332, 301, 320, 332, 301, 334, 390, 330, 320,320, 332, 301, 334, 390, 330, 320,320, 332, 301, 334, 390, 330, 320,320, 332, 301, 334, 390, 330, 320,320, 332, 301, 334, 390, 330, 320,320, 332, 301, 334, 390, 330, 320]
	        },
	        {
	            name:'转出',
	            type:'line',
	            stack: '总量',
	            data: data["3"]
	            // data:[1290, 1330, 1320, 820, 932, 901, 934, 1290, 1330, 1320,820, 932, 901, 934, 1290, 1330, 1320,820, 932, 901, 934, 1290, 1330, 1320,820, 932, 901, 934, 1290, 1330, 1320,820, 932, 901, 934, 1290, 1330, 1320,820, 932, 901, 934, 1290, 1330, 1320]
	        }
	    ]
	};


	// getList(randomNumber,100)
	var target = document.getElementById(id);
	var _chart = echarts.init(target);
		_chart.setOption(option);
}


function drawWinData(id, data){
	var option = {
	    title: {
	        // text: 'Wheater Statistics'
	    },
	    tooltip: {
	        trigger: 'axis',
	        axisPointer: {
	            // type: 'shadow'
	        }
	    },
	    legend: {
	    },
	    grid: {
	        left: 10,
	        top: 20,
	        bottom: 20,
	        show: false
	    },
	    xAxis: {
	        type: 'value',
	        max: 8,
	        name: ' ',
	        axisLabel: {
	            // formatter: '{value}'
	        }
	    },
	    yAxis: {
	        type: 'category',
	        inverse: true,
	        // data: ['Sunny', 'Cloudy', 'Showers'],
	        axisLabel: {
	            formatter: function (value) {
	                return '{' + value + '| }\n{value|' + value + '}';
	            },
	            margin: 30
	        }
	    },
	    series: [
	        {
	            name: '胜',
	            type: 'bar',
	            data: [5]
	        },
	        {
	            name: '平',
	            type: 'bar',
	            label: {},
	            data: [3]
	        },
	        {
	            name: '负',
	            type: 'bar',
	            label: {},
	            data: [2]
	        }
	    ]
	};


	// getList(randomNumber,100)
	var target = document.getElementById(id);
	var _chart = echarts.init(target);
		_chart.setOption(option);
}


HG.colors = ["#5132a6", "#5232a5", "#4ebcd0", "#4dbcd5", "#dfe6fe", "#278fe7"];

function drawCircles(id, data){
	// ['60', '70', '90', '4','5'],
	var labels = [];
	var values = [];
	// [
	// 	{value:0.23, itemStyle: {color:"#cd0000"}},
	// 	{value:0.5, itemStyle: {color:"#eeeeee"}},
	// 	{value:0.7, itemStyle: {color:"#000"}},
	// 	{value:0.99, itemStyle: {color:"#deeedd"}},
	// 	{value:0.79, itemStyle: {color:"#ccc"}}
	// ],

	function getColor(_color, val){
		var warnings = ["#ed473a", "#f39631"];
		if(val > 80){
			return warnings[0];
		}else if(val > 60){
			return warnings[1];
		}else{
			return _color;
		}
	}
	for(var i=0;i<data.length;i++){
		labels.push(data[i]);
		values.push({
			value: data[i]/100,
			itemStyle: {
				color: getColor(HG.colors[i], data[i])
			}
		});
	}
	var option = {
	    angleAxis: {
	    	max: 1,
	    	axisLine: {
	    		lineStyle : {color: "#f5f5f5", width: 1}
	    	},
	    	splitLine: {
	    		lineStyle : {color: "#f5f5f5", width: 1, opacity: 0.5}
	    	},
	    	axisTick: {
	    		show: false
	    	},
	    	splitArea: {
	    		show: false
	    	},
	    	axisLabel: {
	    		show: false
	    	}
	    },
	    radiusAxis: {
	        type: 'category',
	        min: 1,
	        data: labels, 
	        z: 10
	    },
	    polar: {},
	    series: [{
	        type: 'bar',
	        data: values, 
	        coordinateSystem: 'polar',
	        // name: 'ddddddddddd',
	        stack: 'a'
	    }],
	    legend: {
	        show: false,
	        data: ['A', 'B', 'C',"D", "E"]
	    }
	};

	var target = document.getElementById(id);
	var _chart = echarts.init(target);
		_chart.setOption(option);
}

function draWaver(id, data){
	// var data = [["5-05",116],["5-06",129],["6-24",60]];

	var dateList = data.map(function (item) {
	    return item[0];
	});
	var valueList = data.map(function (item) {
	    return item[1];
	});

	var valueList2 = [];
	var isCompare = data[0].length == 3;
	if(isCompare){
		valueList2 = data.map(function (item) {
		    return item[2];
		});
	}

	var option = {
	    // Make gradient line here
	    visualMap: [{
	        show: false,
	        type: 'continuous',
	        seriesIndex: 0
	    }],
	    title: [],
	    tooltip: {
	        trigger: 'axis'
	    },
	    xAxis: [{
	        data: dateList,
	        axisTick: {interval:0}
	    }],
	    yAxis: [{
	        splitLine: {show: false},
	        min : 2,
	        max: 100
	    }],
	    grid: [{
	    	top: '10%',
	    	left: '10%',
	    	right: '5%',
	        bottom: '10%'
	    }],
	    series: [{
	        type: 'line',
	        showSymbol: false,
	        lineStyle: {
	        	color: HG.colors[3],
	        	width: 1
	        },
	        data: valueList
	    }]
	};

	if(isCompare){
		option.series.push({
	        type: 'line',
	        showSymbol: false,
	        lineStyle: {
	        	color: "green",
	        	width: 1
	        },
	        data: valueList2
	    });
	}

	var target = document.getElementById(id);
	var _chart = echarts.init(target);
		_chart.setOption(option);
}


















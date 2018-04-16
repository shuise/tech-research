'use strict';
(function (RECM) {
	var RCharts = {
		pie : function(target, data, config){
			var legends = [];
			for(var i=0;i<data.length;i++){
				legends.push(data[i].name);
			}

			//docs: http://echarts.baidu.com/option.html#series
			var option = {
				title : {
			        text: config.title
			    },
			    tooltip : {
			        trigger: 'item',
			        formatter: '{a} <br/>{b} : {c} ({d}%)',
			        show : true
			    },
			    legend: {
			        orient: 'horizontal', //vertical
			        bottom: '5px',
			        data: legends
			    },
			    series : [
			        {
			            name: config.title,
			            type: 'pie',
			            radius : '65%', //调整pie图大小
			            center: ['50%', '50%'],
			            startAngle: 10,
			            clockwise: false,
			            selectedMode: true,
			            // animationType: 'scale',
			            // animationEasing: 'elasticOut',
			            data: data,
			            color : ['#9898FE','#FDE38E','#54B9CD','#C2E086'],
			            itemStyle: {
			                emphasis: {
			                    // shadowBlur: 2,
			                    // shadowOffsetX: 1,
			                    // shadowColor: 'rgba(0, 0, 0, 0.5)'
			                }
			            },
			            label : {
			            	normal: {
			            		show: config.showLabel
			            	}
			            },
			            labelLine: {
			                normal: {
			                    show: config.showLabel
			                }
			            }
			        }
			    ]
			};

			var _chart = echarts.init(target);
			return _chart.setOption(option);
		},
		line : function(target, data, config, percent){
			var markLine =  {
		        data: [
		            {type: 'average', name: '平均值'},
		            [{
		                symbol: 'none',
		                x: '90%',
		                yAxis: 'max'
		            }, 
		            {
		                symbol: 'circle',
		                label: {
		                    normal: {
		                        position: 'start',
		                        formatter: '最大值'
		                    }
		                },
		                type: 'max',
		                name: '最大值'
		            }]
		        ]
		    };

		    var markPoint = {
		        data: [
		            {type: 'max', name: '最大值'},
		            {type: 'min', name: '最小值'}
		        ]
		    };

		    var legends = [];
			for(var i=0; i<data.length; i++){
				legends.push(data[i].name);
				// data[i].markLine = markLine;
				// data[i].markPoint = markPoint;
				data[i].type = 'line';
			}

			var option = {
			    tooltip: {
			        trigger: 'axis',
			        backgroundColor: '#fff',
			        borderColor: '#AFB1B8',
			        borderWidth: 1,
			        textStyle: {
			        	color: '#AFB1B8'
			        }
			        // formatter: '2017年{b} <br/>{a} : {c}万 - {d}-{e}'
			    },
			    axisPointer: {
			        lineStyle: {
			            color: '#AFB1B8'
			        }
			    },
			    xAxis:  {
			        type: 'category',
			        boundaryGap: false,
			        data: config.x,
			        axisLine : {
			        	lineStyle : {
			        		color: '#333'
			        	}
			        }
			    },
			    yAxis: {
			    	// show: false,
			        type: 'value',
			        axisLabel: {
			            formatter: '{value}'
			        },
			        axisLine : {
			        	lineStyle : {
			        		color: '#333'
			        	}
			        },
				    splitLine : {
				    	show: true,
				    	lineStyle : {
				    		color : '#AFB1B8',
				    		type : 'solid',
				    		opacity : 0.5
				    	}
				    }
			    },
			    color: ['#54B9CD','#000','#333','#666','#999','#eee','#efefef','#f5f5f5'],
			    series: data
			};

			var _chart = echarts.init(target);
			return _chart.setOption(option);
		},
		destroy: function(target){
			echarts.dispose(target);
		}
	};
	RECM.RCharts = RCharts;
})(RECM);
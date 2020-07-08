'use strict';
randomColor = randomColor;

(function (HG) {
	var Charts = {
		pie : function(target, data, colors){

			var _colors = randomColor({
			   count: 10,
			   hue: "#369",
			   format : "hsl"
			});

			colors = colors || _colors;
			
			var legends = [];
			for(var i=0;i<data.length;i++){
				legends.push(data[i].name);
			}

			//docs: http://echarts.baidu.com/option.html#series
			var option = {
				title : {
			        text: ""
			    },
			    tooltip : {
			        trigger: 'item',
			        formatter: '{a} {b} : {c} ({d}%)',
			        e: '人',
			        show : true
			    },
			    legend: {
			        orient: 'horizontal', //vertical
			        bottom: '5px',
			        data: legends
			    },
			    series : [
			        {
			            name: "",
			            type: 'pie',
			            radius : '75%', //调整pie图大小
			            center: ['50%', '50%'],
			            startAngle: 10,
			            clockwise: false,
			            selectedMode: true,
			            // animationType: 'scale',
			            // animationEasing: 'elasticOut',
			            data: data,
			            color : colors,
			            itemStyle: {
			                emphasis: {
			                    // shadowBlur: 2,
			                    // shadowOffsetX: 1,
			                    // shadowColor: 'rgba(0, 0, 0, 0.5)'
			                }
			            },
			            label : {
			            	normal: {
			            		show: true
			            	}
			            },
			            labelLine: {
			                normal: {
			                    show: true
			                }
			            }
			        }
			    ]
			};

			if(typeof target == "string"){
				target = document.getElementById(target);
			}
			var _chart = echarts.init(target);
			return _chart.setOption(option);
		},
		line : function(target, data){
			var option = {
			    xAxis: {
			        type: 'category',
			        data: data.x
			    },
			    yAxis: {
			        type: 'value',
			        interval: 30
			    },
			    series: [{
			        data: data.y,
			        type: 'line'
			    }]
			};


			if(typeof target == "string"){
				target = document.getElementById(target);
			}
			var _chart = echarts.init(target);
			return _chart.setOption(option);
		},
		destroy: function(target){
			echarts.dispose(target);
		}
	};
	HG.Charts = Charts;
})(HG);
/*!
 * NTESChart Extension:  dualBar 1.0
 * 
 * Copyright (c) 2013 xqwei @ netease
 */

(function(NC){
    
    NC.prototype.dualChart = function(data1, data2, opts1, opts2, labels, opts){
        var r = this.$$r;
        var chartOptions = this.options;
        var chartW = chartOptions.width;
        var chartH = chartOptions.height;
        if (labels) {
            opts1.xTick = {
                _labels : labels,
                align : "center"
            }
        }
        opts2.xTick = { labels : "", _labels : null };
        var options = {
            chartType1 : ["hbar"],
            chartType2 : ["hbar"],
            txtPadding : 10,
            framePadding : 25
        }
        NC.deepExtend(options, opts);
        
        var space = this.estimateSpace(labels);
        var txtWidth = space.width;
        var frameWidth = Math.round((chartW - txtWidth) / 2 - options.framePadding) + 14;
        
        //左侧图表(带x label)
        opts1.width = frameWidth + txtWidth - opts1.padding.x;
        opts1.left = options.framePadding + 18 + opts1.padding.x;
        //右侧图表(无x label)
        opts2.width = frameWidth;
        opts2.left = opts1.left + opts1.width;
        this.xyChart(data1, options.chartType1, opts1);
        this.xyChart(data2, options.chartType2, opts2);
    }
    
})(window.NTESChart);

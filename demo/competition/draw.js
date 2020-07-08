(function(){
var testData = {
	type1:32,
	type2:25,
	type3:12,
	type4:13
};
	var panelWidth = 940;
	var panelHeight = 1000;
	var raceCircleX = panelWidth/2;
	var raceCircleY = panelHeight/2;
	
	
	var paper = Raphael("demo",940,1000);
	// 椭圆圆弧曲线 A 或 a 
	// 语法是 "A rx ry x-axis-rotation large-arc-flag sweep-flag x y" 共 7 个参数 
	// rx ，ry 是椭圆弧的x轴半径和y轴半径 
	// x-axis-rotation 是此段弧所在的椭圆的 x 轴与水平方向的夹角，即 x 轴的旋转角度 
	// large-arc-flag 决定弧线是大于还是小于180度，0表示小角度弧，1表示大角度弧。
	//sweep-flag表示弧线的方向，0表示从起点到终点沿逆时针画弧，1表示从起点到终点沿顺时针画弧。
	// x,y 是椭圆弧终端坐标    
    //sAlpha：开始弧度；
    //wAlpha：弧长;
    //R：弧度的半径
    //绘制圆弧，这里的弧度都是按画布的中心点为参照
    paper.customAttributes.arc = function (sAlpha,wAlpha, R) {
    	paper.circle(raceCircleX, raceCircleY, 5);
        var startX = raceCircleX - R * Math.cos(Math.PI*sAlpha/180),
        	startY = raceCircleY - R * Math.sin(Math.PI*sAlpha/180),
            endX = raceCircleX - R * Math.cos(Math.PI*(sAlpha+wAlpha)/180),
            endY = raceCircleY - R * Math.sin(Math.PI*(sAlpha+wAlpha)/180),
            path;
        path = [["M", startX, startY], ["A", R, R, 0, +(wAlpha > 180), 1, endX,endY]];       
        return {path: path};
    };
    
    function drawSector(){
    	paper.path().attr({stroke: "#000", "stroke-width": 20}).attr({arc: [90, 90, 300]});
    	//paper.path("M 80 80A 45 45, 0, 0, 0, 125 125L 125 80 Z").attr({stroke: "#000", "stroke-width": 2})
    	
    	
    }
    drawSector();
})();



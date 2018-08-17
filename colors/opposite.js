/*
反色计算文档：https://www.colortell.com/1463.html
*/

function getOppositeColor(c1){
	//c1: hsl format= hsl(h, l, s); hsl(118, 94.39%, 82.17%)

	// Delta = Math.sqrt( Math.pow(L1 - L2) + Math.pow(s1 - s2) + Math.pow(h1 - h2));

	c1 = c1.split("(")[1].split(")")[0].split(" ").join("").split(","); 

	var h2 = 360 - c1[0];
	var L2 = 100 - c1[1].split("%")[0]/1;
	var s2 = 100 - c1[2].split("%")[0]/1;

	// var arr2 = [ h2, L2 + "%"  , s2 + "%"];

	var c2 = [ Math.ceil(h2*0.68), Math.floor(L2/1.6) + "%"  , Math.ceil(s2/1.6) + "%"];

	c2 = "HSL(" + c2.join(",") + ")";

	return c2;
}
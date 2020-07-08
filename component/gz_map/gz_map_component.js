function showArea(num){
	if(num!=5&&num!=6){
	document.getElementById('gz_map_img').src="images/gz_map"+num+".png"
	}
	document.getElementById('gz_map_area'+num).style.display="block"
}
function hideArea(num){
	document.getElementById("gz_map_img").src="images/map_bg.png";
	document.getElementById('gz_map_area'+num).style.display="none"
}
var gamer = window.gamer || {};
gamer.grounds = $("#mainlist li");
gamer.actionList = ["defalut","sow","water","unroot","reap"];
gamer.actionClasslist = [];
$(gamer.actionList).each(function(i,item){
	gamer.actionClasslist.push("cursor_"+gamer.actionList[i])
});
gamer.actionFlag = 0; //["defalut","sow","water","uproot","reap"];
gamer.total = 0; 
gamer.timer = {};
gamer.fn = {};
gamer.fn.act = function(node){
	var node = $(node);
	var step = parseInt(node.attr("step") || 1);
	switch(gamer.actionFlag){
		case 1 :
			// 播种
			if(node.hasClass("growing")){
				// 有种子，无法播种
			}else{
				// 未播种，可以播种
				node.addClass("growing");
				node.addClass("grown_1");
				node.attr("step",1);
			}
		break;
		case 2 :
			// 浇水
			if(node.hasClass("growing")){
				// 有种子
				var nextstep = step+1 > 4 ? 5 : step+1;
				if(nextstep <= 4){
					// 进展到下一步
					node.removeClass("grown_"+step);
					node.addClass("grown_"+nextstep);
					node.attr("step",nextstep);
				}else{
					// 已成熟，不用再浇水了。
				}
			}else{
				// 未播种，浇水没用
			}
		break;
		case 3 :
			// 铲除
			if(node.hasClass("growing")){
				// 有种子
				node.removeClass("growing");
				node.removeClass("grown_1");
				node.removeClass("grown_2");
				node.removeClass("grown_3");
				node.removeClass("grown_4");
				node.removeAttr("step");
			}else{
				// 未播种，无法铲除
			}
		break;
		case 4 :
			// 收获
			if(node.hasClass("growing")){
				// 有种子
				if(step < 4){
					// 未成熟
				}else{
					// 已成熟
					node.removeClass("growing");
					node.removeClass("grown_4");
					gamer.total ++;
					node.removeAttr("step");
					$(".js_gammertotal").html(gamer.total);
					$("#score").val(gamer.total);
				}
			}else{
				// 未播种，无法收获
			}
		break;
		case 0 :
		defalut:;
		break;
	}
};
// 显示隐藏分享框
function showShare(){
	$("#share_line").show();
}
function hideShare(){
	$("#share_line").hide();
}
// 炫富ajax post数据
function showMyWealth(){
	var nick = $("#nickname").val();
	var score = $("#score").val();
	if(nick == ""){
		alert("昵称不能为空");
		return false;
	}
	var url = "http://active.163.com/service/form/v1/2685/submit";
	var data = {
		nickname:nick,
		score:score
	};
	$.post(url,data,function(){
		// 此句只有同域才能执行
		alert("提交成功");
	});
	hideShare();
}	

$("#btn_sow").bind("click",function(){
	gamer.actionFlag = 1;
	$("body").removeClass(gamer.actionClasslist.join(" "));
	$("body").addClass("cursor_"+gamer.actionList[gamer.actionFlag]);
});

$("#btn_water").on("click",function(){
	gamer.actionFlag = 2;
	$("body").removeClass(gamer.actionClasslist.join(" "));
	$("body").addClass("cursor_"+gamer.actionList[gamer.actionFlag]);
});

$("#btn_uproot").click(function(){
	gamer.actionFlag = 3;
	$("body").removeClass(gamer.actionClasslist.join(" "));
	$("body").addClass("cursor_"+gamer.actionList[gamer.actionFlag]);
});

$("#btn_reap").bind("click",function(){
	gamer.actionFlag = 4;
	$("body").removeClass(gamer.actionClasslist.join(" "));
	$("body").addClass("cursor_"+gamer.actionList[gamer.actionFlag]);
});

$("#btn_cancel").click(function(){
	gamer.actionFlag = 0;
	$("body").removeClass(gamer.actionClasslist.join(" "));
});

$("#btn_show").bind("click",showShare);

$(".justshowmywealth").on("click",function(){
	showMyWealth();
});

$(".nozuo").bind("click",function(){
	hideShare();
});

gamer.grounds.bind("click",function(){
	gamer.fn.act(this);
});

function HozTrans(modId,imgId,listId){
	var warp = $("#" + listId);
	// warp.html(warp.html() + warp.html());
	var items = $("#" + modId + " .Raiders_item");
	items.each(function(index, item){
		if(index >=3){
			$(item).removeClass("Raiders_item_on");
			$(item).css("display","none");
		}
	});


	var now = 1;
	var prev = 0;
	var next = 2;
	var total = items.length - 1;

	var left = $("#" + modId + " .btn_left");
	var right = $("#" + modId + " .btn_right");

	var img = $("#" + imgId);
	var v = items.eq(now).find(".posi-bg").eq(0).attr("src");
	img.attr("src",v);

	right.click(function(){
		now += 1;
		prev += 1;
		next += 1;
		if(next > total){
			return;
		}
		items.each(function(index, item){
			if(index == prev || index == next){
				$(item).addClass("Raiders_item_off");
				$(item).removeClass("Raiders_item_on");
				$(item).css("display","block");
			}else if( index == now ){
				$(item).addClass("Raiders_item_on");
				$(item).removeClass("Raiders_item_off");
				$(item).css("display","block");
			}else{
				$(item).removeClass("Raiders_item_on");
				$(item).css("display","none");
			}
		});

		var v = items.eq(now).find(".posi-bg").eq(0).attr("src");
		img.attr("src",v);
	});

	left.click(function(){
		now -= 1;
		prev -= 1;
		next -= 1;
		if(prev < 0){
			return;
		}
		items.each(function(index, item){
			if(index == prev || index == next){
				$(item).addClass("Raiders_item_off");
				$(item).removeClass("Raiders_item_on");
				$(item).css("display","block");
			}else if( index == now ){
				$(item).addClass("Raiders_item_on");
				$(item).removeClass("Raiders_item_off");
				$(item).css("display","block");
			}else{
				$(item).removeClass("Raiders_item_on");
				$(item).css("display","none");
			}
		});

		var v = items.eq(now).find(".posi-bg").eq(0).attr("src");
		img.attr("src",v);
	});
}	
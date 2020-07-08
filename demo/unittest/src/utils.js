var utils = {
	getWeekDay: function() {
		var curWeekDay = weekDay();
		switch (curWeekDay) {
			case 1:
				return "一";
			case 2:
				return "二";
			case 3:
				return "三";
			case 4:
				return "四";
			case 5:
				return "五";
			case 6:
				return "六";
			case 0:
				return "日";
			default:
				return curWeekDay;
		};
	},
	getDate:function() {
		var curDate = new Date();
		return curDate.getFullYear()+"年"+(curDate.getMonth()+1)+"月"+curDate.getDate()+"日";
	},
	genItem:function(obj,tmpHtml) {
		for (var key in obj) {
			var text = obj[key]===null||obj['key']===undefined?obj[key]:'';
			var regExp = new RegExp('{{'+key+'}}','g');
			tmpHtml = tmpHtml.replace(regExp,text);
		}
		return tmpHtml;
	}
};
'use strict';

var tmpl = $('#bobo_item').html();

//取得数据并绑定投票事件
var urlConfig = config.getConfig();
voteService.setUp(urlConfig);

voteService.getAll()
	.then(function(data) {
		var listHtml = '';
		//渲染列表
		for (var i = 0; i < data.length; i++) {
			listHtml += utils.genItem(data[i], tmpl);
		}
		$('#item-container').html(listHtml);
		//点击投票
		$('.vote_button').bind('click', function() {
			var button = $(this);
			var id = button.data(id).id;
			voteService.vote(id)
				.then(function(code) {
					if (code != 1) {
						alert('今天的票数用完啦，不过签到可以增加一次投票机会哦！');
						return false;
					} else {
						//显示的票数+1
						var voteNum = $('em[data-id=' + id + ']').text().match(/\d+/)[0];
						$('em[data-id=' + id + ']').text((parseInt(voteNum) + 1) + "票");
						alert('恭喜投票成功！');
					}
				});
		});
		//点击签到
		$('.sign_in').bind('click', function() {
			voteService.signup()
				.then(function(code) {
					if (code != 1) {
						alert('今天已经签过咯，明天再来吧！');
					} else {
						alert('签到成功！快去给你心仪的女神投票吧！');
					}
				});
		});
	});

//显示时间
var weekDay = utils.getWeekDay();
$('.week-num').text("星期" + weekDay);
$('.nav-date').text(utils.getDate());


'use strict';
var promise = window.Promise;
var voteService = {
	config: null,
	setUp: function(config) {
		this.config = config;
	},
	getJoiners: function() { //ajax 读参赛者原始数据
		return new promise(function(resolve, reject) {
			$.ajax({
				url: voteService.config.getJoiner,
				dataType: 'jsonp',
				success: function(data) {
					resolve(data.anchors);
				}
			});
		});
	},
	getVoteNum: function() { //ajax读票数
		return new promise(function(resolve, reject) {
			$.get(voteService.config.getVote, function(data) {
				resolve(data);
			});
		});
	},
	vote: function(id) { //投票
		return new promise(function(resolve, reject) {
			var url = voteService.config.vote + "?id=" + id;
			$.get(url, function(data) {
				resolve(data.voteResult||data.code);
			});
		});
	},
	signup: function() { //签到，用户身份由后端判断
		return new promise(function(resolve, reject) {
			$.get(voteService.config.signUp, function(data) {
				resolve(data.code);
			});
		});
	},
	getAll: function() { //整理参赛者和票数，返回用于渲染模板的数据
		return promise.join(voteService.getJoiners(), voteService.getVoteNum(), function(joiners, voteNum) {
			var renderData = [];
			for (var i =0 ;i<joiners.length;i++) {
				var id = joiners[i].unit.ownerId.toString().replace('-', '');
				var name = joiners[i].userWrapInfo.nick;
				var desc = joiners[i].userWrapInfo.intro;
				//var img = joiners[i].unit.cover; //此处存疑，使用哪个图片url还不清楚
				var img = joiners[i].userWrapInfo.avatar;
				var roomid = joiners[i].unit.roomId;
				var vote = 0;
				var live = joiners[i].unit.live?"":"_0";
				for (var j in voteNum.vote) {
					if (voteNum.vote[j].voteId == id) {
						vote = voteNum.vote[j].voteCount;
						break;
					}
				}
				renderData.unshift({
					id: id,
					name: name,
					desc: desc,
					vote: vote,
					img: img,
					roomid:roomid
				});
			}
			renderData = _.sortByOrder(renderData,'vote','desc');
			return renderData;
		});
	}
};
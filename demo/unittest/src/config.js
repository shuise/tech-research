var config = {
	urlConfig: {//暂时的线上接口，可能会改变
		getJoiner: 'http://www.bobo.com/wzyRecommendAnchor?callback=?',
		getVote: '/boboVote/getVote',
		vote: '/boboVote/vote',
		signUp: '/boboVote/sign'
	},
	urlConfig_test: { //假接口
		getJoiner: 'http://www.bobo.com/wzyRecommendAnchor?callback=?',
		getVote: 'data/getVote.json',
		vote: 'data/vote.json',
		signUp: 'data/sign.json'
	},
	getConfig:function() {
		//var env_test = location.href.indexOf('dev') != -1 || location.href.indexOf('test.e.163.') != -1;
		var env_test = location.href.indexOf('dev') != -1;
		if (env_test) {
			return this.urlConfig_test;
		} else {
			return this.urlConfig;
		}
	}
};
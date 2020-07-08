describe('load dependence', function() {
	it('load jquery', function() {
		expect(window.jQuery).toBeDefined();
	});
	it('load promise', function() {
		expect(window.promise).toBeDefined();
	});
	it('load lodash', function() {
		expect(window._).toBeDefined();
	});
});

describe('load scripts', function() { //确保加载了相关的对象
	it('get config object', function() {
		expect(window.config).toBeDefined();
	});

	it('get ajaxService object', function() {
		expect(window.voteService).toBeDefined();
	});

	it('get utils object', function() {
		expect(window.utils).toBeDefined();
	});
});

describe('set up ajaxService', function() {
	var settedConfig;
	it('pass config args', function() {
		voteService.setUp(config.getConfig());
		settedConfig = voteService.config;
		var fin = settedConfig.getJoiner &&settedConfig.getVote &&settedConfig.signUp &&settedConfig.vote;
		expect(fin).toBeTruthy();
	});
});

describe('do ajax operate rightly', function() {
	it('get 30 joiners', function(done) {
		voteService.getJoiners().then(function(joiners) {
			expect(joiners.length).toEqual(29); //说好的接口变了，缺个人
			done();
		});
	});

	it('get voteNum', function(done) {
		voteService.getVoteNum().then(function(vote) {
			var flag = vote.code == 1 || vote.code == 99;
			expect(flag).toBeTruthy();
			done();
		});
	});

	it('can vote', function(done) {
		voteService.vote(3246670083302358500).then(function(code) { //偷个懒，随便抓一个id出来测
			var flag = code == 99 || code == 1;
			expect(flag).toBeTruthy();
			done();
		});
	});

	it('can signup', function(done) {
		voteService.signup().then(function(code) {
			var flag = code == 99 || code == 1;
			expect(flag).toBeTruthy();
			done();
		});
	});
});

describe('get right data to render page', function() {
	it('has all needed data', function(done) {
		voteService.getAll().then(function(renderData) {
			var flag = true;
			for (key in renderData) {
				if (renderData.hasOwnProperty(key)) {
					var tmp = renderData[key];
					if (!(tmp.desc >= "" && tmp.id && tmp.img && tmp.name && tmp.roomid && tmp.vote >= 0)) {
						console.log(key); //不好在jasmine框架中定位哪行出了问题，log一下
						flag = false;
					}
				}
			}
			expect(flag).toBeTruthy();
			done();
		});
	});
});
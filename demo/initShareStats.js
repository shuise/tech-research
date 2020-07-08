/*
 * 分享url设置 & 当前页面发送sps统计
 * 
 * 依赖于h5Share与ntesTracker
 *
 * 用法：window.initShareStat(configObj)
 * 
 * configObj:
 * modelid，CMS API $model.get("modelid")返回的字符串，必须
 * modelurl，CMS API ${modelUrl}字符串(末尾自带 '/')，必须
 * t，type， 标识类型，1表示是H5文章页。0表示普通文章页，可选
 * s，source，代表来源，newsapp代表由网易新闻打开的，163代表从网站推广位中打开，可选
 */
window.initShareStat = function(configObj) {
	configObj = configObj || {};
	if (!window.h5Share || !window.neteaseTracker) {
		throw 'no h5Share or neteaseTracker exists';
		return false;
	}
	if(typeof window.h5Share.conf!=='function' || typeof window.neteaseTracker!=='function') {
		throw 'invalid h5Share or neteaseTracker';
		return false;
	}
	if (!configObj.modelid||!configObj.modelurl) {
		throw 'modelid & modelurl needed';
		return false;
	}
	var getParameter = function() {
		var href = window.location.href,
			beginIndex = href.indexOf('?') + 1,
			oParam = {};
		if (0 !== beginIndex) {
			var paramArr = href.substring(beginIndex).split('&'),
				tmpParam = [];
			for (var i = 0; i < paramArr.length; i++) {
				tmpParam = paramArr[i].split('=');
				if (tmpParam.length > 1) {
					if (i === paramArr.length - 1) {
						var hashIndex = tmpParam[1].indexOf('#');
						if (-1 !== hashIndex) {
							tmpParam[1] = tmpParam[1].substring(0, hashIndex);
						}
					}
					oParam[tmpParam[0]] = tmpParam[1];
				}
			}
		}
		return oParam;
	}
	var oParam = getParameter();
	var host = window.location.hostname.split('.');
	var modelid = configObj.modelid;
	var modelUrl = configObj.modelurl;
	var spsw_current = parseInt(oParam['w']) || 0;
	var spsw_share;
	var spst = oParam['t'] || configObj.t || '0';
	var spss = oParam['s'] || configObj.s || '';
	var spsf = ''; //这个值在下文中处理
	var ua = navigator.userAgent.toLowerCase();
	var referrer = document.referrer;
	var isNTESNewsApp = ua.match(/newsapp/gi);

	// 非新闻客户端中打开，且没有w=1，用户打开的时候直接算1次传播
	if (!isNTESNewsApp && !spsw_current) {
		spsw_current = 1;
	}
	spsw_share = spsw_current + 1;
	// 从网站推广位中打开，将spss设为163，且在后续分享时传播
	if (!spss) {
		if (isNTESNewsApp) {
			spss = 'newsapp';
		} else if (referrer && referrer.match(/163.com/gi)) {
			spss = '163';
		}
	}
	if (ua.match(/micromessenger/gi)) {
		spsf = 'wx';
	} else if (ua.match(/weibo/gi) || referrer.match(/weibo\.com/gi)) {
		spsf = 'wb';
	} else if (ua.match(/yixin/gi)) {
		spsf = 'yx';
	} else if (ua.match(/qq/gi) || referrer.match(/(qzone|qq)\.com/gi)) {
		spsf = 'qq';
	}
	var trackerPrams = 'modelid=' + modelid + '&spss=' + spss + '&spst=' + spst + '&spsf=' + spsf + '&spsw=' + spsw_current;
	var shareUrl = modelUrl + '?' + '&s=' + spss + '&t=' + spst + '&w=' + spsw_share;
	var trackerUrl = 'http://sps.163.com/special/?' + trackerPrams;
	var shareTracker = 'http://sps.163.com/func/?func=sharedone&' + trackerPrams;

	if (spsw_current > 0) {
		neteaseTracker && neteaseTracker(false, trackerUrl, '', 'sps');
	}
	h5Share && h5Share.conf({
		url: shareUrl,
		callback: function() {
			neteaseTracker && neteaseTracker(false, shareTracker, '', 'sps')
		}
	});
}
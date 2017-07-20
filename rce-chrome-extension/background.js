// chrome.tabs.query(object queryInfo, function callback);

/*
tab: https://developer.chrome.com/extensions/tabs
notify: https://developer.chrome.com/extensions/notifications
*/ 

var NotificationOptions = {
	 "iconUrl" : "http://f.rongcloud.cn/res/favicon-32x32.png",
	 "title" : "RCE提醒",
	 "message" : "您收到10条新消息"
};

var notificationId = "RC-" + Math.random();

chrome.notifications.create(notificationId, NotificationOptions, function(){

});

// window.onload = function(){
	alert(1)
	chrome.tabs.query({active:false}, function(tabs) {
		alert(2);
	  	console.log("chrome extension tabs");
	  	console.log(tabs);
	    // var current = tabs[0];
	});
// }
// chrome.tabs.highlight(object highlightInfo, function callback)
var CONFIG = {
	im: {
		appkey: '8w7jv4qb78a9y',
	    server: 'http://172.29.202.24:8090/10w/api',
	    // server: 'https://172.29.201.4:1447/api',
	    approvalServer: '//rce-df.rongcloud.net/erp/approval', // erp server 地址
	    sdk: {
	        api: 'apiprodrcx.cn.ronghub.com',
	        protobuf: './rongcloud/protobuf-2.3.1.min.js' //私有部署开启此配置，无需改值
	    },
	    emoji: {
	        sizePX: 16,
	        url : "./images/emoji-48.png"  //私有部署开启此配置，无需改值
	    },
	    voice: {
	        swfobject: "./rongcloud/swfobject-2.0.0.min.js",  //私有部署开启此配置，无需改值
	        player: "./rongcloud/player-2.0.2.swf"  //私有部署开启此配置，无需改值
	    }
	},
	rtc: {
		// 正常情况下 rtc 和 im 为同一个，由于现在没有开通音视频的 AppKey 暂时分开使用
		appkey: 'x4vkb1qpxfrzk',
		url: 'https://rtc.ronghub.com/voiptoken',
		ws: 'https://rtc.ronghub.com/nav/websocketlist'
	}
};


// var userInfo = {
//     id: "user1",
//     name: "用户1",
//     token: "ZThhLI1Xa1BX5EMREAdArWSH6ouuI8NT/fNmMkzF+4IOKIoFvbsi6JnH8QmnSltLkCcsK8vOgKl3IZgfbxFiWg=="
// }
var utils = {
	getQueryStrings: function(url) {
      // var search = location.search || '';
      var queryString = url.split('?')[1] || '';
      var querys = queryString.split('&');
      var strings = {};
      for (var i = 0; i < querys.length; i++) {
        var query = querys[i];
        var values = query.split('=');
        var key = values[0];
        var value = values[1] || "";
        strings[key] = value;
      }
      return strings;
    },
	connect: function(token, callbacks){
		var params = {
          appKey : "8w7jv4qb78a9y",
          token : token || "ZThhLI1Xa1BX5EMREAdArWSH6ouuI8NT/fNmMkzF+4IOKIoFvbsi6JnH8QmnSltLkCcsK8vOgKl3IZgfbxFiWg=="
        };
        RongIMClient.begin(params,callbacks,{protobuf: "./rongcloud/protobuf-2.1.6.min.js"});
	},
	im: function(target){
		
	}
};

var API = {
	domain: "http://cdHost:8000/cdispatching",
	urls: {
	}
};

API.user1 = {
	"id": "546fc129-31db-4d81-afa2-1972acafdd15",
	"name": "zhaoqingqing",
	"idNumber": "",
	"jobTitle": "",
	"profTitle": "",
	"realName": "赵青青",
	"phone": "13904134432",
	"email": "",
	"certification": "高级工程师",
	"provice": "JT"
};

API.user2 = {
	"id": "67ef6949-a7af-496a-8838-e45c8b056194",
	"name": "zhaoli",
	"idNumber": "",
	"jobTitle": "",
	"profTitle": "",
	"realName": "赵力",
	"phone": "13904137765",
	"email": "",
	"certification": "高级工程师",
	"provice": "JT"
};

API.getToken = function(params, callback){
	var url = "/user/ncc/token";
	var systemid = params.id;
	var systemkey = params.key;
	//post

	var data = {
		"Code": "0",
		"Message": "成功",
		"AccessToken": "e8b26990-69c3-462f-b1bb-5a336154fe77",
		"ExpireTime": "43199"
	};
	callback(data.AccessToken);
}

API.getCurrentUser = function(params, callback){
	var url = "/user/account/getUserDetail";
	var Authorization = params.token;
	var mothod = "get";

	var userInfo = {
		"code": "000000",
		"message": "SUCCESS",
		"time": "2019-02-28T18:25:29.268+0800",
		"body": {
			"id": "2ab397e2-51cd-4d52-b496-b232c0a2bf68",
			"name": "hanlifei",
			"realName": "韩利飞",
			"idNumber": null,
			"jobTitle": null,
			"profTitle": null,
			"phone": "15850148097",
			"email": "hanlifei@ultrapower.com.cn",
			"depts": [
				{
					"id": "2aada46a-4de8-46af-be73-e61fc2ca778e",
					"name": "研发部"
				}
			],
			"roles": [
				{
					"id": "4751a8ac-84e9-40ed-8275-76bba6e15a81",
					"name": "菜单管理员"
				}
			],
			"orgs": [
				{
					"id": "0",
					"name": "集团",
					"province": "JT"
				}
			]
		}
	}
	userInfo.body.avatar = userInfo.body.avatar || "./css/images/person-active.png";
	callback(userInfo);
}

API.getUserList = function(params, callback){
	var url = "/user/user/basic/query";
	var Authorization = params.token;
	//get

	var user1 = API.user1;
	var user2 = API.user2;
	var data = {
		"code": "000000",
		"message": "SUCCESS",
		"time": "2019-02-28T18:33:37.360+0800",
		"body": [
			user1, user2, user1, user2, user1, user2, user1, user2,
			user1, user2, user1, user2, user1, user2, user1, user2
		]
	}

	for(var i=0;i<data.body.length;i++){
		data.body[i].avatar = data.body[i].avatar || "./css/images/person-active.png";
	}

	callback(data.body);
}


/*
4. 同步会议状态（启动会议）
5. 选择入会通知接口
6. 会议更新接口
7. 会议记录时间段同步接口
8. 邀请人员入会通知  通知接口
*/

API.notice = function(params, callback){
	var header = {
		Authorization: params.token
	}
	var response = {
		code: "000000",
		message: "msg",
		time: "",
		body: []
	};

	var meetingStatus = {
		url: "/combineaction/v1/meeting/syncStatus/{meetingNo}",
		post: {
			status: 0 // 0:未开始; 1:进行中; 2:已结束
		}
	}

	var meetingChoosen = {
		url: "/combineaction/v1/meeting/invite/{meetingNo}",
		post: {
			members: [],
			user: {},
			type: "" //1 in; 2 out
		}
	}

	var meetingUpdate = {
		url: "/combineaction/v1/meeting/change/{meetingNo}",
		post: {
			meetingId: "",
			meetingTopic: "",
			meetingDesc: "",
			startTime: ""
		}
	}

	var meetingRecord = {
		url: "/combineaction/v1/meeting/synTimePhase/{meetingNo}",
		post: {
			meetingId: "id",
			phaseInfoList: [],
			phaseInfo: {},
			phaseName: "",
			startTime: "",
			endTime: ""
		}
	}

	var invite = {
		url: "/combineaction/v1/meeting/invitationNotify/{meetingId}",
		post: {
			members: [API.user1, API.user2],
			user: currentUser = API.user1
		}
	}

	if(code = "000000"){
		callback("ok");
	}
}

API.getRCToken = function(userInfo, callback){
	var mocks = {
		"user9": "ZThhLI1Xa1BX5EMREAdArWSH6ouuI8NT/fNmMkzF+4IOKIoFvbsi6JnH8QmnSltLkCcsK8vOgKl3IZgfbxFiWg==",
		"user10": "4FGCL0oQ/E72nU4ivbui8uHR/ySxKaD1cAX2biXsYR6RsLYO9xAA4ooa+q3n42JnVTQyMAdFUiDsjFRDYZaQeg==",
		"user11": "ovjkF2621YWp7odRhy9i6vHDlKxuUva3nL1owWyEuVOxBPB1/Pr1sY7ayEdnH2tgVyqC/Dcl95lDFEgeXzjaqQ=="
    };

    callback(mocks[userInfo.id]);
}


API.groupAdds = function(params, callback){
	params = {
		userIds: [],
		groupId: ""
	}
	callback("ok");
}

API.groupAdd = function(params, callback){
	/*
	var params = {
		userId,
		group : {
			id: ""
		}
	}*/

	var user1 = API.user1;
	var user2 = API.user2;
	var data = {
		"code": "000000",
		"message": "SUCCESS",
		"time": "2019-02-28T18:33:37.360+0800",
		"body": [
			user1, user2, user1, user2
		]
	}

	for(var i=0;i<data.body.length;i++){
		data.body[i].avatar = data.body[i].avatar || "./css/images/person-active.png";
		// data.body[i].realName += i;
	}

	callback(data.body);


	console.log("add userid = ", params.userId, " to group id=", params.group.id);

	var avatar = "./css/images/person-active.png?id=";

	var groupInfo = {
		id: params.group.id,
		name: "作战室沟通",
		user: {
			id: params.userId, 
			name: "name", 
			avatar: avatar + params.userId,
			portrait: avatar + params.userId
		},
		members: data.body
	}
	callback(groupInfo);
}

API.getUserByRoomId = function(roomId, callback){
	//ajax by roomId
	var data = {
		users: [
            {name:'李芳11',online: true},
            {name:'李芳12',online: true},
            {name:'李芳13',online: true},
            {name:'李芳14',online: true}
        ],
        companyLeaders: [
            {name:'李芳2', select: true},
            {name:'李芳3', select: false},
            {name:'李芳4', select: false}
        ],
        groupLeaders: [
            {name:'李芳5', select: true},
            {name:'李芳6', select: false}
        ]
	};

	callback(data);
}



	
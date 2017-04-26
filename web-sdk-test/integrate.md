#IM（Web + PC） Integrate引导文档

##准备工作
	1. 架构介绍
		云，应用服务器，IM三者的关系
		应用服务器的职责
			https://github.com/sealtalk/sealtalk-server

	2. 关键逻辑讲解
		消息状态与未读消息数
		会话类型
		会话列表与好友信息
		消息类型与自定义消息
		消息发送与接收
		Web版与PC版的关系

	3. 收费功能说明
		历史消息云存储（多设备同步）
		消息路由
		http://www.rongcloud.cn/docs/payment.html

	4. 开发环境
		IM开发环境（Web站点）
			开发环境必须为http(s)协议
			禁止localhost或者IP，不推荐使用端口
			需要支持localstorage
		桌面版
			https://github.com/sealtalk/sealtalk-desktop
			http://web.hitalk.im/docs/web/#desktop-build.md
		排查工具
			网络问题
			浏览器环境污染问题


	5. 常见开发功能说明
		会话顺序及分组处理
		默认打开指定会话
		界面调整
		消息搜索
		emoji表情

	6. 常见问题
		token的问题 http://www.rongcloud.cn/docs/web.html#get_token
			一个userId多个token
			token缓存与过期
			name和portraitUri的作用、更新问题

		测试环境账号不得多于100个
		模块化加载
		图片上传
		文件上传
		语音消息
			编码，长度，音频文件类型
		多页面链接消息完全同步的问题

		发消息高频限制
		用户在线状态

	7. 近期开发计划
		近期会发布的新功能






##获取AppKey、AppSecret
	注册开发者账号：
		https://developer.rongcloud.cn/signin
	
	必须知道的不能：
		不同appKey之前不能通信

	App配置


	收费功能开启



##确定平台，引入依赖资源
	1. SDK
	2. API文档
		http://www.rongcloud.cn/docs/api/js/index.html
		https://shuise.github.io/tech-research/web-sdk-test/web-sdk-test.html
	3. 集成方向
		IM
			http://web.sealtalk.im
		客服插件

		站内信

		聊天插件
			http://web.hitalk.im/widget/web/index.html
		聊天室
			todo

			聊天室回收问题
		直播室
			todo
		实时音视频通话
			



##问题反馈


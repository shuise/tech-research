# 一级标题 

## 二级标题（列表）

1. 链接，加粗，斜体

    请点击 [下载页面](download.html) 点击下载
    在 **手机设置** 中，打开界面，点击 ___“设备管理”___

2. 图片
 
    示意图 ![](http://www.rongcloud.cn/docs/assets/img/guide/Web_IM_Widget_Conversation.png "图片对应文字")

3. 更多文档 [http://www.appinn.com/markdown/](http://www.appinn.com/markdown/)

## 二级标题（表格）

|参数   | 必传  |类型   | 说明
|:----- |:----- |:------|:---------
|phone  |  YES  |string | 手机号 e.g. 13269772761
|region |  YES  |string | 区域标识 e.g. 86
|code   |  YES  |string | 验证码 e.g. 8937

## 二级标题

### 代码片段

### 代码

```
RongIMClient.setOnReceiveMessageListener({
    // 接收到的消息
    onReceived: function (message) {
        // 判断消息类型
        // console.log("新消息: " + message.targetId);
        // console.log(message);
        for(var i = 0, len = onMessageList.length; i<len; i++){
            onMessageList[i](message);
        }
    }
});
```


### 引用

这是一段引用自什么的话。
> 注册后登录开发者后台即可创建应用。创建应用后才可进行 Web IM 集成开发。
> 
> 每个应用都提供了生产环境和开发环境，两个环境的功能完全一致、数据完全隔离，分别有自己的 App Key / Secret，App Key / Secret是融云 SDK 连接服务器所必须的标识，请不要外泄。
> 
> 应用最终上线前，使用开发环境进行开发测试，上线申请通过后可获取生产环境的 App Key / Secret，替换后即可发布上线。





function init() {
    appKey = "e0x9wycfeazyq";
    token = "RMmWBeca3K1iQ4yVKrWy6OKSeuOyOAQ/XPr4sUlvw/p2OWJL0P5SG28RhmHYnEOOK2NQ8457HM0=";

    /*appKey = "e0x9wycfx7flq";
    token = "VNyTg28RIm0xchPG2DHVVcLg1HgVe6BNpEIHZDy7fhL03AR3WyG/Ec/c+dIDZXrupSMx3C/s+e4=";*/



    var targetIds = "2,3";
    if (targetIds == "") {
        alert("必须提供两个的有效targetId");
    }

    targetIds = targetIds.split("，").join(",").split(",");
    targetId = targetIds[0];
    targetId2 = targetIds[1];


    /*
     文档：http://www.rongcloud.cn/docs/web.html
     */

    //私有云初始化
    // var appkey = "";
    // var token = "";
    // var config = {
    // 	navi : "103.36.xxx.xxx"
    // }
    // RongIMLib.RongIMClient.init(appKey,null,config);

    //公有云初始化

    RongIMLib.RongIMClient.init(appKey);

    /*RongIMLib.RongIMClient.init(appKey,null,{
        	navi : "119.254.111.49:9100"
    });*/

    instance = RongIMClient.getInstance();

    RongIMLib.RongIMEmoji.init();

    RongIMLib.RongIMVoice.init();


    var publicVue='';
    // 连接状态监听器
    RongIMClient.setConnectionStatusListener({
        onChanged: function (status) {
            switch (status) {
                case RongIMLib.ConnectionStatus.CONNECTED:
                    console.log("链接成功 ");
                    publicVue=initVue();
                    break;
                case RongIMLib.ConnectionStatus.CONNECTING:
                    console.log('正在链接');
                    break;
                case RongIMLib.ConnectionStatus.DISCONNECTED:
                    console.log('断开连接');
                    break;
                case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
                    console.log('其他设备登录');
                    break;
                case RongIMLib.ConnectionStatus.DOMAIN_INCORRECT:
                    console.log('域名不正确');
                    break;
                case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
                    console.log('网络不可用');
                    break;
            }
        }
    });

    /*
     文档：http://www.rongcloud.cn/docs/web.html#3、设置消息监听器

     注意事项：
     1：为了看到接收效果，需要另外一个用户向本用户发消息
     2：判断会话唯一性 ：conversationType + targetId
     3：显示消息在页面前，需要判断是否属于当前会话，避免消息错乱。
     4：消息体属性说明可参考：http://rongcloud.cn/docs/api/js/index.html
     */

    RongIMClient.setOnReceiveMessageListener({
        // 接收到的消息
        onReceived: function (message) {
            // 判断消息类型
            console.log("新消息，类型为：" + message.messageType);
            // showResult("新消息",message,start);

            console.log(message);
            /*{
                content:TextMessage
                conversationType:8
                extra:undefined
                isLocalMessage:undefined
                messageDirection:2
                messageId:"8_16466799"
                messageType:"TextMessage"
                messageUId:"5DO0-N1IE-5000-001H"
                objectName:"RC:TxtMsg"
                offLineMessage:false
                receiptResponse:undefined
                receivedStatus:0
                receivedTime:1492507177712
                senderUserId:"Ddaijia"
                sentStatus:undefined
                sentTime:1492507177585
                targetId:"Ddaijia"
            }*/
            /*{
                "content": {
                "messageName": "TextMessage",
                    "content": "111",
                    "extra": "公众号"
                },
                "conversationType": 8,
                "objectName": "RC:TxtMsg",
                "messageDirection": 1,
                "messageId": 5,
                "senderUserId": "1",
                "sentStatus": 30,
                "sentTime": 1492511558616,
                "targetId": "testing",
                "messageType": "TextMessage",
                "messageUId": "5DO1-7OBR-12LJ-ECGG"
            }*/
            switch (message.messageType) {
                case RongIMClient.MessageType.TextMessage:
                    /*
                     显示消息方法：
                     消息里是 原生emoji
                     RongIMLib.RongIMEmoji.emojiToHTML(message.content.content);
                     */
                    publicVue.stat.msgList.push(message);
                    break;
                case RongIMClient.MessageType.VoiceMessage:
                    /*
                     引入SDK并初始化请参考文档 http://www.rongcloud.cn/docs/web.html#声音库

                     api文档： http://www.rongcloud.cn/docs/api/js/VoiceMessage.html

                     var audio = message.content.content //格式为 AMR 格式的 base64 码
                     var duration = message.content.duration;

                     RongIMLib.RongIMVoice.preLoaded(audio,function(){
                     RongIMLib.RongIMVoice.play(audio,duration);
                     });
                     */


                    break;
                case RongIMClient.MessageType.ImageMessage:
                    // message.content.content => 图片缩略图 base64。
                    // message.content.imageUri => 原图 URL。
                    break;
                case RongIMClient.MessageType.DiscussionNotificationMessage:
                    // message.content.extension => 讨论组中的人员。
                    break;
                case RongIMClient.MessageType.LocationMessage:
                    // message.content.latiude => 纬度。
                    // message.content.longitude => 经度。
                    // message.content.content => 位置图片 base64。
                    break;
                case RongIMClient.MessageType.RichContentMessage:
                    // message.content.content => 文本消息内容。
                    // message.content.imageUri => 图片 base64。
                    // message.content.url => 原图 URL。
                    break;
                case RongIMClient.MessageType.InformationNotificationMessage:
                    // do something...
                    break;
                case RongIMClient.MessageType.ContactNotificationMessage:
                    // do something...
                    break;
                case RongIMClient.MessageType.ProfileNotificationMessage:
                    // do something...
                    break;
                case RongIMClient.MessageType.CommandNotificationMessage:
                    // do something...
                    break;
                case RongIMClient.MessageType.CommandMessage:
                    // do something...
                    break;
                case RongIMClient.MessageType.UnknownMessage:
                    // do something...
                    break;
                case "PublicServiceMultiRichContentMessage":
                    // do something...
                    publicVue.stat.msgList.push(message);
                    break;
                default:
                // do something...
            }
        }
    });

   /* "{"content":{"messageName":"PublicServiceMultiRichContentMessage","richContentMessages":{"articles":[{"digest":"","picurl":"http://7xi6ox.com1.z0.glb.clouddn.com/22c7962d13ca81da353f003e4af42347","title":"如果你来过了北京，就等于去了全世界!","url":"http://public.rongcloud.cn/view/5F3DBDAAEE94639438CC1AFF2601A035"},{"digest":"","picurl":"http://7xi6ox.com1.z0.glb.clouddn.com/8ec356a230c8f83e42a51bc6dcfc74a6","title":"厉害了，北京交通又将大爆发，全国都羡慕！","url":"http://public.rongcloud.cn/view/95B92A7E6DA604E6AADDE20A8110067E"}],"extra":"","user":{"id":"","name":"","portrait":""}}},"conversationType":8,"objectName":"RC:PSMultiImgTxtMsg","messageDirection":2,"messageId":"8_2526138","receivedStatus":0,"receivedTime":1492566484293,"senderUserId":"Ddaijia","sentTime":1492566483541,"targetId":"Ddaijia","messageType":"PublicServiceMultiRichContentMessage","messageUId":"5DO7-P929-L2KP-MC3I","offLineMessage":false}"   */

    //开始链接
    RongIMClient.connect(token, {
        onSuccess: function (userId) {
            console.log("链接成功，用户id：" + userId);
        },
        onTokenIncorrect: function () {
            //console.log('token无效');
        },
        onError: function (errorCode) {
            var info = '';
            switch (errorCode) {
                case RongIMLib.ErrorCode.TIMEOUT:
                    info = '超时';
                    break;
                case RongIMLib.ErrorCode.UNKNOWN_ERROR:
                    info = '未知错误';
                    break;
                case RongIMLib.ErrorCode.UNACCEPTABLE_PaROTOCOL_VERSION:
                    info = '不可接受的协议版本';
                    break;
                case RongIMLib.ErrorCode.IDENTIFIER_REJECTED:
                    info = 'appkey不正确';
                    break;
                case RongIMLib.ErrorCode.SERVER_UNAVAILABLE:
                    info = '服务器不可用';
                    break;
            }
            console.log(info);
        }
    });
}

init();
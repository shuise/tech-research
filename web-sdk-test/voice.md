# 融云声音库

## 声音库使用方法

### 引入声音库

```
<script src="//cdn.ronghub.com/swfobject-2.0.0.min.js"></script>
<script src="lib/libamr-min-new.js"></script>
<script src="./voice.js"></script>
```

### 定义音频文件，base64码，AMR格式
示例中的音频消息：

```
<script src="./res/voice-amr-base64.json"></script>
```

### 初始化声音库
全局只需要 init 一次

```
RongIMVoice.init();
```

### 播放声音

```
/* 
	voice: amr 格式的 base64 语音文件
 	onbeforeplay: 音频播放之前
 	onplayed: 音频开始播放
 	onended: 音频播放完成
 */

RongIMVoice.Player.play(voice, {
    onbeforeplay: function(){
        console.log('onbeforeplay');
    },
    onplayed: function(){
        console.log('onplayed');
    },
    onended: function(){
        console.log('onended');
    }
});

```

### 停止播放

```
RongIMVoice.Player.pause();
```

## 微信浏览器、IOS 的 Safari 浏览器等播放语音问题解决

如果需要在微信浏览器或者 IOS 的 Safari 浏览器等使用，请参考 voiceComponent.js demo

```
<script src="//res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
<script src="./voiceComponent.js"></script>
```

### 微信浏览器播放语音 demo 使用方法

```
......（ 判断是否为 微信浏览器 ）

wx.ready(function () {

   document.getElementById('play').addEventListener("touchstart",function(event){

	    RongIMVoice.Player.play(voice); //此处执行的是 播放语音消息 方法

	    window.removeEventListener('touchstart',RongIMVoice.Player.play(voice), false);
	    event.stopPropagation(); 
	});

});
```

### IOS Safari 浏览器等 播放语音 demo 使用方法

```
/*
	Safari 浏览器 明确指出等待用户的交互动作后才能播放 audio ，如果没有得到用户的 action 就播放的话就会被 safri 拦截
*/

......（ 判断是否为 IOS 浏览器 ）

document.getElementById('play').addEventListener("touchstart",function(event){

    RongIMVoice.Player.play(voice); //此处执行的是 播放语音消息 方法

    window.removeEventListener('touchstart',RongIMVoice.Player.play(voice), false);
    event.stopPropagation(); 
});
```

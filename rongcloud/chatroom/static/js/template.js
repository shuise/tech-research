var temConfig = {
	ulId: 'messageList',//message_list的id
	emojiId: 'emojiItem',
	emojiContentId: 'emojiContainer',//emoji_list的id
	textId: 'roomChatTexta',//输入框的id
	textPlaceholderId: 'roomChatTextaPlaceholder',//输入框的id
	messageType: ['talkMessage','enterMessage']
}

var chatRoomTem = (function(){
	var containerTmp = function(){
		return	[
			'<div class="room-chat-container">',
			'<div class="room-chat-scroller">',
			'<ul class="room-chat-message" id="'+temConfig.ulId+'">',
			'</ul>',
			'</div>',
			'</div>',
			'<div class="room-chat-dispatch">',
			'<div class="room-chat-tools">',
			'<div class="room-chat-tool-left body-left">',
			'<span class="room-tool-item room-tool-item-emoji" id="'+temConfig.emojiId+'" onclick="domobj.showEmojiContent(event)"></span>',
			'<div class="emoji-content" id="'+temConfig.emojiContentId+'" onclick="domobj.chooseEmoji(event)">',
			'</div>',
			'</div>',
			'</div>',
			'<div class="room-chat-send">',
			'<div class="room-chat-input">',
			'<textarea class="room-chat-texta" id="'+temConfig.textId+'" onfocus="domobj.changeTextaFocus(true)" onblur="domobj.changeTextaFocus(false)" onkeydown="domobj.send(event)"></textarea>',
			'<div class="room-chat-texta-placeholder" id="'+temConfig.textPlaceholderId+'">快和大家一起聊天吧</div>',
			'</div>',
			'<div class="room-chat-send-btn" onclick="domobj.send()">发送</div>',
			'</div>',
			'</div>'
		].join('');
	};
	var messageTemA = function(name,message){
		return [
			'<li class="room-chat-item">',
			'<span class="room-chat-user-name">'+name+'：</span>',
			'<span class="room-chat-content">'+message+'</span>',
			'</li>',
		].join('');
	};
	var messageTemB = function(name){
		return [
			'<li class="room-chat-item">',
			'<span class="room-chat-enter-message">',
			'欢迎&nbsp;<span class="room-chat-user-name">'+name+'</span>',
			'&nbsp;进入本房间</span>',
			'</li>',
		].join('');
	};
	return {
		containerTmp: containerTmp,
		messageTemA:messageTemA,
		messageTemB:messageTemB
	}
})()
var domobj = (function(){
	//消息显示在页面上
	var showMessage = function(messageObj){
		var li;
		if (messageObj.type == temConfig.messageType[0]) {
			li = chatRoomTem.messageTemA(messageObj.name,messageObj.message);
		} else if (messageObj.type == temConfig.messageType[1]) {
			li = chatRoomTem.messageTemB(messageObj.name,messageObj.message);
		}
		$('#'+temConfig.ulId).append(li);
		var height = $('#'+temConfig.ulId).height();
		$('#'+temConfig.ulId).parent().scrollTop(height);
	};
	//控制textarea的placeholder
	var changeTextaFocus = function(change){
		var containerVisibility = 'hidden';
		if (!change && !$('#'+temConfig.textId).val()) {
			containerVisibility = 'visible';
		}
		document.getElementById(temConfig.textPlaceholderId).style.visibility = containerVisibility;
	};
	//表情添加到列表中
	var showEmoji = function(emoji){
		var strHtml = '';
		for (var i = 0; i < emoji.length; i++) {
			strHtml += emoji[i].innerHTML;
		}
		document.getElementById(temConfig.emojiContentId).innerHTML = strHtml;
	};
	//表情容器的显示与隐藏
	var showEmojiContent = function(event){
		var thisTarget = event.target || event.srcElement;
		var emojiContainer = $('#'+temConfig.emojiContentId);
		if (emojiContainer.hasClass('content-active')) {
			emojiContainer.removeClass('content-active');
			$(thisTarget).removeClass('room-tool-active');
		} else {
			emojiContainer.addClass('content-active');
			$(thisTarget).addClass('room-tool-active');
		}
	};
	//表情的点击事件
	var chooseEmoji = function(event){
		var thisTarget = event.target || event.srcElement;
		if ($(thisTarget).hasClass('RC_Expression')) {
			thisTarget = $(thisTarget).parent()[0];
		}
		var emojiName = $(thisTarget).attr('name');
		var textA = $('#'+temConfig.textId);
		if (emojiName) {
			if (!textA.val()) {
				document.getElementById("roomChatTextaPlaceholder").style.visibility = 'hidden';
			}
			textA.val(textA.val()+emojiName);
			$('#'+temConfig.emojiContentId).removeClass('content-active');
			$('#'+temConfig.emojiId).removeClass('room-tool-active');
			textA.trigger('focus');
		}
	};
	//发送
	var send = function(event){
		if (event && event.keyCode != "13") {
			return;
		}
		if (event && event.keyCode == "13") {
			event.preventDefault();
		}
		var textA = $('#'+temConfig.textId);
		var message = textA.val();
		if (!message) {
			alert('请输入内容');
			return;
		}
		rongConfig.sendMessageToChatroom(message,temConfig.messageType[0]);
		textA.val('');
		textA.trigger('focus');
	}
	return {
		showMessage: showMessage,
		changeTextaFocus: changeTextaFocus,
		showEmoji: showEmoji,
		showEmojiContent: showEmojiContent,
		chooseEmoji: chooseEmoji,
		send: send
	}
})();
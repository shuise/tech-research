(function(){
	//https://developer.chrome.com/extensions/content_scripts 
	window.onload = function(){
		var _form = document.querySelector(".signinBox form");
		var user = document.querySelector("#username");
		var pwd = document.querySelector("#pwdIn");
		var btn = document.querySelector(".button-wrapper .sign-button");

		user.value = "13800138000";
		pwd.value = "111111";

		// _form.submit();

		// btn.click();
	}
})();



YUI({
	combine: true,
	comboBase: "http://img4.cache.netease.com/service/combo?"
}).use("cookie", "overlay", "json-parse", "jsonp", "autocomplete", "event-mouseenter",
function(c) {
	window.mask = c.Node.create('<div class="v-mask"></div>');
	c.one("body").insert(mask, 0);
	if (c.UA.ie && c.UA.ie <= 6) {
		mask.setStyle("position", "absolute");
		function p() {
			mask.setStyles({
				width: c.DOM.docWidth() + "px",
				height: c.DOM.docHeight() + "px"
			})
		}
		p();
		c.on("windowresize",
		function() {
			p()
		})
	}
	if (!c.one("iframe.proxy")) {
		window.logined = false;
		window.userId;
		var k = c.Cookie.get("P_INFO");
		if (k) {
			k = k.split("|");
			if (1 == k[2] || 0 == k[2] && Boolean(c.Cookie.get("S_INFO"))) {
				logined = true;
				userId = k[0]
			}
		}
	}
	var j = c.one("#myVideoBtn");
	if (logined && j) {
		j.setStyle("visibility", "visible")
	}
	var o = c.Node.create('<div class="v-login hidden"><h2><span class="left f14px fB">登录网易通行证</span><span class="right v-login-close"></span></h2><form class="login"method="POST" action="https://reg.163.com/logins.jsp" target="_self"><div class="v-login-item clearfix"><label class="v-login-label f14px" for="email">账号：</label><input class="v-login-input"type="text" id="email" name="username" value="" /></div><div class="v-login-item clearfix"><label class="v-login-label f14px" for="password">密码：</label><input class="v-login-input"type="password" id="password" name="password" /></div><div class="clearfix"><label class="v-login-label"></label><div class=""><input type="checkbox" class="v-login-checkbox" id="savelogin" name="savelogin" value="1"> <label for="savelogin">下次自动登录</label> <a class="cBlue" title="忘记密码" href="http://reg.163.com/RecoverPassword.shtml">忘记密码？</a> </div></div><div class="clearfix"><label class="v-login-label" > </label><input type="submit" value="登 录" class="v-login-submit left f14px"/><a href="http://reg.email.163.com/mailregAll/reg0.jsp" title="注册" class="left v-login-reg cBlue">注册网易通行证</a></div><input id="tieCheck" type="hidden" name="url" value=""><input type="hidden" value="163v" name="product"></form></div>');
	o.appendTo("body");
	o.one("#tieCheck").set("value", "http://comment.v.163.com/reply/check.jsp?url=" + encodeURIComponent(location.href));
	window.loginOl = new c.Overlay({
		srcNode: o,
		visible: false,
		zIndex: 10000,
		render: true
	});
	o.removeClass("hidden");
	c.on("click",
	function() {
		loginOl.hide();
		mask.setStyle("display", "none")
	},
	".v-login-close");
});
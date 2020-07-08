(function (W) {
    W.NTESCommonLogin = W.NTESCommonLogin || {};
    var Util = {
        getXY: function (Obj) {
            var sumTop = 0, sumLeft = 0;
            while (Obj != document.body && Obj != null) {
                sumLeft += Obj.offsetLeft;
                sumTop += Obj.offsetTop;
                Obj = Obj.offsetParent;
            }
            return {
                x: sumLeft + 1,
                y: sumTop
            };
        },
        getElemById: function (id) {
            return W.document.getElementById(id);
        },
        cookie: {
            get: function (key) {
                var c = document.cookie.split("; ");
                for (var i = 0; i < c.length; i++) {
                    var p = c[i].split("=");
                    if (key == p[0]) try { return decodeURIComponent(p[1]) } catch (e) { return null }
                }
                return "";
            }
        },
        addElement: function (elem) {
            document.body.appendChild(elem);
        },
        delElement: function (elem) {
            document.body.removeChild(elem)
        }
    };

    var wrap = document.createElement("div"),
        uName = "",
        pId = "163",
        uTk = "",
        url = "http://reg.163.com/chgcookie.jsp?",
        responseUrl = "http://www.163.com/special/0077450P/login_frame.html",
        logoutUrl = "http://reg.163.com/Logout.jsp",
        iframeStr = '<iframe src="javascript:false;" name="changeCookie" frameborder="0" style="width:0;height:0;display:none;"></iframe>',
        destory = function (sender) {
            try {
                document.body.removeChild(sender);
            } catch (e) {

            }
        },
        init = function (cb) {
            var sender = null;
            wrap.innerHTML = iframeStr;
            uTk = Util.cookie.get("USERTRACK");
            uName = String(Util.cookie.get("P_INFO")).split("|")[0];
            document.body.appendChild(sender = wrap.firstChild);
            sender.onload = sender.onreadystatechange = function () {
                if ((!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {
                    setTimeout(function () {
                        if (Util.cookie.get('S_INFO')) {
                            cb && cb();
                        }
                        destory(sender);
                        sender = null;
                    }, 400);
                }
            };
            sender.src = url + ["username=" + uName, "product=" + pId, "userip=" + uTk, "retUrl=" + responseUrl, "loginUrl=" + responseUrl].join("&");
        },
        logout = function (cb) {
            var sender = null;
            wrap.innerHTML = iframeStr;
            uTk = Util.cookie.get("USERTRACK");
            uName = String(Util.cookie.get("P_INFO")).split("|")[0];
            document.body.appendChild(sender = wrap.firstChild);
            sender.onload = sender.onreadystatechange = function () {
                if ((!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {
                    setTimeout(function () {
                        cb && cb();
                        destory(sender);
                        sender = null;
                    }, 400);
                }
            };
            sender.src = logoutUrl;
        };

    var LoginUtil = {
            /**
            * 是否通过监听iframe的onload事件校验登录
            */
            listenFrame: true,
            /**
            * 登录Action
            */
            loginAction: 'https://reg.163.com/logins.jsp',
            /**
            * 成功回调的Action
            */
            successAction: '',
            /**
            * 失败回调的Action
            */
            failedAction: '',
            /**
            * 登录成功回调方法
            */
            success: {},
            /**
            * 登录失败回调方法
            */
            failed: {},
            /**
            * 错误消息
            */
            errorMsg: {
                412: '您尝试的次数已经太多,请过一段时间再试',
                414: '您的IP登录失败次数过多,请稍后再试',
                415: '您今天登录错误次数已经太多,请明天再试',
                416: '您的IP今天登录过于频繁，请稍后再试',
                417: '您的IP今天登录次数过多，请明天再试',
                418: '您今天登录次数过多,请明天再试',
                419: '您的登录操作过于频繁，请稍候再试',
                420: '用户名不存在',
                422: '帐号被锁定，请您解锁后再登录',
                424: '该靓号服务已到期，请您续费',
                425: '外域帐号并且在激活有效期以内',
                426: '外域帐号并且已经过了激活有效期限',
                427: '超时，已超过5分钟有效期',
                428: '需要进入中间提醒页面',
                460: '密码不正确',
                500: '系统繁忙，请您稍后再试',
                503: '系统维护，请您稍后再试',
                1000: '请输入有效的用户名'
            },
            /**
            * 提交登录 方法
            * @param Object data
            * {
            *     username : Ｓtring,//用户名
            *     password : String,//密码
            *     type: 1/0,//0表示password经过md5加密，对用户密码做MD5前需要对密码中的'和\做转换，其前再加上一个\字符。1表示password为明文
            *     product : String,//产品标识
            *     savelogin : 1/0,//是否保留用户登录信息，设置cookie:NTES_PASSPORT。1保留，0不保留
            * }
            * @method commit
            */
            commit: function (data) {
                if (!data) {
                    return;
                }
                !this.frame && this.createElements();
                this.username.value = data.username;
                this.password.value = data.password;
                this.type.value = data.type || 1;
                this.product.value = data.product || "163";
                this.savelogin.value = data.savelogin || 0;
                this.url.value = this.successAction;
                this.url2.value = this.failedAction;
                this.noRedirect.value = 1;

                this.form.submit();
            },
            /**
            * 校验登录状态
            */
            verifyLogin: function () {
                if (this.verifyCookie && this.verifyCookie()) {
                    for (var fn in this.success) {
                        if (typeof this.success[fn] === 'function') {
                            this.success[fn].call(this, arguments[0]);
                        }
                    }
                } else {
                    for (var fn in this.failed) {
                        if (typeof this.failed[fn] === 'function') {
                            arguments[0] && (arguments[0].errorMsg = this.errorMsg[this.errorMsg[arguments[0].errorType] ? arguments[0].errorType : 1000])/* && console.log(arguments[0].errorType)*/;
                            this.failed[fn].call(this, arguments[0]);
                        }
                    }
                }
            },
            verifyCookie : function () {
                var S_INFO = Util.cookie.get('S_INFO'), P_INFO = Util.cookie.get('P_INFO');
                return (S_INFO && (P_INFO[2] != '2'));
            },
            /**
            * 获取URL中的搜索参数
            * @param String href
            * @method getSearches
            */
            getSearches: function (href) {
                href = href || window.location.search;
                var str = href.substring(1), slist = str.split('&'), data = {};
                for (var i = 0; i < slist.length; i++) {
                    var d = slist[i].split('=');
                    d[0] && (data[d[0]] = d[1] || null);
                }
                return data;
            },
            /**
            * 生成所有元素
            * @method createElements
            */
            createElements: function () {
                this.frame = this.createFrame();
                this.form = this.createForm();

                this.username = this.createInput('username');
                this.password = this.createInput('password');
                this.type = this.createInput('type');
                this.product = this.createInput('product');
                this.savelogin = this.createInput('savelogin');
                this.url = this.createInput('url');
                this.url2 = this.createInput('url2');
                this.noRedirect = this.createInput('noRedirect');

                this.form.appendChild(this.username);
                this.form.appendChild(this.password);
                this.form.appendChild(this.type);
                this.form.appendChild(this.product);
                this.form.appendChild(this.savelogin);
                this.form.appendChild(this.url);
                this.form.appendChild(this.url2);
                this.form.appendChild(this.noRedirect);

                Util.addElement(this.form);
                Util.addElement(this.frame);
            },
            /**
            * 创建input
            * @param String name
            */
            createInput: function (name) {
                var el = this.toElement('<input/>');
                el.setAttribute('name', name);
                return el;
            },
            /**
            * 通过innerHTML创建并返回新元素
            * @param String html
            * @return Boolean
            * @method toElement
            */
            toElement: (function () {
                var div = document.createElement('div');
                return function (html) {//闭包,无须再次创建div
                    div.innerHTML = html;
                    var element = div.firstChild;
                    div.removeChild(element);
                    return element;
                };
            })(),
            /**
            * 创建IFrame
            * @return Element iframe
            * @method createFrame
            */
            createFrame: function () {
                var me = this, iframe, id = 'login_util_frame', count = 0;
                iframe = me.toElement('<iframe src="javascript:false;" name="' + id + '" />');
                iframe.setAttribute('id', id);
                iframe.setAttribute('border', 'no');
                iframe.style.display = 'none';
                iframe.onload = iframe.onreadystatechange = function () {
                    if (!me.listenFrame) {
                        return;
                    } //不用事件校对登录
                    if ((!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {
                        try {
                            var _w = this.window || this.contentWindow;
                            var _search = _w.location.search;
                            if (count || _search) {
                                me.verifyLogin(me.getSearches(_search));
                            }
                            count++;
                        } catch (e) {

                        }
                    }
                };
                return iframe;
            },
            /**
            * 创建 form
            * @return Element form
            * @method createForm
            */
            createForm: function () {
                var me = this, form;
                form = me.toElement('<form method="post"></form>');
                form.setAttribute('id', 'login_util_form');
                form.setAttribute('action', this.loginAction);
                form.setAttribute('target', this.frame.name);
                form.style.display = 'none';
                return form;
            }
        };

    NTESCommonLogin.ChangeCookie = init;

    NTESCommonLogin.Logout = logout;
    
    //自动完成，补充邮箱选项
    NTESCommonLogin.Suggestion = function () {
        //去除字符串2边空格
        String.prototype.trim = function () {
            return this.replace(/(^\s*)|(\s*$)/g, "");
        };

        String.prototype.replaceAll = function (s1, s2) {
            return this.replace(new RegExp(s1, "gm"), s2);
        }

        function resizeFunc() {
            var ds = document.getElementById("js_passportUserNameList");
            var xy = Util.getXY(Passport.usernameInputElement);
            if(!ds){return;}
            ds.style.left = xy.x + "px";
            ds.style.top = (xy.y + Passport.usernameInputElement.offsetHeight) + "px";
        }

        function insertElmToBody(str) {
            var div = document.createElement('div');
            div.innerHTML = str;
            Util.addElement(div.firstChild)
            div = null;
        }

        var Passport = {
            usernameInputElement: false,
            usernameInputElementX: false,
            usernameInputElementY: false,
            usernameInputHeight: false,
            usernameListElement: false,
            currentSelectIndex: -1,
            hasShow: false,
            domainSelectElmentString: "<div id = \"js_passportUserNameList\"  class=\"ntes-domain-selector\" style=\"position: fixed; _position: absolute; display: none;\"><div class=\"ntes-domain-selector-main\"><table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\"><tbody><tr><td class=\"title\" style=\"title\" >\u8bf7\u9009\u62e9\u6216\u7ee7\u7eed\u8f93\u5165\u002e\u002e\u002e</td></tr><tr><td><td /></tr></tbody></table></div><iframe src=\"javascript:'';\"  style=\" z-index:1008;width:100%;height:0px;display:block  \" frameborder=\"0\"></iframe></div><div style=\"display: none;\"></div><div id=\"passport_111\"></div>",
            domainSelectElement: false,
            domainArray: ["163.com", "126.com", "yeah.net", "vip.163.com", "vip.126.com", "popo.163.com", "188.com", "vip.188.com", "qq.com", "yahoo.com", "sina.com"],
            helpDivString: "<div style=\"width:100%;\" id=\"passport_helper_div\"></div>",
            bind: function (obj,op) {
                this.usernameInputElement = obj;
                var xy = Util.getXY(this.usernameInputElement);
                this.usernameInputElementX = xy.x;
                this.usernameInputElementY = xy.y;
                this.handle(op);
            },
            handle: function (op) {
                insertElmToBody(this.domainSelectElmentString);
                insertElmToBody(this.helpDivString);

                this.domainSelectElement = document.getElementById("js_passportUserNameList");
                if (op && !op.center && !op.mask) {
                    this.domainSelectElement.style.position = "absolute";
                }
                this.usernameListElement = this.domainSelectElement.firstChild.firstChild.rows[1].firstChild;
                this.currentSelectIndex = 0;
                this.usernameInputElement.onblur = function (e) {
                    Passport.preventEvent(e);
                    setTimeout(function () {
                        Passport.doSelect();
                    }, 200);
                    return false;
                };
                try {
                    this.usernameInputElement.addEventListener("keypress", this.keypressProc, false);
                    this.usernameInputElement.addEventListener("keyup", this.keyupProc, false);
                } catch (e) {
                    try {
                        this.usernameInputElement.attachEvent("onkeydown", this.checkKeyDown);
                        this.usernameInputElement.attachEvent("onkeypress", this.keypressProc);
                        this.usernameInputElement.attachEvent("onkeyup", this.keyupProc);
                    } catch (e) {
                    }
                }

                //----------------解决用户名自动提示div在窗口大小发生变化时的位置偏移的bug.-----------
                resizeFunc();
                if (navigator.userAgent.indexOf("MSIE") > 0) {
                    window.attachEvent("onresize", resizeFunc);
                } else {
                    //zdli edit 会覆盖原有逻辑的resize事件
                    window.addEventListener("resize", resizeFunc, false);
                    //window.onresize = resizeFunc;
                }
                //----------------解决用户名自动提示div在窗口大小发生变化时的位置偏移的bug.-----------
            },
            preventEvent: function (e) {
                try {
                    e.cancelBubble = true;
                    e.returnValue = false;
                    if (e.preventDefault) {
                        e.preventDefault();
                    }
                    if (e.stopPropagation) {
                        e.stopPropagation();
                    }
                } catch (e) {

                }
            },
            checkKeyDown: function (e) {
                this.currentSelectIndex = 0;
                var keyCode = e.keyCode;
                if (keyCode == 38 || keyCode == 40) {
                    Passport.preventEvent(e);

                    Passport.clearFocus();
                    if (keyCode == 38) {
                        Passport.upSelectIndex();
                    } else {
                        Passport.downSelectIndex();
                    }
                    Passport.setFocus();

                    return false;
                }
            },
            keyupProc: function (e) {
                this.currentSelectIndex = 0;
                var keyCode = e.keyCode;
                Passport.changeUsernameSelect();
                if (keyCode == 13) {
                    Passport.doSelect();
                }
                var isSafari;
                if ((isSafari = navigator.userAgent.indexOf("Safari")) > 0) {
                    if (keyCode == 38 || keyCode == 40) {
                        Passport.preventEvent(e);
                        Passport.clearFocus();
                        if (keyCode == 38) {
                            Passport.upSelectIndex();
                        } else {
                            Passport.downSelectIndex();
                        }
                        Passport.setFocus();
                    }
                }
                return false;
            },
            keypressProc: function (e) {
                this.currentSelectIndex = 0;
                var keyCode = e.keyCode;
                if (keyCode == 13) {
                    Passport.preventEvent(e);
                } else {
                    if (keyCode == 38 || keyCode == 40) {
                        Passport.preventEvent(e);
                        Passport.clearFocus();
                        if (keyCode == 38) {
                            Passport.upSelectIndex();
                        } else {
                            Passport.downSelectIndex();
                        }
                        Passport.setFocus();
                    } else {
                        if (keyCode == 108 || keyCode == 110 || keyCode == 111 || keyCode == 115) {
                            setTimeout(function () {
                                Passport.changeUsernameSelect();
                            }, 20);
                        }
                    }
                }
            },
            clearFocus: function (index) {
                var index = this.currentSelectIndex;
                try {
                    var x = this.findTdElement(index);
                    x.style.backgroundColor = "white";
                } catch (e) {
                }
            },
            findTdElement: function (index) {
                try {
                    var x = this.usernameListElement.firstChild.rows;
                    for (var i = 0; i < x.length; ++i) {
                        if (x[i].firstChild.idx == index) {
                            return x[i].firstChild;
                        }
                    }
                } catch (e) {
                }
                return false;
            },
            upSelectIndex: function () {
                var index = this.currentSelectIndex;
                if (this.usernameListElement.firstChild == null) {
                    return;
                }
                var x = this.usernameListElement.firstChild.rows;
                var i;
                for (i = 0; i < x.length; ++i) {
                    if (x[i].firstChild.idx == index) {
                        break;
                    }
                }
                if (i == 0) {
                    this.currentSelectIndex = (x.length - 1);
                } else {
                    this.currentSelectIndex = x[i - 1].firstChild.idx;
                }
            },
            downSelectIndex: function () {
                var index = this.currentSelectIndex;
                if (this.usernameListElement.firstChild == null) {
                    return;
                }
                var x = this.usernameListElement.firstChild.rows;
                var i = 0;
                for (; i < x.length; ++i) {
                    if (x[i].firstChild.idx == index) {
                        break;
                    }
                }
                if (i >= x.length - 1) {
                    this.currentSelectIndex = x[0].firstChild.idx;
                } else {
                    this.currentSelectIndex = x[i + 1].firstChild.idx;
                }
            },
            setFocus: function () {
                var index = this.currentSelectIndex;
                try {
                    var x = this.findTdElement(index);
                    x.style.backgroundColor = "#D5F1FF";
                } catch (e) {
                }
            },
            changeUsernameSelect: function () {
                var userInput = this.usernameInputElement.value;
                userInput = userInput.replaceAll("<", "");
                if (userInput.trim() == "") {
                    this.domainSelectElement.style.display = "none";
                    this.hasShow = false;
                } else {
                    var username = "", hostname = "";
                    var pos;
                    if ((pos = userInput.indexOf("@")) < 0) {
                        username = userInput;
                        hostname = "";
                    } else {
                        username = userInput.substr(0, pos);
                        hostname = userInput.substr(pos + 1, userInput.length);
                    }
                    var usernames = [];
                    if (hostname == "") {
                        for (var i = 0; i < this.domainArray.length; ++i) {
                            usernames.push(username + "@" + this.domainArray[i]);
                        }
                    } else {
                        for (var i = 0; i < this.domainArray.length; ++i) {
                            if (this.domainArray[i].indexOf(hostname) == 0) {
                                usernames.push(username + "@" + this.domainArray[i]);
                            }
                        }
                    }
                    if (usernames.length > 0) {
                        resizeFunc();

                        this.domainSelectElement.style.zIndex = "1010";
                        this.domainSelectElement.style.paddingRight = "0";
                        this.domainSelectElement.style.paddingLeft = "0";
                        this.domainSelectElement.style.paddingTop = "2px";
                        this.domainSelectElement.style.paddingBottom = "0";
                        this.domainSelectElement.style.backgroundColor = "white";
                        this.domainSelectElement.style.display = "block";
                        this.hasShow = true;
                        var myTable = document.createElement("TABLE");
                        myTable.cellSpacing = 0;
                        myTable.cellPadding = 3;
                        var tbody = document.createElement("TBODY");
                        myTable.appendChild(tbody);
                        for (var i = 0; i < usernames.length; ++i) {
                            var tr = document.createElement("TR");
                            var td = document.createElement("TD");
                            td.nowrap = "true";
                            td.align = "left";
                            td.innerHTML = usernames[i];
                            td.idx = i;
                            td.onmouseover = function () {
                                Passport.clearFocus();
                                Passport.currentSelectIndex = this.idx;
                                Passport.setFocus();
                                this.style.cursor = "hand";
                            };
                            td.onmouseout = function () {
                            };
                            td.onclick = function (e) {
                                Passport.doSelect();
                                Passport.preventEvent(e);
                                return false;

                            };
                            tr.appendChild(td);
                            tbody.appendChild(tr);
                        }
                        this.usernameListElement.innerHTML = "";
                        this.usernameListElement.appendChild(myTable);
                        //alert(myTable.getAttribute("width"));

                        //取提示的最大用户名长度。
                        var maxlength = 0;
                        for (var j = 0; j < usernames.length; ++j) {
                            if (usernames[j].length > maxlength)
                                maxlength = usernames[j].length;
                        }
                        //alert("maxlength is :" + maxlength);
                        maxlength = maxlength * 10;
                        if (maxlength < 185)
                            maxlength = 185;

                        myTable.style.width = maxlength + "px";
                        //alert("myTable.width is :" + myTable.style.width);
                        this.domainSelectElement.style.width = myTable.style.width;
                        this.setFocus();
                    } else {
                        this.domainSelectElement.style.display = "none";
                        this.hasShow = false;
                        this.currentSelectIndex = -1;
                    }

                    //修改div的宽度
                }
            },
            doSelect: function () {
                this.domainSelectElement.style.display = "none";
                this.hasShow = false;
                if (this.usernameInputElement.value.trim() == "") {
                    return;
                }
                var currentUsernameTd = this.findTdElement(this.currentSelectIndex);
                if (currentUsernameTd) {
                    this.usernameInputElement.value = currentUsernameTd.innerHTML;
                    this.usernameInputElement.value = this.usernameInputElement.value.replaceAll("<", "");
                }
            }
        };
        return Passport;
    };

    //隐藏.
    NTESCommonLogin.hide = function (e) {
        _loginBox = Util.getElemById(NTESCommonLogin._op.boxId);
        _tips = Util.getElemById("js_passportUserNameList");
        if (_loginBox) {
            if (e)
                for (var t = e.target || e.srcElement, n = _loginBox; t;) {
                    if (t == n || (_tips && t == _tips)) return;
                    t = t.parentNode
                }
            
            if (NTESCommonLogin._op.clickClose) {
                _loginBox && _loginBox.parentNode.removeChild(_loginBox);
                _tips && _tips.parentNode.removeChild(_tips);
            }
            NTESCommonLogin.hideMask();
        }
        if (navigator.userAgent.indexOf("MSIE") > 0) {
            document.detachEvent("onclick", NTESCommonLogin.hide);
        } else {
            document.removeEventListener("click", NTESCommonLogin.hide, false);
        }
    }

    //显示
    NTESCommonLogin.showMask = function (_op) {
        var _mask = Util.getElemById("common_popup_mask"),
                _maskFrame = Util.getElemById("common_popup_mask_frame");
        if (_op.mask) {
            var _mask = Util.getElemById("common_popup_mask"),
                _maskFrame = Util.getElemById("common_popup_mask_frame");
            if (!_mask && !_maskFrame) {
                _mask = document.createElement("div");
                _maskFrame = document.createElement("iframe");

                _mask.id = "common_popup_mask";
                _maskFrame.id = "common_popup_mask_frame";

                var _maskCss = "width: 100%;position: absolute;filter: alpha(opacity=16);opacity: .16;background: black;border: 0;left:0;top:0;height:" + document.body.scrollHeight + "px;";
                _mask.style.cssText = "z-index: 301;" + _maskCss;
                _maskFrame.style.cssText = "z-index: 300;" + _maskCss;

                _body.appendChild(_maskFrame);
                _body.appendChild(_mask);
            } else {
                _mask.style.display = "block";
                _maskFrame.style.display = "block";
            }
        }
    }

    NTESCommonLogin.hideMask = function () {
        var _mask = Util.getElemById("common_popup_mask"),
               _maskFrame = Util.getElemById("common_popup_mask_frame");

        _mask && _body.removeChild(_mask);
        _maskFrame && _body.removeChild(_maskFrame);
    }

    NTESCommonLogin.refresh = function (cb) {
        var pInfo = "",
            sInfo = "",
            olderPInfo = pInfo,
            userInfo = null,
            tmpPInfo = [],
            tmpSInfo = [],
            tmpUserMail = "",
            tmpUserState = 0;

        pInfo = String(Util.cookie.get("P_INFO"));
        sInfo = String(Util.cookie.get("S_INFO"));

        tmpPInfo = pInfo.split("|");
        tmpSInfo = sInfo.split("|");
        tmpUserMail = tmpPInfo[0] || "";

        userInfo = {
            userName: tmpUserMail.split("@")[0],
            userMail: tmpUserMail,
            userDomain: tmpUserMail ? tmpUserMail.split("@")[1] : "",
            userIp: String(Util.cookie.get("USERTRACK")),
            userLogin: !!tmpUserMail && (!!sInfo || (tmpPInfo[2] == 1)),
            userProduct: tmpPInfo[7] || ""
        };

        if (pInfo && sInfo && pInfo.split("|")[2] != "2") {
            olderPInfo = pInfo;
            if (NTESCommonLogin._op && NTESCommonLogin._op.clickClose) {
                var _loginBox = Util.getElemById(NTESCommonLogin._op.boxId);
                _loginBox && _loginBox.parentNode.removeChild(_loginBox);
                NTESCommonLogin.hideMask();
            }

            cb && cb(userInfo);
        }

        if (userInfo.userLogin && !sInfo) {
            NTESCommonLogin.ChangeCookie();
        }
        return userInfo;
    }

    /**
    * 提交登录 方法
    * @param Object data
    * {
    *     username : Ｓtring,//用户名
    *     password : String,//密码
    *     type: 1/0,//0表示password经过md5加密，对用户密码做MD5前需要对密码中的'和\做转换，其前再加上一个\字符。1表示password为明文
    *     product : String,//产品标识
    *     savelogin : 1/0,//是否保留用户登录信息，设置cookie:NTES_PASSPORT。1保留，0不保留
    * }
    * @method login
    */
    NTESCommonLogin.login = function(data,callback){
        try { document.domain = "163.com"; } catch (err) { }
        //验证通过后重定向到的URL
        LoginUtil.successAction = 'http://www.163.com/special/0077450P/login_frame.html';
        //验证失败后重定向到的URL
        LoginUtil.failedAction = 'http://www.163.com/special/0077450P/login_frame.html';
        //校验Cookie的方法实现
        LoginUtil.success.userProduct = function (data) {
            callback && callback(NTESCommonLogin.refresh());
        };
        LoginUtil.failed.userProduct = function (data) {
            callback && callback(data);
        };

        LoginUtil.commit(data);
    }

    NTESCommonLogin.Login = function (cb, op) {
        try { document.domain = "163.com"; } catch (err) { }

        var refresh = NTESCommonLogin.refresh;

        var _template = Util.getElemById("common_login_template");
        var Passport = NTESCommonLogin.Suggestion();
        
        _body = document.body;

        var _op = {
            template: '<div class="ntes-loginframe clearfix"><div class="ntes-loginframe-blank clearfix"><span class="ntes-loginframe-tips" id="component_ntes_loginframe_tips">网易邮箱/通行证用户可直接登录</span><br><label class="ntes-loginframe-label clearfix"><span class="loginframe-hidden">账号：</span><input type="text" id="component_js_loginframe_username" class="ntes-loginframe-label-ipt" placeholder="网易通行证/登录邮箱"></label></div><div class="ntes-loginframe-blank clearfix"><label class="ntes-loginframe-label clearfix"><span class="loginframe-hidden">密码：</span><input type="password" class="ntes-loginframe-label-ipt" placeholder="请输入密码"></label><span class="ntes-loginframe-label mt6 mb12 clearfix"><label class="c-fl"><input type="checkbox" name="autologin" class="ntes-loginframe-checkbox"><span class="c-fl">十天内免登录</span></label><a href="http://reg.163.com/RecoverPassword.shtml?f=www" class="c-fr">忘记密码？</a></span><button class="ntes-loginframe-btn" id="component_ntes_loginframe_btn">登　录</button></div></div>',
            mask: true,
            templateBoxId : "",
            center: true,
            boxId: 'component_js_N_login_wrap',
            clickClose: true,
            openSuggestion : true,
            display:"block"
        }

        _template && _template.innerHTML && (_op.template = _template.innerHTML);

        for (var _k in op) {
            _op[_k] = op[_k];
        }

        this._op = _op;

        var _loginBox = Util.getElemById(_op.boxId),
            _xy = { x: 0, y: 0 };

        if (!_loginBox) {
            _loginBox = document.createElement("div");
            _loginBox.id = _op.boxId;
            _loginBox.className = "ntes-nav-loginframe-pop";

            _loginBox.innerHTML = _op.template;
            _loginBox.style.display = _op.display;
            _loginBox.style.position = "absolute";
            _loginBox.style.zIndex = "302";

            _body.appendChild(_loginBox);
        } else {
            if (_loginBox.style.display == "none") {
                _loginBox.style.display = "block";
                this.showMask(_op);
                return;
            } else if (_loginBox.style.display == "block") {
                return;
            }
        }

        if (_op.obj) {
            if (typeof _op.obj == "string") {
                _op.obj = Util.getElemById(_op.obj);
                if (_op.obj) {
                    _xy = Util.getXY(_op.obj);
                }
            }

            if (_op.obj && _op.obj.nodeType == 1) {
                _xy = Util.getXY(_op.obj);
            }


            if (_op.left) {
                _xy.x += _op.left;
            }

            if (_op.top) {
                _xy.y += _op.top;
            }

            _loginBox.style.left = _xy.x + "px"
            _loginBox.style.top = _xy.y + "px";
        } else if (_op.center) {
            _loginBox.style.left = "50%";

            _loginBox.style.marginLeft = (-_loginBox.offsetWidth / 2) + "px";

            _loginBox.style.top = (_body.scrollTop || document.documentElement.scrollTop) 
                + (document.documentElement.clientHeight || document.body.clientHeight || window.innerHeight) / 2 
                - _loginBox.offsetHeight / 2 + "px";
        }


        this.showMask(_op);

        //验证通过后重定向到的URL
        LoginUtil.successAction = 'http://www.163.com/special/0077450P/login_frame.html';
        //验证失败后重定向到的URL
        LoginUtil.failedAction = 'http://www.163.com/special/0077450P/login_frame.html';
        //校验Cookie的方法实现
        LoginUtil.success.userProduct = function (data) {
            userProduct.loginSuccess(data);
        };
        LoginUtil.failed.userProduct = function (data) {
            userProduct.loginFailed(data);
        };

        var userProduct = {
            logined: false,
            mailReg: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/i,
            trimReg: /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
            formEl: Util.getElemById(_op.boxId),
            fieldEl: Util.getElemById(_op.boxId).getElementsByTagName("input"),
            submitEl: Util.getElemById('component_ntes_loginframe_btn') || Util.getElemById('ntes_loginframe_btn'),
            tipEl: Util.getElemById('component_ntes_loginframe_tips'),
            nameTmp: '',
            passTmp: '',
            passportLoaded: false
        };
        userProduct.nameField = userProduct.fieldEl[0];
        userProduct.passField = userProduct.fieldEl[1];
        userProduct.saveField = userProduct.fieldEl[2];
        userProduct.tipText = userProduct.tipEl && userProduct.tipEl.innerHTML || "";
        userProduct.passField.type = 'password';
        if(_op.display != "none")userProduct.nameField.focus();
        //使用账号自动补全
        if(_op.openSuggestion)
            Passport.bind(userProduct.nameField,_op);

        userProduct.filter = {
            "163.com": {
                "read": 1,
                "name": "163",
                "url": "http://entry.mail.163.com/coremail/fcg/ntesdoor2?verifycookie=1&lightweight=1"
            },
            "126.com": {
                "read": 1,
                "name": "126",
                "url": "http://entry.mail.126.com/cgi/ntesdoor?verifycookie=1&lightweight=1&style=-1"
            },
            "yeah.net": {
                "read": 1,
                "name": "yeah",
                "url": "http://entry.yeah.net/cgi/ntesdoor?verifycookie=1&lightweight=1&style=-1"
            },
            "188.com": {
                "read": 0,
                "name": "188",
                "url": "http://reg.mail.188.com/servlet/enter"
            },
            "vip.126.com": {
                "read": 0,
                "name": "vip",
                "url": "http://reg.vip.126.com/enterMail.m"
            },
            "vip.163.com": {
                "read": 0,
                "name": "vip",
                "url": "http://reg.vip.163.com/enterMail.m?enterVip=true-----------"
            }
        };
        userProduct.trim = function (text) {
            return text ? (text + '').replace(userProduct.trimReg, '') : '';
        };
        userProduct.verifyFields = function (name, pass) {
            var nf = userProduct.nameField, pf = userProduct.passField;
            if (name.length == 0) {
                userProduct.addClass(nf.parentNode, 'tips-error');
                this.loginFailed();
                nf.focus();
                return false;
            } else if (pass.length == 0) {
                userProduct.addClass(pf.parentNode, 'tips-error')
                pf.focus();
                this.loginFailed();
                return false;
            }
            return true;
        };
        userProduct.submit = function () {
            var data, name = userProduct.trim(userProduct.nameField.value), pass = userProduct.trim(userProduct.passField.value), save = userProduct.saveField.checked ? 1 : 0;
            userProduct.nameTmp = name;
            userProduct.passTmp = pass;
            if (!userProduct.verifyFields(name, pass)) {
                return;
            }
            data = {
                username: name,
                password: pass,
                savelogin: save,
                product: '163',
                type: 1
            };

            LoginUtil.commit(data);
        };
        userProduct.loginSuccess = function (data) {
            userProduct.logined = true;
            refresh(cb);
        };
        userProduct.loginFailed = function (data) {
            userProduct.logined = false;

            if (!data) {
                return;
            }

            if (data.errorMsg) {
                userProduct.showError(data.errorMsg);
                return;
            }
            
            switch (parseInt(data.errorType)) {
                case 420:
                    setTimeout(function () {
                        userProduct.nameField.focus();
                    }, 1000);
                    break;
                case 460:
                    setTimeout(function () {
                        userProduct.passField.focus();
                    }, 1000);
                    break;
                default:
                    refresh(true);
                    break;
            }
        };
        userProduct.showError = function (msg) {
            Util.getElemById('component_ntes_loginframe_tips').innerHTML = msg;
            _loginBox.className += " ue-animation ue-shake";
            setTimeout(function(){
                _loginBox.className = _loginBox.className.replace(/ ue-animation ue-shake/, "");
            }, 2000);
        };
        userProduct.hasClass = function (el, name) {
            var cls = '*' + el.className.replace(/\s+/ig, '*') + '*';
            return (cls.indexOf('*' + name + '*') != -1);
        };
        userProduct.addClass = function (el, name) {
            if (userProduct.hasClass(el, name)) {
                return;
            }
            var cls = el.className + ' ' + name;
            el.className = userProduct.trim(cls);
        };
        userProduct.removeClass = function (el, name) {
            if (!userProduct.hasClass(el, name)) {
                return;
            }
            var cls = '*' + el.className.replace(/\s+/ig, '*') + '*';
            cls = cls.replace((new RegExp('\\*' + name + '\\*', 'ig')), ' ').replace(/\*/ig, ' ');
            el.className = userProduct.trim(cls);
        };

        userProduct.submitEl && (userProduct.submitEl.onclick = userProduct.submit);

        function userProductformElonkeydown(e) {
            if (e.keyCode == 13 && !LoginUtil.verifyCookie()) {
                if (Passport.hasShow) {

                    setTimeout(function () {
                        userProduct.passField.focus();
                    }, 250);
                    return;
                }
                userProduct.submit();
            }
        }

        function userProductfieldElonkeyup() {
            var name = userProduct.trim(userProduct.nameField.value), pass = userProduct.trim(userProduct.passField.value);
            if ((userProduct.nameTmp != name) || (userProduct.passTmp != pass)) {
                userProduct.removeClass(this.parentNode, 'tips-error');
                userProduct.showError(userProduct.tipText);
            }
        };

        try {
            userProduct.formEl.addEventListener("keydown", userProductformElonkeydown, false);
            userProduct.fieldEl.addEventListener("keyup", userProductfieldElonkeyup, false);
        } catch (e) {
            try {
                userProduct.formEl.attachEvent("onkeydown", userProductformElonkeydown);
                userProduct.fieldEl.attachEvent("onkeyup", userProductfieldElonkeyup);
            } catch (e) {
            }
        }
        
        setTimeout(function(){
            if (navigator.userAgent.indexOf("MSIE") > 0) {
                document.attachEvent("onclick", NTESCommonLogin.hide);
            } else {
                document.addEventListener("click", NTESCommonLogin.hide, false);
            }
        },500);
        
        return {
            userInfo: refresh(),
            refresh: refresh
        }
    };

})(window);
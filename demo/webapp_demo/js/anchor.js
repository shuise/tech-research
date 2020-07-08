function getOSVersion() {
    var tempVersion = 10;
    var ua = navigator.userAgent, app = navigator.appVersion;
    var b = {
        android: ua.indexOf('Android') > -1 || ua.indexOf('Linux') > -1,
        iPhone: ua.indexOf('iPhone') > -1 || ua.indexOf('Mac') > -1,
        iPad: ua.indexOf('iPad') > -1,
        webKit: ua.indexOf('AppleWebKit') > -1,
        gecko: ua.indexOf('Gecko') > -1 && ua.indexOf('KHTML') == -1, //火狐内核
        webApp: ua.indexOf('Safari') == -1
    };
    if (b.android) {
        if ((temp = /Android ([1-9]\.\d[\.\d]*);/gi.exec(ua)) != null) {
            tempVersion = temp[1];
        }
        if (tempVersion.indexOf(".") != -1) {
            tempVersion = tempVersion.substring(0, tempVersion.indexOf("."));
        }
    } else if (b.iPhone || b.iPad) {
        if ((temp = /OS ([3-9]_\d[_\d]*) like Mac OS X/gi.exec(ua)) != null) {
            tempVersion = temp[1].replace("_", ".");
        }
    }
    return { browser: b, version: tempVersion };
}

function Anchor() {
    return (this instanceof Anchor) ? this.Init() : new Anchor();
}
Anchor.prototype.Init = function () {
    this.currNode = null;
    this.top = document.body.scrollTop || document.documentElement.scrollTop;
    this.height = this.getWinHeigth();
    this.isTouch = 'ontouchstart' in window;
    this.isBindEvent = false;
    this.EventArray = new Array();
}
Anchor.prototype.addEventListener = function (fn) {
    this.EventArray.push(fn);
}
Anchor.prototype.bind = function () {
    var self = this;
    var touchStartEvent = this.isTouch ? 'touchstart' : 'mousedown';
    var touchEndEvent = this.isTouch ? 'touchend' : 'mouseup';
    window.onscroll = function () {
        var top = document.body.scrollTop || document.documentElement.scrollTop;
        if (top > self.height) {
            if (self.currNode == null) {
                self.currNode = self.createTopElement();
            }

            var os = getOSVersion();
            if ((os.browser.iPhone || os.browser.iPad) && os.version < 6.0) {
                self.setPosition(self.currNode);
            } else if (os.browser.android && os.version < 4.0) {
                self.setPosition(self.currNode);
            }

            if (!self.isBindEvent) {
                self.currNode.onclick = function () {
                    var top = document.body.scrollTop || document.documentElement.scrollTop;
                    self.scrollAnimate(top, 0);
                }
                self.currNode.onmousedown = function () {
                    self.addClass(self.currNode, "m_r_top_touch");
                }
                for (var i = 0; i < self.EventArray.length; i++) {
                    self.addEvent(self.currNode, "click", self.EventArray[i], false);
                }
                self.isBindEvent = true;
            }
        } else {
            self.removeTopElement(self.currNode);
            self.currNode = null;
            self.isBindEvent = false;
        }
    }
}

//元素定位
Anchor.prototype.setPosition = function (currNode) {
    var top = document.body.scrollTop || document.documentElement.scrollTop;
    currNode.style.position = "absolute";
    var nodeBottom = parseInt(this.attrStyle(currNode, "bottom"));
    var currNodeTop = this.getWinHeigth() - nodeBottom;
    var os = getOSVersion();
    if (os.browser.webApp) {
        currNodeTop -= currNode.offsetHeight;
    } else if (os.browser.gecko) {
        currNodeTop += 60;
    }
    currNode.style.top = currNodeTop + top + "px";
}
Anchor.prototype.attrStyle = function (elem, attr) {
    if (!elem) { return; }
    if (elem.style[attr]) {
        return elem.style[attr];
    } else if (elem.currentStyle) {
        return elem.currentStyle[attr];
    } else if (document.defaultView && document.defaultView.getComputedStyle) {
        attr = attr.replace(/([A-Z])/g, '-$1').toLowerCase();
        return document.defaultView.getComputedStyle(elem, null).getPropertyValue(attr);
    } else {
        return null;
    }
}
Anchor.prototype.scrollAnimate = function (fromY, toY) {
    var begin = +new Date();
    var from = fromY;
    var to = toY;
    var duration = 500;
    var easing = function (time, duration) {
        return -(time /= duration) * (time - 2);
    };
    var timer = setInterval(function () {
        var time = new Date() - begin;
        var pos, now;
        if (time > duration) {
            clearInterval(timer);
            now = to;
        }
        else {
            pos = easing(time, duration);
            now = pos * (to - from) + from;
        }
        if (document.body.scrollTop) {
            document.body.scrollTop = now;
        } else {
            document.documentElement.scrollTop = now;
        }
    }, 10);
}
Anchor.prototype.createTopElement = function () {
    var top = document.createElement("a");
    top.id = "returnTop";
    top.href = "javascript:void(0);";
    top.className = "m_r_top";
    var div = document.createElement("div");
    var span = document.createElement("span");
    var b = document.createElement("b");
    top.appendChild(div);
    top.appendChild(span);
    top.appendChild(b);
    document.body.appendChild(top);
    return top;
}
Anchor.prototype.removeTopElement = function (elem) {
    if (elem != null)
        elem.parentNode.removeChild(elem);
}
Anchor.prototype.hasClass = function (element, className) {
    var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
    return element.className.match(reg);
}
Anchor.prototype.addClass = function (element, className) {
    if (!this.hasClass(element, className)) {
        element.className += " " + className;
    }
}
Anchor.prototype.removeClass = function (element, className) {
    if (this.hasClass(element, className)) {
        var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
        element.className = element.className.replace(reg, ' ');
    }
}
Anchor.prototype.getWinHeigth = function () {
    var winH = 0;
    if (window.innerHeight) {
        winH = Math.min(window.innerHeight, document.documentElement.clientHeight);
    } else if (document.documentElement && document.documentElement.clientHeight) {
        winH = document.documentElement.clientHeight;
    } else if (document.body) {
        winH = document.body.clientHeight;
    }
    return winH;
}
Anchor.prototype.addEvent = function (elm, type, fn, useCapture) {
    if (!elm) return;
    if (elm.addEventListener) {
        elm.addEventListener(type, fn, useCapture);
        return true;
    } else if (elm.attachEvent) {
        var r = elm.attachEvent('on' + type, fn);
        return r;
    } else {
        elm['on' + type] = fn;
    }
}
var anchor = Anchor();
anchor.addEvent(window, "load", function () { anchor.bind(); }, false);
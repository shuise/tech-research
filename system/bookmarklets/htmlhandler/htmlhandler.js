(function () {
    var DOM = document
        , head = DOM.head || DOM.getElementsByTagName('head')[0]
        , body = DOM.body || DOM.getElementsByTagName('body')[0]
        , ne = DOM.createElement('script')
        , clipScript = DOM.createElement('script')
        , style = DOM.createElement('link')
        , n = 3
        , panelEl = DOM.createElement('div')
        , moduleEl = DOM.createElement('div')
        , container = DOM.createElement('div')
        , selectAreaElement = DOM.createElement('div')
        , tempEl = null
        , styleMap = {}
        , getComputedStyle = window.getComputedStyle
        , href = location.href
        , comment = DOM.createComment(href)
        , DEV_URI = 'http://dev.f2e.163.com/'
        , PUBLISH_URI = 'http://qa.developer.163.com/';

    styleMap = {
        'background': '',
        'borderTop': '',
        'borderRight': '',
        'borderBottom': '',
        'borderLeft': '',
        'borderRadius': '0px',
        'borderCollapse': 'separate',
        'borderImage': 'none',
        'boxShadow': 'none',
        'boxSizing': 'content-box',
        'bottom': 'auto',
        'clear': 'none',
        'color': '',
        'cursor': 'auto',
        'display': '',
        'filter': 'none',
        'float': 'none',
        'fontStyle': 'normal',
        'fontFamily': '',
        'fontVariant': 'normal',
        'fontSize': 'normal',
        'fontWeight': 'normal',
        'height': 'auto',
        'lineHeight': 'normal',
        'letterSpacing': 'normal',
        'left': 'auto',
        'listStyle': 'disc outside none',
        'margin': '0px 0px',
        'outline': '',
        'overflow': 'visible',
        'opacity': '1',
        'padding': '0px',
        'position': 'static',
        'resize': 'none',
        'right': 'auto',
        'textAlign': 'start',
        'textShadow': 'none',
        'top': 'auto',
        'transition': 'all 0s ease 0s',
        'text-indent': '',
        'verticalAlign': 'baseline',
        'visibility': 'visible',
        'width': 'auto',
        'whiteSpace': 'normal',
        'wordBreak': 'normal',
        'wordSpacing': '0px',
        'wordWrap': 'normal',
        'zIndex': 'auto',
        'zoom': '1'
    };

    selectAreaElement.id = 'NEHTMLHandler_select';

    container.id = 'NEHTMLHandler';
    body.appendChild(container);
    body.style.position = 'relative';

    panelEl.className = 'panel';
    panelEl.innerHTML = '<ol>' +
        '<li>' +
        '<a href="#" class="btn select" data-dis="1">抓取</a>' +
        '</li>' +
        '<li>' +
        '<a href="#" class="btn pause" data-dis="1">暂停</a>' +
        '</li>' +
        '<li>' +
        '<a href="mailto:f2e_product@corp.netease.com" class="btn" data-dis="1" target="_top">反馈</a>' +
        '</li>' +
        '<li>' +
        '<a href="#" class="btn close" data-dis="1">退出</a>' +
        '</li>' +
        '</ol>';

    moduleEl.className = 'module_bg';
    moduleEl.innerHTML = '<div class="module">' +
        '<div class="module_body"></div>' +
        '<div class="module_foot">' +
        '<a href="#" class="btn btn_back">后退</a>' +
        '<a href="#" class="btn btn_get_parent">抓取父元素</a> ' +
        '<a href="#" class="btn copy">复制</a>' +
        '<a href="#" class="btn module_close">关闭</a>' +
        '</div>' +
        '</div>';

    container.appendChild(moduleEl);
    container.appendChild(panelEl);

    ne.type = 'text/javascript';
    ne.src = PUBLISH_URI + 'system/bookmarklets/htmlhandler/ne.js';
    clipScript.type = 'text/javascript';
    clipScript.src = PUBLISH_URI + 'component/clipboard/clipboard.js';
    style.type = 'text/css';
    style.rel = 'stylesheet';
    style.href = PUBLISH_URI + 'system/bookmarklets/htmlhandler/htmlhandler.css?' + (+new Date());


    style.onload = style.onreadystatechange = staticLoad;
    ne.onload = ne.onreadystatechange = staticLoad;
    clipScript.onload = clipScript.onreadystatechange = staticLoad;

    head.insertBefore(ne, head.firstChild);
    head.insertBefore(style, head.firstChild);
    head.insertBefore(clipScript, head.firstChild);

    function staticLoad() {
        // 检查是否加载完成，适时触发回调函数
        if (!this.readyState ||
            this.readyState === 'loaded' ||
            this.readyState === 'complete') {
            this.onload = this.onreadystatechange = null;
            n--;
            if (!n) {
                progress(window.NE);
            }
        }
    }

    function progress($) {
        var NEHtmlHandler = function () {
                return new NEHtmlHandler.fn.init(arguments);
            }
            , Module = function () {
                // 弹窗处理
                return new Module.fn.init();
            }
            , that, self
            , isClipReady = false
            , clip = new ZeroClipboard.Client()
            , targetElement, selectParent, targetElementArr = [], isSelecting = false
            , isSelectPause = true;

        NEHtmlHandler.fn = NEHtmlHandler.prototype = {
            constructor: NEHtmlHandler,

            init: function () {
                // 添加浮动框
                // 注册事件
                // module的触发和关闭事件
                // 拷贝代码事件
                // select 事件

                this.module = new Module();
                that = this;

                targetElement = null;
                isSelectPause = true;
                this.selectTimer = '';

                body.appendChild(selectAreaElement);

                this.selectAreaElement = $(selectAreaElement);
                this.btnSelect = $('.select', container);
                this.btnPause = $('.pause', container);
                this.btnClose = $('.close', container);

                this.btnSelect.bind('click', this.select);
                this.btnPause.bind('click', this.pause);
                this.btnClose.bind('click', this.close);
                this.selectAreaElement.bind('mousedown', function (e) {
                    that.module.show(function (moduleBody) {
                        this.format(e, moduleBody);
                        setTimeout(function () {
                            NEHtmlHandler.pause();
                            clip.reposition();
                        }, 200);
                    }, that);
                });

                $(body).bind('mouseover', selectHandler);

                that.pause = this.pause;

                return this;
            },
            close: function (e) {
                // 关闭插件, 移除事件注册
                // select事件(绑定在公共元素上的事件同理)

                ( e && e.preventDefault() );

                body.removeChild(container);
                body.removeChild(selectAreaElement);
                head.removeChild(ne);
                head.removeChild(style);
                head.removeChild(clipScript);

                $(body).unbind('mouseover', selectHandler);

                container = null;
                ne = null;
                style = null;
                clipScript = null;
                clip.destroy();

                delete NEHTMLHandler;
                ( window.NEHTMLHandlerScript && body.removeChild(window.NEHTMLHandlerScript) );
                delete window.NEHTMLHandlerScript;

                return undefined;
            },
            reset: function () {
                // 初始化缓存对象
                // 待定
            },
            select: function (e) {
                // 获取元素
                e.preventDefault();
                isSelectPause = false;
                selectAreaElement.style.display = 'block';
            },
            pause: function (e) {
                // 暂停选择
                // 无需解绑事件
                e && e.preventDefault();
                isSelectPause = true;
                selectAreaElement.style.display = 'none';
            },
            format: function (e, moduleBody) {
                // 处理样式
                e.preventDefault();
                var el;
                if (!targetElement) {
                    return undefined;
                } else {
                    el = targetElement[0];
                }

                tempEl = formatHandler(el);
                tempEl.className = 'clearfix';
                moduleBody.appendChild(tempEl);
                return el;
            }
        };
        NEHtmlHandler.pause = NEHtmlHandler.fn.pause;

        function getChildren(el) {
            var children = el.childNodes;
            if (children && children.length) {
                return children;
            } else {
                return undefined;
            }
        }

        function selectHandler(e) {
            var el = e.target;
            if (!isSelectPause && el.nodeName.toLowerCase() !== 'body') {
                if (targetElement
                    && targetElement[0] !== el
                    && that.selectTimer) {
                    that.selectAreaElement.hide();
                    clearTimeout(that.selectTimer);
                    that.selectTimer = null;
                }
                that.selectTimer = setTimeout(function () {
                    e.preventDefault();
                    if (isSelectPause) {
                        return;
                    }
                    var left, top, width, height;
                    if (el.getAttribute('data-dis') === '1') {
                        return;
                    }
                    left = el.getBoundingClientRect().left + body.scrollLeft;
                    top = el.getBoundingClientRect().top + body.scrollTop;
                    width = Math.max(el.offsetWidth, el.clientWidth);
                    height = Math.max(el.offsetHeight, el.clientHeight);
                    that.selectAreaElement.css({
                        top: top,
                        left: left,
                        width: width,
                        height: height
                    });
                    that.selectAreaElement.show();
                    targetElement = $(el);
                }, 200);
            }
        }

        function getStyle(temp, el) {
            var sourceStyle = getComputedStyle(el)
                , style
                , defaultStyle
                , key;
            for (key in styleMap) {
                defaultStyle = styleMap[key];
                style = sourceStyle[key];
                if (style !== defaultStyle) {
                    temp.style[key] = style;
                }
            }
        }

        function elementMerge(el, temp) {
            var types = ['className', 'classList',
                    'id', 'href', 'baseURI',
                    'value', 'src', 'placeholder']
                , type = '' , i = 0, il = types.length;
            temp.attributes = el.attributes;
            temp.style = el.style;
            for (; i < il; i++) {
                type = types[i];
                if (el[type]) {
                    temp[type] = el[type];
                }
            }
        }

        function formatHandler(el, isPush) {
            if (isSelecting) {
                return undefined;
            } else {
                isSelecting = true;
            }
            var parent = DOM.createElement('div');
            try {
                htmlFormator(el, parent);
            } catch (e) {
                alert('哪里不对劲了, 再试试?');
            }
            if (el && el.parentNode && el.parentNode.nodeName.toLowerCase() !== 'body') {
                if (!isPush) {
                    targetElementArr.push(el);
                }
                selectParent = el.parentNode;
            } else {
                selectParent = el;
            }
            setTimeout(function () {
                isSelecting = false;
                clip.reposition();
            }, 300);
            return parent;
        }

        function htmlFormator(el, parent) {
            var children = getChildren(el)
                , i = 0, il = ( children && children.length )
                , nodeName = el.nodeName
                , nodeType = el.nodeType
                , temp = '';

            if (nodeName.toLowerCase() === '#text') {
                temp = DOM.createTextNode(el.nodeValue);
                parent.appendChild(temp);
            } else if (nodeType === 1 || nodeType === 9) {
                temp = DOM.createElement(nodeName);
                getStyle(temp, el);
                parent.appendChild(temp);
                elementMerge(el, temp);
                if (il) {
                    for (; i < il; i++) {
                        htmlFormator(children[i], temp);
                    }
                }
            }
        }

        function toClipboard(btn, node) {
            clip.setHandCursor(true);
            clip.addEventListener('complete', function () {
                alert('复制成功');
            });
            clip.addEventListener('error', function () {
                alert('无法复制, 请再试试?');
            });
            clip.addEventListener('mouseDown', function () {
                clip.setText(node.innerHTML);
            });
            clip.glue(btn, undefined, {
                'position': 'fixed',
                'zIndex': '9999'
            });
        }


        Module.fn = Module.prototype = {
            constructor: Module,
            bgEl: $(moduleEl),
            moduleEl: $('.module', moduleEl),
            moduleHead: $('.module_head h2', moduleEl),
            moduleClose: $('.module_close', moduleEl),
            moduleParent: $('.btn_get_parent', moduleEl),
            moduleBack: $('.btn_back', moduleEl),
            moduleCopy: $('.copy', moduleEl),
            moduleBody: $('.module_body', moduleEl),
            init: function () {
                // 初始化函数, 返回Module对象
                self = this;
                this.moduleClose.bind('click', function (e) {
                    e.preventDefault();
                    self.close();
                });

                this.moduleParent.bind('click', function (e) {
                    e.preventDefault();
                    tempEl = formatHandler(selectParent);
                    if (tempEl) {
                        tempEl.className = 'clearfix';
                        var moduleBody = self.moduleBody[0];
                        moduleBody.innerHTML = '';
                        moduleBody.appendChild(comment);
                        moduleBody.appendChild(tempEl);
                    }
                });

                this.moduleBack.bind('click', function (e) {
                    e.preventDefault();
                    var el = targetElementArr.pop();
                    if (!targetElementArr.length && el.parentNode) {
                        targetElementArr.push(el);
                        selectParent = el.parentNode;
                    }
                    if (el) {
                        tempEl = formatHandler(el, true);
                        if (tempEl) {
                            tempEl.className = 'clearfix';
                            var moduleBody = self.moduleBody[0];
                            moduleBody.innerHTML = '';
                            moduleBody.appendChild(comment);
                            moduleBody.appendChild(tempEl);
                        }
                    }
                });

                self.reset = this.reset;

                return this;
            },
            show: function (callback, context) {
                // 显示
                // 回调处理
                var self = this;
                context = context || this;
                self.bgEl.addClass('active');
                self.moduleBody[0].appendChild(comment);
                if (!isClipReady) {
                    toClipboard(self.moduleCopy[0], self.moduleBody[0]);
                    isClipReady = true;
                }
                setTimeout(function () {
                    self.moduleEl.addClass('active');
                    if (typeof callback === 'function') {
                        callback.call(context, self.moduleBody[0]);
                    }
                }, 100);
                return this;
            },
            close: function (context) {
                // 关闭module
                // 回调处理, 清空内容
                var self = this;
                context = context || this;
                self.moduleEl.removeClass('active');
                setTimeout(function () {
                    self.bgEl.removeClass('active');
                    if (typeof callback === 'function') {
                        callback.call(context, this);
                    }
                    self.reset();
                }, 200);
            },
            reset: function () {
                // 初始化module, 用于关闭后的处理, 可自行调用
                // 待定
                this.moduleBody[0].innerHTML = '';
            }
        };

        Module.fn.init.prototype = Module.fn;
        NEHtmlHandler.fn.init.prototype = NEHtmlHandler.fn;

        window.NEHTMLHandler = new NEHtmlHandler();
    }

}());

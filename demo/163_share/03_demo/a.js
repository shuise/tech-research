(function($) {
    $.tools = $.tools || {
        version: "1.0"
    };
    $.tools.suggest = {};
    $.tools.suggest.defaults = {
        url: null,
        params: null,
        delay: 100,
        cache: true,
        formId: "#search_form",
        focus: null
    };
    $.tools.suggest.borderKey = {
        UP: 38,
        DOWN: 40,
        TAB: 9,
        ESC: 27,
        ENTER: 13
    };
    $.fn.suggest = function(options, fn) {
        var options,
        key = $.tools.suggest.borderKey;
        if ($.isFunction(options)) {
            fn = options;
            options = $.extend({},
            $.tools.suggest.defaults, key)
        } else {
            options = $.extend({},
            $.tools.suggest.defaults, key, options)
        }
        return this.each(function() {
            var self = $(this),
            url = options.url,
            params = options.params,
            searchUrl = null,
            searchtimer = 0,
            delay = options.delay,
            cache = options.cache,
            formobj = $(options.formId),
            focus = options.focus,
            rebox = $("<ul/>").attr("id", "sele_div"),
            htmlLi = null,
            litop = null,
            lileft = null,
            liwth = null,
            tip = false,
            val = null,
            rlen = null,
            UP = options.UP,
            DOWN = options.DOWN,
            TAB = options.TAB,
            ESC = options.ESC,
            ENTER = options.ENTER,
            index = -1,
            choseKey = null,
            backval = null,
            hidden = false,
            locksuggest = false,
            timer = null;
            if (focus) {
                self.trigger("focus")
            }
            self.bind("focus", 
            function() {
                backval = (backval = $.trim(self.val())) == "" ? null: backval;
                getQueue()
            }).bind("blur", 
            function() {
                clearQueue();
                hideResult()
            }).bind("keydown", 
            function(e) {
                switch (e.keyCode) {
                case UP:
                    clearQueue();
                    if ($("#sele_div").css("display") == "none") {
                        reSet();
                        return false
                    }
                    index--;
                    if (index < 0) {
                        index = Math.abs(rlen) - 1
                    }
                    changeSelect(index);
                    e.preventDefault();
                    break;
                case DOWN:
                    clearQueue();
                    if ($("#sele_div").css("display") == "none") {
                        reSet();
                        return false
                    }
                    index++;
                    if (index >= rlen) {
                        index = 0
                    }
                    changeSelect(index);
                    e.preventDefault();
                    break;
                case TAB:
                    clearQueue();
                    hideResult();
                    break;
                case ESC:
                    clearQueue();
                    hideResult();
                    e.preventDefault();
                    break;
                case ENTER:
                    clearQueue();
                    break;
                default:
                    getQueue();
                    break
                }
            });
            function getKey() {
                val = $.trim(self.val());
                if ( !! val && val != backval) {
                    backval = val;
                    if (cache && !!$.tools.suggest[val]) {
                        index = -1;
                        rlen = $.tools.suggest[val][1];
                        appendSuggest($.tools.suggest[val][0])
                    } else {
                        $.tools.suggest[val] = ["", 0];
                        searchurl = url + "?" + $.param(params);
                        getResult(searchurl)
                    }
                }
                if ( !! !val && !hidden) {
                    hideResult()
                }
            }
            function getResult(searchurl) {  //ajax请求核心
                $.ajax({
                    type: "GET",
                    url: searchurl,
                    cache: true,     //
                    dataType: "jsonp",
                    jsonpCallback: "$.fn.suggest.suggetCallback"
                })
            }
            function appendSuggest(result) {
                locksuggest = hidden = false;
                if ( !! result) {
                    if (!tip) {
                        litop = self.offset().top + self.outerHeight() - 2;
                        lileft = self.offset().left + 3.5;
                        liwth = self.outerWidth() + 1;
                        rebox.css({
                            position: "absolute",
                            top: litop,
                            left: lileft
                        }).html(result).appendTo("body").show();
                        tip = true
                    } else {
                        rebox.html(result).show()
                    }
                    rebox.find("li").bind("mouseover", 
                    function() {
                        locksuggest = true;
                        index = $(this).index();
                        changeSelect(index, false)
                    }).bind("click", 
                    function() {
                        changeSelect(index);
                        searchSubmit()
                    });
                    rebox.bind("mouseout", 
                    function() {
                        locksuggest = false
                    })
                } else {
                    rebox.hide()
                }
            }
            $.fn.suggest.suggetCallback = function(tmp) {
                var data = tmp,
                htmltemp = "",
                htmllen = data.total,
                inputWord = data.kw;
                if (htmllen > 0) {
				//htmltemp +='<em></em>';
                    $.each(data.list, 
                    function(i, n) {
                        if (n.word != inputWord) {
                            htmltemp += '<li data-value="' + n.word + '">' + n.word + "</li>"
                        }
                    });
                    htmltemp = htmltemp.toLocaleLowerCase();
                    var regex = eval("/>" + inputWord + "/g");
                    htmltemp = htmltemp.replace(regex, "><b>" + inputWord + "</b>");
                    $.tools.suggest[inputWord] = [htmltemp, htmllen]
                }
                if (self.val() == inputWord) {
                    rlen = htmllen;
                    index = -1;
                    appendSuggest(htmltemp)
                }
            };
            function getQueue() {
                var n = $(document).queue("suggest");
                if (n.length < 1) {
                    $(document).queue("suggest", getQueue);
                    getKey();
                    timer = setTimeout((function() {
                        $(document).dequeue("suggest")
                    }), delay)
                }
            }
            function clearQueue() {
                $(document).clearQueue("suggest");
                clearTimeout(timer)
            }
            function changeSelect(index, v) {
                v = v == false ? false: true;
                var obj = rebox.find("li").eq(index);
                rebox.find("li.current").removeClass("current");
                obj.addClass("current");
                if (v) {
                    choseKey = backval = obj.attr("data-value");
                    self.val(choseKey)
                }
            }
            function reSet() {
                if ( !! self.val()) {
                    index = -1;
                    $("#sele_div").css("display", "block");
                    rebox.find("li.current").removeClass("current");
                    rlen = rebox.find("li").size()
                }
            }
            function hideResult() {
                if (!locksuggest) {
                    choseKey = backval = null;
                    hidden = true;
                    rebox.hide()
                }
            }
            function searchSubmit() {
                self.val(choseKey);
                clearQueue();
                hideResult();
                formobj.submit()
            }
        })
    }
})(jQuery);

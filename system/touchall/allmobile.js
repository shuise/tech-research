!function (t, e) {
  t._amVersion = {
    devices: { //需要适配的设备
      phone: 1
    },
    modules: {
      mobilizer: 1,
      preprocess: 1
    },
    files: {
      style: "style.min.css"
    }
  };
  var n = t.AMPlatform = t.AMPlatform || {
    id: "allmobilize",
    attr: "data-entry",
    page: "data-page",
    entry: 0,
    state: 0,
    m: [],
    p: {
      data: {},
      md: {},
      tpl: {}
    },
    __timing: []
  };
  (function (t, e) {
    function a(e) {
      var n = e.match(/ip(hone|od|ad)/i),
          a = (e.match(/android (\d)/i) || {})[1],
          r = {
            width: t.outerWidth,
            height: t.outerHeight
          };
      if (!n) {
        if (a > 3) return r;
        var i = t.devicePixelRatio || 1;
        return r.width = Math.round(r.width / i), r.height = Math.round(r.height / i), r
      }
      var o = t.orientation % 180;
      return o ? (r.height = t.screen.width, r.width = t.screen.height) : (r.width = t.screen.width, r.height = t.screen.height), r
    }
    function r(e) {
      var n = t.devicePixelRatio || 1;
      return {
        width: Math.round(e.width * n),
        height: Math.round(e.height * n)
      }
    }
    var i = function () {
      var n = !1,
          a = function (a) {
            var r = function () {
              return n ? void 0 : (n = !0, a())
            },
                i = function () {
                  if (!n) {
                    try {
                      e.documentElement.doScroll("left")
                    } catch (t) {
                      return void setTimeout(i, 1)
                    }
                    return r()
                  }
                };
            if ("complete" === e.readyState) return r();
            if (e.addEventListener) e.addEventListener("DOMContentLoaded", r, !1), t.addEventListener("load", r, !1);
            else if (e.attachEvent) {
              e.attachEvent("onreadystatechange", r), t.attachEvent("onload", r);
              var o = !1;
              try {
                o = null == t.frameElement
              } catch (l) {}
              if (e.documentElement.doScroll && o) return i()
            }
          };
      return a
    }(),
    s = n.config = n.config || {},
    c = s.options = t._amVersion || {};
    c.modules = s.options.modules || {}, c.modules.capture = 1, s.debug = c.debug;
    var h = n.srcElement = e.getElementById(n.id);
    if (n.runOnce = ++n.entry > 1 || h.getAttribute(n.attr), !(n.runOnce && (n.config && (c.keepz && n.$ && (t.Zepto = t.$ = n.$, delete n.$), i(function () {
      n.state = 1e3, n.event.fire(n.event.onMobilizedDocReady, {
        doc: e
      })
    }), o(function () {
      n.state = 1001, n.event.fire(n.event.onMobilizedWinLoad, {
        win: t
      }), l(t)
    })), n.state > 0))) {
      var p = s.ua = (t.navigator.userAgent || t.navigator.vendor || t.opera || "").toLowerCase();
      s.weixin = p.match(/micromessenger/), s.lang = (t.navigator.userLanguage || t.navigator.language || "en-US").split("-")[0], s.lang = "en" === s.lang || "zh" === s.lang ? s.lang : "en", s.screen = a(p), s.physicalSize = r(s.screen);
      s.srcUrl = "http://a.yunshipei.com/56642b1a3924a55682dcade27e8ddebd/";
      var u = s.srcUrl.lastIndexOf("/"),
          d = s.srcRoot = -1 !== u ? s.srcUrl.substring(0, u + 1) : "";
      if (s.srcRoot) try {
        s.siteId = d.substring(d.lastIndexOf("/", d.length - 2) + 1, d.length - 1)
      } catch (f) {
        s.siteId = ""
      }
      s.pageId = h ? h.getAttribute(n.page) : "";
    }
  })(t, e);
  (function (t, e) {
    if (!t.runOnce) {
      t.loader = {
        selector: ".allmobilize_loader",
        html: '<div class="allmobilize_loader" style="position:fixed;top:50%;left:50%;width:120px;height:120px;margin-top:-60px;margin-left:-60px;text-align:center;"><div id="allmobilize_spinner" style="position: relative; height: 50px;background:url(http://img1.cache.netease.com/f2e/finance/gegu/images/loading.gif) no-repeat center center"></div><p style="margin:10px 0;color:#666;font-size:1em;font-family:\'Microsoft YaHei\',\'微软雅黑\',Helvetica,Arial,sans-serif">页面加载中 ...</p></div>'
      }
    }
  })(n, n.config);
  (function (t, e, n, a, r) {
    if (!n.runOnce) {
      var i = '<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" class="allmobilize_loader" />' + r.html + '<plaintext style="display:none">',
          o = "allmobilize",
          l = "_" + o,
          s = "_allmobads=1",
          c = "phone",
          h = "tablet",
          p = "desktop",
          u = "http://s.yunshipei.com/at/m.min.js",
          d = function (e) {
            e = e.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var n = "[\\?&]" + e + "=([^&#]*)",
                a = new RegExp(n),
                r = a.exec(t.location.href);
            return null == r ? "" : decodeURIComponent(r[1].replace(/\+/g, " "))
          },
          f = function (t) {
            var e = t.lastIndexOf(l);
            return -1 != e ? t.substr(0, e - 1) : t
          },
          m = function (n) {
            n && (e.cookie = n), t.location = f(t.location.href)
          },
          g = d(l + "dev");
      if (g) return g != p && g != h && g != c && (g = c), void m(o + "=" + g + "; path=/;");
      var v = a.weixin = a.weixin || d("sukey"),
          y = d(l + "ads");
      if (y) return void m(s + "; path=/;");
      var b = function (t) {
        return /(yunshipei|allmobilize)\.(com|net)/.test(t) || /192\.168/.test(t) || /localhost/.test(t) || /ysp\.www\.gov\.cn/.test(t)
      },
          w = function (e) {
            if (e) {
              var n = t.location.hostname,
                  a = new RegExp(e, "i");
              return a.test(n) || b(n)
            }
            return !0
          },
          x = function (t) {
            return b(t)
          },
          _ = function (t) {
            var e = (new Date).getTime();
            return !t || parseInt(t) >= e
          },
          k = n.ls = !a.options.suspend && w(a.options.domains) && _(a.options.version) && x(a.srcRoot),
          E = {
            tablet: function (t) {
              return /ipad|GT-P7500/i.test(t) || /tablet/.test(t) && a.screen.width <= 1024 ? !0 : !1
            },
            phone: function (t) {
              return t ? /(bb\d+|meego).+mobile|ucweb|ucbrowser|mqqbrowser|360browser|micromessenger|avantgo|bada\/|blackberry|android|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(t) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/.test(t.substr(0, 4)) ? !0 : !1 : a.screen.width <= 720
            },
            desktop: function () {
              return !0
            }
          },
          C = function (t) {
            for (S in E) if (E.hasOwnProperty(S) && E[S](t)) return S;
            return ""
          },
          M = function (t) {
            return -1 != e.cookie.indexOf(o + "=" + t)
          },
          S = a.realDevice = C(a.ua);
      S = v && S == p ? c : S, S = t.name == l ? c : S, S = t.name == l + h ? h : S, S = t.name == l + p ? p : S, (a.debug || a.options.preview) && (S = M(c) ? c : M(h) ? h : p), S = M(p) ? p : S, a.device = S;
      var T = a.render = a.options.devices[S] && k;
      if (T) e.write(i), n.state = 1;
      else if (a.realDevice != p) {
        var j = e.createElement("script");
        j.setAttribute("type", "text/javascript");
        j.setAttribute("defer", ""), j.setAttribute("src", u);
        var P = e.getElementsByTagName("head"),
            O = P ? P[0] : null;
        O && O.appendChild(j)
      }
    }
  })(t, e, n, n.config, n.loader);
  if (n.config) {
    var a = function () {
      function e(t) {
        return null == t ? String(t) : W[Y.call(t)] || "object"
      }
      function n(t) {
        return "function" == e(t)
      }
      function a(t) {
        return null != t && t == t.window
      }
      function r(t) {
        return null != t && t.nodeType == t.DOCUMENT_NODE
      }
      function i(t) {
        return "object" == e(t)
      }
      function o(t) {
        return i(t) && !a(t) && Object.getPrototypeOf(t) == Object.prototype
      }
      function l(t) {
        return "number" == typeof t.length
      }
      function s(t) {
        return j.call(t, function (t) {
          return null != t
        })
      }
      function c(t) {
        return t.length > 0 ? E.fn.concat.apply([], t) : t
      }
      function p(t) {
        return t in z ? z[t] : z[t] = new RegExp("(^|\\s)" + t + "(\\s|$)")
      }
      function f(t) {
        return "children" in t ? T.call(t.children) : E.map(t.childNodes, function (t) {
          return 1 == t.nodeType ? t : void 0
        })
      }
      function m(t, e, n) {
        for (k in e) n && (o(e[k]) || K(e[k])) ? (o(e[k]) && !o(t[k]) && (t[k] = {}), K(e[k]) && !K(t[k]) && (t[k] = []), m(t[k], e[k], n)) : e[k] !== _ && (t[k] = e[k])
      }
      function g(t, e) {
        return null == e ? E(t) : E(t).filter(e)
      }
      function v(t, e, a, r) {
        return n(e) ? e.call(t, a, r) : e
      }
      function y(t, e, n) {
        null == n ? t.removeAttribute(e) : t.setAttribute(e, n)
      }
      function b(t, e) {
        var n = t.className,
            a = n && n.baseVal !== _;
        return e === _ ? a ? n.baseVal : n : void(a ? n.baseVal = e : t.className = e)
      }
      function w(t) {
        var e;
        try {
          return t ? "true" == t || ("false" == t ? !1 : "null" == t ? null : /^0/.test(t) || isNaN(e = Number(t)) ? /^[\[\{]/.test(t) ? E.parseJSON(t) : t : e) : t
        } catch (n) {
          return t
        }
      }
      function x(t, e) {
        e(t);
        for (var n = 0, a = t.childNodes.length; a > n; n++) x(t.childNodes[n], e)
      }
      var _, k, E, C, M, A, S = [],
          T = S.slice,
          j = S.filter,
          P = t.document,
          O = {},
          z = {},
          I = {
            "column-count": 1,
            columns: 1,
            "font-weight": 1,
            "line-height": 1,
            opacity: 1,
            "z-index": 1,
            zoom: 1
          },
          N = /^\s*<(\w+|!)[^>]*>/,
          D = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
          R = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
          B = /^(?:body|html)$/i,
          L = /([A-Z])/g,
          H = ["val", "css", "html", "text", "data", "width", "height", "offset"],
          $ = ["after", "prepend", "before", "append"],
          q = P.createElement("table"),
          U = P.createElement("tr"),
          F = {
            tr: P.createElement("tbody"),
            tbody: q,
            thead: q,
            tfoot: q,
            td: U,
            th: U,
            "*": P.createElement("div")
          },
          V = /complete|loaded|interactive/,
          Z = /^[\w-]*$/,
          W = {},
          Y = W.toString,
          G = {},
          J = P.createElement("div"),
          K = Array.isArray || function (t) {
              return t instanceof Array
            };
      return G.Z = function (t, e) {
        return t = t || [], t.__proto__ = E.fn, t.selector = e || "", t
      }, G.isZ = function (t) {
        return t instanceof G.Z
      }, G.init = function (t, e) {
        var a;
        if (!t) return G.Z();
        if ("string" == typeof t) if (t = t.trim(), "<" == t[0] && N.test(t)) a = G.fragment(t, RegExp.$1, e), t = null;
        else {
          if (e !== _) return E(e).find(t);
          a = G.qsa(P, t)
        } else {
          if (n(t)) return E(P).ready(t);
          if (G.isZ(t)) return t;
          if (K(t)) a = s(t);
          else if (i(t)) a = [t], t = null;
          else if (N.test(t)) a = G.fragment(t.trim(), RegExp.$1, e), t = null;
          else {
            if (e !== _) return E(e).find(t);
            a = G.qsa(P, t)
          }
        }
        return G.Z(a, t)
      }, E = function (t, e) {
        return G.init(t, e)
      }, E.extend = function (t) {
        var e, n = T.call(arguments, 1);
        return "boolean" == typeof t && (e = t, t = n.shift()), n.forEach(function (n) {
          m(t, n, e)
        }), t
      }, G.qsa = function (t, e) {
        var n, a = "#" == e[0],
            i = !a && "." == e[0],
            o = a || i ? e.slice(1) : e,
            l = Z.test(o);
        return r(t) && l && a ? (n = t.getElementById(o)) ? [n] : [] : 1 !== t.nodeType && 9 !== t.nodeType ? [] : T.call(l && !a ? i ? t.getElementsByClassName(o) : t.getElementsByTagName(e) : t.querySelectorAll(e))
      }, E.contains = P.documentElement.contains ?
        function (t, e) {
          return t !== e && t.contains(e)
        } : function (t, e) {
          for (; e && (e = e.parentNode);) if (e === t) return !0;
          return !1
        }, E.type = e, E.camelCase = M, E.trim = function (t) {
          return null == t ? "" : String.prototype.trim.call(t)
        }, E.uuid = 0, E.support = {}, E.expr = {}, E.map = function (t, e) {
          var n, a, r, i = [];
          if (l(t)) for (a = 0; a < t.length; a++) n = e(t[a], a), null != n && i.push(n);
          else for (r in t) n = e(t[r], r), null != n && i.push(n);
          return c(i)
        }, E.each = function (t, e) {
          var n, a;
          if (l(t)) {
            for (n = 0; n < t.length; n++) if (e.call(t[n], n, t[n]) === !1) return t
          } else for (a in t) if (e.call(t[a], a, t[a]) === !1) return t;
          return t
        }, t.JSON && (E.parseJSON = JSON.parse), E.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function (t, e) {
          W["[object " + e + "]"] = e.toLowerCase()
        }), E.fn = {
          forEach: S.forEach,
          reduce: S.reduce,
          push: S.push,
          sort: S.sort,
          remove: function () {
            return this.each(function () {
              null != this.parentNode && this.parentNode.removeChild(this)
            })
          },
          each: function (t) {
            return S.every.call(this, function (e, n) {
              return t.call(e, n, e) !== !1
            }), this
          },
          filter: function (t) {
            return n(t) ? this.not(this.not(t)) : E(j.call(this, function (e) {
              return G.matches(e, t)
            }))
          },
          not: function (t) {
            var e = [];
            if (n(t) && t.call !== _) this.each(function (n) {
              t.call(this, n) || e.push(this)
            });
            else {
              var a = "string" == typeof t ? this.filter(t) : l(t) && n(t.item) ? T.call(t) : E(t);
              this.forEach(function (t) {
                a.indexOf(t) < 0 && e.push(t)
              })
            }
            return E(e)
          },
          eq: function (t) {
            return -1 === t ? this.slice(t) : this.slice(t, +t + 1)
          },
          find: function (t) {
            var e, n = this;
            return e = t ? "object" == typeof t ? E(t).filter(function () {
              var t = this;
              return S.some.call(n, function (e) {
                return E.contains(e, t)
              })
            }) : 1 == this.length ? E(G.qsa(this[0], t)) : this.map(function () {
              return G.qsa(this, t)
            }) : []
          },
          html: function (t) {
            return 0 in arguments ? this.each(function (e) {
              var n = this.innerHTML;
              E(this).empty().append(v(this, t, e, n))
            }) : 0 in this ? this[0].innerHTML : null
          },
          text: function (t) {
            return 0 in arguments ? this.each(function (e) {
              var n = v(this, t, e, this.textContent);
              this.textContent = null == n ? "" : "" + n
            }) : 0 in this ? this[0].textContent : null
          },
          attr: function (t, e) {
            var n;
            return "string" != typeof t || 1 in arguments ? this.each(function (n) {
              if (1 === this.nodeType) if (i(t)) for (k in t) y(this, k, t[k]);
              else y(this, t, v(this, e, n, this.getAttribute(t)))
            }) : this.length && 1 === this[0].nodeType ? !(n = this[0].getAttribute(t)) && t in this[0] ? this[0][t] : n : _
          },
          removeAttr: function (t) {
            return this.each(function () {
              1 === this.nodeType && y(this, t)
            })
          }
        }, E.fn.detach = E.fn.remove, ["width", "height"].forEach(function (t) {
          var e = t.replace(/./, function (t) {
            return t[0].toUpperCase()
          });
          E.fn[t] = function (n) {
            var i, o = this[0];
            return n === _ ? a(o) ? o["inner" + e] : r(o) ? o.documentElement["scroll" + e] : (i = this.offset()) && i[t] : this.each(function (e) {
              o = E(this), o.css(t, v(this, n, e, o[t]()))
            })
          }
        }), $.forEach(function (n, a) {
          var r = a % 2;
          E.fn[n] = function () {
            var n, i, o = E.map(arguments, function (t) {
              return n = e(t), "object" == n || "array" == n || null == t ? t : G.fragment(t)
            }),
                l = this.length > 1;
            return o.length < 1 ? this : this.each(function (e, n) {
              i = r ? n : n.parentNode, n = 0 == a ? n.nextSibling : 1 == a ? n.firstChild : 2 == a ? n : null;
              var s = E.contains(P.documentElement, i);
              o.forEach(function (e) {
                if (l) e = e.cloneNode(!0);
                else if (!i) return E(e).remove();
                i.insertBefore(e, n), s && x(e, function (e) {
                  null == e.nodeName || "SCRIPT" !== e.nodeName.toUpperCase() || e.type && "text/javascript" !== e.type || e.src || t.eval.call(t, e.innerHTML)
                })
              })
            })
          }, E.fn[r ? n + "To" : "insert" + (a ? "Before" : "After")] = function (t) {
            return E(t)[n](this), this
          }
        }), G.Z.prototype = E.fn, E.zepto = G, E
    }();
    t.Zepto = a, void 0 === t.$ && (t.$ = a), function (n) {
      "focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select keydown keypress keyup error".split(" ").forEach(function (t) {
        n.fn[t] = function (e) {
          return e ? this.bind(t, e) : this.trigger(t)
        }
      })
    }(a), function () {
      var n = [],
          a = t.Zepto;
      if (a && !n.__proto__) {
        var r = function (t) {
          return n.push.apply(this, t), this
        };
        a.zepto.Z = function (t, e) {
          t = t || [];
          var n = new r(t);
          return n.selector = e || "", n
        }, a.zepto.Z.prototype = r.prototype = a.fn;
        var i = /^\s*<(\w+)[^>]*>/,
            o = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
            l = {
              option: [1, "<select multiple='multiple'>", "</select>"],
              legend: [1, "<fieldset>", "</fieldset>"],
              thead: [1, "<table>", "</table>"],
              tr: [2, "<table><tbody>", "</tbody></table>"],
              td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
              col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
              area: [1, "<map>", "</map>"],
              "*": [0, "", ""]
            };
        l.optgroup = l.option, l.tbody = l.tfoot = l.colgroup = l.caption = l.thead, l.th = l.td, a.zepto.fragment = function (t, a) {
          void 0 === a && (a = i.test(t) && RegExp.$1), t = t.toString().replace(o, "<$1></$2>");
          var r = l[a] || l["*"],
              s = r[0],
              c = e.createElement("div");
          for (c.innerHTML = r[1] + t + r[2]; s--;) c = c.lastChild;
          return n.slice.call(c.childNodes)
        }
      }
    }(), function (t, e, n) {
      e.runOnce || n.isOldBrowsers || (t.$ && t.$.noConflict ? e.$ = t.$.noConflict(!0) : (e.$ = t.Zepto, e.$.support = e.$.support || {}, t.$ && t.Zepto === t.$ && delete t.$, t.Zepto && delete t.Zepto))
    }(t, n, n.config);
    var r = function () {
      var t = function () {
        function t(t) {
          this.string = t
        }
        var e;
        return t.prototype.toString = function () {
          return "" + this.string
        }, e = t
      }(),
      e = function (t) {
        function e(t) {
          return l[t] || "&amp;"
        }
        function n(t, e) {
          for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n])
        }
        function a(t) {
          return t instanceof o ? t.toString() : t || 0 === t ? (t = "" + t, c.test(t) ? t.replace(s, e) : t) : ""
        }
        function r(t) {
          return t || 0 === t ? u(t) && 0 === t.length ? !0 : !1 : !0
        }
        var i = {},
            o = t,
            l = {
              "&": "&amp;",
              "<": "&lt;",
              ">": "&gt;",
              '"': "&quot;",
              "'": "&#x27;",
              "`": "&#x60;"
            },
            s = /[&<>"'`]/g,
            c = /[&<>"'`]/;
        i.extend = n;
        var h = Object.prototype.toString;
        i.toString = h;
        var p = function (t) {
          return "function" == typeof t
        };
        p(/x/) && (p = function (t) {
          return "function" == typeof t && "[object Function]" === h.call(t)
        });
        i.isFunction = p;
        var u = Array.isArray ||
              function (t) {
                return t && "object" == typeof t ? "[object Array]" === h.call(t) : !1
              };
        return i.isArray = u, i.escapeExpression = a, i.isEmpty = r, i
      }(t),
      n = function () {
        function t() {
          for (var t = Error.prototype.constructor.apply(this, arguments), e = 0; e < n.length; e++) this[n[e]] = t[n[e]]
        }
        var e, n = ["description", "fileName", "lineNumber", "message", "name", "number", "stack"];
        return t.prototype = new Error, e = t
      }(),
      a = function (t, e) {
        function n(t, e) {
          this.helpers = t || {}, this.partials = e || {}, a(this)
        }
        function a(t) {
          t.registerHelper("helperMissing", function (t) {
            if (2 === arguments.length) return void 0;
            throw new Error("Missing helper: '" + t + "'")
          }), t.registerHelper("blockHelperMissing", function (e, n) {
            var a = n.inverse ||
                  function () {},
                r = n.fn;
            return u(e) && (e = e.call(this)), e === !0 ? r(this) : e === !1 || null == e ? a(this) : p(e) ? e.length > 0 ? t.helpers.each(e, n) : a(this) : r(e)
          }), t.registerHelper("each", function (t, e) {
            var n, a = e.fn,
                r = e.inverse,
                i = 0,
                o = "";
            if (u(t) && (t = t.call(this)), e.data && (n = g(e.data)), t && "object" == typeof t) if (p(t)) for (var l = t.length; l > i; i++) n && (n.index = i, n.first = 0 === i, n.last = i === t.length - 1), o += a(t[i], {
              data: n
            });
            else for (var s in t) t.hasOwnProperty(s) && (n && (n.key = s, n.index = i, n.first = 0 === i), o += a(t[s], {
              data: n
            }), i++);
            return 0 === i && (o = r(this)), o
          }), t.registerHelper("if", function (t, e) {
            return u(t) && (t = t.call(this)), !e.hash.includeZero && !t || o.isEmpty(t) ? e.inverse(this) : e.fn(this)
          }), t.registerHelper("unless", function (e, n) {
            return t.helpers["if"].call(this, e, {
              fn: n.inverse,
              inverse: n.fn,
              hash: n.hash
            })
          }), t.registerHelper("with", function (t, e) {
            return u(t) && (t = t.call(this)), o.isEmpty(t) ? void 0 : e.fn(t)
          })
        }
        function r(t, e) {
          m.log(t, e)
        }
        var i = {},
            o = t,
            l = e,
            s = "1.2.1";
        i.VERSION = s;
        var c = 4;
        i.COMPILER_REVISION = c;
        var h = {
          1: "<= 1.0.rc.2",
          2: "== 1.0.0-rc.3",
          3: "== 1.0.0-rc.4",
          4: ">= 1.0.0"
        };
        i.REVISION_CHANGES = h;
        var p = o.isArray,
            u = o.isFunction,
            d = o.toString,
            f = "[object Object]";
        i.HandlebarsEnvironment = n, n.prototype = {
          constructor: n,
          logger: m,
          log: r,
          registerHelper: function (t, e, n) {
            if (d.call(t) === f) {
              if (n || e) throw new l("Arg not supported with multiple helpers");
              o.extend(this.helpers, t)
            } else n && (e.not = n), this.helpers[t] = e
          },
          registerPartial: function (t, e) {
            d.call(t) === f ? o.extend(this.partials, t) : this.partials[t] = e
          }
        };
        var m = {
          methodMap: {
            0: "debug",
            1: "info",
            2: "warn",
            3: "error"
          },
          DEBUG: 0,
          INFO: 1,
          WARN: 2,
          ERROR: 3,
          level: 3,
          log: function (t, e) {
            if (m.level <= t) {
              var n = m.methodMap[t];
              "undefined" != typeof console && console[n] && console[n].call(console, e)
            }
          }
        };
        i.logger = m, i.log = r;
        var g = function (t) {
          var e = {};
          return o.extend(e, t), e
        };
        return i.createFrame = g, i
      }(e, n),
      r = function (t, e, n) {
        function a(t) {
          var e = t && t[0] || 1,
              n = u;
          if (e !== n) {
            if (n > e) {
              var a = d[n], r = d[e];
              throw new Error("Template was precompiled with an older version of Handlebars than the current runtime. Please update your precompiler to a newer version (" + a + ") or downgrade your runtime to an older version (" + r + ").")
            }
            throw new Error("Template was precompiled with a newer version of Handlebars than the current runtime. Please update your runtime to a newer version (" + t[1] + ").")
          }
        }
        function r(t, e) {
          if (!e) throw new Error("No environment passed to template");
          var n = function (t, n, a, r, i, o) {
            var l = e.VM.invokePartial.apply(this, arguments);
            if (null != l) return l;
            if (e.compile) {
              var s = {
                helpers: r,
                partials: i,
                data: o
              };
              return i[n] = e.compile(t, {
                data: void 0 !== o
              }, e), i[n](a, s)
            }
            throw new p("The partial " + n + " could not be compiled when running in runtime-only mode")
          },
              a = {
                escapeExpression: h.escapeExpression,
                invokePartial: n,
                programs: [],
                program: function (t, e, n) {
                  var a = this.programs[t];
                  return n ? a = o(t, e, n) : a || (a = this.programs[t] = o(t, e)), a
                },
                merge: function (t, e) {
                  var n = t || e;
                  return t && e && t !== e && (n = {}, h.extend(n, e), h.extend(n, t)), n
                },
                programWithDepth: e.VM.programWithDepth,
                noop: e.VM.noop,
                compilerInfo: null
              };
          return function (n, r) {
            r = r || {};
            var i, o, l = r.partial ? r : e;
            r.partial || (i = r.helpers, o = r.partials);
            var s = t.call(a, l, n, i, o, r.data);
            return r.partial || e.VM.checkRevision(a.compilerInfo), s
          }
        }
        function o(t, e, n) {
          var a = function (t, a) {
            return a = a || {}, e(t, a.data || n)
          };
          return a.program = t, a.depth = 0, a
        }
        function s() {
          return ""
        }
        var c = {},
            h = t,
            p = e,
            u = n.COMPILER_REVISION,
            d = n.REVISION_CHANGES;
        return c.checkRevision = a, c.template = r, c.programWithDepth = i, c.program = o, c.noop = s, c
      }(e, n, a),
      i = function (t, e, n, a, r) {
        var i, o = t,
            l = e,
            s = n,
            c = a,
            h = r,
            p = function () {
              var t = new o.HandlebarsEnvironment;
              return c.extend(t, o), t.SafeString = l, t.Exception = s, t.Utils = c, t.VM = h, t.template = function (e) {
                return h.template(e, t)
              }, t
            },
            u = p();
        return u.create = p, i = u
      }(a, t, n, e, r);
      return i
    }()
  }!
  function (t, e) {
    if (!t.runOnce) {
      var n = t.logger = t.logger || {
        times: [].concat(t.__timing),
        images: [],
        errors: []
      };
      delete t.__timing, n.time = function (t, e) {
        var n = e || +new Date;
        return this.times.push([n, t]), n
      }, n.error = function (t, e, n) {
        var a = n || +new Date;
        this.errors.push([a, t, e])
      }
    }
  }(n, n.config), function (t, e, n, a) {
    function r(t, e) {
      var n = t.split("?");
      if (n.length >= 2) {
        for (var a = n[1].split(/[&;]/g), r = a.length; r-- > 0;) for (var i = 0, o = e.length; o > i; i++) {
          var l = encodeURIComponent(e[i]) + "=";
          if (a[r] && -1 !== a[r].lastIndexOf(l, 0)) {
            a.splice(r, 1);
            break
          }
        }
        return n[0] + (a.length ? "?" + a.join("&") : "")
      }
      return t
    }
    if (!n.runOnce) {
      var i = n.util = n.util || {};
      i.extend = function (t) {
        return Array.prototype.forEach && [].slice.call(arguments, 1).forEach(function (e) {
          for (var n in e) void 0 !== e[n] && (t[n] = e[n])
        }), t
      }, i.keys = function (t) {
        var e = [];
        for (var n in t) t.hasOwnProperty(n) && e.push(n);
        return e
      }, i.values = function (t) {
        var e = [];
        for (var n in t) t.hasOwnProperty(n) && e.push(t[n]);
        return e
      }, i.clone = function (t) {
        var e = {};
        for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]);
        return e
      };
      var o = e.createElement("a");
      var l = /^https?/;
      var s, c = ["sukey", "from", "isappinstalled"];
      i.getDocUrlPath = function () {
        return s ? s : (s = t.location.pathname + (t.location.search ? t.location.search : ""), a.weixin && (s = r(s, c)), s)
      }, i.gotoUrl = function (e) {
        t.location.href = e
      }, i.outerHTML = function (t) {
        if (t.outerHTML) return t.outerHTML;
        var n = e.createElement("div");
        n.appendChild(t.cloneNode(!0));
        var a = n.innerHTML;
        return n = null, a
      }, i.getDoctype = function (t) {
        var n = t.doctype || [].filter.call(t.childNodes, function (t) {
          return t.nodeType == Node.DOCUMENT_TYPE_NODE
        })[0];
        return n ? "<!DOCTYPE HTML" + (n.publicId ? ' PUBLIC "' + n.publicId + '"' : "") + (n.systemId ? ' "' + n.systemId + '"' : "") + ">" : ""
      }, i.getDocProtocol = function (t) {
        return "https:" == t.location.protocol ? "https" : "http"
      }, i.removeBySelector = function (t, n) {
        n = n || e;
        var a = n.querySelectorAll(t);
        return i.removeElements(a, n)
      }, i.removeElements = function (t, n) {
        n = n || e;
        for (var a = 0, r = t.length; r > a; a++) {
          var i = t[a];
          i.parentNode.removeChild(i)
        }
        return t
      }, i.createElement = function (t, n, a) {
        a = a || e;
        var r = a.createElement(t);
        for (var i in n) n.hasOwnProperty(i) && r.setAttribute(i, n[i]);
        return r
      }, i.insertAfter = function (t, e) {
        t.parentNode.insertBefore(e, t.nextSibling)
      }, i.domIsReady = function (t) {
        var t = t || e;
        return t.attachEvent ? "complete" === t.readyState : "loading" !== t.readyState
      }, i.waitForReady = function (t, e) {
        var n = this,
            a = !1,
            r = function () {
              a || (a = !0, i && clearInterval(i), e(t))
            },
            i = setInterval(function () {
              n.domIsReady(t) && r()
            }, 100);
        t.addEventListener("readystatechange", r, !1)
      }, i.injectJSCode = function (t, e, a, r) {
        var i = this.createElement("script", {
          charset: "utf-8",
          defer: "",
          async: "",
          src: e,
          id: a || ""
        }, t);
        r && (i.readyState ? i.onreadystatechange = function () {
          ("loaded" == i.readyState || "complete" == i.readyState) && (i.onreadystatechange = null, r(i))
        } : i.onload = function () {
          r(i)
        });
        var o = t.getElementById(n.id);
        if (o) this.insertAfter(o, i);
        else if (t.body) t.body.appendChild(i);
        else {
          var l = t.getElementsByTagName("head")[0];
          l && l.appendChild(i)
        }
      }
    }
  }(t, e, n, n.config), function (t, e, n) {
    var a = t.event = t.event || {};
    a.onPlatformReady = "onPlatformReady", a.onOriginalDocReady = "onOriginalDocReady", a.onOriginalWinLoad = "onOriginalWinLoad", a.onBeforeMobilize = "onBeforeMobilize", a.onPageTmplLoad = "onPageTmplLoad", a.onPreprocessDoc = "onPreprocessDoc", a.onBeforeRender = "onBeforeRender", a.onMobilizedDocReady = "onMobilizedDocReady", a.onMobilizedWinLoad = "onMobilizedWinLoad", a.fire = function (a, r) {
      n.time(a);
      for (var i = {
        cancel: !1,
        lastModule: ""
      }, o = 0, l = t.m.length; l > o && !i.cancel; o++) {
        var s = t.m[o];
        if (s[a] && e.options.modules[s.name]) {
          s[a](i, r);
          i.lastModule = s.name;
        }
      }
      return i
    }, a.registerModule = function (a) {
      for (var r = 0, i = t.m.length; i > r; r++) if (t.m[r].name == a.name) return;
      t.m.push(a), e.debug && n.time("Load module: " + a.name)
    }
  }(n, n.config, n.logger), function (t, e, n, a, r, i) {
    if (!n.runOnce) {
      var o = {
        name: "capture"
      };
      r.registerModule(o);
      var l, s, c = function (t, e) {
        var a = r.fire(t, e);
        return a.cancel || (n.state = 150, e.renderCapturedDoc()), a
      },
          p = function (t, a) {
            var r = e.createElement("script");
            r.type = "text/javascript", a && (r.readyState ? r.onreadystatechange = function () {
              ("loaded" == r.readyState || "complete" == r.readyState) && (r.onreadystatechange = null, a())
            } : r.onload = function () {
              a()
            }), r.src = t, n.srcElement.parentNode.insertBefore(r, n.srcElement)
          },
          u = function () {
            l || (void 0 !== t.stop ? t.stop() : void 0 !== e.execCommand && e.execCommand("Stop", !1), l = !0)
          };
      o.onPlatformReady = function (t) {
        if (a.render) {
          n.doc.init(function (t) {
            n.state = 102, s = t;
            var e = c(r.onBeforeMobilize, t);
          }), t.cancel = !0
        }
      }
    }
  }(t, e, n, n.config, n.event, n.util, n.logger), function (t, e, n, a, r, i, o) {
    function l(t) {
      return t.nodeName.toLowerCase()
    }
    function s(t) {
      return t.replace('"', "&quot;")
    }
    function c(t) {
      return t ? [].map.call(t.childNodes, function (t) {
        var e = l(t);
        return "#comment" == e ? "<!--" + t.textContent + "-->" : "plaintext" == e ? t.textContent : "script" == e && (/allmobilize|yunshipei/.test(t.src) || /allmobilize|yunshipei/i.test(t.textContent)) ? "" : t.outerHTML || t.nodeValue
      }).join("") : ""
    }
    if (!n.runOnce) {
      var h = /(<script[\s\S]*?>)/gi,
          p = {
            style: ' media="x-media"',
            script: ' type="text/x-script"'
          },
          u = new RegExp(r.values(p).join("|"), "g"),
          d = {
            img: ["src"],
            source: ["src"],
            iframe: ["src"],
            script: ["src", "type"],
            link: ["href"],
            style: ["media"]
          },
          f = new RegExp("<(" + r.keys(d).join("|") + ")([\\s\\S]*?)>", "gi"),
          m = {},
          g = {};
      for (var v in d) if (d.hasOwnProperty(v)) {
        var y = d[v];
        y.forEach(function (t) {
          g[t] = !0
        }), m[v] = new RegExp("\\s+((?:" + y.join("|") + ")\\s*=\\s*(?:('|\")[\\s\\S]+?\\2))", "gi")
      }
      var b = e.createElement("div"),
          w = function (t, e) {
            this.sourceDoc = t, this.prefix = e || "x-"
          };
      w.init = function (t, n, a) {
        var n = n || e, //document
            i = function (t, e, n) {
              var a = new w(e, n);
              var i = a.createDocumentFragmentsStrings(a.sourceDoc);
              r.extend(a, i);
              var o = a.createDocumentFragments();
              r.extend(a, o), t(a)
            };
        r.domIsReady(n) ? i(t, n, a) : r.waitForReady(n, function () {
          i(t, n, a)
        })
      };
      w.removeClosingTagsAtEndOfString = function (t) {
        var e = t.match(/((<\/[^>]+>)+)$/);
        return e ? t.substring(0, t.length - e[0].length) : t
      };
      w.removeTargetSelf = function (t) {
        return t.replace(/target=("_self"|\'_self\')/gi, "")
      };
      w.cloneAttributes = function (t, e) {
        var n = t.match(/^<(\w+)([\s\S]*)$/i);
        return b.innerHTML = "<div" + n[2], [].forEach.call(b.firstChild.attributes, function (t) {
          try {
            e.setAttribute(t.nodeName, t.nodeValue)
          } catch (n) {
            console.error("Error copying attributes while capturing: ", n)
          }
        }), e
      };
      w.disable = function (t, e) {
        var n = function () {
          return function (t, n, a) {
            var lowercaseTagName = n.toLowerCase();
            var result = "<" + lowercaseTagName + (p[lowercaseTagName] || "") + a.replace(m[lowercaseTagName], " " + e + "$1") + ">"
            return result;
          }
        }(),
        a = /(<!--[\s\S]*?-->)|(?=<\/script)/i,
        r = t.split(a),
        i = r.map(function (t) {
          var e;
          return t ? /^<!--/.test(t) ? t : (e = t.split(h), e[0] = e[0].replace(f, n), e[1] && (e[1] = e[1].replace(f, n)), e) : ""
        });
        return [].concat.apply([], i).join("")
      };
      w.enable = function (t, e) {
        var n = new RegExp("\\s" + e + "(" + r.keys(g).join("|") + ")", "gi");
        return t.replace(n, " $1").replace(u, "")
      };
      w.openTag = function (t) {
        if (!t) return "";
        t.length && (t = t[0]);
        var e = [];
        return [].forEach.call(t.attributes, function (t) {
          e.push(" ", t.name, '="', s(t.value), '"')
        }), "<" + l(t) + e.join("") + ">"
      };
      w.prototype.createDocumentFragmentsStrings = function (t) {
        var e = t.getElementsByTagName("head")[0] || t.createElement("head"),
            n = t.getElementsByTagName("body")[0] || t.createElement("body"),
            a = t.getElementsByTagName("html")[0];
        r.removeBySelector(o.selector, t);
        var i = {
          doctype: r.getDoctype(t),
          htmlOpenTag: w.openTag(a),
          headOpenTag: w.openTag(e),
          bodyOpenTag: w.openTag(n),
          headContent: c(e),
          bodyContent: c(n)
        };
        i.all = function (t) {
          return this.doctype + this.htmlOpenTag + this.headOpenTag + (t || "") + this.headContent + this.bodyOpenTag + this.bodyContent
        };
        var l = /<!--(?:[\s\S]*?)-->|(<\/head\s*>|<body[\s\S]*$)/gi,
            s = i.bodyContent = i.headContent + i.bodyContent;
        i.headContent = "";
        for (var h; h = l.exec(s); h) if (h[1]) {
          i.headContent = s.slice(0, h.index);
          var p = new RegExp("^[\\s\\S]*(<head(?:[^>'\"]*|'[^']*?'|\"[^\"]*?\")*>)([\\s\\S]*)$").exec(i.headContent);
          if (p && (i.headOpenTag = p[1], i.headContent = p[2]), "/" != h[1][1]) {
            i.bodyContent = h[0];
            var u = /^((?:[^>'"]*|'[^']*?'|"[^"]*?")*>)([\s\S]*)$/.exec(i.bodyContent);
            u && (i.bodyOpenTag = u[1], i.bodyContent = u[2]);
            break
          }
          i.bodyContent = s.slice(h.index + h[1].length)
        }
        return i
      };
      w.prototype.restoreOriginalDoc = function () {
        var t = this;
        r.waitForReady(e, function () {
          t.render(t.all())
        })
      };
      w.prototype.setElementContentFromString = function (t, e) {
        for (b.innerHTML = e; b.firstChild; t.appendChild(b.firstChild));
      };
      w.prototype.createDocumentFragments = function () {
        var t = {},
            n = t.capturedDoc = e.implementation.createHTMLDocument(""),
            a = t.htmlEl = n.documentElement,
            r = t.headEl = a.firstChild,
            i = t.bodyEl = a.lastChild;
        w.cloneAttributes(this.htmlOpenTag, a);
        w.cloneAttributes(this.headOpenTag, r);
        w.cloneAttributes(this.bodyOpenTag, i);
        i.innerHTML = w.disable(this.bodyContent, this.prefix);
        var o = w.disable(this.headContent, this.prefix);
        try {
          r.innerHTML = o
        } catch (l) {
          var s = r.getElementsByTagName("title")[0];
          s && r.removeChild(s), this.setElementContentFromString(r, o)
        }
        return a.appendChild(r), a.appendChild(i), t
      };
      w.prototype.escapedHTMLString = function () {
        var t = this.capturedDoc,
            e = w.enable(r.outerHTML(t.documentElement), this.prefix),
            n = this.doctype + e;
        return n
      };
      w.prototype.render = function (t) {
        var e;
        e = t ? w.enable(t, this.prefix) : this.escapedHTMLString();
        var n = this.sourceDoc;
        setTimeout(function () {
          n.open("text/html", "replace"), n.write(e), n.close()
        })
      };
      w.prototype.getCapturedDoc = function () {
        return this.capturedDoc
      };
      n.doc = n.doc || w
    }
  }(t, e, n, n.config, n.util, n.logger, n.loader), function (t, e, n, a, r, i, o, l, s) {
    if (!n.runOnce) {
      var c = {
        name: "mobilizer"
      };
      a.registerModule(c);
      var h = function (t) {
        var e = "";
        if (t.length) {
          var n = t.length ? t[0] : t;
          e = n.outerHTML ? n.outerHTML : l("<div>").append(l(n).clone()).html(), "string" == typeof e && (e = l.trim(e))
        }
        return e
      },
          p = function (t) {
            var e = function (t, e, a) {
              return (l.fn.init || l.zepto.init).call(this, t, e || n.context(), a)
            },
                n = l.sub(e);
            return n.context = function () {
              return t || "<div>"
            }, n.zepto || (n.fn.init = e, n.fn.init.prototype = l.fn), n
          };
      l.sub = l.sub ||
        function (t) {
          return l.extend(t, l), t.zepto = l.extend({}, l.zepto), t
        }, l.fn.anchor = function () {
          return p(this)
        }, l.fn.src = function () {
          return l(this).attr("x-src") || l(this).attr("src")
        }, l.fn.href = function () {
          var t = l(this).attr("href");
          if (r.options.domains) {
            var e = new RegExp(r.options.domains),
                n = e.exec(t);
            if (n && n.length > 0) {
              var a = n[0],
                  i = t.indexOf(a);
              i >= 0 && 8 >= i && (t = t.substring(t.indexOf("/", i + 1)))
            }
          }
          return t
        }, l.fn.outerHTML = function () {
          return h(l(this))
        };
      var u, d, f = function () {
        var t = n.p.md;
        for (var e in t) t.hasOwnProperty(e) && s.registerPartial(e, s.template(t[e]));
        s.registerHelper("ifCond", function (t, e, n, a) {
          switch (e) {
          case "==":
            return t == n ? a.fn(this) : a.inverse(this);
          case "===":
            return t === n ? a.fn(this) : a.inverse(this);
          case "<":
            return n > t ? a.fn(this) : a.inverse(this);
          case "<=":
            return n >= t ? a.fn(this) : a.inverse(this);
          case ">":
            return t > n ? a.fn(this) : a.inverse(this);
          case ">=":
            return t >= n ? a.fn(this) : a.inverse(this);
          default:
            return a.inverse(this)
          }
          return a.inverse(this)
        }), s.registerHelper("parseLayout", function (t) {
          var e = this.content.___AM_PRIVATE_CHILDREN[t],
              n = [];
          return l.each(e, function (t, e) {
            var a = "blank" === e.__type ? e.id : e.__type,
                r = s.partials[a];
            r ? n.push(r(e)) : o.error("module_missing", a)
          }), n.join("\n")
        })
      },
          m = function (t, e) {
            var a = t.content && t.content.template;
            !a && t.content && t.content._templates && (a = t.content._templates[e]);
            var r = n.p.tpl[a];
            return r ? (r = s.template(r))(t) : ""
          },
          g = function (t, e) {
            return f(), m(t, e)
          },
          v = function (t, e) {
            return e && (e.jquery || t.zepto && t.zepto.isZ && t.zepto.isZ(e) || e.selector && e.length || e.innerHTML) ? h(e) : "object" == typeof e ? e : e && e.toString() || ""
          },
          y = function (t, e, n) {
            var r = {};
            return l.each(t, function (t, a) {
              if ("_" != t[0]) {
                var i;
                "function" == typeof a ? (i = a(e, n), i = v(e, i)) : i = "object" == typeof a ? y(a, e, n) : a, r[t] = i
              } else r[t] = a
            }), r
          },
          b = {
            select: function (t) {
              var e = this,
                  n = {};
              return l.each(t, function (t, s) {
                o.time("Pattern: " + t);
                var c = !1;
                if ("$" == t[0] && "$" == t[1] && e._patterns) {
                  var h = e._patterns[t.substring(2)];
                  c = h(e.$)
                }
                return c || r.pageId && s.template === r.pageId || new RegExp(t, "i").test(i.getDocUrlPath()) ? (s._options && l.extend(e._options, s._options), a.fire(a.onPreprocessDoc, {
                  options: e._options,
                  $: e.$
                }), n = y(s, e.$, e), !1) : void 0
              }), n
            },
            _helpers: {},
            __clone: function () {
              var t = ["select", "__clone", "_helpers", "_options"],
                  e = l.extend({}, this);
              return l.each(t, function (t, n) {
                delete e[n]
              }), e
            }
          },
          w = function (t, e) {
            var n = l.extend(!0, {}, e, b);
            return n.$ = p(t.documentElement), n.Handlebars = s, n.__root = r.srcRoot, n.__lang = r.lang, n.__ads = r.showAds, y(e, n.$, n)
          },
          E = function (t, e, l, s) {
            var c = l ? g(l, s) : "";
            if (c) {
              var h = {
                docHtml: c
              };
              n.state = 200, e.render(h.docHtml), t.cancel = !0;
            }
          };
      c.onBeforeMobilize = function (t, e) {
        var a = r.device,
            i = e.getCapturedDoc();//html节点
        try {
          u = w(i, n.p.data[a])
        } catch (l) {
          u = null, d = l.stack
        }
        if (u) {
          u.__device = a, u.__root = r.srcRoot, u.__lang = r.lang, u.__stylePath = u.__root + r.options.files.style
        }
        r.options.splitmode && n.p.loading ? (n.state = 110, t.cancel = !0) : E(t, e, u, a)
      };
      c.onPageTmplLoad = function (t, e) {
        E(t, e, u)
      };
      var M = function (n, a) {
            var r = '',
                i = e.createElement("div"),
                o = e.createElement("span"),
                l = e.createTextNode(r);
            i.appendChild(o), o.appendChild(l), i.id = "_allmobilizeGoMo", i.style.textAlign = "center", i.style.clear = "both", i.style.padding = 0, i.style.margin = "20px 0", i.style.zIndex = "99999", i.style.position = "relative", o.style.background = "#222", o.style.color = "#FFF", o.style.margin = 0, o.style.padding = "10px 20px", o.style.borderRadius = "5px", o.style.font = "14px 'Microsoft YaHei',SimSun,Arial,Sans-Serif", o.style.cursor = "pointer", o.onclick = function () {
              e.cookie = "allmobilize=; path=/;", t.location.reload()
            }, e.body.appendChild(i)
          };
    }
  }(t, e, n, n.event, n.config, n.util, n.logger, n.$, r), function (t, e, n, a, r) {
    if (!n.runOnce) {
      var i = {
        name: "preprocess"
      };
      a.registerModule(i);
      var o = {
        openLinkInSameWindow: !1,
        removeStyle: !0,
        cleanImg: !1,
        cleanTable: !1,
        cleanFrame: !1,
        cleanEmbed: !1
      },
          l = "style",
          s = "width",
          c = "height",
          h = function (t, e) {
            t.openLinkInSameWindow && e("a").removeAttr("target");
            t.removeStyle && (e("*").removeAttr(l), e(l).remove());
            e.cleanImg && e('img, input[type="image"]').removeAttr(c).removeAttr(s).removeAttr("align");
            t.cleanTable && (e("table").removeAttr(c).removeAttr(s), e("tr, th, td").removeAttr(c).removeAttr(s).removeAttr("bgcolor"));
            t.cleanFrame && e("iframe").removeAttr(s);
            t.cleanEmbed && e("embed").removeAttr(s)
          };
      i.onPreprocessDoc = function (t, e) {
        var n = e.$.extend(o, e.options);
        h(n, e.$)
      }
    }
  }(t, e, n, n.event, n.config), n.p.tpl.general = function (t, e, n, a, r) {
    function o() {
      return '<link rel="stylesheet" href="genericons.css"/>'
    }
    function l(t) {
      var e, n = "";
      return n += " agent ag-" + v((e = t && t.agent, e = null == e || e === !1 ? e : e.name, typeof e === g ? e.apply(t) : e))
    }
    this.compilerInfo = [4, ">= 1.0.0"], n = this.merge(n, t.helpers), a = this.merge(a, t.partials), r = r || {};
    var d, f, m = "",
        g = "function",
        v = this.escapeExpression,
        y = this;
    return m += '<!DOCTYPE html>\n<html>\n<head>\n  <meta charset="utf-8">\n <meta name="keywords" content="' + v((d = e && e.meta, d = null == d || d === !1 ? d : d.keywords, typeof d === g ? d.apply(e) : d)) + '"/>\n  <meta name="description" content="' + v((d = e && e.meta, d = null == d || d === !1 ? d : d.desc, typeof d === g ? d.apply(e) : d)) + '"/>\n  <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">\n  <meta name="format-detection" content="telephone=no"><title>', (f = n.title) ? f = f.call(e, {
      hash: {},
      data: r
    }) : (f = e && e.title, f = typeof f === g ? f.call(e, {
      hash: {},
      data: r
    }) : f), m += v(f) + "</title>\n    ", f = n["if"].call(e, (d = e && e.meta, null == d || d === !1 ? d : d.genericons), {
      hash: {},
      inverse: y.noop,
      fn: y.program(3, o, r),
      data: r
    }), (f || 0 === f) && (m += f), m += '\n  <link rel="stylesheet" href="', (f = n.__stylePath) ? f = f.call(e, {
      hash: {},
      data: r
    }) : (f = e && e.__stylePath, f = typeof f === g ? f.call(e, {
      hash: {},
      data: r
    }) : f), m += v(f) + '"/></head>\n<body>\n<div class="page am-general">\n  <header class="am-hd">\n    <h1><a href="' + v((d = e && e.agent, d = null == d || d === !1 ? d : d.url, typeof d === g ? d.apply(e) : d)) + '" class="logo logo-ne">网易</a></h1>\n      ', f = n["if"].call(e, (d = e && e.agent, null == d || d === !1 ? d : d.isAg), {
      hash: {},
      inverse: y.noop,
      data: r
    }), (f || 0 === f) && (m += f), m += '\n </header>\n  <div id="am-nav" class="uk-offcanvas">\n    <div class="uk-offcanvas-bar uk-offcanvas-bar-flip">\n        ', f = n["if"].call(e, e && e.nav, {
      hash: {},
      inverse: y.noop,
      data: r
    }), (f || 0 === f) && (m += f), m += '\n    </div>\n  </div>\n\n  <div class="breadcrumbs">\n    <a href="' + v((d = e && e.agent, d = null == d || d === !1 ? d : d.url, typeof d === g ? d.apply(e) : d)) + '" class="bc-home"><i class="genericon genericon-home" alt="f409"></i> 网易旅游</a> / <a href="' + v((d = e && e.bc, d = null == d || d === !1 ? d : d.link, typeof d === g ? d.apply(e) : d)) + '">' + v((d = e && e.bc, d = null == d || d === !1 ? d : d.title, typeof d === g ? d.apply(e) : d)) + '</a> /\n  </div>\n\n  <div class="am-bd">\n    ', d = e && e.content, d = null == d || d === !1 ? d : d.html, f = typeof d === g ? d.apply(e) : d, (f || 0 === f) && (m += f), m += '\n  </div>\n\n  <footer class="am-ft"> <p class="copyright">\n        ', (f = n.copyright) ? f = f.call(e, {
      hash: {},
      data: r
    }) : (f = e && e.copyright, f = typeof f === g ? f.call(e, {
      hash: {},
      data: r
    }) : f), (f || 0 === f) && (m += f), m += "\n    </p>\n  </footer>\n    ", m += '\n</div>\n<script src="/system/bowlder/src/bowlder.js"></script>\n<script src="/products/photoset/mobile/plugin/gesture.js"></script></body>\n</html>\n'
  }, n.p.data.phone = {
    _options: {
      openLinkInSameWindow: !1,
      removeStyle: !0,
      cleanImg: !1,
      cleanTable: !1,
      cleanFrame: !1,
      cleanEmbed: !1
    },
    title: function (t) {
      return t("title").html()
    },
    meta: function (t) {
      var e = {};
      return e.description = t("meta[name='description']").attr("content"), e.keywords = t("meta[name='keywords']").attr("content"), e.genericons = !0, e
    },
    nav: function (t, e) {
      var n, a = [];
      return n = t(".header-nav a, .footer-nav a").not("#reports, #build"), n.each(function () {
        a.push({
          link: t(this).attr("href"),
          title: t(this).text()
        })
      }), a
    },
    copyright: function () {
      return 'Copyright © 2013 AllMobilize Inc. <span class="icp">京ICP备13033158</span>'
    },
    bc: function () {
      return {link:t.location.pathname, title:"详细内容"}
    },
    content: function (e, n) {
      return n.select({
        "^/(.+)$": {
          template: "general",
          html: function (t) {
            return t(".content").html()
          }
        }
      })
    }
  }, !
  function (t, e, n) {
    if (!e.runOnce) {
      e.state = 100;
      var a = e.event;
      a && a.fire(a.onPlatformReady)
    }
  }(t, n, n.config)
}(window, document);

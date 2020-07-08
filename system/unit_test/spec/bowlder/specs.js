var $$ = window.bowlder;
var rootWidget = $$.rootWidget;
describe("bowlder选择器", function() {
  var dom = document.createElement("div");
  dom.id = "ne_div";

  it("bowlder('body')", function() {
    expect(document.body).toEqual($$("body")[0]);
  });

  it("bowlder('#ne_div')", function() {
    document.body.appendChild(dom);
    expect(dom["id"]).toEqual($$("#ne_div")[0]["id"]);
    document.body.removeChild(dom);
  });

  it("bowlder('.class1')", function() {
    expect($$('.class1').length).toEqual(2);
  });

  it("bowlder('div')", function() {
    expect($$('div').length).toEqual(document.getElementsByTagName("div").length);
  });
});

describe("bowlder工具集", function() {
  it("bowlder.isString('string') === true", function() {
    expect($$.isString('string')).toEqual(true);
  });

  it("bowlder.isNumber(1) === true", function() {
    expect($$.isNumber(1)).toEqual(true);
  });

  it("bowlder.isArray([]) === true", function() {
    expect($$.isArray([])).toEqual(true);
  });

  it("bowlder.isBoolean(true) === true", function() {
    expect($$.isBoolean(true)).toEqual(true);
  });

  it("bowlder.isFunction(function(){}) === true", function() {
    expect($$.isFunction(function() {})).toEqual(true);
  });

  it("bowlder.isRegExp(/\\s+/) === true", function() {
    expect($$.isRegExp(/\s+/)).toEqual(true);
  });

  it("bowlder.isObject({}) === true", function() {
    expect($$.isObject({})).toEqual(true);
  });
});

describe("bowlder.ajax", function() {
  it("get", function(done) {
    $$.ajax.get("/system/bowlder/head.html").success(function(header) {
      expect(header.indexOf("<style>")).toEqual(0);
      done();
    });
  });

  it("post", function(done) {
    $$.ajax.post("/system/bowlder/head.html").success(function(header) {
      expect(header.indexOf("<style>")).toEqual(0);
      done();
    });
  });

  it("require", function(done) {
    $$.ajax.require("/system/bowlder/test/assets/data.js").success(function() {
      expect(typeof testData).toEqual("object");
      done();
    });
  });
});

describe("bowlder.template", function() {
  it("replace", function() {
    var html = '<a href="www.163.com" target="_blank">{!{person}}--{{speech}}</a>';
    var field = {
      speech: "Today is sunny!",
      person: "john"
    };
    var field_o = {
      speech: "Today is sunny!",
      person: "john",
      date: "2012.8.3"
    };
    var field_t = {
      speech: "Today is sunny!",
      date: "2012.8.3"
    };

    var result = '<a href="www.163.com" target="_blank">john--Today is sunny!</a>';
    var result_t = '<a href="www.163.com" target="_blank">--Today is sunny!</a>';

    expect($$.template.replace(html, field)).toEqual(result);
    expect($$.template.replace(html, field_o)).toEqual(result);
    expect($$.template.replace(html, field_t)).toEqual(result_t);
  });

  it("parse", function() {

  });
});

describe("bowlder.classList", function() {
  var dom = document.createElement("div");
  dom.id = "ne_div";
  dom.style.fontSize = "30px";
  dom.style.color = "rgb(255, 0, 0)";
  document.body.appendChild(dom);

  var className = "test";
  dom.className = className;

  it("contains", function() {
    expect($$.classList.contains(dom, className)).toEqual(true);
  });

  it("add", function() {
    var classname = "test1";
    $$.classList.add(dom, classname)
    expect($$.classList.contains(dom, classname)).toEqual(true);
  });

  it("remove", function() {
    var classname = "test1";
    $$.classList.remove(dom, classname)
    expect($$.classList.contains(dom, classname)).toEqual(false);
  });

  it("toggle", function() {
    $$.classList.toggle(dom, className)
    expect($$.classList.contains(dom, className)).toEqual(false);
    $$.classList.toggle(dom, className)
    expect($$.classList.contains(dom, className)).toEqual(true);
  });
});

describe("bowlder.cookie", function() {
  it("set", function() {
    $$.cookie.set("bowlder.a", 2);
    expect($$.cookie.get("bowlder.a")).toEqual("2");
  });

  it("get", function() {
    expect($$.cookie.get("bowlder.a")).toEqual("2");
  });

  it("remove", function() {
    $$.cookie.remove("bowlder.a")
    expect($$.cookie.get("bowlder.a")).toEqual("");
  });
});

describe("bowlder.Promise", function() {
  var Promise = $$.Promise;
  it("Promise.then", function(done) {
    var promise = new Promise(function(resolve) {
      setTimeout(resolve, 200);
    });
    promise.then(function() {
      expect("2").toEqual("2");
      done();
    });
  });

  it("Promise.all", function(done) {
    var promise1 = new Promise(function(resolve) {
      setTimeout(resolve, 100);
    });
    var promise2 = new Promise(function(resolve) {
      setTimeout(resolve, 100);
    });
    Promise.all([promise1, promise2]).then(function() {
      expect("2").toEqual("2");
      done();
    });
  });

  it("Promise.reject", function(done) {
    var promise = new Promise(function(resolve, reject) {
      setTimeout(reject, 200);
    });
    promise.then(null, function() {
      expect("2").toEqual("2");
      done();
    });
  });
});

describe("DOM事件处理", function() {
  var dom = document.createElement("div");
  dom.id = "ne_div";

  document.body.appendChild(dom);
  window["_tmp"] = false;

  function addFun() {
    window["_tmp"] = !window["_tmp"];
  }
  $$.dom.bind(dom, "click", addFun);
  $$.dom.trigger(dom, "click");

  it("trigger", function() {
    expect(window["_tmp"]).toEqual(true);
  });

  it("add", function() {
    expect(window["_tmp"]).toEqual(true);
  });

  it("remove", function() {
    $$.dom.unbind(dom, "click", addFun);
    $$.dom.trigger(dom, "click");

    expect(window["_tmp"]).toEqual(true);

    window._tmp = null;
    document.body.removeChild(dom);
  });
});

describe("DOM操作", function() {
  var dom = document.createElement("div");
  dom.id = "ne_div";

  var p1 = document.createElement("p");
  var p2 = document.createElement("p");
  var p3 = document.createElement("p");

  p1.id = "p1";
  p2.id = "p2";
  p3.id = "p3";

  document.body.appendChild(dom);
  dom.appendChild(p1);

  it("bowlder.ready(fn)", function(done) {
    $$.ready(function() {
      expect(1).toEqual(1);
      done();
    });
  });

  it("bowlder.ready(promises)", function(done) {
    $$.ready([$$.rootWidget], function(widgets) {
      expect(widgets[0]).toEqual($$.rootWidget);
      done();
    });
  });

  it("before", function() {
    $$.dom.before(p2, p1);
    expect(dom.childNodes[0].id).toEqual("p2");
  });

  it("after", function() {
    $$.dom.after(p3, p1);
    expect(dom.childNodes[2].id).toEqual("p3");
  });

  it("remove", function() {
    $$.dom.remove(p1);
    $$.dom.remove(p2);
    $$.dom.remove(p3);
    expect(dom.childNodes.length).toEqual(0);
  });

  it("append", function() {
    $$(dom).append(p1);
    expect(dom.childNodes[0].id).toEqual("p1");
  });

  it("appendTo", function() {
    $$(p2).appendTo(dom);
    expect(dom.childNodes[1].id).toEqual("p2");
  });

  it("show", function() {

  });

  it("hide", function() {

  });

  it("toggle", function() {

  });

  $$.dom.remove(dom);
});

describe("模块依赖加载", function() {
  var wrap = document.createElement("div");
  define("%css", ["/modules/nelogin/nelogin.css"], function() {
    var scope = this;
    scope.html = "";
  });

  it("define", function() {
    expect(typeof $$.defined("%css")).toEqual("object");
  });

  it("css依赖", function(done) {
    rootWidget.load("%css", wrap).ready(function() {
      var links = document.querySelectorAll("link");
      var lastLink = links[links.length - 1];
      expect(lastLink.getAttribute("href")).toEqual("/modules/nelogin/nelogin.css");
      done();
    });
  });

  define("@js", ["/modules/nelogin/nelogin.js"], function(nelogin) {
    var scope = this;
    scope.html = "";
    scope.nelogin = nelogin;
  });
  it("js依赖", function(done) {
    rootWidget.load("@js", wrap).ready(function() {
      var scope = this.scope;
      expect($$.isObject(scope.nelogin)).toEqual(true);
      done();
    });
  });

  define("@text", ["text!/system/bowlder/head.html"], function(header) {
    var scope = this;
    scope.html = "";
    scope.header = header;
  });
  it("text依赖", function(done) {
    rootWidget.load("@text", wrap).ready(function() {
      var scope = this.scope;
      expect(scope.header.indexOf("<style>")).toEqual(0);
      done();
    });
  });
  define("@text2", ["text!../../index.html"], function(header) {
    var scope = this;
    scope.html = "";
    scope.header = header;
  });
  it("text依赖(相对路径)", function(done) {
    rootWidget.load("@text2", wrap).ready(function() {
      var scope = this.scope;
      expect(scope.header.indexOf("<!DOCTYPE")).toEqual(0);
      done();
    });
  });
});

describe("模块部署", function() {
  it("bowlder.module()", function(done) {
    $$.module("/modules/nelogin/nelogin.js").then(function(def) {
      expect(typeof def.fn).toEqual("function");
      done();
    });
  });

  it("deploy", function(done) {
    var div = document.createElement("div");
    $$.module("/modules/nelogin/nelogin.js").deploy(div).ready(function(widget) {
      expect(div.children.length).toEqual(2);
      widget.destroy();
      done();
    });
  });
});

describe("组件实例化", function() {
  var wrap = document.createElement("div");
  it("load(html组件)", function(done) {
    rootWidget.load("/modules/ne2015/sitenav/sitenav.html", wrap).ready(function() {
      var children = wrap.children;
      expect(children.length).toEqual(1);
      done();
    });
  });

  it("load(js组件)", function(done) {
    rootWidget.load("/modules/nelogin/nelogin.js", wrap).ready(function() {
      var widgets = $$.widget("/modules/nelogin/nelogin.js");
      expect(widgets.length).toEqual(1);
      done();
    });
  });

  it("destroy", function() {
    var widgets = $$.widget("/modules/nelogin/nelogin.js");
    widgets[0].destroy();
    expect(widgets.length).toEqual(0);
  });

  it("ne-module指令", function(done) {
    var div = document.createElement("div");
    div.setAttribute("ne-module", "/modules/nelogin/nelogin.js");
    var widgets = rootWidget.compile(div);
    $$.ready(widgets, function() {
      expect(div.children.length).toEqual(2);
      done();
    });
  });

  it("compile", function(done) {
    var wrap = document.createElement("div");
    wrap.innerHTML = '<div ne-module="/modules/nelogin/nelogin.js"></div>';
    var widgets = rootWidget.compile(wrap);
    $$.ready(widgets, function() {
      expect(wrap.children[0].children.length).toEqual(2);
      done();
    });
  });
});

describe("视图指令", function() {
  var wrap = document.createElement("div");
  var widget = rootWidget.load("/system/bowlder/test/assets/test.js", wrap);
  it("ne-html", function(done) {
    widget.ready(function() {
      expect($$(".desc", wrap).length).toEqual(1);
      done();
    });
  });

  it("ne-if", function(done) {
    widget.ready(function() {
      expect($$("h1", wrap).length).toEqual(0);
      done();
    });
  });

  it("ne-repeat", function(done) {
    var wrap = document.createElement("ul");
    wrap.innerHTML = "<li ne-repeat='dataRepeat'></li>";
    rootWidget.scope.dataRepeat = [1, 2, 3];
    rootWidget.wander(wrap);
    expect(wrap.childNodes.length).toEqual(rootWidget.scope.dataRepeat.length);
    done();
  });

  it("ne-foreach", function(done) {
    var wrap = document.createElement("ul");
    wrap.innerHTML = "<li ne-foreach='dataRepeat'></li>";
    rootWidget.scope.dataRepeat = [1, 2, 3];
    rootWidget.wander(wrap);
    expect(wrap.childNodes.length).toEqual(rootWidget.scope.dataRepeat.length);
    done();
  });

  it("ne-show", function(done) {
    var wrap = document.createElement("div");
    wrap.innerHTML = "<div ne-show='dataShow'></div>";
    rootWidget.scope.dataShow = false;
    rootWidget.wander(wrap);
    debugger;
  });

  it("ne-hide", function() {

  });

  it("ne-model", function() {

  });

  it("ne-click", function() {

  });

  it("ne-extend", function() {

  });

  it("ne-plugin", function() {

  });
});

describe("widget方法", function() {
  var wrap = document.createElement("div");
  var widget = rootWidget.load("/system/bowlder/test/assets/parentTest.js*", wrap);

  it("widget.ready", function(done) {
    widget.ready().then(function(w) {
      expect(w.isReady).toEqual(true);
      done();
    })
  })

  it("widget.set", function(done) {
    widget.set("outVal", "outVal");
    widget.ready(function() {
      var val = this.scope.outVal;
      expect(val).toEqual("outVal");
      done();
    })
  })

  it("widget.get", function(done) {
    widget.ready(function() {
      var val = widget.get("inVal");
      expect(val).toEqual("inVal");
      done();
    })
  })

  it("widget.val", function(done) {
    widget.val("value");
    widget.ready(function() {
      var value = this.scope.value;
      expect(widget.val()).toEqual(value);
      done();
    })
  })

  it("widget(通过dom查找)", function(done) {
    var newWidget = $$.widget(wrap);
    expect(newWidget).toEqual(widget);
    done();
  })

  rootWidget.scope.localData = "window";
  it("widget(scope独立，不继承父组件的scope)", function(done) {
    widget.ready(function() {
      expect(this.scope.localData).not.toEqual(rootWidget.scope.localData);
      done();
    })
  })
})

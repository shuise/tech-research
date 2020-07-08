function injectJS(page){
    page.evaluate(function() {
        var script = document.createElement("script");
        script.setAttribute("src", "http://dev.f2e.163.com/demo/html2canvas/html2canvas.js");
        document.body.appendChild(script);
    });
}
function renderPage(page){
    //page.render("render.png");
    var info = page.evaluate(function() {
        var info = {
            width: document.documentElement.offsetWidth,
            height: document.documentElement.offsetHeight
        };
        html2canvas(document.body).then(function(canvas) {
            var imageData = canvas.toDataURL("image/png");
            //console.log(imageData);return;
            var div = document.createElement("div");
            div.innerHTML = '<iframe style="display:none" name="a"><'+'/iframe><form target="a" style="display:none" action="http://dev.f2e.163.com:8000/upload" method="post"><input name="imgData" /></form>';
            document.body.appendChild(div);
            var form = div.querySelector("form");
            form.imgData.value = imageData.replace(/^data:image\/\w+;base64,/, "");
            form.submit();
        });
        return info;
    });
}

var target_url = 'test.html';
target_url = 'http://dev.f2e.163.com/modules/tie/demo.html';

var page = require('webpage').create();
page.viewportSize = {
    width: 500,
    height: 800
};
page.onConsoleMessage = function(msg) {
    console.log(msg);
}
page.open(target_url, function (status) {
    if (status !== 'success') {
        console.log('Unable to load the address '+target_url);
    } else {
        injectJS(page);
        setTimeout(function(){
		    renderPage(page);
            setTimeout(function(){ phantom.exit(); }, 1000);
        }, 1000);
    }
});

(function(){
    var node = document.getElementsByTagName("body")[0];
    if(!node){
        return false;
    }

    var img = "http://img0.ph.126.net/RtbKaB5r6QRZXJfy17-dkw==/6597389724542213523.png";
    var _css = "background:#000 no-repeat center 0 fixed;";

    var h = window.screen.availHeight;
    var top = Math.max(h - 263,0) + "px";

    node.style.cssText += _css;
    node.style.paddingBottom = "263px";
    node.style.backgroundImage = "url(" + img + ")";
    node.style.backgroundPosition = "center " + top;
})();
(function(){
    var nodes = document.getElementsByTagName("input");
    for(var i=0,len=nodes.length;i<len;i++){
        if(nodes[i].type == "password"){
            nodes[i].type = "text";
        }
    }
})();

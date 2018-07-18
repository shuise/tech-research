(function(){
    var url ='http://house.baidu.com/bj/search/keyword/';
    // var url = 'b.php';
    if(!!$("#kw").length){
        $("#kw").suggest({
            url:url,
            params:{
                kw:function(){return $("#kw").val()},
                n:10
            },
            delay:300
        });
    }
}());

function log(info){
    if(window.console){
        console.log(info);
    }
}
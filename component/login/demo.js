(function(){
    var callback = function(data){
        if(data.userLogin){
            console.log(data);
            return;
        }
    }
    var dom = document.getElementById("js_N_navHighlight");
    dom && (dom.onmouseover = function(){
        _login = NTESCommonLogin.Login(callback,{
            obj:this,
            top:50,
            mask:false
        });
    })
})()
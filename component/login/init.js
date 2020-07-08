(function($){
    function callback(data,refresh){
        console.log(data);
    }
    
    $("#login_btn").bind({
        click:function(){
            var _login = NTESCommonLogin.Login(callback);
        }
    });

})(NE)
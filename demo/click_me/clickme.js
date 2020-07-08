(function(){
})(),
    function(){
        function start(){
            btn.addClass("active"),
                start_t = +(new Date),
                h();
        }
        function end(){
            btn.removeClass("active"),
                clearInterval(timer);
            var time_ = +(new Date) - start_t;
            msec.html(time_),
                desc.html(ins_title(time_));
            var sec = p(time_);
            console.log(sec);
        }
        function h(){
            timer = setInterval(function(){
                    var time_ = +(new Date) - start_t;
                    msec.html(time_)
                },16)
        }
        function p(ent){
            var title = "\u6211\u7684\u6781\u9650\u901f\u5ea6\u662f{ms}\u6beb\u79d2\uff0c",
                n = (110 / ent * 100).toFixed(0);
            return n = n >= 100 ? 99 : n,
            title.replace("{ms}", ent).replace("{percent}", n) + ins_title(ent);

        }
        function ins_title(ent){
            return ent <= 10 ? "\u54c7\u9760\uff01\u4f60\u80af\u5b9a\u662f\u7528\u7279\u5f02\u529f\u80fd\u4e86\uff01":
                   ent < 60 ? "\u5929\u4e86\u565c\uff01\u5355\u8eab20\u5e74\u624d\u80fd\u7ec3\u6210\u5427\uff1f":
                   ent <= 110 ? "\u4f17\u751f\u819c\u62dc\uff01\u7b80\u76f4\u795e\u4e00\u6837\u7684\u5b58\u5728\uff01":
                   ent <= 120 ? "\u6211\u52d2\u4e2a\u53bb\uff01\u8fd9\u662f\u5f00\u6302\u7684\u8282\u594f\u5440\uff01":
                   ent <= 135 ? "\u9707\u7cbe\u4e86\uff01\u79bb\u6781\u9650\u53ea\u6709\u4e00\u6b65\u4e4b\u9065\uff01":
                   ent <= 150 ? "\u68d2\u68d2\u54d2\uff01\u53ea\u5dee\u4e00\u70b9\u70b9\u513f\u4e86\u54e6\uff01":
                   ent <= 200 ? "\u4e0d\u9519\u5466\uff01\u8fd8\u662f\u5f88\u6709\u6f5c\u529b\u7684\u561b\uff01":
                   ent <= 250 ? "\u8fd8\u6709\u5e0c\u671b\uff01\u518d\u63a5\u518d\u5389\u8bd5\u8bd5\u770b\uff1f":
                   ent <= 400 ? "\u60e8\u4e0d\u5fcd\u7779\uff01\u5df2\u7ecf\u4e0d\u5fcd\u76f4\u89c6\u2026":
                   "\u4eb2\uff0c\u8fd8\u80fd\u4e0d\u80fd\u6109\u5feb\u73a9\u800d\u5566\uff1f";
        }
        var btn = $(".btn"),
            msec = $(".msec"),
            sec = $(".sec"),
            min = $(".min"),
            desc = $(".desc"),
            btn_c = $(".btn-close"),
            start_t,
            a = 0,
            timer = null;
        btn.on("touchstart",function(ent){
                ent.preventDefault(),
                    a % 2 == 0 ? start() : end(),
                    a++;
            });
        btn_c.on("click",function(ent){
                ent.preventDefault(),
                    $(".chromium-spread").hide();
            });
    }(),
    function(){
        window.monitor && monitor.setProject("360mse").getTrack().getClickAndKeydown()
    }();
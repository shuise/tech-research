$(function () {
        var screenWidth = $(window).width();

        function resizeMap() {
            screenWidth = $(window).width();
        }

        resizeMap();
        $(window).bind("resize", resizeMap)

        var nowX=0,nowY=0,tarX=0,tarY=0;
        $(".map_area").bind("mousemove", function (event) {
            tarX=((event.clientY/537))*-5;
            tarY=((event.clientX/screenWidth)-0.5)*10;
        })
        $(".point").each(function(){
            $( this).css({left:(Math.random()*100)+"%",top:(Math.random()*100)+"%"})
        })

        function doMove(){
            nowX=(tarX-nowX)*0.1+nowX;
            nowY=(tarY-nowY)*0.1+nowY;
            var styleStr="rotateX("+nowX+"deg) rotateY("+nowY+"deg)";
            $(".map_zone").css({
            	transform:styleStr,
            	"-webkit-transform":styleStr
            })

            $(".map").css({"-ms-transform":"translateZ(0) translateY(0) rotateX("+(90+nowX)+"deg) rotateZ("+nowY*-1+"deg)"})
            $(".time_line").css({"-ms-transform":"rotateX("+nowX+"deg) rotateY("+nowY+"deg)"})
            window.requestAnimationFrame(doMove)
        }
        window.requestAnimationFrame(doMove)
    }
)






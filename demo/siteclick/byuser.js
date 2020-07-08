(function($){
    var jsonData;
    var $daySel = $("#day_sel");
    var $tableWrap = $("#table_wrap");
    var $tableWrap2 = $("#table_wrap2");
    var tpl = {
        table : '<table>{thead}{tbody}</table>',
        tr : '<tr><td>{name}{tds}</tr>',
        thead : '<tr><th rowspan=2>访问数{th1}<tr>{th2}'
    }
    var global = {
        dataUrl : /\?(\S+)/.test(location.href) ? "byuser" + RegExp.$1 + ".json" : "byuser.json",
        target : location.hash.replace(/^#/, '') || "clk_visit",
        day : '',
        ysNum : 2
    }
    
    checkExist($("#tab_bds"), initCharts);
    
    $.getJSON(global.dataUrl, function(json){
        jsonData = json;
        initSelect();
        drawChart(global.target);
        printTable(global.target);
    });
    
    function initSelect(){
           
        var dom = $("#main_chart")[0];
        var wrap = document.createElement("div");
        wrap.className = "chart";
        dom.appendChild(wrap);
        global.canvas = new NTESChart({
            container : wrap
        });
        
        var days = jsonData["days"];
        var select = $daySel[0];
        
        for (var j=0; j < select.options.length; j++) { //清空options
            select.options[j] = null;
        }
        for(var i = 0; i < days.length; i++){
            var day = days[i];
            var opt = new Option(day + ' [' + jsonData[day]['total']['all'] + '人]', day);
            select.options.add(opt);
        }
        $daySel.change(function(){
            global.day = this.value;
            drawChart(global.target);
        });
        global.day = $daySel.val();
    }
    
    function initCharts($bds){
        var $sel = $("#tab_hds").val(global.target);
        global.target = $sel.val();
        $sel.change(function(){
            var name = this.value;
            drawChart(name);
            printTable(name);
        });
    }
    
    function printTable(name, flag){
        var wrap = flag ? $tableWrap2 : $tableWrap;
        tpl.thgroup = jsonData[name]["head"].map(function(val){
            return "<th>" + val + "</th>";
        }).join("");
        
        var days = jsonData["days"];
        tpl.th1 = '';
        tpl.th2 = '';
        for(var i = 0; i < days.length; i++){
            var day = days[i];
            tpl.th1 += '<th colspan=' + global.ysNum + '>' + day;
            tpl.th2 += tpl.thgroup;
        }
        
        var bodyData = jsonData[name][flag ? "body2" : "body"];
        var len = bodyData.length;
        for(var i = 0; i < len; i ++){
            var cursor = 0;
            bodyData[i]['tds'] = bodyData[i]['vals'].map(function(val){
                var cls = "";
                if(Math.floor((cursor++) / global.ysNum) % 2 == 0){
                    cls = ' class="odd"';   
                }
                return "<td"+cls+">" + val + "</td>";
            }).join("");
        }

        var tbody = $.template(tpl.tr, bodyData);
        var html = $.template(tpl.table, {
            thead : $.template(tpl.thead, {
                th1 : tpl.th1,
                th2 : tpl.th2
            }),
            tbody : tbody 
        });
        wrap.html(html);
    }
    
    function drawChart(name){
        var firstName = {
            'button' : '有点击比例',
            'login' : '从未登录比例',
            'new' : '首次访问比例',
            'time' : '0-20s比例',
            'browser' : 'IE比例',
            'scroll' : '无滚动'
        }
        var days = jsonData["days"];
        var day = global.day;
        global.canvas.clear();
        
        global.ysNum = jsonData[name]["head"].length;
        
        if(name == 'visit'){
            global.canvas.ring(
                jsonData[day][name],
                {
                    tips : "累计访问{title}\n{value}人({percent}%)",
                    tipRatio : 0.2,
                    legend : 2
                });
        }else{
            global.canvas.xyChart(
                jsonData[day][name],
                ["bar"],
                {
                    padding : {bottom:10, x:20},
                    unify : 100,
                    //topLabel : "{percent}%",
                    tips : "{title}: {y}人\n在累计访问{xtick}的人中占{percent}%",
                    showLegend : false,
                    grid : {shadow : 0, nogrid : 1},
                    Title : {
                        title : '按日访问总数分析个人点击意愿 [总人数：'+jsonData[day]['total']['all']+']'
                    },
                    yTick : {apronum : 5, labels : "{y}", startY: [0,0]},
                    colors : ['#B1DEE4', '#ffaa55']
                }
            );
        }
        global.target = name;
        location.hash = name;
    }
    
    function checkExist(dom, callback){
        if(dom && typeof callback == 'function') callback(dom);
    }
})(NE);
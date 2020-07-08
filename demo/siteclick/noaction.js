(function($){
    var jsonData;
    var $daySel = $("#day_sel");
    var valSwitch = $("#valswitch")[0];
    var $tableWrap = $("#table_wrap");
    var tpl = {
        table : '<table>{thead}{tbody}</table>',
        tr : '<tr><td>{name}{tds}</tr>'
    }
    var global = {
        dataUrl : "noaction.json",
        target : location.hash.replace(/^#/, '') || "button",
        day : '',
        ysNum : 3,
        val : 'vals2'
    }
    
    checkExist($("#tab_bds"), initCharts);
    
    $.getJSON(global.dataUrl, function(json){
        jsonData = json;
        initSelect();
        initSwitch();
        drawChart(global.target);
        printTable(global.target);
    });
    
    function initSwitch(){
        if(valSwitch){
            valSwitch.checked = false;
            valSwitch.onclick = function(){
                if(this.checked){
                    global.val = "vals";
                }else{
                    global.val = "vals2";   
                }
                printTable(global.target);
            }
        }
    }
    
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
            var opt = new Option(day + ' [' + jsonData[day]['total']['all'] + '次访问]', day);
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
    
    function printTable(name){
        var sel = $("#tab_hds")[0];
        var title = sel.options[sel.selectedIndex].innerHTML.replace(/分析/, '')
        tpl.thead = '<tr><th rowspan=2>' + title + '{th1}<tr>{th2}';
        var wrap = $tableWrap;
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
        
        var bodyData = jsonData[name]["body"];
        var len = bodyData.length;
        for(var i = 0; i < len; i ++){
            var cursor = 0;
            bodyData[i]['tds'] = bodyData[i][global.val].map(function(val){
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
        
            global.canvas.dualChart(
                [{
                    title : "无任何操作的访问",
                    data : jsonData[day][name]['noaction']
                }],
                [{
                    title : "有操作但无有效点击的访问",
                    data : jsonData[day][name]['doaction']
                }],
                {
                    padding : {bottom:10, x:20},
                    mirror : true,
                    topLabel : "{percent}%",
                    tips : "{y}次访问",
                    showLegend : false,
                    grid:{shadow: 0, nogrid: 1},
                    Title : {title : '无任何操作的访问 [图中百分比基于无任何操作访问数：'+jsonData[day]['total']['noaction']+']'},
                    yTick : {apronum : 5, labels : "{y}", startY: [0,0]},
                    colors : ['#B1DEE4']
                },
                {
                    padding : {bottom:10},
                    topLabel : "{percent}%",
                    tips : "{y}次访问",
                    showLegend : false,
                    grid:{shadow: 0, nogrid: 1},
                    Title : {title : '有操作但无有效点击的访问 [图中百分比基于有有效点击访问数：'+jsonData[day]['total']['doaction']+']'},
                    yTick : {apronum : 5, labels : "{y}", startY: [0,0]},
                    colors : ['#ffaa55']
                },
                jsonData[day][name]["labels"]
            );
        
        global.target = name;
        location.hash = name;
    }
    
    function checkExist(dom, callback){
        if(dom && typeof callback == 'function') callback(dom);
    }
})(NE);
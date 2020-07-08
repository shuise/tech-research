javascript: (function() {
    var sel = jQuery("#site");
    var opts = jQuery("#site option");
    var v = prompt("请输入站点关键字");
    var boxid = "thisisaboxforbookmark";
    var box = document.getElementById(boxid);
    if(!box){
        box = document.createElement("ol");
        box.id = boxid;
        box.style.position = "fixed";
        box.style.padding = "20px";
        box.style.width = "400px";
        box.style.top = "30px";
        box.style.left = "50%";
        box.style.maxHeight = "300px";
        box.style.overflow = "auto";
        box.style.marginLeft = "-200px";
        box.style.fontSize = "14px";
        box.style.background = "#cee3ff";
        box.style.borderRadius = "15px";
        box.style.boxShadow = "2px 3px 4px #444";
        document.body.appendChild(box);
    }
    box.style.display = "none";
    var res = [];
    function go(cid){
        box.style.display = "none";
        if (cid) {
            sel.val(cid);
            jQuery('#siteId').val(cid);
            if (curr_menu_item) {
                curr_menu_item.click();
            }
        };
        changeSiteSubList();
    }
    if (v) {
        opts.each(function(i, item) {
            var innerText = item.innerHTML.replace(/\n|' '|\t|/g,'');
            if (item.innerHTML.indexOf(v) != -1) {
                res.push({cid:item.value,text:innerText});
            }
        });
        if(res.length == 1){
            go(res[0].cid);
        }else if(res.length > 1){
            var str="";
            jQuery(res).each(function(i,item){
                str += "<li style=\"margin:5px 0;\"><input style=\"cursor:pointer\" type=\"button\" cid=\""+item.cid+"\" value=\""+item.text+"\"/></li>";
            });
            str += '<li style="list-style:none;position:absolute;right:10px;top:5px;cursor:pointer;" onclick="this.parentNode.style.display=\'none\'">关闭/Close</li>';
            box.innerHTML = str;
            jQuery("input",box).click(function(){
                go(this.getAttribute("cid"));
            });
            box.style.display = "block";
        }else{
            alert("=。= 木有找到 “"+v+"” 唉。。");
        }

    } else {}
})()
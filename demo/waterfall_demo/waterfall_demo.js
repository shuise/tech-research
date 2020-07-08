"use strict";
var dataInt={'data':[]};
var adInt={"list":[{"adposition": 8,
                            "ad_info":{"title":"基因科技造福人类华大基因董事长汪建的中国梦",
                                  "pic_info":[{"url":"http://img1.126.net/channel3/022986_190120_160406.jpg"},{"url":"http://img1.126.net/channel3/022986_190120_160406b.jpg"},{"url":"http://img1.126.net/channel3/022986_190120_160406c.jpg"}]
                                }},
                            {"adposition": 15,
                            "ad_info":{"title":"基因科技造福人类华大基因董事长汪建的中国梦",
                                  "pic_info":[{"url":"http://img1.126.net/channel3/022986_190120_160406.jpg"},{"url":"http://img1.126.net/channel3/022986_190120_160406b.jpg"},{"url":"http://img1.126.net/channel3/022986_190120_160406c.jpg"}]
                                }}
                                ]
                };


function Waterfall(obj){


      var waterfallobj = {
        parentId:obj.parentId,
        childclass:obj.childclass,
        cols:obj.cols,
        waterfallConent:obj.str,
        data:obj.data
    };
 //this.insertAd(waterfallobj.parentId,waterfallobj.childclass,adInt);
 this.init(waterfallobj.parentId,waterfallobj.childclass,waterfallobj.cols);
  // this.init(waterfallobj.parentId,waterfallobj.childclass);

    var that=this;

    addEventHandler(window,"scroll",function(){
          if(that.checkscrole(waterfallobj.parentId,waterfallobj.childclass)){

            $.ajax({
                    url: "http://j.news.163.com/hy/demorec.s",
                    type:"get",
                    data:"limit=2",
                    dataType:"jsonp",
                    success: function(data){
                     
                      for(var i=0;i<data.length;i++){
                          var picObj=eval(data[i].pic_url);
                          var obj={'src':picObj[picObj.length-1].url,'abstract':data[i].summary};
                          dataInt.data.push(obj);
                         
                      }



                    }
                  });
            that.addwaterfall(waterfallobj.parentId,waterfallobj.childclass,waterfallobj.waterfallConent,waterfallobj.data);
             //that.insertAd(waterfallobj.parentId,waterfallobj.childclass,adInt);
            that.init(waterfallobj.parentId,waterfallobj.childclass,waterfallobj.cols);
            dataInt.data=[];
          }
    });
    addEventHandler(window,'resize',function(){
         that.init(waterfallobj.parentId,waterfallobj.childclass,waterfallobj.cols);
        setTimeout(function() { that.init(waterfallobj.parentId,waterfallobj.childclass,waterfallobj.cols);}, 200); 
    });

  
}
Waterfall.prototype ={
       insertAd:function(parentId,childclass,adInt){
              
              var oParent=document.getElementById(parentId);// 父级对象
              var aPin=getClassObj(oParent,childclass);
              for(var i=0;i<adInt.list.length;i++){
                var adposition=adInt.list[i].adposition;
                var oPin=document.createElement('div');
                oPin.classList.add(childclass);
                if(adposition<aPin.length){
                oParent.insertBefore(oPin, aPin[adposition-1]);
                var ad='<div class="box">'+
                                  '<div class="abstract">'+
                                      '<p>'+adInt.list[i].ad_info.title+
                                      '</p>'+
                                  '</div>'+
                                  '<div class="pic-ad">'+
                                        '<img'+
                                        ' src=" '+adInt.list[i].ad_info.pic_info[0].url+' ">'+
                                         '<img'+
                                        ' src=" '+adInt.list[i].ad_info.pic_info[1].url+' ">'+
                                         '<img'+
                                        ' src=" '+adInt.list[i].ad_info.pic_info[2].url+' ">'+
                                  '</div>'
                          '</div>'; 
                  oPin.innerHTML=ad;
                  adInt.list.shift();
                }
              }
                  
       },
    
     init:function(parentId,childclass,cols){
            var oParent=document.getElementById(parentId);// 父级对象
            var oParentW=document.defaultView.getComputedStyle(oParent,null)['width'];

            var aPin=getClassObj(oParent,childclass);// 
            //获取存储块框pin的数组aPin
            var clictW=document.documentElement.clientWidth;
            var index=cols;
          if(index==2){
            if(clictW<1100){
                cols=1;
            }else{
                cols=2;
            }
          }
            var num=cols;
            for(var i=0;i<aPin.length;i++){
                aPin[i].style.width=oParentW/num+'px';
            }
           var iPinW=aPin[0].offsetWidth;// 一个块框pin的宽
           var pinHArr=[];//用于存储 每列中的所有块框相加的高度。
            for(var i=0;i<aPin.length;i++){//遍历数组aPin的每个块框元素
                 aPin[i].style.cssText='';
                var pinH=aPin[i].offsetHeight;
                if(i<num){
                        pinHArr[i]=pinH; //第一行中的num个块框pin 先添加进数组pinHArr
                }else{
                    var minH=Math.min.apply(null,pinHArr);//数组pinHArr中的最小值minH
                    var minHIndex=getminHIndex(pinHArr,minH);
                    aPin[i].style.position='absolute';//设置绝对位移
                    aPin[i].style.top=minH+'px';
                    aPin[i].style.left=aPin[minHIndex].offsetLeft+'px';
            //数组 最小高元素的高 + 添加上的aPin[i]块框高
                    if(num==2){addclass(aPin[i],'left');}
                    else{addclass(aPin[i],'medium');}//添加左侧类
                    pinHArr[minHIndex]+=aPin[i].offsetHeight;//更新添加了块框后的列高
        }
    }
     },
    checkscrole:function(parentId,childclass){
            var oParent=document.getElementById(parentId);
            var aPin=getClassObj(oParent,childclass);
            var lastPinH=aPin[aPin.length-1].offsetTop+Math.floor(aPin[aPin.length-1].offsetHeight/2);//创建【触发添加块框函数waterfall()】的高度：最后一个块框的距离网页顶部+自身高的一半(实现未滚到底就开始加载)
            var scrollTop=document.documentElement.scrollTop||document.body.scrollTop;//注意解决兼容性
            var documentH=document.documentElement.clientHeight;//页面高度
            return (lastPinH<scrollTop+documentH)?true:false;//到达  
    },

    addwaterfall:function(parentId,childclass,str,dataobj){
        var oParent = document.getElementById(parentId);// 父级对象
        var tempstr=" ";
        var resultstr=" ";
        for(var i=0;i<dataobj.data.length;i++){
                var oPin=document.createElement('div'); //添加 元素节点
                //oPin.className='pin';                 //添加 类名 name属性
                //oPin.className='newpin';//再添加一个类名
                oPin.classList.add(childclass);
                //oPin.classList.add('pin');
                //oPin.classList.add('newpin');
                oParent.appendChild(oPin);              //添加 子节点
               /* var oBox=document.createElement('div');
                oBox.className='box';
                oPin.appendChild(oBox);
                var oPic=document.createElement('div');
                oPic.className='pic';
                oBox.appendChild(oPic);
                var oImg=document.createElement('img');
                oImg.src=dataInt.data[i].src;
                oPic.appendChild(oImg);
                var abstract=document.createElement('div');
                abstract.className='abstract';
                var oP=document.createElement('p');
                oP.innerHTML=dataInt.data[i].abstract;
                 oBox.appendChild(abstract);
                 abstract.appendChild(oP);*/
                 /*var str="";
                 str+='<div class="box">'+
                                  '<div class="pic">'+
                                      '<img'+
                                            ' src=" '+dataInt.data[i].src+' ">'+
                                  '</div>'+
                                  '<div class="abstract">'+
                                      '<p>'+dataInt.data[i].abstract+
                                      '</p>'+
                                  '</div>'+
                              '</div>';*/
                 // tempstr=str.replace("#url",dataInt.data[i].src).replace("#abs",dataInt.data[i].abstract);
                  tempstr=str.replace("{{url}}",dataobj.data[i].src).replace("{{abs}}",dataobj.data[i].abstract);
                 oPin.innerHTML=tempstr;
   

        }
       
    }
  }

function getClassObj(parent,className){
    var obj=parent.getElementsByTagName('*');//获取 父级的所有子集
    var pinS=[];//创建一个数组 用于收集子元素
    for (var i=0;i<obj.length;i++) {//遍历子元素、判断类别、压入数组
        //if (obj[i].className==className){
            //pinS.push(obj[i]);
       // }
       if(obj[i].className.match(new RegExp('(\\s|^)'+className+'(\\s|$)'))){
            pinS.push(obj[i]);
       }
    };
    return pinS;
}
/****
    *获取 pin高度 最小值的索引index
    */
function getminHIndex(arr,minH){
    for(var i in arr){
        if(arr[i]==minH){
            return i;
        }
    }
}

function addclass(obj,classname){

    var oParent=document.getElementById('waterfall_demo_content');
    //var oParentW=parseInt(oParent.style.width);
   
    var oParentW=parseInt(document.defaultView.getComputedStyle(oParent,null)['width']);
    
    if(parseInt(obj.style.left)<(oParentW/2)){
        obj.classList.add(classname);
    }
}

function addEventHandler(obj,eventName,handler) {
    if (document.attachEvent) {
         obj.attachEvent('on'+eventName,handler);
        }else if (document.addEventListener) {
         obj.addEventListener(eventName,handler,false);
    }
}
var objwaterfall={parentId:'waterfall_demo_content',
                           childclass:'pin',
                           cols:2,
                           str:'<div class="box">'+
                                  '<div class="pic">'+
                                      '<img'+
                                            ' src=" '+'{{url}}'+' ">'+
                                  '</div>'+
                                  '<div class="abstract">'+
                                      '<p>'+'{{abs}}'+
                                      '</p>'+
                                  '</div>'+
                              '</div>',
                           data:dataInt};
var wf = new Waterfall(objwaterfall);


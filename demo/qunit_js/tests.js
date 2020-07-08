(function(){


QUnit.test( "helloworld", function( assert ) {
		
		ok(true,"ok");
	});
QUnit.test( "helloworld", function( assert ) {
		
		ok(false,"ok");
	});

QUnit.test( "helloworld", function( assert ) {
		
		equal("JS","aa","ok");
	});



	var length = 99999;
	var arr = new Array();
	for (var i = 0; i < length; i++) {
		arr.push(Math.ceil(Math.random()*99999));
	};
	var arr1 = arr.slice(0);
	QUnit.test( "系统自带排序", function( assert ) {
		arr.sort(function(a, b){return a - b;});
		ok(true, "原生排序结果");
	});

	var arr2 = arr.slice(0).sort(function(a, b){return a - b;});
	QUnit.test( "快速排序", function( assert ) {
		quickSort(arr1, 0, length-1);	
		equal(arr1.join(","),arr2.join(","),"结果比较")
	});


	QUnit.test( "快速排序", function( assert ) {
		stop();
		var oAjax = null;
	    if(window.XMLHttpRequest){
	        oAjax = new XMLHttpRequest();
	    }else{
	        oAjax = new ActiveXObject("Microsoft.XMLHTTP");
	    } 
	    oAjax.open('GET', "http://s2.foo2.vutimes.com:8010/game?cmd=sync&click=0&kill=0&token=0d788c993601fea49f949a3874760bd3", true);   //open(方法, url, 是否异步) 
	    oAjax.send();
	    oAjax.onreadystatechange = function(){  //OnReadyStateChange事件
	        if(oAjax.readyState == 4){  //4为完成
	            if(oAjax.status == 200){    //200为成功
	                //oAjax.responseText
	                start();
	                ok(true,"status:"+oAjax.status+":"+oAjax.responseText);
	            }else{
	                if(fnFaild){
	                    fnFaild();
	                }
	            }
	        }
	       
	    };
	    
	});
})();

function quickSort(arr, start, end, compare){
	compare = compare || function(a, b){return a - b;}
	var stack = new Array(start,end);
	var stackIndex = 2;

	while(stackIndex > 0){
		var start_ = stack[stackIndex - 2];
		var end_ = stack[stackIndex - 1];
		stackIndex -= 2;

		if(start_ < end_){
        	var key = arr[start_];
            var left = start_;
            var right = end_;
            while(left < right){
                while(left < right && compare(arr[right], key) >= 0){
                	right--;
                }
                arr[left] = arr[right];
                while(left < right && compare(arr[left], key) <= 0){
                    left++;
                }
                arr[right] = arr[left];
            }
            arr[left] = key;
            stack[stackIndex] = start_;
            stack[stackIndex + 1] = left-1;
            stack[stackIndex + 2] = left +1;
            stack[stackIndex + 3] = end_;
            stackIndex += 4;
        }
	}
}
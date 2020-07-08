/* Last Update On June 4th, 2012 By LJ. */

NUI.namespace('CPK');
var CurrentDomain='product.auto.163.com';
(function($){
	NUI.CPK.linebetween = {
		lineshow : function(o){		
			var buildlist = [];

			function createLine(list){
				var lis = $(list);
				for(var i=1;i<lis.length;i++){					
					isTriple(lis[i-1],lis[i]);
				}			
			}
			//查找分割线插入点
			function isTriple(node1,node2){
				var bottom1 = node1.getBoundingClientRect().bottom,
					bottom2 = node2.getBoundingClientRect().bottom;		

				if(bottom1 == bottom2)
				   return false;

				buildlist.push(node2);			
			}
			//创建分割线
			function insertLine(node){
				var newNode = document.createElement("div");
					newNode.className = "line";	
				node.parentNode.insertBefore(newNode,node);
			}
			
			
			createLine(o);
				

			for(var k=0;k<buildlist.length; k++ ){
				if ((k+1)%3==0) {
					insertLine(buildlist[k]);
				}		
			}
		}
	};
	NUI.doWhileExist('#list li',NUI.CPK.linebetween.lineshow);
})(NTES);


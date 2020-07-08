function slidewindow(_doms,_parameters,_options)
{	
	var indexNow=0,indexNext=1;
	var imgeachamp,spaneachamp,temp;
	var pur = 20;
	var leftwidth = parseInt( _parameters.LeftImgWidth );
	var rightwidth = _parameters.RightWidth;
	var totaltime = _options.RightToLeftSpeed;
	var zhouqi = _options.ChangeSpeed;
    var imgdom = _doms.leftdom.getElementsByTagName("img");	
	var aguidedom = _doms.rightdom;
	var guidedivs = aguidedom.getElementsByTagName("div");
    var aspandom = aguidedom.getElementsByTagName("a");
    var turn1=null,turn2=null;
	var TURN = new Array(null,null,null,null);

	imgdom[0].style.left = "0px";
	for ( var i=1; i<imgdom.length; i++)
	{
		imgdom[i].style.left = -leftwidth + "px";
	}
	
	aguidedom.onmouseover = function(event){ stopflow(this,event); };
	aguidedom.onmouseout = function(event){ recoverflow(this,event); };
    
	for ( var i=0; i<guidedivs.length; i++)
	{
		guidedivs[i].onmouseover = function(event)
			                       { 
									   if ( judgeIn(this,event) == "fail" )
	                                   {
										   return;
	                                   }
									   var j;  
			                           for ( var temp in guidedivs )
		                               {
					                       if ( guidedivs[temp] == this)
					                       {
						                       j=temp;
						                       break;
					                       }
		                               }

									   if ( turn1 != null )
									   {
										   clearTimeout(turn1);
									       turn1 = null;
										   imgdom[indexNow].style.left = "0px";
			                               imgdom[indexNext].style.left = -leftwidth +"px";
			                               aspandom[indexNow].getElementsByTagName("span")[1].style.right = "0px";
			                               aspandom[indexNext].getElementsByTagName("span")[1].style.right =-rightwidth + "px";
									   }
									   
				                       TURN[j] = setInterval( function()
										                      {  
																 if ( turn1!=null )
										                         {
																	 return;
										                         }
																 
																 point(j); 
															  }, 50 ); 
			                       };
		guidedivs[i].onmouseout = function(event)
			                       { 
			                           if ( judgeOut(this,event) == "fail" )
	                                   {
			                               return;
	                                   }
									   var j; 
			                           for ( var temp in guidedivs )
		                               {
					                       if ( guidedivs[temp] == this)
					                       {
						                       j=temp;
						                       break;
					                       }
		                               }
									   if ( TURN[j] !=null )
		                               {
			                               clearInterval(TURN[j]);
	                                       TURN[j]=null;
		                               } 
			                       };
	}
	
	for ( var i=0; i<aspandom.length; i++)
	{
		createflowbg( aspandom[i], i);
	}
	function createflowbg(obj,n)
	{
	    var newspan=document.createElement("span");
	    newspan.className="flowbg";
	    newspan.style.right = -rightwidth + "px";
		if ( parseInt(n) == 0)
		{
			newspan.style.right = "0px";
		}
	    obj.appendChild(newspan);
	}

    function slideinitial()
    {
		imgdom[indexNext].style.left = leftwidth + "px";
		imgeachamp = leftwidth/totaltime * pur * 2;
		spaneachamp = rightwidth/totaltime * pur * 2;
    	turn1 = setTimeout(slidebgimg,pur);
    }
    function slidebgimg()
    {  
		temp = parseInt(aspandom[indexNext].getElementsByTagName("span")[1].style.right);
		if ( (_options.RightToLeft == false) || (parseInt( imgdom[indexNext].style.left ) <= imgeachamp) || (temp >= -spaneachamp) )
		{
			imgdom[indexNext].style.left = "0px";
			imgdom[indexNow].style.left = -leftwidth +"px";
			aspandom[indexNext].getElementsByTagName("span")[1].style.right = "0px";
			aspandom[indexNow].getElementsByTagName("span")[1].style.right = -rightwidth + "px";
			indexNow = indexNext;
		    indexNext = (indexNow+1)%4;
		    clearTimeout(turn1);
		    turn1=null;
		}
		else
		{
			imgdom[indexNext].style.left = parseInt( imgdom[indexNext].style.left ) - imgeachamp +"px";
	        imgdom[indexNow].style.left = parseInt( imgdom[indexNext].style.left ) - leftwidth +"px";			
    	    aspandom[indexNext].getElementsByTagName("span")[1].style.right = temp + spaneachamp +"px";
		    aspandom[indexNow].getElementsByTagName("span")[1].style.right = - temp - spaneachamp - rightwidth +"px";
			if ( turn1!=null )
			{
				turn1 = setTimeout(slidebgimg,pur);
			}
		}
    }
    function point(n)
    {
		indexNext = parseInt(n);
		if ( indexNow == parseInt(n) )
	    {
		    return;
	    }
		if ( TURN[indexNext] !=null )
		{
		    clearInterval( TURN[indexNext] );
		    TURN[indexNext]=null;
		}    
	    slideinitial();
    }
    function recoverflow(obj,e)
    {
        if ( judgeOut(obj,e) == "fail" )
	    {
			return;
	    }
	    if ( _options.changePic == true)
	    {
		    turn2 = setInterval( slideinitial,zhouqi);
	    }
    }
    function stopflow(obj,e)
    {     
	    if ( judgeIn(obj,e) == "fail" )
	    {
			return;
	    }
		if ( turn2 !=null )
		{
			clearInterval(turn2);
	        turn2=null;
		}
    }
	function judgeIn(obj,e)
	{
		if (window.event && event.fromElement) 
        {
			if (obj.contains(event.fromElement)) 
	        {
                return "fail";
            }
        } 
        else if (e && e.relatedTarget) 
        {
			if (obj.contains(e.relatedTarget)) 
	        {
                return "fail";
            }
        }
		return "success";
	}
	function judgeOut(obj,e)
	{
		if (window.event && event.toElement) 
        {
            if (obj.contains(event.toElement)) 
	        {
			    return "fail";
            }
        } 
        else if (e && e.relatedTarget) 
        {
            if (obj.contains(e.relatedTarget)) 
	        {
                return "fail";
            }
        }
		return "success";
	}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
	if ( _options.changePic == true)
	{
		turn2 = setInterval( slideinitial,zhouqi);
	}
}
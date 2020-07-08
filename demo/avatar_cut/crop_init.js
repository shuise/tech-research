(function($) {
	var image, canvas, ctx;
	var iMouseX, iMouseY = 1;
	var theSelection;
	var clickevent =  'ontouchend' in document.documentElement ? "touchend" : "click";
	var input = document.getElementById("imageData");
	var popup = $("#popup_cut");
	var oFReader = new FileReader(),
	    rFilter = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i,
		eFilter = /\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/;
		
	oFReader.onload = function (oFREvent) {
		alert(oFREvent.target.result)
	    document.getElementById("cropimage").src = oFREvent.target.result;
	    initCrop();
	};
	

	input.onchange = function() {
		setPopupH();
		popup.show();
		if (input.files.length === 0) {
			//return;
		}
		//debugger
	    var oFile = input.files[0];
	    
	    blobURLref = window.webkitURL ? window.webkitURL.createObjectURL(oFile) : window.URL.createObjectURL(oFile);
	    //alert(blobURLref)
	    document.getElementById("cropimage").src = blobURLref;
	    initCrop();
	    // if (!rFilter.test(oFile.type) && !eFilter.test(oFile.name)) { 
	    	// alert("You must select a valid image file!"); 
	    	// return; 
	    // }
	    
	    //oFReader.getAsDataURL(oFile); 
	    //oFReader.readAsDataURL(oFile); 
	}
	
	
	      
	popup.find(".popup_btn_back").bind(clickevent, function() {
		popup.hide()
	});
	
	popup.find(".popup_btn_cut").bind(clickevent, function() {
		$("#imageShow").attr("src", $(this).attr("_dataurl"));
		popup.hide()
	});
	
	function initCrop() {
		$( '.cropimage' ).each( function () {
	    var image = $(this),
	        cropwidth = image.attr('cropwidth'),
	        cropheight = image.attr('cropheight');
	
	      image.cropbox( {width: cropwidth, height: cropheight, showControls: 'auto' } )
	        .on('cropbox', function( event, results, img ) {
	          console.log(img.getDataURL())
	          popup.find(".popup_btn_cut").attr("_dataurl", img.getDataURL())
	        });
	  } );
	}
	
	function setPopupH() {
		var _cH = (document.documentElement).clientHeight;
		var _cW = (document.documentElement).clientWidth;
		popup.css("height", _cH + "px");
	}
	
	
})($)

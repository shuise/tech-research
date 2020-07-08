(function($){
function print_date () {
	var now = new Date();
	$('.time')[0].innerHTML = "今天是: " + now.getFullYear() + "年" + (now.getMonth() + 1) + "月" + now.getDate() + "日 " + "星期" + ["日","一","二","三","四","五","六"][now.getDay()]+" ";
};
print_date();

jQuery.fn.flipCountDown = jQuery.fn.flipcountdown = function( _options ){
	var default_options = {//默认参数
			showHour	:true,//显示小时
			showMinute	:true,//显示分钟
			showSecond	:true,//显示秒数
			size		:52
		},
		createFlipCountDown = function( $box ){
			var $flipcountdown 	= $('<div class="xdsoft_flipcountdown"></div>'),//整个外包装
				$clearex 		= $('<div class="xdsoft_clearex"></div>'),//最后位置，作用为清除浮动
				
				options = $.extend({},default_options),//参数
				
				timer = 0,//相对全局的定时器标记
				
				_animateRange = function( box,a,b ){//动画部分，此处调用_animateOne方法 Math.abs()绝对值
					_animateOne( box,a, (a>b&&!(a==9&&b==0))?-1:1, (a==9&&b==0)?1:Math.abs(a-b) );
				},
				
				_animateOne = function( box,a,arrow,range ){//动画部分，此处调用_setMargin方法
					if( range<1 )
						return;
	
					_setMargin(box,-(a*6*options.size+1),1,arrow,function(){
						_animateOne(box,a+arrow,arrow,range-1);
					},range);
				},
				
				_setMargin = function( box, marginTop, rec, arrow,callback,range){//动画部分，定时修改样式
					if( marginTop<=-options.size*60 )
						marginTop = -1;
					box.css('background-position','0px '+marginTop+'px' );
					if( rec<=6 ){
						setTimeout(function(){
							_setMargin(box, marginTop-arrow*options.size, ++rec, arrow, callback,range);	
						},parseInt(60/range));
					}else
						callback();
				},
				blocks = [],//作为标记，在_generate中使用
				_generate = function( chars ){//见_calcMoment方法中调用次方法的说明
					// if( !(chars instanceof Array) || !chars.length )//确保chars为数组类型且真实有效
					// 	return false;
					for( var i = 0; i<chars.length; i++ ){//循环chars
						if( !blocks[i] ){//如果blocks里面没有就拼上,在blocks里面记录，拼好的标签字符串插在$clearex的前面
							blocks[i] = $('<div class="xdsoft_digit"></div>');
							$clearex.before(blocks[i]);
						}
						if( blocks[i].data('value') != chars[i] ){//不同的内容切换不同的class
						
							if(chars[i] == ':'){
								blocks[i].addClass('xdsoft_separator');
							}
							
						}
						if( !isNaN(chars[i]) ){
							var old = parseInt(blocks[i].data('value')),
								crnt = parseInt(chars[i]);
							if( isNaN(old) ){
								// console.log(old,i,ii,crnt)
								old = (crnt-1)<0?9:crnt-1;
								// console.log(old)
							}
							_animateRange(blocks[i],old,crnt);
						}
						blocks[i].data('value',chars[i]);
					}
				},
				counter = 0,
				_calcMoment = function(){//拼合时间等字符串
					var chars = [],
						value = new Date();
						var h = value.getHours();
						chars = [parseInt(h/10),
							h%10,
							':',
							parseInt(value.getMinutes()/10),
							value.getMinutes() % 10,
							':',
							parseInt(value.getSeconds()/10),
							value.getSeconds() % 10];//这写合起来就是显示在页面上的字符串
						_generate(chars);//调用方法，对时间显示拼上对应的HTML结构，插入页面中
				};
				
			$flipcountdown
				.append($clearex)
				.on('xdinit',function(){
					clearInterval(timer);
					timer = setInterval(_calcMoment,1000);
					_calcMoment();
				});
				
			$box.data('setOptions',function( _options ){
				options = $.extend(options,_options);
				$flipcountdown
					.addClass('xdsoft_size_md')
					.trigger('xdinit');
			});
			$box.append($flipcountdown);
		};
		//回忆一下，$box就是上面大函数的参数,也就是下面调用的时候传的参数
	return this.each(function(){
		var $box = $(this);
		if( !$box.data('setOptions') ){
			$box.addClass('xdsoft')
			createFlipCountDown($box);//调用整个大函数
		}
		if($box.data('setOptions')){//判断有这个属性
			if($.isFunction($box.data('setOptions'))){//判断这个属性是function
				$box.data('setOptions')(_options)//调用这个function传入参数_options
			}
		}
	});
}

$('#retroclockbox1').flipcountdown();



})(jQuery);

			

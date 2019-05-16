var ecrw = {

	swipe:function(tar,obj){                 //首页banner切换    //支持IE7+
		if(tar.length!=0){
			try{
				tar.swiper(obj);
			}
			catch(e){
				console.log(e.message);
			}
		}
		else{
			return false;
		}
	},

	/**
	 * tab 函数介绍
	 * tar 是事件目标dom，必须要有的。tar需要时jquery格式的dom节点例如$(".sample");
	 *obj,是对象总和，包括很多的配置选项
	 *  hCls: 目标节点选中的class
	 *	cur:代表切换目标的节点，不是必填，如果有
	 * 则 curCls 则为必填，
	 * select:表示默认的时候是否显示第一个和选中第一个  默认为true
	 *style:代表事件的触发方式，默认的人是click，有两个参数 tap,over
	 */

	tab:function(tar,obj){

		if(tar.length!=0){
			if(obj.cur){

				if(obj.select==false){
					tar.eq(0).removeClass(obj.hCls);
					obj.cur.eq(0).removeClass(obj.curCls);
				}else{
					tar.eq(0).addClass(obj.hCls);
					obj.cur.eq(0).addClass(obj.curCls);
				}

				if(obj.style=="over"){
					tar.each(function(index){
						$(this).on("mouseover",function(){
							tar.removeClass(obj.hCls);
							tar.eq(index).addClass(obj.hCls);

							obj.cur.removeClass(obj.curCls);
							obj.cur.eq(index).addClass(obj.curCls);
						});
					});
				}

				else{
					tar.each(function(index){
						$(this).on("click",function(){
							tar.removeClass(obj.hCls);
							tar.eq(index).addClass(obj.hCls);

							obj.cur.removeClass(obj.curCls);
							obj.cur.eq(index).addClass(obj.curCls);
						});
					});
				}

			}
			else{
				if(obj.select){
					tar.eq(0).addClass(obj.hCls);
				}
				tar.each(function(index){
					$(this).on("click",function(){
						tar.removeClass(obj.hCls);
						tar.eq(index).addClass(obj.hCls);
					});
				});
			}
		}
	},
	form:function(tar){		//form表单换样式
		if(tar.length!=0){
			tar.uniform();
		}
	},
	log:function(arg){		//打印调试，简化版，省去代码负担
		console.log(arg);
	},
	check:function(arg){
		var tar = Modernizr;
		for(var x in tar){
			if(tar[arg]===true){
				return true;
			}
			else{
				return false;
			}
		}
	}
}	
		
	



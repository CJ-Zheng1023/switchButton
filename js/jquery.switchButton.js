/*
 * 开关按钮（switchButton）jquery插件  V2.0.0
 *
 * 2种配置方式
 *
 * 		配置1.<a data-type="switch-button" data-onName="启用" data-offName="停用" data-defaultState="on" data-whenOn="whenOn" data-whenOff="whenOff"></a>
 *
 * 		(1)data-onName表示开启按键名，data-offName表示关闭按键名，data-defaultState表示初始开启或关闭状态 ，data-whenOn表示开启时调用的函数，data-whenOff表示关闭时调用函数
 * 	       data-beforeOn表示开启之前调用函数，data-beforeOff表示关闭之前调用函数，canOn表示是否可以手动开启，canOff表示是否可以手动关闭
 * 		(2)在js里$("[data-type='switch-button']").switchButton();
 *
 * 		配置2.$("[data-type='switch-button']").switchButton({
 * 				onName:"on",                 //表示开启按键名
 *              offName:"off",               //表示关闭按键名
 *              whenOn:function(btnObj){},   //表示开启时调用的函数
 *              whenOff:function(btnObj){},  //表示关闭时调用函数
 *              beforeOn:function(btnObj){}, //开启之前调用函数
 *              beforeOff:function(btnObj){},//关闭之前调用函数
 *              defaultState:"off"，         //表示初始开启或关闭状态  on/off   默认是off
 *              canOn:true,                  //表示是否可以手动开启
 *              canOff:true                  //表示是否可以手动关闭
 *
 * 			  });
 *
 * 		*****dom节点属性配置优先级高于js里的配置*****
 *
 * @author AfterWin
 * @mail CJ_Zheng1023@hotmail.com
 *
 *
 *
 * update log
 *
 * 		2016.3.15    v1.0.0   完成基本功能
 *
 *      2016.3.15    v2.0.0   重新架构，对外暴露几个接口
 *
 */


(function($){

    /**
     * 按钮组对象
     * @author AfterWin
     * @mail CJ_Zheng1023@hotmail.com
     */
    var SwitchButtonGroup=function(){
        this.buttons=[];
    }
    $.extend(SwitchButtonGroup.prototype,{

        /**
         * 设置按钮关闭
         * @author AfterWin
         * @mail CJ_Zheng1023@hotmail.com
         * @method public
         */
        setUnActive:function(callBack){
            var length=this._getButtonsLength();
            for(var i= 0;i<length;i++){
                var switchButton=this.buttons[i];
                switchButton._turnOff(callBack);
            }
        },
        /**
         * 设置按钮开启
         * @author AfterWin
         * @mail CJ_Zheng1023@hotmail.com
         * @method public
         */
        setActive:function(callBack){
            var length=this._getButtonsLength();
            for(var i= 0;i<length;i++){
                var switchButton=this.buttons[i];
                switchButton._turnOn(callBack);
            }
        },
        /**
         * 获取所有开启按钮
         * @author AfterWin
         * @mail CJ_Zheng1023@hotmail.com
         * @method public
         * @return SwitchButtonGroup  按钮组对象
         */
        getAllActive:function(){
            var switchButtonGroup=new SwitchButtonGroup();
            var length=this._getButtonsLength();
            for(var i= 0;i<length;i++){
                var switchButton=this.buttons[i];
                if(switchButton.target.hasClass("active")){
                    switchButtonGroup.buttons.push(switchButton);
                }
            }
            return switchButtonGroup;
        },
        /**
         * 获取所有关闭按钮
         * @author AfterWin
         * @mail CJ_Zheng1023@hotmail.com
         * @method public
         * @return SwitchButtonGroup  按钮组对象
         */
        getAllUnActive:function(){
            var switchButtonGroup=new SwitchButtonGroup();
            var length=this._getButtonsLength();
            for(var i= 0;i<length;i++){
                var switchButton=this.buttons[i];
                if(!switchButton.target.hasClass("active")){
                    switchButtonGroup.buttons.push(switchButton);
                }
            }
            return switchButtonGroup;
        },
        _getButtonsLength:function(){
            return this.buttons.length;
        }
    })

    /**
     * 按钮对象
     * @author AfterWin
     * @mail CJ_Zheng1023@hotmail.com
     */
    var SwitchButton=function(target,options){
        this._init(target,options);
        this.target=target;
        this.options=options;

    }
    $.extend(SwitchButton.prototype,{
        /**
         * 构造按钮
         * @author AfterWin
         * @mail CJ_Zheng1023@hotmail.com
         * @param target   按钮jquery对象
         * @param op       配置参数
         * @private
         */
        _init:function(target,op){
            var me=this;
            var $onName=$("<span>"+op.onName+"</span>").addClass("span-on-name"),
                $offName=$("<span>"+op.offName+"</span>").addClass("span-off-name"),
                $button=$("<i></i>").addClass("switch-button").css("left",2);
            me.button=$button;
            target.addClass("switch-button-bar");
            if(op.defaultState=="on"){
                target.addClass("active");
                $button.css("left",32);
            }

            target.append($onName).append($button).append($offName);
            target.bind({
                click:function(){
                    if(target.hasClass("active")){
                        me._before(op.beforeOff);
                        if(op.canOff==true){
                            me._turnOff(op.whenOff);
                        }
                    }else{
                        me._before(op.beforeOn);
                        if(op.canOn==true){
                            me._turnOn(op.whenOn);
                        }
                    }
                }
            })
        },
        /**
         * 开启按钮action
         * @author AfterWin
         * @mail CJ_Zheng1023@hotmail.com
         * @param callback   回调函数
         * @private
         */
        _turnOn:function(callback){
            var target=this.target,op=this.options;
            this.button.animate({
                left:32
            },function(){
                target.addClass("active");
                if(typeof callback=="function"){
                    callback(target);
                }else if(typeof callback=="string"){
                    eval(callback+"(target)");
                }
            })
        },
        _before:function(callback){
            if(typeof callback=="function"){
                callback();
            }else if(typeof callback=="string"){
                eval(callback+"()");
            }
        },
        /**
         * 关闭按钮action
         * @author AfterWin
         * @mail CJ_Zheng1023@hotmail.com
         * @param callback   回调函数
         * @private
         */
        _turnOff:function(callback){
            var target=this.target,op=this.options;
            this.button.animate({
                left:2
            },function(){
                target.removeClass("active");
                if(typeof callback=="function"){
                    callback(target);
                }else if(typeof callback=="string"){
                    eval(callback+"(target)");
                }
            })
        }
    })


    /**
     * 扩展jquery原型链
     *
     * @author AfterWin
     * @mail CJ_Zheng1023@hotmail.com
     * @param options     参数配置
     * @returns {SwitchButtonGroup}
     */
    $.fn.switchButton=function(options){
        var switchButtonGroup=new SwitchButtonGroup();
        $(this).each(function(){
            var defaults={
                onName:"on",
                offName:"off",
                whenOn:function(btnObj){},
                whenOff:function(btnObj){},
                beforeOn:function(btnObj){},
                beforeOff:function(btnObj){},
                defaultState:"off",
                canOn:true,
                canOff:true
            }
            var me=$(this);
            var propertyConfig={
                onName:me.attr("data-onName"),
                offName:me.attr("data-offName"),
                whenOn:me.attr("data-whenOn"),
                whenOff:me.attr("data-whenOff"),
                beforeOn:me.attr("data-beforeOn"),
                beforeOff:me.attr("data-beforeOff"),
                defaultState:me.attr("data-defaultState"),
                canOn:me.attr("data-canOn"),
                canOff:me.attr("data-canOff")
            }
            var op= $.extend(true,defaults,options||defaults,propertyConfig||defaults);
            switchButtonGroup.buttons.push(new SwitchButton(me,op));
        })
        return switchButtonGroup;
    }


})(jQuery);
/*
 * 开关按钮（switchButton）jquery插件  V2.0.0
 *
 * 2种配置方式
 *
 * 		配置1.<a data-type="switch-button" data-onName="启用" data-offName="停用" data-defaultState="on" data-whenOn="whenOn" data-whenOff="whenOff"></a>
 *
 * 		(1)data-onName表示开启按键名，data-offName表示关闭按键名，data-defaultState表示初始开启或关闭状态 ，data-whenOn表示开启时调用的函数，data-whenOff表示关闭时调用函数
 * 	       data-beforeOn表示开启之前调用函数，data-beforeOff表示关闭之前调用函数，canOn表示是否可以手动开启，canOff表示是否可以手动关闭
 * 	       data-theme表示应用主题 默认绿色主题 ，（现可选orange）
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
 *              theme:""                  //表示应用主题，默认为绿色主题，（现可选值有orange）
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
 *      2016.5.20    v2.1.0   新增ORANGE主题，可通过theme或data-theme参数配置，详情请见上方配置说明
 *
 */


(function($){

    var LENGTH_TO_BUTTON_BAR=2;  //按钮球距离BUTTON_BAR的左右间距

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
                $button=$("<i></i>").addClass("switch-button").css("left",LENGTH_TO_BUTTON_BAR);
            me.button=$button;
            target.append($onName).append($button).append($offName);
            target.addClass("switch-button-bar").addClass(op.theme);
            me.whenOnLeftValue=target.width()-$button.width()-LENGTH_TO_BUTTON_BAR;
            $onName.width(me.whenOnLeftValue-LENGTH_TO_BUTTON_BAR*2);
            $offName.width(me.whenOnLeftValue-LENGTH_TO_BUTTON_BAR*2);
            if(op.defaultState=="on"){
                target.addClass("active");
                $button.css("left",me.whenOnLeftValue);
            }
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
            var me=this;
            var target=me.target,op=me.options;
            me.button.animate({
                left:me.whenOnLeftValue
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
                left:LENGTH_TO_BUTTON_BAR
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
                canOff:true,
                theme:"default"
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
                canOff:me.attr("data-canOff"),
                theme:me.attr("data-theme")
            }
            var op= $.extend(true,defaults,options||defaults,propertyConfig||defaults);
            switchButtonGroup.buttons.push(new SwitchButton(me,op));
        })
        return switchButtonGroup;
    }


})(jQuery);
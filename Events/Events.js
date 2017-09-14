/**
 * Created by likeke on 2017/9/14.
 */
(function () {
    var _t = this;
    var eventList = {};
    function add(eventName,func) { //向某个事件中增加一个行为
        if(eventList[eventName] == null){
            eventList[eventName] = [];
        }
        var code = func;
        if (typeof (code) != 'function') code = eval("(function () {" + code + "; })");
        eventList[eventName].push(code);
    }
    function bindOne(eventName, func) {//移除之前的事件行为重新绑定一个新的事件行为
        this.remove(eventName);
        this.add(eventName,func);
    }
    function trigger() { //触发某个事件并传递行为实现时需要的参数
        var eventName = Array.prototype.shift.call(arguments);
        var eventFuncList  = eventList[eventName];
        if(eventFuncList == null) {return this}
        for(var i = 0,l = eventFuncList.length;i<l;i++){
            if (eventFuncList[i].apply(_t,arguments) === false){
                return false;
            }
        }
    }
    function remove(eventName) {//移除某个事件
        return eventList[eventName] != null ? eventList[eventName].length = 0 : void 0;
    }
    function removeOne(eventName,funcRef) {//移除某个事件中的某个行为
        var eventFuncList = eventList[eventName];
        if(eventFuncList === null){
            return false;
        }
        for(var i = 0,l=eventFuncList.length;i<l;i++){
            if(eventFuncList[i] === funcRef){
                eventFuncList.splice(i,1);
            }
        }
    }
    window.Events = {
        add:add,
        bindOne:bindOne,
        remove:remove,
        removeOne:removeOne,
        trigger:trigger
    };
})(window);
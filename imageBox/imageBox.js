/**
 * Created by likeke on 2017/7/13.
 */

/***************************tools开始***********************************/
//给构造函数添加方法
Function.prototype.method = function (name, func) {
    this.prototype[name] = func;
    return this;
};
//绑定事件
Object.prototype.addEvent = function () {
    this.addEventListener.apply(this, arguments);
    return this;
};
/***************************tools结束***********************************/

/******************************构建ImageBox类开始*************************************/
if (ImageBox) console.warn('命名冲突:构造函数ImageBox');

var ImageBox = function (config) {
    this.config = config;
};
ImageBox.method('start', function () {
    var self = this;
    if (!(self.config.targetElement instanceof HTMLElement)) {
        console.warn('参数类型错误:targetElement必须为DOM对象');
        return;
    }
    self.config.targetElement.addEvent('load', function () {
        self.dataInit();
        self.eventInit();
        if (self.config.menusList) self.menusListInit();
        if (self.config.localExpend) self.localExpendInit();
    });
}).method('dataInit', function () {
    //初始化基本数据:
    var conf = this.config; //配置项集合
    this.scaleDetail = conf.scaleDetail || 0.3; //缩放比
    //被操作目标元素的初始宽度
    if (conf.initWidth) {
        conf.targetElement.style.width = conf.initWidth + "px";
    }
    conf.targetElement.style.position = 'absolute';
    //被操作目标元素的状态
    this.status = {
        initWidth: conf.targetElement.offsetWidth,
        initHeight: conf.targetElement.offsetHeight,
        deg: 0,
        scale: 1
    };
}).method('eventInit', function () {
    //事件绑定:
    var self = this;
    var conf = self.config;
    var eventFunc = self.eventFunc(); //事件方法集合
    var targetElement = conf.targetElement; //被操作的目标元素

    targetElement.addEvent('mousedown', function (e) {
        //鼠标按下后的移动事件
        var ev = e || window.event;
        eventFunc.move(e,'mouseup');
    });

    //滚轮滚动事件
    document.addEvent('mousewheel', function (e) {
        var e = e || window.event;
        e.preventDefault(); //防止有滚动条时缩小时跳动
        if (e.wheelDelta > 0) {
            eventFunc.scale('toBig');
        } else {
            eventFunc.scale('toSmall');
        }
    });
}).method('menusListInit', function () {
    //右键菜单初始化(如果启用的话)
    var conf = this.config;
    var targetElement = conf.targetElement;
    var eventFunc = this.eventFunc();
    var menusList = document.createElement('ul');
    menusList.setAttribute('id', 'menusList');
    var lis = [{id: 'scaleB', text: '放大'}, {id: 'scaleS', text: '缩小'}, {id: 'rotateN', text: '逆时针旋转'}, {
        id: 'rotateS',
        text: '顺时针旋转'
    }, {id: 'reset', text: '重置'}];
    for (var i = 0, l = lis.length; i < l; i++) {
        var li = document.createElement('li');
        li.setAttribute('id', lis[i].id);
        li.innerText = lis[i].text;
        menusList.appendChild(li);
    }
    document.body.appendChild(menusList);
    var scaleB = menusList.querySelector('#scaleB'); //放大
    var scaleS = menusList.querySelector('#scaleS'); //缩小
    var rotateN = menusList.querySelector('#rotateN'); //逆时针
    var rotateS = menusList.querySelector('#rotateS'); //顺时针
    var reset = menusList.querySelector('#reset'); //还原大小

    scaleB.addEvent('click', function (e) {
        //放大：
        eventFunc.scale('toBig');
    });
    scaleS.addEvent('click', function (e) {
        //缩小：
        eventFunc.scale('toSmall');
    });

    menusList.addEvent('mouseout', function (e) {
        //menusList鼠标移出
        menusList.style.display = 'none';
    }).addEvent('mouseover', function (e) {
        //menusList鼠标移入
        menusList.style.display = 'block';
    });
    //逆时针旋转事件
    rotateN.addEvent('click', function (e) {
        eventFunc.rotate(-90);
    });
    //顺时针旋转事件
    rotateS.addEvent('click', function (e) {
        eventFunc.rotate(90);
    });
    //还原大小事件
    reset.addEvent('click', function (e) {
        eventFunc.resetTransf();
    });
    targetElement.addEvent('contextmenu', function (e) {
        //目标元素右键点击事件
        var e = e || window.event;
        e.preventDefault();
        var Px = e.pageX;
        var Py = e.pageY;
        menusList.style.display = 'block';
        menusList.style.top = Py - 20 + 'px';
        menusList.style.left = Px - 20 + 'px';
    });
}).method('localExpendInit', function () {
    //局部放大功能

}).method('eventFunc', function () {
    //目标元素的事件函数集合:
    var self = this;
    var conf = this.config;
    var targetElement = conf.targetElement;

    function transform(ele, conf) {
        ele.style.transform = 'rotate(' + (conf.deg || self.status.deg) + "deg)" + ' scale(' + (conf.scale || self.status.scale) + ')';
        if (Number(conf.x) && Number(conf.y)) {
            ele.style.transformOrigin = conf.x + ' ' + conf.y;
        }
        if (conf.left) {
            ele.style.left = conf.left + 'px';
        }
        if (conf.top) {
            ele.style.top = conf.top + 'px';
        }
    }

    return {
        scale: function (style) {
            //缩放：
            var height = targetElement.offsetHeight;
            var x = self.scaleDetail; //缩放比例
            switch (style) {
                case 'toBig':
                    if (self.status.scale >= 10) {
                        //已到最大级别
                        return;
                    }
                    self.status.scale = height * (self.status.scale + x) / self.status.initHeight;
                    transform(targetElement, {});
                    break;
                case 'toSmall':
                    if (self.status.scale - 0.1 <= 0) {
                        //已到最小级别
                        return;
                    }
                    self.status.scale = height * (self.status.scale - x) / self.status.initHeight;
                    transform(targetElement, {});
                    break;
                default:
                    console.warn("参数类型错误:ImageBox.eventFun.scale要求参数为字符串toBig或toSmall");
                    break;
            }
        },
        rotate: function (deg) {
            self.status.deg += deg;
            transform(targetElement, {});
        },
        resetTransf: function () {
            //还原:
            transform(targetElement, {deg: "0", scale: 1, left: "0", top: "0"});
            self.status.scale = 1;
            self.status.deg = 0;
        },
        move: function (e,endMoveEvent) {
            //移动:
            var ev = e || window.event;
            var startX = ev.pageX;
            var startY = ev.pageY;
            var imgStartX = targetElement.offsetLeft;
            var imgStartY = targetElement.offsetTop;

            function mouseMoveFunc(ev) {
                var ev = ev || window.event;
                ev.preventDefault();
                var endX = ev.pageX;
                var endY = ev.pageY;
                var CX = endX - startX;
                var CY = endY - startY;
                targetElement.style.left = imgStartX + CX + "px";
                targetElement.style.top = imgStartY + CY + "px";
            }

            targetElement.addEvent('mousemove', mouseMoveFunc);
            targetElement.addEvent(endMoveEvent, function (e) {
                targetElement.removeEventListener('mousemove', mouseMoveFunc);
            })
        }
    }
});
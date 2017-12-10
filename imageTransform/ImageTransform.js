/***************************tools开始***********************************/
Function.prototype.addProp = function (prop, value) {
    this.prototype[prop] = value;
    return this;
};
Object.prototype.addEvent = function () {
    this.removeEventListener.apply(this,arguments);
    this.addEventListener.apply(this, arguments);
    return this;
};
/***************************tools结束***********************************/
if (ImageTransform) console.error('命名冲突:构造函数ImageTransform');
var ImageTransform = function (config) {
    this.config = config;
    this.scaleDetail = null;
    this.status = null;
};
ImageTransform.addProp('start', function (callback) {
    var self = this;
    var targetElement = self.config.targetElement;
    if (!(targetElement instanceof HTMLElement)) {
        console.error('参数类型错误:targetElement必须为DOM对象');
        return;
    }
    targetElement.addEvent('load', init);
    if(targetElement.complete)init();//解决有缓存时load事件不执行的问题
    function init() {
        if(targetElement.getAttribute('__initCompleted'))return;//防止src变化时和刷新页面时的多次初始化
        self.dataInit();
        self.eventInit();
        if (self.config.menusList) self.menusListInit();
        if(typeof callback == "function") callback(self);
        targetElement.setAttribute('__initCompleted',true);
    }
}).addProp('dataInit', function () {
    var conf = this.config; //配置项集合
    this.scaleDetail = conf.scaleDetail || 0.05; //缩放比
    //初始样式
    if (conf.css){
        for(var css in conf.css){
            if(conf.css.hasOwnProperty(css)){
                conf.targetElement.style[css] = conf.css[css];
            }
        }
    }
    this.status = {
        initWidth: conf.initWidth||conf.targetElement.clientWidth,
        initHeight: conf.initHeight||conf.targetElement.clientHeight,
        initLeft:conf.initLeft||conf.targetElement.offsetLeft,
        initTop:conf.initTop||conf.targetElement.offsetTop,
        deg: 0,
        scale: 1
    };
    conf.targetElement.style.position = 'absolute';
}).addProp('eventInit', function () {
    //事件绑定:
    var self = this;
    var conf = self.config;
    var transform = self.transform(); //变换方法集合
    var targetElement = conf.targetElement; //被操作的目标元素
    targetElement.addEvent('mousedown', mousedown);
    document.body.addEvent('mousewheel', mousewheel);

    function mousedown(e) {var ev = e || window.event;transform.move(e, 'mouseup');}
    function mousewheel(e) {
        var e = e || window.event;
        e.preventDefault(); //防止有滚动条时缩小时跳动
        if (e.wheelDelta > 0) {
            transform.scale('1');
        } else {
            transform.scale('-1');
        }
    }
}).addProp('menusListInit', function () {
    var conf = this.config;
    var targetElement = conf.targetElement;
    var transform = this.transform();
    var menusList = document.createElement('ul');
    menusList.setAttribute('id', 'menusList');
    var lis = [ { id: 'rotateN', text: '逆时针旋转' }, {id: 'rotateS', text: '顺时针旋转'},{ id: 'scaleB', text: '放大' }, { id: 'scaleS', text: '缩小' }, { id: 'reset', text: '重置'}];
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
    menusList.addEvent('mouseout', mouseout).addEvent('mouseover', mouseover);
    scaleB.addEvent('click', big);
    scaleS.addEvent('click', small);
    rotateN.addEvent('click', rotate1);
    rotateS.addEvent('click', rotate2);
    reset.addEvent('click', resetTransform);
    targetElement.addEvent('contextmenu', contextmenu);

    function mouseout(e) {menusList.style.display = 'none';}
    function mouseover(e) {menusList.style.display = 'block';}
    function big(e) {transform.scale('1');}
    function small(e) {transform.scale('-1');}
    function rotate1(e) {transform.rotate(-90);}
    function rotate2(e) {transform.rotate(90);}
    function resetTransform(e) {transform.reset();}
    function contextmenu(e) {
        var e = e || window.event;
        e.preventDefault();
        var Px = e.pageX;
        var Py = e.pageY;
        menusList.style.display = 'block';
        menusList.style.top = Py - 20 + 'px';
        menusList.style.left = Px - 20 + 'px';
    }
}).addProp('transform', function () {
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
            // var height = targetElement.offsetHeight;
            var x = self.scaleDetail; //缩放比例
            switch (style) {
                case '1':
                    if (self.status.scale >= (conf.maxScale||5)) {
                        //已到最大级别
                        return;
                    }
                    // self.status.scale = height * (self.status.scale + x) / self.status.initHeight;
                    self.status.scale += x;
                    transform(targetElement, {});
                    break;
                case '-1':
                    if (self.status.scale <= (conf.minScale||0.1)) {
                        //已到最小级别
                        return;
                    }
                    // self.status.scale = height * (self.status.scale - x) / self.status.initHeight;
                    self.status.scale -= x;
                    transform(targetElement, {});
                    break;
                default:
                    console.error("参数类型错误:ImageTransform.transform().scale要求参数为字符串1或-1");
                    break;
            }
        },
        rotate: function (deg,relativePos) {
            relativePos = typeof relativePos === "number"? relativePos : self.status.deg;
            self.status.deg = Number(relativePos) + Number(deg);
            transform(targetElement, {});
        },
        reset: function () {
            //还原:
            transform(targetElement, { deg: "0", scale: 1, left: self.status.initLeft, top: self.status.initTop});
            self.status.scale = 1;
            self.status.deg = 0;
        },
        move: function (e, endMoveEvent) {
            //移动:
            var ev = e || window.event;
            var startX = ev.pageX;
            var startY = ev.pageY;
            var imgStartX = targetElement.offsetLeft;
            var imgStartY = targetElement.offsetTop;
            targetElement.style.cursor = 'move';
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
                targetElement.style.cursor = 'default';
                targetElement.removeEventListener('mousemove', mouseMoveFunc);
            })
        }
    }
});

/**
 * Created by likeke on 2017/8/17.
 */
function flexByScreenWidth(pageBasePath, areaConfig, pageFlexConfigs) {
    if (!(dataType(pageBasePath) == "String" && dataType(pageFlexConfigs) == "Object")) { alert("flexByScreenWidth调用时参数类型错误"); return; }
    var currentPagePath = location.href.replace(/\\/g, "/");
    var lastPositionOfpageBasePath = currentPagePath.lastIndexOf(pageBasePath);
    var currPagePathAfterBasePath = currentPagePath.slice(lastPositionOfpageBasePath + pageBasePath.length);

    var config = pageFlexConfigs[currPagePathAfterBasePath];

    while (config == undefined) {
        var endIndexOfDire = currPagePathAfterBasePath.lastIndexOf("/");
        if(endIndexOfDire == 0||endIndexOfDire == -1){
            config = pageFlexConfigs['*']||pageFlexConfigs['/'];//全局默认
            break;
        }else {
            currPagePathAfterBasePath = currPagePathAfterBasePath.slice(0,endIndexOfDire)
            config = pageFlexConfigs[currPagePathAfterBasePath];
        }
    }

    var baseWidthScale = config.baseWidthScale || defaultConfig.baseWidthScale;
    var baseHeightScale = config.baseHeightScale || defaultConfig.baseHeightScale;
    var baseWidth = config.baseWidth || defaultConfig.baseWidth;
    var baseHeight = config.baseHeight || defaultConfig.baseHeight;

    var currentScreenWidth = window.screen.availWidth; //当前屏幕宽
    var currentScreenHeight = window.screen.availHeight; //当前屏幕高

    var scaleX = (currentScreenWidth - baseWidth) / baseWidth;
    var ignoreArea = areaConfig.ignoreArea;
    var pageBody = areaConfig.scaleArea; //需要缩放的块
    var il = ignoreArea.length;
    var pl = pageBody.length;
    var noScaleHeight = 0;
    while (il--){
        noScaleHeight += ignoreArea[il].offsetHeight;
    }
    var scaleY = (currentScreenHeight - baseHeight) / (baseHeight - noScaleHeight || 0);
    if (pl === 0) {
        scaleY = (currentScreenHeight - baseHeight) / (baseHeight - areaConfig.ignoreAreaHeight || 0);
        transformContainer(document.body);
    } else {
        while (pl--) {
            transformContainer(pageBody[pl]);
        }
    }

    /*
     * fixed定位的iframe独立缩放引起的错位问题解决
     * 考虑display为none的情况
     * */
    var iframesContainer = areaConfig.fixedScaleIframes;
    for (var i = 0, l = iframesContainer.length; i < l; i++) {
        marginTopConf(iframesContainer[i]);
    }

    var topStatus = {
        ifCtrlIsDown: false
    };
    //禁用ctrl+滚轮
    var iframes = window.document.getElementsByTagName('iframe');
    var windowList = [];
    windowList.push(window);
    for (var c = 0, cl = iframes.length; c < cl; c++) {
        windowList.push(iframes[c].contentWindow);
    }
    preventDefaultScaleAction(windowList);

    function marginTopConf(iframesContainer) {
        var timer = null;
        if (iframesContainer.style.display != 'none') {
            iframesContainer.style.marginTop = iframesContainer.offsetTop * (1 - 1 / (1 + scaleY)) + 'px';
            clearTimeout(timer);
            timer = null;
        } else {
            timer = setTimeout(function() {
                marginTopConf(iframesContainer);
            }, 100);
        }
    }
    function transformContainer(pageBody) {
        pageBody.style.transformOrigin = "0 0";
        pageBody.style.width = baseWidth * baseWidthScale + "px";
        pageBody.style.height = baseHeight * baseHeightScale + "px";
        pageBody.style.transform = "scaleX(" + (1 + scaleX) + ")" + " " + "scaleY(" + (1 + scaleY) + ")";
    }
    function preventDefaultScaleAction(windowList) {
        for (var i = 0, l = windowList.length; i < l; i++) {
            var win = windowList[i];
            var ifrs = win.document.getElementsByTagName('iframe');
            win.scaleInfo = win.scaleInfo || {};
            win.scaleInfo.X = 1 + scaleX;
            win.scaleInfo.Y = 1 + scaleY;
            win.scaleInfo.ignore = ignoreArea;
            win.scaleInfo.scale = pageBody;
            if (ifrs.length != 0) {
                var winList = [];
                for (var c = 0, cl = ifrs.length; c < cl; c++) {
                    winList.push(ifrs[c].contentWindow);
                }
                preventDefaultScaleAction(winList);
            }
            win.addEventListener = win.addEventListener || win.attachEvent;
            var isIE9 = win.addEventListener ? "" : "on";
            win.addEventListener(isIE9 + 'keydown', function(e) {
                var _t = this;
                var ev = e || _t.event;
                if (17 !== ev.keyCode) {
                    return;
                }
                topStatus.ifCtrlIsDown = true;
                _t.onmousewheel = _t.document.onmousewheel = function(e) {
                    var ev = e || _t.event;
                    wheelEventFunc(ev, _t);
                };
            });
            win.addEventListener(isIE9 + 'keyup', function(e) {
                var _t = this;
                var ev = e || _t.event;
                if (17 !== ev.keyCode) {
                    return;
                }
                topStatus.ifCtrlIsDown = false;
                _t.onmousewheel = _t.document.onmousewheel = null;
            });

            function wheelEventFunc(ev, win) {
                if (topStatus.ifCtrlIsDown) {
                    ev.preventDefault();
                } else {
                    win.onmousewheel = win.document.onmousewheel = null;
                }
            }
        }
    }
    function dataType(data) {
        return Object.prototype.toString.call(data).slice(8, -1);
    }
}
//缩放范围外的元素定位和大小问题
function FlexignorePositionCalc(ele, x, y, disableScale) {
    //如果有局部缩放
    if (window.scaleInfo && window.scaleInfo.scale.length ) {
        x *= window.scaleInfo.X;
        var il = window.scaleInfo.ignore.length;
        var h = 0;
        while (il--) {
            h += window.scaleInfo.ignore[il].offsetHeight;
        }
        y = h + (y - h) * window.scaleInfo.Y;
        if (disableScale !== true && ele) {
            ele.style.transformOrigin = "0 0";
            ele.style.transform = "scaleX(" + window.scaleInfo.X + ")" + " " + "scaleY(" + window.scaleInfo.Y + ")";
        }
    }
    return {
        X: x,
        Y: y
    }
}
setTimeout(function() {
    flexByScreenWidth("/ui/js/app/" //相对路径
        ,{
            ignoreArea: document.querySelectorAll(".Header"),
            scaleArea: document.querySelectorAll(".FlexContainer"),//scaleArea获取失败时默认使用body
            ignoreAreaHeight: 104, //在ignoreArea获取失败的情况下ignoreHeight采取的值
            fixedScaleIframes:document.querySelectorAll('.iframesContainer')//fixed定位并且独立缩放的iframe
        }
        ,{
            "*":{ //全局默认配置
                baseWidth: 1600,
                baseHeight: 936,
                baseWidthScale: 1,
                baseHeightScale: 1
            },
            'configs':{ //配置模块默认配置
                baseWidth: 1600,
                baseHeight: 900,
                baseWidthScale: 0.93,
                baseHeightScale: 1
            },
            "register/register.html": {//自定义配置
                baseWidth: 1600,
                baseHeight: 900,
                baseWidthScale: 1,
                baseHeightScale: 1
            },
            "studymatch/studymatchs.html": {
                baseWidth: 1600,
                baseHeight: 1020,
                baseWidthScale: 1,
                baseHeightScale: 1
            },
            "search/search-for-match.html": {
                baseWidth: 1600,
                baseHeight: 1020,
                baseWidthScale: 0.49,
                baseHeightScale: 1
            },
            "studysearch/studysearch.html": {
                baseWidth: 1600,
                baseHeight: 1020,
                baseWidthScale: 0.49,
                baseHeightScale: 1
            },
            "report/report.trace.html": {
                baseWidth: 1800,
                baseHeight: 1000,
                baseWidthScale: 1,
                baseHeightScale: 1
            },
            "report/report.followup.html": {
                baseWidth: 1830,
                baseHeight: 1060,
                baseWidthScale: 1,
                baseHeightScale: 1
            },
            "report/report.base.html": {
                baseWidth: 1830,
                baseHeight: 1000,
                baseWidthScale: 1,
                baseHeightScale: 1
            }
        });
}, 0);
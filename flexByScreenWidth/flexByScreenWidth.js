///////////////////
function flexByScreenWidth(pageBasePath, defaultConfig, pageFlexConfigs) {
    if (!(dataType(pageBasePath)=="String" && dataType(defaultConfig)=="Object" && dataType(pageFlexConfigs)=="Object")){alert("flexByScreenWidth调用时参数类型错误");return;}

    var currentPagePath = location.href.replace(/\\/g, "/");
    var lastPositionOfPageBasePath = currentPagePath.lastIndexOf(pageBasePath);
    var currentPagePathRelativedByPageBasePath = currentPagePath.slice(lastPositionOfPageBasePath + pageBasePath.length);

    var config = pageFlexConfigs[currentPagePathRelativedByPageBasePath];
    if (config === undefined) {
        config = defaultConfig;
    }

    var pageBody = document.body;
    pageBody.style.transformOrigin = "0 0";

    var baseWidthScale = config.baseWidthScale || defaultConfig.baseWidthScale;
    var baseHeightScale = config.baseHeightScale || defaultConfig.baseHeightScale;
    var baseWidth = config.baseWidth || defaultConfig.baseWidth;
    var baseHeight = config.baseHeight || defaultConfig.baseHeight;

    var currentScreenWidth = window.screen.availWidth;//当前屏幕宽
    var currentScreenHeight = window.screen.availHeight;//当前屏幕高

    var scaleX = (currentScreenWidth - baseWidth) / baseWidth;
    var scaleY = (currentScreenHeight - baseHeight) / baseHeight;

    pageBody.style.width = baseWidth * baseWidthScale + "px";
    pageBody.style.height = baseHeight * baseHeightScale + "px";

    pageBody.style.transform = "scaleX(" + (1 + scaleX) + ")" + " " + "scaleY(" + (1 + scaleY) + ")";

    var topStatus = {
        ifCtrlIsDown : false
    };
    //禁用ctrl+滚轮
    function preventDefaultScaleAction(windowList) {
        for(var i=0,l=windowList.length;i<l;i++){
            var win = windowList[i];

            var ifrs = win.document.getElementsByTagName('iframe');
            if(ifrs.length != 0){
                var winList=[];
                for(var c=0,cl=ifrs.length;c<cl;c++){
                    winList.push(ifrs[c].contentWindow);
                }
                preventDefaultScaleAction(winList);
            }

                win.onkeydown = function (e) {
                    var _t = this;
                    var ev = e || _t.event;
                    if (17 !== ev.keyCode) {
                        return;
                    }
                    topStatus.ifCtrlIsDown = true;
                    _t.onmousewheel = _t.document.onmousewheel = function (e) {
                        var ev = e || _t.event;
                        wheelEventFunc(ev,_t);
                    };
                };
                win.onkeyup = function (e) {
                    var _t = this;
                    var ev = e || _t.event;
                    if (17 !== ev.keyCode) {
                        return;
                    }
                    topStatus.ifCtrlIsDown = false;
                    _t.onmousewheel = _t.document.onmousewheel = null;
                };

                function wheelEventFunc(ev,win) {
                    if(topStatus.ifCtrlIsDown){
                        ev.preventDefault();
                    }else {
                        win.onmousewheel = win.document.onmousewheel = null;
                    }
                }
        }
    }
    var iframes = window.document.getElementsByTagName('iframe');
    var windowList=[];
    windowList.push(window);
    for(var c=0,cl=iframes.length;c<cl;c++){
        windowList.push(iframes[c].contentWindow);
    }
    preventDefaultScaleAction(windowList);
    function dataType(data) {
        return Object.prototype.toString.call(data).slice(8,-1);
    }
}
//////////////////
setTimeout(function () {

    flexByScreenWidth("/ui/js/app/"  //相对路径
        , { //默认配置
            baseWidth: 1800,
            baseHeight: 1000,
            baseWidthScale: 1,
            baseHeightScale: 1
        }
        , {  //自定义配置
            "configs/configs.html": {
                baseWidth: 1800,
                baseHeight: 1020,
                baseWidthScale: 1,
                baseHeightScale: 1
            }
            , "studysearch/studysearch.html": {
                baseWidth: 1800,
                baseHeight: 1000,
                baseWidthScale: 0.49,
                baseHeightScale: 1
            }
            , "search/search-for-match.html": {
                baseWidth: 1800,
                baseHeight: 1000,
                baseWidthScale: 0.49,
                baseHeightScale: 1
            }
        });

}, 10);

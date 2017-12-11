/**
 * Created by likeke on 2017-12-11.
 */



(function TemplateEngine(global) {
    /*
    * 入口
    * */
    global.TemplateEngine = TemplateEngine;

    /*
     * 公共静态方法
     * include:引入外部模板
     * parser:使用当前页面内的模板
     * */
    TemplateEngine.include = function (src, target, data) {
        require(src, function (ifr) {
            var ifrID = ifr.id;
            var source = getTemplateByIframeID(ifrID);
            render(source, target, data, false);
        })
    };

    TemplateEngine.parser = function (sourceID, target, data, replaceAll) {
        var source = getTemplateById(sourceID);
        render(source, target, data, replaceAll);
    };
    TemplateEngine.autoInclude = function (root) {
        root = root || document.body;
        var text = root.innerHTML;
        var reg_includeMatchs = /{{include\s+[\'\"]+\w+\.html[\'\"]+}}/g;
        var includeMatchs = text.match(reg_includeMatchs);
        var src;
        for (var i=0;i<includeMatchs.length;i++){
            src = includeMatchs[i].match(/[\'\"]+(\w+\.html)[\'\"]+/)[1];
            (function (i) {
                require(src, function (ifr) {
                    var ifrID = ifr.id;
                    var source = getTemplateByIframeID(ifrID);
                    text = text.replace(includeMatchs[i],source);
                    root.innerHTML = text;
                })
            })(i)
        }
    };
    /*
     * 私有方法
     * */
    function render(source, target, data, replaceAll) {
        if (replaceAll) {
            target.innerHTML = parser2Text(source, data);
        } else {
            var html = parser2Html(source, data);
            target.appendChild(html);
        }
    }
    //
    function parser2Text(htmlText, data) {
        data = data || {};
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                var reg = new RegExp("{{" + key + "}}", "g");
                var value = data[key];
                htmlText = htmlText.toString().replace(reg, value);
            }
        }
        return htmlText;
    }
    //
    function parser2Html(htmlText, data) {
        var text = parser2Text(htmlText, data);
        var tempDom = document.createElement('span');
        tempDom.innerHTML = text;
        return tempDom;
    }
    //
    function getTemplateById(id) {
        var template = document.getElementById(id);
        if (template) {
            return template.innerHTML;
        } else {
            throw Error("未找到id为'" + id + "'的模板!")
        }
    }
    //
    function getTemplateByIframeID(id) {
        var ifr = document.getElementById(id);
        if (ifr) {
            return ifr.contentWindow.document.body.innerHTML;
        } else {
            throw Error("通过iframe获取模板失败:未找到id为" + id + "的iframe!");
        }
    }
    //
    function require(src, callback) {
        var ifr = document.createElement('iframe');
        document.body.appendChild(ifr);
        ifr.id = 'template_' + new Date().getTime();
        ifr.style.display = 'none';
        ifr.src = src;
        ifr.onload = function () {
            var _t = this;
            if (typeof callback === "function") {
                callback(_t);
            }
            if(_t.parentNode){//_t有问题，无法移除所有ifr
                _t.parentNode.removeChild(_t);
            }
        }
    }
})(window);

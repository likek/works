/********************************开始：不同设备的各项配置***************************************/
var equipmentConfigs = {
    "default": {
        clipImageWhenDblClick: { //双击放大
            clipConfig: {
                top: 0.21,
                right: 0.81,
                bottom: 0.78,
                left: 0.375
            },
            otherCss: {},
            callback: function (img,conf) {
            }
        },
        displayAllImages: { //底部所有图片的陈列
            clipConfig: {
                top: 0.21,
                right: 0.81,
                bottom: 0.78,
                left: 0.375,
                widthScale: 1.8
            },
            otherCss: {
                top: "12px",
                left: "-14px"
            }
        },
        printReport: {  //打印报告时的图片剪切
            clipConfig: {
                top: 0.21,
                right: 0.81,
                bottom: 0.78,
                left: 0.375
            },
            otherCss: {}
        }
    },
    //设备-未定义
    "设备ID||设备名称": {
        clipImageWhenDblClick: { //双击放大
            clipConfig: {
                top: 0.21,
                right: 0.81,
                bottom: 0.78,
                left: 0.375
            },
            otherCss: {}
        },
        displayAllImages: {//底部所有图片的陈列
            clipConfig: {
                top: 0.21,
                right: 0.81,
                bottom: 0.78,
                left: 0.375
            },
            otherCss: {}
        },
        printReport: {  //打印报告时的图片剪切
            clipConfig: {
                top: 0.21,
                right: 0.81,
                bottom: 0.78,
                left: 0.375
            },
            otherCss: {}
        }
    }
};
/********************************结束：不同设备的各项配置***************************************/
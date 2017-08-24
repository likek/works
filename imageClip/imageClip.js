/********************************开始：图片剪裁***************************************/
function imageClip(configs) {
    if(!(GetType(configs)=="Object" && GetType(configs.image)=="HTMLImageElement" && GetType(configs.behavior)=="String")){return;}
    var image = configs.image;//要剪切的图片
    var behavior = configs.behavior;//业务场景

    var currentForm = formCallCenter.GetFormByID(window.FormIDs.ReportModule) || new Form(document.body);
    var currntEquipment = (currentForm && (currentForm.GetField("CurrEquipmentID")||"default")) || "default";

    for(var Equipment in equipmentConfigs){
        var eq = Equipment.split("||");
        if(eq[0]==currntEquipment || eq[1]==currntEquipment){
            currntEquipment = Equipment;
            break;
        }
    }
    if(!(equipmentConfigs[currntEquipment] && equipmentConfigs[currntEquipment][behavior] && equipmentConfigs[currntEquipment][behavior]["clipConfig"])){
        currntEquipment = "default";
    }
    var otherCss = equipmentConfigs[currntEquipment][behavior]["otherCss"];
    var clipConfig = equipmentConfigs[currntEquipment][behavior]["clipConfig"];
    var callback = equipmentConfigs[currntEquipment][behavior]["callback"];//特殊情况的处理
    clipConfig = {
        top:image.offsetHeight * clipConfig.top,
        right:image.offsetWidth * clipConfig.right,
        bottom:image.offsetHeight * clipConfig.bottom,
        left:image.offsetWidth * clipConfig.left,
        widthScale: clipConfig.widthScale
    };

    var AvailableArea = {
        width: clipConfig.right - clipConfig.left,
        height: clipConfig.bottom - clipConfig.top
    };


    var scaleBaseWidth = clipConfig.widthScale || 1+(image.offsetWidth - (clipConfig.right - clipConfig.left))/image.offsetWidth;
    var scaleBaseHeight = clipConfig.widthScale || 1+(image.offsetHeight - (clipConfig.bottom - clipConfig.top))/image.offsetHeight;
    var widthScale = Math.min(scaleBaseWidth,scaleBaseHeight);

    image.style.position = "absolute";
    image.style.top = 0 + "px";
    image.style.left = 0+ "px";

    var marginLeft =(image.parentNode.offsetWidth - image.offsetWidth)/2 - clipConfig.left + (clipConfig.left + (image.offsetWidth - clipConfig.right))/2;
    var marginTop =(image.parentNode.offsetHeight - image.offsetHeight)/2 - clipConfig.top + (clipConfig.top + (image.offsetHeight - clipConfig.bottom))/2;

    image.style.marginLeft = marginLeft + "px";
    image.style.marginTop = marginTop + "px";

    image.style.clip = "rect(" + (clipConfig.top || 0) + "px " + (clipConfig.right || 0) + "px " + (clipConfig.bottom || 0) + "px " + (clipConfig.left || 0) + "px)";
    image.style.transformOrigin = (clipConfig.left + AvailableArea.width/2) + "px  "+ (clipConfig.top + AvailableArea.height/2) + "px";
    image.style.transform = "scale(" + widthScale + ")";


    if (otherCss) {
        for (var item in otherCss) {
            image.style[item] = otherCss[item];
        }
    }
    if(callback){
        clipConfig.AvailableArea=AvailableArea;
        clipConfig.widthScale = widthScale;
        clipConfig.marginLeft = marginLeft;
        clipConfig.marginTop = marginTop;
        callback(image,clipConfig);
    }
    function GetType(data) {
        return Object.prototype.toString.call(data).slice(8,-1);
    }
}
/********************************结束：图片剪裁***************************************/
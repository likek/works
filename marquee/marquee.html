    function marquee(box, content,direction,speed) {
        var content = content;//滚动内容
        var speed = speed||50;//速度默认 2像素/50毫秒
        if(/HTML/.test(Object.prototype.toString.call(content))){
            content= dom2str(content);
        }
        var container = document.createElement('div');

        var div = document.createElement('div');
        div.innerHTML = content;
        div.style.height = box.offsetHeight + "px";
        div.style.width = box.offsetWidth + "px";
        container.appendChild(div);

        var div2 = document.createElement('div');
        div2.innerHTML = content;
        div2.style.height = box.offsetHeight + "px";
        div2.style.width = box.offsetWidth + "px";
        container.appendChild(div2);

        box.style.position = "relative";
        box.style.textAlign = "center";
        container.style.position = "absolute";
        box.appendChild(container);
        if(direction == "right" || direction == "left"){
            container.style.width = "200%";
            div.style.width = "48%";
            div2.style.width = "48%";
            div.style.float = direction;
            div2.style.float = direction;
        }

        box.style.overflow = "hidden";
        var step = 0,maxHeight = box.offsetHeight,maxWidth = box.offsetWidth;
        container.style.left = 0;
        switch (direction){
            case "right":
                step = -maxWidth;
                !function temp0() {
                    if(step >= 0){
                        step = -maxWidth;
                    }
                    container.style.left = step + "px";
                    step += 2;
                    setTimeout(temp0,speed);
                }();
                break;
            case "down":
                step = -maxHeight;
                !function temp1() {
                    if(step >= 0){
                        step = -maxHeight;
                    }
                    container.style.top = step + "px";
                    step += 2;
                    setTimeout(temp1,speed);//速度默认 2像素/50毫秒
                }();
                break;
            case "left":
                !function temp2() {
                    if(step <= -maxWidth){
                        step = 0;
                    }
                    container.style.left = step + "px";
                    step -= 2;
                    setTimeout(temp2,speed);//速度默认 2像素/50毫秒
                }();
                break;
            default:
                !function temp3() {
                    if(step <= -maxHeight){
                        step = 0;
                    }
                    container.style.top = step + "px";
                    step -= 2;
                    setTimeout(temp3,speed);//速度默认 2像素/50毫秒
                }();
                break;
        }

        function dom2str(dom){
            var div= document.createElement("div");

            div.appendChild(dom);

            return div.innerHTML;
        }
    }
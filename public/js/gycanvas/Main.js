let engine;
let looper = {
    updateFuncId : null,
    lastTick : -1,
};

const START_BTN_ID = "start_button";
const STOP_BTN_ID = "stop_button";

let rect1;

function init(){
    let createRect = function (x,y,w,h, f){
        let t = new GYTransform();
        t.pos.x = x;t.pos.y = y;
        t.scale.x = w;t.scale.y = h;

        return new GYRect(t, f);
    };

    rect1 = createRect(700,700, 100, 100, 'red');
    // let rect2 = createRect(0,100, 100, 100, 'blue');
    // let rect3 = createRect(100,0, 100, 100, 'green');
    // let rect4 = createRect(100,100, 100, 100, 'yellow');

    engine = new Engine("sandbox");
    engine.addNodes(rect1);

    engine.draw(0);
}

function onPressedStartBtn(){
    rect1.addAnimation('translate', new Vector2D(0, 700), 1000, 'linear');
    rect1.addAnimation('translate', new Vector2D(0, 0), 1000, 'ease-in');
    rect1.addAnimation('translate', new Vector2D(700, 0), 1000, 'ease-out');
    rect1.addAnimation('translate', new Vector2D(700, 700), 1000, 'ease-in-out');
    looper.updateFuncId = window.requestAnimationFrame(onUpdate);
    document.getElementById(START_BTN_ID).disabled = true;
    document.getElementById(STOP_BTN_ID).disabled = false;
}

function onPressedStopBtn(){
    if(looper.updateFuncId != null){
        looper.lastTick = -1;
        window.cancelAnimationFrame(looper.updateFuncId);
        document.getElementById(START_BTN_ID).disabled = false;
        document.getElementById(STOP_BTN_ID).disabled = true;
    }
}

function onUpdate(timestamp){
    if(looper.lastTick === -1){
        looper.lastTick = timestamp;
        looper.updateFuncId = window.requestAnimationFrame(onUpdate);
        return;
    }

    let dt = timestamp - looper.lastTick;
    engine.draw(dt);

    looper.lastTick = timestamp;
    looper.updateFuncId = window.requestAnimationFrame(onUpdate);
}

window.onload = ()=>{
    init();
};

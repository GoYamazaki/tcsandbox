let engine;
let looper = {
    updateFuncId : null,
    lastTick : -1,
};

let scene = {
    current_showing_idx : 0
};
const img_url_params = ['0000FF', '00FF00', 'FF0000'];

window.onload = ()=>{
    engine = new GYEngine("sandbox");

    const img_url_template = `https://via.placeholder.com/${engine.width}x${engine.height}/`;
    img_url_params.forEach((color, index)=>{
        const img = new Image();
        img.src = img_url_template + color + `?text=${index+1}`;
        img.onload = ()=>{
            const img_node = GYImage.create(index*engine.width, 0, engine.width, engine.height, img);
            scene[`rect${index}`] = img_node;
            engine.addNodes(img_node);
            if(Object.keys(scene).length === img_url_params.length){
                engine.draw(0);
                looper.updateFuncId = window.requestAnimationFrame(onUpdate);
            }
        };
    });
};

function move(dir){
    for(let i = 0;i<img_url_params.length;i++){
        const rect = scene[`rect${i}`];
        const rect_pos_source_x = rect.transform.pos.x;
        const rect_pos_destination_x = rect_pos_source_x + (dir * rect.transform.scale.x);
        const rect_next_pos = new Vector2D(rect_pos_destination_x, rect.transform.pos.y);
        rect.addAnimation('translate', rect_next_pos, 1000, 'ease-out');
    }
}

function onPressedNextBtn(){
    if(scene['rect0'].isAnimating)
        return;
    if(scene.current_showing_idx === img_url_params.length-1)
        return;

    scene.current_showing_idx ++;
    move(-1);

}

function onPressedPrevBtn(){
    if(scene['rect0'].isAnimating)
        return;
    if(scene.current_showing_idx === 0)
        return;

    scene.current_showing_idx --;
    move(1);
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

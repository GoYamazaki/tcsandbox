class Vector2D{
    constructor(x,y) {
        this.x = x === undefined ? 0 : x;
        this.y = y === undefined ? 0 : y;
    }
}

class GYTransform{
    constructor() {
        this.pos = new Vector2D();
        this.scale = new Vector2D();
        this.rot = 0;
    }

    static create(x,y,w,h,r){
        let ret = new GYTransform();
        ret.pos.x = x;
        ret.pos.y = y;
        ret.scale.x = w;
        ret.scale.y = h;
        ret.rot = r;

        return ret;
    }
}

class GYNode{
    constructor(transform, fillStyle) {
        this.parent = null;

        this.transform = transform;
        this.fillStyle = fillStyle;
        this.animations = [];
    }

    /**
     * Add Animation
     * @param type
     * @param dest Vector2D
     * @param duration Animation duration in millisec
     * @param interpolate 'linear' or 'ease-in-out'
     */
    addAnimation(type, dest, duration = 1000, interpolate = 'linear'){
        let interpolateType = GYLinearAnimation;
        const onFinish = ()=>{
            this.animations.splice(0, 1);//delete the finished animation.
        };

        //Select Interpolate
        if(interpolate === "ease-in-out"){
            interpolateType = GYQuadEaseInOutAnimation;
        } else {
            interpolateType = GYLinearAnimation;
        }

        //Instantiate Animation Object
        if(type === 'translate'){
            const to = [dest.x, dest.y];
            const onStart = ()=>{
                console.log(`start ${this.transform.pos.x} : ${this.transform.pos.y}`);
                return [this.transform.pos.x, this.transform.pos.y];
            };
            const onUpd = (progress)=>{
                this.transform.pos.x = progress[0];
                this.transform.pos.y = progress[1];
            };

            this.animations.push(new interpolateType(to, duration, onStart, onUpd, onFinish));
        }
    }

    onDraw(ctx, dt){
        ctx.save();

        this.animate(dt);

        ctx.translate(this.transform.pos.x, this.transform.pos.y);
        ctx.rotate(this.transform.rot);
        ctx.scale(this.transform.scale.x, this.transform.scale.y);

        ctx.fillStyle = this.fillStyle;
        this.drawElement(ctx);

        ctx.restore();
    }

    drawElement(){
        //Do nothing
    }

    animate(dt){
        if(this.animations.length > 0){
            let current_animation = this.animations[0];
            current_animation.animate(dt);
        }
    }
}

class GYRect extends GYNode{
    constructor(transform, fillStyle = 'black') {
        super(transform, fillStyle);
    }

    drawElement(ctx){
        ctx.fillRect(0,0,1,1);
    }
}


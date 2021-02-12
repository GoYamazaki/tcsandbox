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

    get isAnimating(){
        return this.animations.length !== 0;
    }

    addAnimation(type, dest, duration = 1000, interpolate = 'linear'){
        let interpolateType = GYLinearAnimation;
        const onFinish = ()=>{
            this.animations.splice(0, 1);//delete the finished animation.
        };

        //Select Interpolate
        if(interpolate === "ease-in-out"){
            interpolateType = GYQuadEaseInOutAnimation;
        } else if (interpolate === 'ease-in') {
            interpolateType = GYQuadEaseInAnimation;
        } else if (interpolate === 'ease-out') {
            interpolateType = GYQuadEaseOutAnimation;
        }

        //Instantiate Animation Object
        if(type === 'translate'){
            const to = [dest.x, dest.y];
            const onStart = ()=>{
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
        this.draw(ctx);

        ctx.restore();
    }

    draw(){
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

    static create(x,y,w,h,f){
        let t = new GYTransform();
        t.pos.x = x;t.pos.y = y;
        t.scale.x = w;t.scale.y = h;

        return new GYRect(t, f);
    }

    draw(ctx){
        ctx.fillRect(0,0,1,1);
    }
}

class GYImage extends GYNode{
    constructor(transform, image ) {
        super(transform);
        this.image = image;
    }

    static create(x,y,w,h,image){
        let t = new GYTransform();
        t.pos.x = x;t.pos.y = y;
        t.scale.x = w;t.scale.y = h;

        return new GYImage(t, image);
    }

    draw(ctx){
        ctx.drawImage(this.image, 0,0,1,1);
    }
}

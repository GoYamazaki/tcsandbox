class GYAnimation{

    constructor(to, duration, onStart, onUpdate, onDone) {
        this.to = to;
        this.duration = duration;

        this.timestamp = null;
        this.time_ratio = 0.0;

        this.onStart = onStart;
        this.onUpdate = onUpdate;
        this.onDone = onDone;
    }

    calc_progress(dt){
        if(this.timestamp == null){
            this.from = this.onStart();
            this.timestamp = 0.0;
        } else {
            this.timestamp += dt;
        }

        this.time_ratio = this.timestamp / this.duration;

        if(this.time_ratio > 1.0){
            this.onDone();
        }
    }

    animate(dt){
        this.calc_progress(dt);
        let ret = new Array(this.from.length);

        for(let i = 0;i<this.from.length;i++){
            ret[i] = this.interpolate(this.from[i], this.to[i]);
        }

        console.log(`@ ${ret[0]} : ${ret[1]}`);
        this.onUpdate(ret);
    }

    interpolate(from, to){
        throw 'GYAnimation meant to be abstract'
    }
}

class GYLinearAnimation extends GYAnimation{
    constructor(to, duration, onStart, onUpdate, onDone) {
        super(to, duration, onStart, onUpdate, onDone);
    }

    interpolate(from, to) {
        let t = this.time_ratio;
        return to * t + from;
    }
}

class GYQuadEaseInOutAnimation extends GYAnimation{
    constructor(to, duration, onStart, onUpdate, onDone) {
        super(to, duration, onStart, onUpdate, onDone);
    }

    interpolate(from, to) {
        let t = this.time_ratio * 2.0;

        if(t < 1.0){
            return to/2.0*t*t + from;
        }

        t -= 1.0;
        return -to/2.0 * (t*(t-2.0)-1.0) + from;
    }
}

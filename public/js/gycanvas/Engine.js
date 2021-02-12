class GYEngine {
    constructor(tag) {
        let canvas = document.getElementById(tag)
        this.width = parseInt(canvas.getAttribute('width'))
        this.height = parseInt(canvas.getAttribute('height'))
        this.ctx = canvas.getContext('2d')

        this.nodes = [];
    }

    addNodes(...nodes){
        nodes.forEach(n =>{
           this.nodes.push(n);
        });
    }

    clear(){
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    draw(dt) {
        this.clear();
        this.nodes.forEach(n=>{
            n.onDraw(this.ctx, dt);
        });
    }
}

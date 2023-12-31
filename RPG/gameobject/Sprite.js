class Sprite {
    constructor(config) {

        // image setup

        this.Image = new Image();
        this.Image.src = config.src;
        this.Image.onload = () => {
            this.isLoaded = true;
        }
// Shadow

this.shadow = new this.Image();
this.useShadow = true; // config.useShadow || false
if (this.useShadow){
    this.shadow.src = "";
}

this.shadow.onload = () => {
    this.isShadowLoaded = true;
}



        // configure Animation and initial state
        this.animations = config.animations || {
            idleDown: [
                [0,0]
            ],
            walkDown: [
                [0,0], [1,0], [2,0], [3,0],
            ],
        }

        this.currentAnimation = config.currentAnimation || "idleDown";
        this.currentAnimationFrame = 0;
    }

    // ref the game obj

    // fix this error

    // this.gameObject = config.gameObject;

draw(ctx) {
    const x = this.gameObject.x * 16 -8;
    const y = this.gameObject.y * 16 -18;

    this.isShadowLoaded && ctx.drawImage(this.shadow,x,y)


    ctx.drawImage (this.Image,
        0,0,
        32,32,
        x,y,
        32,32
        )
}

}
class Overworld{
    constructor (config){
        this.element = config.element;
        this.canvas = this.element.querySelector(".game-canvas");
        this.ctx = this.canvas.getContext("2d");
    }

init (){
    // console.log("ful it")

    const image = new Image();
    image.onload = () => {
        this.ctx.drawImage(image,0,0)
    };
    image.src = "";


const hero = new Image ();
hero.onload = () => {
    // draw the hero
    this.ctx.drawImage(hero, 0,0)

}

hero.src = "";

}


}
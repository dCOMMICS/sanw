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
    image.src = "/images/maps/DemoLower.png";

    

    

const x = 5;
const y = 6;

const shadow = new Image();
shadow.onload = () => {

}

shadow.src = "";

const hero = new Image ();
hero.onload = () => {
    // draw the hero
    this.ctx.drawImage(
        hero, 
        0, // left cut
        0, // top cut
        32, // width of cut
        32, // height of cut
        x * 16 - 8,
        y * 16 - 18,
        32,
        32
        )

}

hero.src = "";


// place some game object
const npc1 = new GameObject ({
    x:7,
    y:9,
    src:""
})

setTimeout(()=>{

    hero.sprite.draw(this.ctx);
    npc1.sprite.draw(this.ctx);

},200)




}


}
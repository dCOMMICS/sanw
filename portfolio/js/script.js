function reveal() {
    var reveals = document.querySelectorAll(".reveal");
  
    for (var i = 0; i < reveals.length; i++) {
      var windowHeight = window.innerHeight;
      var elementTop = reveals[i].getBoundingClientRect().top;
      var elementVisible = 150;
  
      if (elementTop < windowHeight - elementVisible) {
        reveals[i].classList.add("active");
      } else {
        reveals[i].classList.remove("active");
      }
    }
    
  }
  
  window.addEventListener("scroll", reveal);


  // delete this 

  const scroll = new LocomotiveScroll({
    el: document.querySelector('#main'),
    smooth: true
});

var tl = gsap.timeline()

tl.to("#page1",{
    y:"100vh",
    scale:0.6,
    duration:0
})
tl.to("#page1",{
    y:"30vh",
    duration:1,
    delay:1
})
tl.to("#page1",{
    y:"0vh",
    rotate:360,
    scale:1,
    duration:0.7
})

// CLASS C 

var end_panel = document.querySelector("#panel");
var end_cv = document.getElementById("magic-dust");
var end_ctx = end_cv.getContext("2d");
var end_cvWidth = parseInt(window.getComputedStyle(end_panel).width, 10); // get width without "px"
var end_cvHeight = parseInt(window.getComputedStyle(end_panel).height, 10); // get height without "px"
var resolution = window.devicePixelRatio || 1;
var sprites = [];
var toRad = Math.PI / 180;
var fx_tl;

// resize for retina
resizeCv();
function start_fx() {
    // particles
    init_fx(
        "circle",			    // texture
        1777, 				    // total sprites
        50,50, 50,50,  		// width-+, height-+
        0,2200, 0,2200,   // start position x-+, y-+
        4,12, 0,360,  		// velocity-+, angle-+
        .1,2.5, .2,.8, 	  // scale start-+, end-+
        360, 0,0,   		  // rotation start, end-+
        1.7,24,   			  // duration-+
        .1, 2,  			    // fade in, out duration
        0.1,  				    // gravity
        12,					      // delay+ inbetween sprites
        -1,					      // repeat sprite animation (-1 = infinite)
        0					        // delay timeline
    );
}

$(document).mousemove(function(e) {
    var x = e.pageX;
    var y = e.pageY;
    var scrollPosition = $(window).scrollTop()
    createMagicDust(x,y-scrollPosition,5)
});

function init_fx(textureSpr, totalSpr, minWidth,maxWidth, minHeight,maxHeight, xMin,xMax, yMin,yMax, veloMin,veloMax, angleMin,angleMax, startScaleMin,startScaleMax, endScaleMin,endScaleMax, rotStart, rotEndMin,rotEndMax, minDur,maxDur, fadeInDur, fadeOutDur, gravitySpr, delaySpr, repeatSpr, delayTl) {
    // generate sprites
    for (var i = 0; i < totalSpr; i++) {
        var widthSpr = randomInt(minWidth, maxWidth);
        var heightSpr = randomInt(minHeight, maxHeight);
        // define texture
        var texture = createShape(textureSpr, i);
        sprites.push(createSprite());
    }

    createMagicDust = (x,y,n) => {
        for (var i = 0; i < n; i++) {
            var texture = createShape(textureSpr, Math.floor(Math.random()*10));
            sprites.push(createSprite(x,y,2));
        }
    };

    // start rendering animation
    gsap.ticker.add(renderCv);
    gsap.registerPlugin(Physics2DPlugin);
    function createSprite(x,y,t) {
        var width  = (texture.naturalWidth  || texture.width  || 0) / resolution;
        var height = (texture.naturalHeight || texture.height || 0) / resolution;
        var duration = t || randomNr(minDur, maxDur);
        // limit angle if needed
        var angleNr;
        if (angleMin == -90 && angleMax == -270) {
            angleNr = Math.random() < 0.5 ? 90 : 270; // only up or down
        } else if (angleMin == -0 && angleMax == -180)  {
            angleNr = Math.random() < 0.5 ? 0 : 180; // only left or right
        } else {
            angleNr = randomNr(angleMin, angleMax);
        }
        // create a new timeline for the sprite
        fx_tl = gsap.timeline({
            delay: t ? 0 : randomNr(delaySpr),
            repeat: t ? 0 : repeatSpr,
            repeatDelay: randomNr(1)
        });
        // sprite object default properites
        var sprite = {
            animation: fx_tl,
            texture: texture,
            width: width,
            height: height,
            alpha: 0,
            rotation: randomNr(rotStart),
            scale: randomNr(startScaleMin, startScaleMax),
            originX: t ? .2 : 0.5,
            originY: t ? .3 : 0.5,
            x: x || randomNr(xMin, xMax),
            y: y || randomNr(yMin, yMax),
        };

        // animate to
        fx_tl.add("start", delayTl)
            .to(sprite, t ? 0.3 : fadeInDur, {alpha: 1, ease:Power0.easeIn}, "start")
            .to(sprite, duration, {
                rotation: 180 * randomNr(rotEndMin, rotEndMax),
                scale: randomNr(endScaleMin, endScaleMax),
                physics2D: {
                    velocity: randomNr(veloMin, veloMax),
                    angle: angleNr,
                    gravity: gravitySpr,
                }
            }, "start")
            // fade out
            .to(sprite, t ? 1.5 : fadeOutDur, {
                alpha: 0,
                delay: t ? 1.5 : duration-fadeOutDur
            }, 0);

        return sprite;
    }

    function createShape(textureSpr, i) {
        // Create offscreen canvas
        var canvas = document.createElement("canvas");
        var context = canvas.getContext("2d");
        canvas.width = widthSpr * resolution;
        canvas.height = heightSpr * resolution;
        var radius = widthSpr / 2;
        var gradient = context.createRadialGradient(radius, radius, 0, radius, radius, radius);
        if (i % 3 === 0){
            gradient.addColorStop(0, "rgba(177,255,252,0.75)");
            gradient.addColorStop(0.15,	"rgba(177,255,252,0.1)");
        } else if (i % 5 === 0){
            gradient.addColorStop(0, "rgba(202,76,255,0.6)");
            gradient.addColorStop(0.1,	"rgba(202,76,255,0.1)");
        } else {
            gradient.addColorStop(0, "rgba(102,219,214,0.6)");
            gradient.addColorStop(0.1,	"rgba(102,219,214,0.1)");
        }
        gradient.addColorStop(0.65, "rgba(0,0,0,0)");
        context.fillStyle = gradient;
        context.fillRect(0, 0, widthSpr, heightSpr);
            return canvas;
    }
}

function renderCv() {
    end_ctx.clearRect(0, 0, end_cvWidth, end_cvHeight);
    for (var i = 0; i < sprites.length; i++) {
        var sprite = sprites[i];
        // Skip rendering sprite if it has no alpha
        if (!sprite.alpha) {
            continue;
        }
        end_ctx.save();
        var offsetX = sprite.originX * sprite.width;
        var offsetY = sprite.originY * sprite.height;
        end_ctx.translate(sprite.x + offsetX, sprite.y + offsetY);
        end_ctx.rotate(sprite.rotation * toRad);
        end_ctx.scale(sprite.scale, sprite.scale);
        end_ctx.globalAlpha = sprite.alpha;
        end_ctx.drawImage(sprite.texture, -offsetX, -offsetY);
        end_ctx.restore();
    }
}

function resizeCv() {
    end_cv.width  = end_cvWidth * resolution;
    end_cv.height = end_cvHeight * resolution;
    end_cv.style.width  = end_cvWidth + "px";
    end_cv.style.height = end_cvHeight + "px";
    end_ctx.scale(resolution, resolution);
}

function randomNr(min, max) {
    if (max === undefined) { max = min; min = 0; }
    if (min > max) { var tmp = min; min = max; max = tmp; }
    return min + (max - min) * Math.random();
}

function randomInt(min, max) {
    if (max === undefined) { max = min; min = 0; }
    if (min > max) { var tmp = min; min = max; max = tmp; }
    return Math.floor(min + (max - min + 1) * Math.random());
}
start_fx();

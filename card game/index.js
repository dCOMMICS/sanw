
const cardObjectDefinitions = [
    {id:1, imagePath:'/images/card-KingHearts.png'},
    {id:2, imagePath:'/images/card-JackClubs.png'},
    {id:3, imagePath:'/images/card-QueenDiamonds.png'},
    {id:4, imagePath:'/images/card-AceSpades.png'}
]
const aceId = 4

const cardBackImgPath = '/images/card-back-blue.png'

let cards = []

const playGameButtonElem = document.getElementById('playGame')

const cardContainerElem = document.querySelector('.card-container')

const collapsedGridAreaTemplate = '"a a" "a a"'
const cardCollectionCellClass = ".card-pos-a"

const numCards = cardObjectDefinitions.length

let cardPositions = []


let gameInProgress = false 
let shufflingInProgress = false 
let cardsRevealed = false


const currentGameStatusElem = document.querySelector('.current-status')
const scoreContainerElem = document.querySelector('.header-score-container')
const scoreElem = document.querySelector('.score')
const roundContainerElem = document.querySelector('.header-round-container')
const roundElem = document.querySelector('.round')

const winColor = "green"
const loseColor = "red"
const primaryColor = "black"

let roundNum = 0
let maxRounds = 4
let score = 0

let gameObj = {}

const localStorageGameKey = "HTA"


/* <div class="card">
<div class="card-inner">
    <div class="card-front">
        <img src="/images/card-JackClubs.png" alt="" class="card-img">
    </div>
    <div class="card-back">
        <img src="/images/card-back-Blue.png" alt="" class="card-img">
    </div>
</div>
</div> */


loadGame()


function gameOver()
{
    updateStatusElement(scoreContainerElem,"none")
    updateStatusElement(roundContainerElem,"none")

    const gameOverMessage = `Game Over! Final Score - <span class = 'badge'>${score}</span> Click 'Play Game' button to play again`

    updateStatusElement(currentGameStatusElem,"block",primaryColor,gameOverMessage)

    gameInProgress = false
    playGameButtonElem.disabled = false
}

function endRound()
{
    setTimeout(()=>{
        if(roundNum == maxRounds)
        {
            gameOver()
            return
        }
        else
        {
            startRound()
        }
    },3000)
}

function chooseCard(card)
{
    if(canChooseCard())
    {
        evaluateCardChoice(card)
        saveGameObjectToLocalStorage(score, roundNum)
        flipCard(card,false)

        setTimeout(() => {
            flipCards(false)
            updateStatusElement(currentGameStatusElem,"block", primaryColor,"Card positions revealed")

            endRound()

        },3000)
        cardsRevealed = true
    }

}

function calculateScoreToAdd(roundNum)
{
    if(roundNum == 1)
    {
        return 100
    }
    else if(roundNum == 2)
    {
        return 50
    }
    else if(roundNum == 3)
    {
        return 25
    }
    else
    {
        return 10
    }
}

function calculateScore()
{
    const scoreToAdd = calculateScoreToAdd(roundNum)
    score = score + scoreToAdd
}

function updateScore()
{
    calculateScore()
    updateStatusElement(scoreElem, "block", primaryColor, `Score <span class='badge'>${score}</span>`)

}

function updateStatusElement(elem, display, color, innerHTML)
{
    elem.style.display = display

    if(arguments.length > 2)
    {
        elem.style.color = color
        elem.innerHTML = innerHTML
    }

}

function outputChoiceFeedBack(hit)
{
    if(hit)
    {
        updateStatusElement(currentGameStatusElem, "block", winColor, "Hit!! - Well Done!! :)")
    }
    else
    {
        updateStatusElement(currentGameStatusElem, "block", loseColor, "Missed!! :(")
    }
}

function evaluateCardChoice(card)
{
    if(card.id == aceId)
    {
        updateScore()
        outputChoiceFeedBack(true)
    }
    else
    {
        outputChoiceFeedBack(false)
    }
}

function canChooseCard()
{
    return gameInProgress == true && !shufflingInProgress && !cardsRevealed
}



function loadGame(){
    createCards()

    cards = document.querySelectorAll('.card')

    cardFlyInEffect()

    playGameButtonElem.addEventListener('click', ()=>startGame())

    updateStatusElement(scoreContainerElem,"none")
    updateStatusElement(roundContainerElem,"none")

}

function checkForIncompleteGame()
{
    const serializedGameObj = getLocalStorageItemValue(localStorageGameKey)
    if(serializedGameObj)
    {
        gameObj = getObjectFromJSON(serializedGameObj)

        if(gameObj.round >= maxRounds)
        {
            removeLocalStorageItem(localStorageGameKey)
        }
        else
        {
            if(confirm('Would you like to continue with your last game?'))
            {
                score = gameObj.score
                roundNum = gameObj.round
            }
        }

    }

}

function startGame(){
    initializeNewGame()
    startRound()

}
function initializeNewGame(){
    score = 0
    roundNum = 0

    checkForIncompleteGame()

    shufflingInProgress = false

    updateStatusElement(scoreContainerElem,"flex")
    updateStatusElement(roundContainerElem,"flex")

    updateStatusElement(scoreElem,"block",primaryColor,`Score <span class='badge'>${score}</span>`)
    updateStatusElement(roundElem,"block",primaryColor,`Round <span class='badge'>${roundNum}</span>`)

}
function startRound()
{
    initializeNewRound()
    collectCards()
    flipCards(true)
    shuffleCards()

}
function initializeNewRound()
{
    roundNum++
    playGameButtonElem.disabled = true

    gameInProgress = true
    shufflingInProgress = true
    cardsRevealed = false

    updateStatusElement(currentGameStatusElem, "block", primaryColor, "Shuffling...")
    
    updateStatusElement(roundElem, "block", primaryColor, `Round <span class='badge'>${roundNum}</span>`)

}

function collectCards(){
    transformGridArea(collapsedGridAreaTemplate)
    addCardsToGridAreaCell(cardCollectionCellClass)

}

function transformGridArea(areas)
{
    cardContainerElem.style.gridTemplateAreas = areas

}
function addCardsToGridAreaCell(cellPositionClassName)
{
    const cellPositionElem = document.querySelector(cellPositionClassName)

    cards.forEach((card, index) =>{
        addChildElement(cellPositionElem, card)
    })

}

function flipCard(card, flipToBack)
{
    const innerCardElem = card.firstChild

    if(flipToBack && !innerCardElem.classList.contains('flip-it'))
    {
        innerCardElem.classList.add('flip-it')
    }
    else if(innerCardElem.classList.contains('flip-it'))
    {
        innerCardElem.classList.remove('flip-it')
    }

}

function flipCards(flipToBack){
    cards.forEach((card,index)=>{
        setTimeout(() => {
            flipCard(card,flipToBack)
        },index * 100)
    })
}

function cardFlyInEffect()
{
    const id = setInterval(flyIn, 5)
    let cardCount = 0

    let count = 0

    function flyIn()
    {
        count++
        if(cardCount == numCards)
        {
            clearInterval(id)
            playGameButtonElem.style.display = "inline-block"            
        }
        if(count == 1 || count == 250 || count == 500 || count == 750)
        {
            cardCount++
            let card = document.getElementById(cardCount)
            card.classList.remove("fly-in")
        }
    }



}

function removeShuffleClasses()
{
    cards.forEach((card) =>{
        card.classList.remove("shuffle-left")
        card.classList.remove("shuffle-right")
    })
}
function animateShuffle(shuffleCount)
{
    const random1 = Math.floor(Math.random() * numCards) + 1
    const random2 = Math.floor(Math.random() * numCards) + 1

    let card1 = document.getElementById(random1)
    let card2 = document.getElementById(random2)

    if (shuffleCount % 4 == 0)
    {
        card1.classList.toggle("shuffle-left")
        card1.style.zIndex = 100
    }
    if (shuffleCount % 10 == 0)
    {
        card2.classList.toggle("shuffle-right")
        card2.style.zIndex = 200
    }

}

function shuffleCards()
{
    let shuffleCount = 0
    const id = setInterval(shuffle, 12)


    function shuffle()
    {
        randomizeCardPositions()
       
        animateShuffle(shuffleCount)
       
        if(shuffleCount == 500)
        {
            clearInterval(id)
            shufflingInProgress = false
            removeShuffleClasses()
            dealCards()
            updateStatusElement(currentGameStatusElem, "block", primaryColor, "Please click the card that you think is the Ace of Spades...")

        }
        else{
            shuffleCount++
        }

    }

}
function randomizeCardPositions()
{
    const random1 = Math.floor(Math.random() * numCards) + 1
    const random2 = Math.floor(Math.random() * numCards) + 1

    const temp = cardPositions[random1 - 1]

    cardPositions[random1 - 1] = cardPositions[random2 - 1]
    cardPositions[random2 - 1] = temp

}
function dealCards()
{
    addCardsToAppropriateCell()
    const areasTemplate = returnGridAreasMappedToCardPos()

    transformGridArea(areasTemplate)

}
function returnGridAreasMappedToCardPos()
{
    let firstPart = ""
    let secondPart = ""
    let areas = ""

    cards.forEach((card, index) => {
        if(cardPositions[index] == 1)
        {
            areas = areas + "a "
        }
        else if(cardPositions[index] == 2)
        {
            areas = areas + "b "
        }
        else if (cardPositions[index] == 3)
        {
            areas = areas + "c "
        }
        else if (cardPositions[index] == 4)
        {
            areas = areas + "d "
        }
        if (index == 1)
        {
            firstPart = areas.substring(0, areas.length - 1)
            areas = "";
        }
        else if (index == 3)
        {
            secondPart = areas.substring(0, areas.length - 1)
        }

    })

    return `"${firstPart}" "${secondPart}"`


}


function addCardsToAppropriateCell()
{
    cards.forEach((card)=>{
        addCardToGridCell(card)
    })
}



function createCards()
{
    cardObjectDefinitions.forEach((cardItem)=>{
        createCard(cardItem)
    })
}


function createCard(cardItem){

    //create div elements that make up a card
    const cardElem = createElement('div')
    const cardInnerElem = createElement('div')
    const cardFrontElem = createElement('div')
    const cardBackElem = createElement('div')

    //create front and back image elements for a card
    const cardFrontImg = createElement('img')
    const cardBackImg = createElement('img')

    //add class and id to card element
    addClassToElement(cardElem, 'card')
    addClassToElement(cardElem, 'fly-in')
    addIdToElement(cardElem, cardItem.id)

    //add class to inner card element
    addClassToElement(cardInnerElem, 'card-inner')
    
    //add class to front card element
    addClassToElement(cardFrontElem, 'card-front')

    //add class to back card element
    addClassToElement(cardBackElem, 'card-back')

    //add src attribute and appropriate value to img element - back of card
    addSrcToImageElem(cardBackImg, cardBackImgPath)

    //add src attribute and appropriate value to img element - front of card
    addSrcToImageElem(cardFrontImg, cardItem.imagePath)

    //assign class to back image element of back of card
    addClassToElement(cardBackImg, 'card-img')
   
    //assign class to front image element of front of card
    addClassToElement(cardFrontImg, 'card-img')

    //add front image element as child element to front card element
    addChildElement(cardFrontElem, cardFrontImg)

    //add back image element as child element to back card element
    addChildElement(cardBackElem, cardBackImg)

    //add front card element as child element to inner card element
    addChildElement(cardInnerElem, cardFrontElem)

    //add back card element as child element to inner card element
    addChildElement(cardInnerElem, cardBackElem)

    //add inner card element as child element to card element
    addChildElement(cardElem, cardInnerElem)

    //add card element as child element to appropriate grid cell
    addCardToGridCell(cardElem)

    initializeCardPositions(cardElem)

    attatchClickEventHandlerToCard(cardElem)


}
function attatchClickEventHandlerToCard(card){
    card.addEventListener('click', () => chooseCard(card))
}

function initializeCardPositions(card)
{
    cardPositions.push(card.id)
}

function createElement(elemType){
    return document.createElement(elemType)

}
function addClassToElement(elem, className){
    elem.classList.add(className)
}
function addIdToElement(elem, id){
    elem.id = id
}
function addSrcToImageElem(imgElem, src){
    imgElem.src = src
}
function addChildElement(parentElem, childElem){
    parentElem.appendChild(childElem)
}

function addCardToGridCell(card)
{
    const cardPositionClassName = mapCardIdToGridCell(card)

    const cardPosElem = document.querySelector(cardPositionClassName)

    addChildElement(cardPosElem, card)

}
function mapCardIdToGridCell(card){
   
    if(card.id == 1)
    {
        return '.card-pos-a'
    }
    else if(card.id == 2)
    {
        return '.card-pos-b'
    }
    else if(card.id == 3)
    {
        return '.card-pos-c'
    }
    else if(card.id == 4)
    {
        return '.card-pos-d'
    }
}

//local storage functions
function getSerializedObjectAsJSON(obj)
{
    return JSON.stringify(obj)
}
function getObjectFromJSON(json)
{
    return JSON.parse(json)
}
function updateLocalStorageItem(key, value)
{
    localStorage.setItem(key, value)
}
function removeLocalStorageItem(key)
{
    localStorage.removeItem(key)
}
function getLocalStorageItemValue(key)
{
    return localStorage.getItem(key)
}

function updateGameObject(score,round)
{
    gameObj.score = score
    gameObj.round = round
}
function saveGameObjectToLocalStorage(score,round)
{
    updateGameObject(score, round)
    updateLocalStorageItem(localStorageGameKey, getSerializedObjectAsJSON(gameObj))
}


// rotary code


RPH = {};

RPH.math = {

    getDistance: function(x1, y1, x2, y2) {

        return Math.pow(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2), 0.5);

    },

    getAngle: function(x1, y1, x2, y2) {

        var angle;

        if (Math.abs(x1 - x2) < RPH.W / 100 && y2 > y1) return 1 * Math.PI / 2;
        if (Math.abs(x1 - x2) < RPH.W / 100 && y2 < y1) return 3 * Math.PI / 2;

        angle = Math.atan((y2 - y1) / (x2 - x1));

        if (x1 < x2) {

            if (angle < 0) return angle + 2 * Math.PI;
            return angle;

        }

        return angle + Math.PI;

    }

};

RPH.mouse = {

    x: 0,
    y: 0,
    xDrag: 0,
    yDrag: 0,
    isDragging: false,

    get: function(e) {

        var rect = RPH.canvas.getBoundingClientRect();
        this.x = e.clientX - rect.left;
        this.y = e.clientY - rect.top;

    },

    down: function(e) {

        this.get(e);
        this.xDrag = this.x;
        this.yDrag = this.y;
        this.isDragging = true;

    },

    up: function(e) {

        this.get(e);
        this.isDragging = false;

    },

    move: function(e) {

        this.get(e);

    },

    draw: function(e) {

        RPH.pen.circle(this.x, this.y, 5);

    }

};

RPH.pen = {

    clear: function() {

        RPH.ctx.clearRect(0, 0, RPH.W, RPH.H);

    },

    rect: function(x, y, w, h) {

        RPH.ctx.beginPath();
        RPH.ctx.rect(x, y, w, h);
        RPH.ctx.closePath();
        RPH.ctx.fill();

    },

    circle: function(x, y, r) {

        RPH.ctx.beginPath();
        RPH.ctx.arc(x, y, r, 0, Math.PI * 2, true);
        RPH.ctx.fill();

    }

};

RPH.phone = {

    alpha: 0,
    alphaPrev: 0,
    oBeta: Math.PI * 4 / 9,
    dBeta: Math.PI / 7,
    rBeta: Math.PI / 24,

    r0: 0.35,
    r2: 0.23,
    r1: 0.29,
    r3: 0.04,

    fontString: "",

    activeDigit: -1,

    setDrag: function() {

        var xc = this.centroid.x,
            yc = this.centroid.y;

        this.alpha = RPH.math.getAngle(RPH.W * xc, RPH.H * yc, RPH.mouse.x, RPH.mouse.y) - RPH.math.getAngle(RPH.W * xc, RPH.H * yc, RPH.mouse.xDrag, RPH.mouse.yDrag);

        // dialing only works forward
        this.alpha = (this.alpha < 0) ? 0 : this.alpha;

        if (this.alpha > ((10 - this.activeDigit) * this.dBeta + this.rBeta)) {

            RPH.mouse.isDragging = false;

            if (RPH.dialer.number.length < 12) RPH.dialer.number += this.activeDigit;
            if (RPH.dialer.number.length === 3 || RPH.dialer.number.length === 7) RPH.dialer.number += '-';

            this.activeDigit = -1;

        }

    },

    setActiveDigit: function() {

        var angle;

        this.activeDigit = -1;

        for (i = 0; i < 10; i += 1) {

            angle = this.oBeta + this.dBeta * i + this.alpha;

            xt = RPH.W * this.centroid.x + RPH.minWH * this.r1 * Math.cos(angle);
            yt = RPH.H * this.centroid.y + RPH.minWH * this.r1 * Math.sin(angle);

            if (RPH.math.getDistance(RPH.mouse.x, RPH.mouse.y, xt, yt) < RPH.minWH * this.r3) {

                this.activeDigit = i;

            }

        }

    },

    drawRing: function() {

        var xc = this.centroid.x,
            yc = this.centroid.y;

        RPH.ctx.fillStyle = "#444444";
        RPH.pen.circle(RPH.W * xc, RPH.H * yc, RPH.minWH * this.r0);

        RPH.ctx.fillStyle = "rgb(240,245,240)";
        RPH.pen.circle(RPH.W * xc, RPH.H * yc, RPH.minWH * this.r2);

    },

    drawLine: function() {

        var angle = this.oBeta + 10 * this.dBeta + this.rBeta,
            xc = this.centroid.x,
            yc = this.centroid.y;

        RPH.ctx.strokeStyle = "rgb(240,245,240)";

        RPH.ctx.beginPath();
        RPH.ctx.moveTo(RPH.W * xc + this.r0 * RPH.minWH * Math.cos(angle), RPH.H * yc + this.r0 * RPH.minWH * Math.sin(angle));
        RPH.ctx.lineTo(RPH.W * xc + this.r1 * RPH.minWH * Math.cos(angle), RPH.H * yc + this.r1 * RPH.minWH * Math.sin(angle));
        RPH.ctx.lineWidth = RPH.minWH / 150;
        RPH.ctx.stroke();

    },

    drawNumber: function() {

        RPH.ctx.font = RPH.minWH / 25 + "px " + this.fontString;
        RPH.ctx.fillStyle = "#444444";
        RPH.ctx.fillText(RPH.dialer.number, RPH.W * this.text.x, RPH.H * this.text.y);

    },

    drawDigits: function() {

        var i, angle;

        RPH.ctx.font = RPH.minWH / 18 + "px Courier";

        for (i = 0; i < 10; i += 1) {

            RPH.ctx.fillStyle = (this.activeDigit === i) ? "rgb(180,205,200)" : "rgb(240,245,240)";

            angle = RPH.phone.oBeta + RPH.phone.dBeta * i + RPH.phone.alpha;
            RPH.pen.circle(
                RPH.W * this.centroid.x + RPH.minWH * this.r1 * Math.cos(angle),
                RPH.H * this.centroid.y + RPH.minWH * this.r1 * Math.sin(angle),
                RPH.minWH * this.r3
            );

            RPH.ctx.fillStyle = "#444444";
            angle = RPH.phone.oBeta + RPH.phone.dBeta * i;

            RPH.ctx.fillText(
                i,
                RPH.W * this.centroid.x + RPH.minWH * this.r1 * Math.cos(angle),
                RPH.H * this.centroid.y + RPH.minWH * this.r1 * Math.sin(angle)
            );

        }

    },

    centroid: {

        x: 0.5,
        y: 0.55

    },

    text: {

        x: 0.5,
        y: 0.1,
        isHovered: function() {

            return (RPH.mouse.y / RPH.minWH < this.y + 0.02) && (RPH.mouse.y / RPH.minWH > this.y - 0.02);

        }

    }

};

RPH.dialer = {

    number: "",

    dial: function() {

        window.location = "tel:" + this.number;

    }

};

RPH.mouseUp = function(e) {

    RPH.mouse.up(e);

};

RPH.mouseDown = function(e) {

    RPH.mouse.down(e);

    RPH.mouse.isDragging = (RPH.phone.alpha < 0.03 && RPH.phone.activeDigit !== -1);

    if (RPH.phone.text.isHovered()) {

        RPH.dialer.dial();

    }

};

RPH.mouseMove = function(e) {

    RPH.mouse.move(e);

    if (RPH.mouse.isDragging) {

        RPH.phone.setDrag();

    } else if (RPH.phone.alpha < 0.03) {

        RPH.phone.setActiveDigit();

    }

    RPH.fontString = (RPH.phone.text.isHovered()) ? "bold " : "";
    RPH.fontString += RPH.minWH / 30 + "px Courier";


};

// !main
RPH.draw = function() {

    RPH.pen.clear();

    RPH.ctx.textAlign = "center";
    RPH.ctx.textBaseline = "middle";

    RPH.phone.drawRing();
    RPH.phone.drawLine();
    RPH.phone.drawNumber();
    RPH.phone.drawDigits();

    if (RPH.phone.alpha > 0 && !RPH.mouse.isDragging) {

        RPH.phone.alpha -= 0.02;

    }

    RPH.canvas.addEventListener('mousedown', RPH.mouseDown);
    RPH.canvas.addEventListener('mousemove', RPH.mouseMove);
    RPH.canvas.addEventListener('mouseup', RPH.mouseUp);

};

function touchHandler(event) {

    var touch = event.changedTouches[0],
        simulatedEvent = document.createEvent("MouseEvent");

    simulatedEvent.initMouseEvent({
            touchstart: "mousedown",
            touchmove: "mousemove",
            touchend: "mouseup"
        }[event.type], true, true, window, 1,
        touch.screenX, touch.screenY,
        touch.clientX, touch.clientY, false,
        false, false, false, 0, null);

    touch.target.dispatchEvent(simulatedEvent);
    event.preventDefault();

}

RPH.init = function() {

    document.addEventListener("touchstart", touchHandler, true);
    document.addEventListener("touchmove", touchHandler, true);
    document.addEventListener("touchend", touchHandler, true);
    document.addEventListener("touchcancel", touchHandler, true);

    RPH.canvas = document.getElementById("retrophone");
    RPH.ctx = RPH.canvas.getContext("2d");

    this.resizeCanvas();
    return setInterval(RPH.draw, 10);

};

RPH.resizeCanvas = function() {

    RPH.canvas.width = window.innerWidth;
    RPH.canvas.height = window.innerHeight;
    RPH.W = RPH.canvas.width;
    RPH.H = RPH.canvas.height;
    RPH.minWH = Math.min(RPH.W, RPH.H);

};

RPH.init();

window.addEventListener('resize', RPH.resizeCanvas, false);





//  super wek peeter


class App extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        time: 0
      }
      this.animate = this.animate.bind(this)
    }
  
    render() {
      return (
        <div style={{
          width: 600,
          margin: 'auto'
        }}>
          <Drawing time={this.state.time}/>
        </div>
      )
    }
    
    animate() {
      requestAnimationFrame(() => {
        this.setState({
          time: this.state.time + 0.02
        })
        this.animate()
      })    
    }
  
    componentDidMount() {
      this.animate()
    }
  }
  
  function isFirstPointRepeated(polygonCoordinates) {
    const firstPoint = polygonCoordinates[0]
    const lastPoint = polygonCoordinates[polygonCoordinates.length - 1]
    return (firstPoint[0] === lastPoint[0]) && (firstPoint[1] === lastPoint[1])
  }
  
  function getPointCount(polygonCoordinates) {
    let length = polygonCoordinates.length
    if (isFirstPointRepeated(polygonCoordinates)) {
      length -= 1
    }
    return length
  }
  
  function getCentroid(polygonCoordinates) {
    const pointCount = getPointCount(polygonCoordinates)
    return polygonCoordinates.reduce((centroid, currentPoint, index, polygonCoordinates) => {
      return [centroid[0] + currentPoint[0] / pointCount, centroid[1] + currentPoint[1] / pointCount]
    })
  }
  
  function scatter(point, basePoint, time) {
    const baseVector = [basePoint[0] + 40, basePoint[1]]
    const timeFactor = 1 - Math.cos(time)
    return [
      point[0] + baseVector[0] * 0.02 * timeFactor,
      point[1] + baseVector[1] * 0.03 * timeFactor
    ]
  }
  
  const colors = {
    red: '#D13233',
    blue: '#143C6B'
  }
  
  const pieces = [[[14.4, -45.15], [17.19, -48.1], [20.11, -36.42], [14.4, -45.15]], [[23.65, -41.11], [19.08, -16.8], [30.66, -39.22], [23.65, -41.11]], [[13.44, -29.3], [0.19, -7.18], [0.42999999999999999, -29.88], [13.44, -29.3]], [[18.95, -32.18], [6.44, -12.01], [13.14, -7.52], [18.95, -32.18]], [[25.94, -26.71], [19.23, 0.78000000000000003], [36.69, 0.63], [25.94, -26.71]], [[37.29, -5.01], [41.42, -3.85], [40.31, 6.13], [37.29, -5.01]], [[30.91, 15.92], [45.04, 13.68], [45.08, 18.38], [30.91, 15.92]], [[17.16, 12.51], [28.07, 7.54], [18.5, 3.82], [17.16, 12.51]], [[8.359999999999999, -2.49], [12.9, 21.33], [17.95, -9.44], [8.359999999999999, -2.49]], [[4.41, -8.310000000000001], [1.5, 19.8], [9.51, 18.68], [4.41, -8.310000000000001]], [[16.5, 23.79], [18.49, 15.43], [34.97, 28.95], [16.5, 23.79]], [[28.84, 34.86], [30.77, 31.8], [33.77, 40.45], [28.84, 34.86]], [[3.15, 23.07], [24.24, 28.82], [20.24, 43.82], [3.15, 23.07]], [[0.14000000000000001, 26.14], [0.20999999999999999, 46.45], [14.08, 46.33], [0.14000000000000001, 26.14]]]
  
  const wholes = [
    [
      [-15.9, -15.91],
      [-0.23000000000000001, -29.87],
      [-0.23000000000000001, -13.3],
      [-15.9, -15.91],
      [-16.52, -28.96]
    ],
    [
      [-15.59, -9.310000000000001],
      [-0.23000000000000001, -5.46],
      [-4.89, -5.48],
      [-15.59, -9.310000000000001],
      [-15.88, -15.47],
      [-0.23000000000000001, -12.86]
    ],
    [
      [-19.28, 43.0],
      [-0.23000000000000001, 46.45],
      [-14.96, 46.72],
      [-19.28, 43.0],
      [-17.94, 37.88],
      [-20.12, 0.90000000000000002],
      [-15.32, -3.86],
      [-15.57, -8.84],
      [-4.97, -5.05],
      [-0.23000000000000001, -5.02]
    ],
    [
      [-22.76, -32.57],
      [-18.62, -33.86],
      [-18.97, -43.01],
      [-21.82, -42.73],
      [-22.76, -32.57]
    ],
    [
      [-31.68, -0.44],
      [-21.56, 1.72],
      [-30.21, 0.01],
      [-31.68, -0.44],
      [-33.81, -6.39],
      [-27.76, -10.95],
      [-24.83, -31.46],
      [-18.53, -33.44],
      [-16.97, -29.12],
      [-15.77, -4.04]
    ],
    [
      [-31.95, 46.0],
      [-20.56, 46.18],
      [-18.37, 37.83],
      [-20.53, 1.31],
      [-21.42, 2.19],
      [-30.07, 0.47999999999999998],
      [-34.34, 38.41],
      [-31.95, 46.0]
    ]
  ]
  
  const rawDrawingSize = 100
  
  const svgSize = 600
  const svgPadding = 50
  const svgInnerSize = svgSize - 2 * svgPadding
  
  function Drawing(props) {
    return (
      <svg width={svgSize} height={svgSize}>
        <g transform={`translate(${svgPadding} ${svgPadding})`}>
          <g transform={`translate(${svgInnerSize / 2} ${svgInnerSize / 2}) scale(${svgInnerSize / rawDrawingSize}) rotate(180)`}>
            <PolygonGroup
              fill={colors.red}
              time={props.time}
              polygons={pieces}
              isAnimated={true}
            />
            <PolygonGroup
              fill={colors.blue}
              polygons={wholes}
            />
          </g>
        </g>
      </svg>
    )
  }
  
  function PolygonGroup(props) {
    const list = props.polygons.map((coordinates, i) => {
      return <Polygon
        {...props}
        key={i}
        coordinates={coordinates}
      />
    })
    return (
      <g>
        {list}
      </g>
    )
  }
  
  function Polygon(props) {
    const {time} = props
    const centroid = getCentroid(props.coordinates)
    const animationFunction = props.isAnimated ? (point) => scatter(point, centroid, time) : (point) => (point)
    const coordinateString = props.coordinates
      .slice(1)
      .map(animationFunction)
      .map(point => [- point[0], point[1]])
      .map(point => point.join(',')).join(' ')
    return (
      <g>
        <polygon fill={props.fill} points={coordinateString}/>
      </g>
    )
  }
  
  ReactDOM.render(<App/>, document.getElementById('app'))



//   rusty React round 

/**
 * Game state object. Mutated by keyboard interactions.
 */
const gameState = {
    acceptKeys: true,
    lateralPosition: {
      current: 0,
      target: 0
    },
    verticalPosition: {
      current: 1,
      target: 1
    }
  }
  
  /**
   * Vertex shader source.
   */
  const vertexShaderSource = `
  uniform mat4 u_Perspective;
  uniform mat4 u_Transform;
  uniform vec3 u_LightDirection;
  attribute vec4 a_Position;
  attribute vec4 a_Normal;
  attribute vec4 a_Color;
  varying vec4 v_Color;
  void main() {
    vec4 lightDirection = normalize(vec4(u_LightDirection, 0.0));
    gl_Position = u_Perspective * (u_Transform * a_Position);
    float brightness = 0.55 - dot(lightDirection, normalize(a_Normal)) * 0.45;
    v_Color = a_Color * brightness;
  }
  `
  
  /**
   * Fragment shader source.
   */
  const fragmentShaderSource = `
  precision mediump float;
  varying vec4 v_Color;
  void main() {
    gl_FragColor = v_Color;
  }
  `
  
  // Entry point
  ;(function main () {
    let ticks = 0
    const canvas = document.getElementById('webgl')
    resize(canvas)
    const gl = canvas.getContext('webgl')
    createProgram(gl, vertexShaderSource, fragmentShaderSource)
    setLight(gl)
    setTransform(gl)
    document.addEventListener('keydown', handleKeyDown)
    window.addEventListener('resize', resize.bind(this, canvas, gl))
    function tick () {
      ticks += 1
      setPerspective(gl, ticks)
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
      animateLateralPosition()
      drawShape(gl, moebius)
      drawShape(gl, car, transformCar(
        ticks / 50,
        gameState.lateralPosition.current,
        gameState.verticalPosition.current
      ))
      window.requestAnimationFrame(tick)
    }
    tick()
  }())
  
  /**
   * Compute car transform matrix.
   * @param {float} angle - Angle around the Moebius strip, in Radians.
   * @param {lateralPosition} - Normalized position along the width of the strip. Varies between +1 and -1.
   * @param {verticalPosition} - Normalized vertical position, varying between -1 and +1. These two values correspond to the two sides of the strip as the vehicle ascends.
   * @returns {Matrix4} transform - Transformation matrix.
   */
  function transformCar (angle, lateralPosition, verticalPosition) {
    const rotZ = new Matrix4().setRotate(
      (angle + Math.PI / 2) * 180 / Math.PI,
      0,
      0,
      1
    )
    const rotX = new Matrix4().setRotate(
      (-angle + Math.PI / 2) * 180 / Math.PI,
      Math.cos(angle + Math.PI / 2),
      Math.sin(angle + Math.PI / 2),
      0
    )
    const translateXY = new Matrix4().setTranslate(
      0.5 * Math.cos(angle),
      0.5 * Math.sin(angle),
      0
    )
    const translateZ = new Matrix4().setTranslate(0, 0, verticalPosition * 0.04)
    const translateY = new Matrix4().setTranslate(
      -lateralPosition * 0.10 * Math.sin(angle + Math.PI / 2),
      lateralPosition * 0.10 * Math.cos(angle + Math.PI / 2),
      0
    )
    const scale = new Matrix4().setScale(0.6, 0.6, 0.6)
    return translateXY
      .multiply(rotX)
      .multiply(translateY)
      .multiply(translateZ)
      .multiply(rotZ)
      .multiply(scale)
  }
  
  /**
   * Animate current position values toward the target ones.
   */
  function animateLateralPosition () {
    if (gameState.lateralPosition.current < gameState.lateralPosition.target - 0.001) {
      gameState.lateralPosition.current += 0.025
    } else if (gameState.lateralPosition.current > gameState.lateralPosition.target + 0.001) {
      gameState.lateralPosition.current -= 0.025
    }
    if (gameState.verticalPosition.current < gameState.verticalPosition.target - 0.001) {
      gameState.verticalPosition.current += 0.05
    } else if (gameState.verticalPosition.current > gameState.verticalPosition.target + 0.001) {
      gameState.verticalPosition.current -= 0.05
    }
  }
  
  /**
   * Handle key down event.
   * @param {Object} e - Event object.
   */
  function handleKeyDown (e) {
    if (!gameState.acceptKeys) {
      return
    }
    gameState.acceptKeys = false
    setTimeout(function () {
      gameState.acceptKeys = true
    }, 100)
    const keyCode = e.keyCode
    if (keyCode === 39) {
      gameState.lateralPosition.target = Math.max(
        gameState.lateralPosition.target - 0.5,
        -1
      )
    } else if (keyCode === 37) {
      gameState.lateralPosition.target = Math.min(
        gameState.lateralPosition.target + 0.5,
        1
      )
    } else if (keyCode === 40) {
      gameState.verticalPosition.target = -gameState.verticalPosition.target
    }
  }
  
  /**
   * Resize canvas
   * @param {DOMElement} canvas - Canvas element.
   * @param {Object} gl - WebGL rendering context.
   */
  function resize (canvas, gl) {
    const w = Math.min(document.body.clientWidth, document.body.clientHeight)
    canvas.height = w
    canvas.width = w
    if (gl) {
      gl.viewport(0, 0, w, w)
    }
  }
  
  function setPerspective (gl, ticks) {
    const perspectiveMatrix = new Matrix4()
    perspectiveMatrix.setPerspective(24, 1, 1, 100)
    perspectiveMatrix.lookAt(
      3 * Math.sin(ticks / 300),
      3 * Math.cos(ticks / 300),
      1,
      0, 0, 0, 0, 0, 1
    )
    const uPerspective = gl.getUniformLocation(gl.program, 'u_Perspective')
    gl.uniformMatrix4fv(
      uPerspective,
      false,
      perspectiveMatrix.elements
    )
  }
  
  function setTransform (gl, matrix) {
    const uTransform = gl.getUniformLocation(gl.program, 'u_Transform')
    gl.uniformMatrix4fv(
      uTransform,
      false,
      (matrix && matrix.elements) || new Matrix4().elements
    )
  }
  
  function setLight (gl) {
    const uLightDirection = gl.getUniformLocation(gl.program, 'u_LightDirection')
    gl.uniform3fv(uLightDirection, new Float32Array([0.2, 0.2, 1]))
  }
  
  // Shapes
  
  /**
   * Generate car shape.
   * @returns {Object} shape - Shape coordinates.
   */
  function car () {
    const triangles = [{
      normal: [0.0, 0.0, 1.0],
      coordinates: [
        [-0.11705460018119969, 0.0012516894548989877, 0.0],
        [-0.079654010181487933, 0.0012516894548989877, 0.0],
        [-0.079654010181487933, 0.038652279454610743, 0.0]
      ]
    }, {
      normal: [0.0, 0.0, 1.0],
      coordinates: [
        [-0.086133382962100699, -0.0085091607436833284, 0.0],
        [-0.11325880186348414, -0.0085091607436833284, 0.0],
        [-0.086133382962100699, -0.035634579645066763, 0.0]
      ]
    }, {
      normal: [0.0, 0.0, 1.0],
      coordinates: [
        [-0.12077234892450511, -0.017377899162263791, 0.0],
        [-0.1407723489245051, -0.017377899162263791, 0.0],
        [-0.12077234892450511, -0.037377899162263785, 0.0]
      ]
    }, {
      normal: [0.24253562503633297, 0.0, 0.97014250014533188],
      coordinates: [
        [0.029999999999999999, -0.050000000000000003, 0.01],
        [0.070000000000000007, -0.050000000000000003, 0.0],
        [0.070000000000000007, 0.050000000000000003, 0.0]
      ]
    }, {
      normal: [0.0, 0.099503719020998915, 0.99503719020998915],
      coordinates: [
        [0.070000000000000007, 0.050000000000000003, 0.0],
        [0.029999999999999999, 0.050000000000000003, 0.0],
        [0.029999999999999999, -0.050000000000000003, 0.01]
      ]
    }, {
      normal: [-0.097590007294853315, 0.19518001458970663, 0.97590007294853309],
      coordinates: [
        [-0.070000000000000007, -0.050000000000000003, 0.0],
        [0.029999999999999999, -0.050000000000000003, 0.01],
        [-0.02, 0.0, -0.0050000000000000001]
      ]
    }, {
      normal: [0.099503719020998915, 0.0, 0.99503719020998915],
      coordinates: [
        [-0.070000000000000007, 0.050000000000000003, 0.0],
        [-0.070000000000000007, -0.050000000000000003, 0.0],
        [-0.02, 0.0, -0.0050000000000000001]
      ]
    }, {
      normal: [0.0, -0.099503719020998915, 0.99503719020998915],
      coordinates: [
        [-0.070000000000000007, 0.050000000000000003, 0.0],
        [-0.02, 0.0, -0.0050000000000000001],
        [0.029999999999999999, 0.050000000000000003, 0.0]
      ]
    }, {
      normal: [-0.19518001458970663, 0.097590007294853315, 0.97590007294853309],
      coordinates: [
        [-0.02, 0.0, -0.0050000000000000001],
        [0.029999999999999999, -0.050000000000000003, 0.01],
        [0.029999999999999999, 0.050000000000000003, 0.0]
      ]
    }]
    let vertices = []
    for (let triangle of triangles) {
      for (let pt of triangle.coordinates) {
        let triangleVertices = []
        triangleVertices = triangleVertices.concat(pt)
        triangleVertices = triangleVertices.concat(triangle.normal)
        triangleVertices = triangleVertices.concat([0.05, 0.05, 0.9, 1.0])
        vertices = vertices.concat(triangleVertices)
      }
    }
    return {
      vertices: new Float32Array(vertices)
    }
  }
  
  /**
   * Create moebius shape
   * @returns {Object} shape - Moebius shape.
   */
  function moebius () {
    const n = 161
    let vertices = []
    let connectivity = []
    const radius = 0.5
    const width = 0.25
    const color = [0.9, 0.9, 0.9, 0.6]
    for (let i = 0; i < n; i += 1) {
      let angle = 2 * Math.PI / (n - 3) * i
      let sinAngle = Math.sin(angle)
      let cosAngle = Math.cos(angle)
      let projectedRadius = (i % 2 === 0)
        ? (radius - (width / 2 * sinAngle))
        : (radius + (width / 2 * sinAngle))
      let normal = [
        sinAngle * cosAngle,
        sinAngle * sinAngle,
        cosAngle
      ]
      let position = [
        projectedRadius * cosAngle,
        projectedRadius * sinAngle,
        ((i % 2 === 0) ? 1 : -1) * width / 2 * cosAngle
      ]
      vertices = vertices.concat([
        position[0], position[1], position[2],
        normal[0], normal[1], normal[2],
        color[0], color[1], color[2], color[3]
      ])
      if (i > 1) {
        connectivity = connectivity.concat([i - 2, i - 1, i])
      }
    }
    return {
      vertices: new Float32Array(vertices),
      connectivity: new Uint8Array(connectivity)
    }
  }
  
  /**
   * Draw a shape
   * @param {Object} gl - WebGL rendering context.
   * @param {Function} shapeConstructor - A function returning a shape object.
   * @param {Matrix4} transform - Base transform for the shape. Replaces current transform uniform value in the vertex shader.
   */
  function drawShape (gl, shapeConstructor, transform) {
    setTransform(gl, transform)
    const shape = shapeConstructor()
    const vertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, shape.vertices, gl.STATIC_DRAW)
  
    const FSIZE = shape.vertices.BYTES_PER_ELEMENT
  
    const aPosition = gl.getAttribLocation(gl.program, 'a_Position')
    if (aPosition < 0) {
      console.log('Failed to get storage location for a_Position.')
    }
    gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, FSIZE * 10, 0)
    gl.enableVertexAttribArray(aPosition)
  
    const aNormal = gl.getAttribLocation(gl.program, 'a_Normal')
    if (aNormal < 0) {
      console.log('Failed to get storage location for a_Normal.')
    }
    gl.vertexAttribPointer(aNormal, 3, gl.FLOAT, false, FSIZE * 10, FSIZE * 3)
    gl.enableVertexAttribArray(aNormal)
  
    const aColor = gl.getAttribLocation(gl.program, 'a_Color')
    if (aColor < 0) {
      console.log('Failed to get storage location for a_Color.')
    }
    gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, FSIZE * 10, FSIZE * 7)
    gl.enableVertexAttribArray(aColor)
  
    gl.bindBuffer(gl.ARRAY_BUFFER, null)
  
    if (shape.connectivity) {
      const indexBuffer = gl.createBuffer()
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, shape.connectivity, gl.STATIC_DRAW)
      gl.drawElements(gl.TRIANGLES, shape.connectivity.length, gl.UNSIGNED_BYTE, 0)
    } else {
      gl.drawArrays(gl.TRIANGLES, 0, shape.vertices.length / 10)
    }
  }
  
  // WebGL utilities
  
  /**
   * Load a single shader.
   * @param {Object} gl - WebGL rendering context.
   * @param {number} type - Shader type, as a constate parameter gl.VERTEX_SHADER or gl.FRAGMENT_SHADER.
   * @param {String} source - Shader source code.
   * @returns {Object} shader - Shader.
   */
  function loadShader (gl, type, source) {
    const shader = gl.createShader(type)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
    if (!compiled) {
      let error = gl.getShaderInfoLog(shader)
      console.log('Failed to compile shader: ' + error)
      gl.deleteShader(shader)
      return null
    }
    return shader
  }
  
  /**
   * Initialize shaders
   * @param {Object} gl - WebGL rendering context.
   * @param {String} vShader - Vertex shader source code.
   * @param {String} fShader - Fragment shader source code.
   * @returns {Bool} success - Returns whether the initialization was successful.
   */
  function createProgram (gl, vShader, fFhader) {
    // Create shader object
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vShader)
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fFhader)
    if (!vertexShader || !fragmentShader) {
      return null
    }
  
    // Create a program object
    const program = gl.createProgram()
    if (!program) {
      return null
    }
  
    // Attach the shader objects
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
  
    // Link the program object
    gl.linkProgram(program)
  
    gl.enable(gl.DEPTH_TEST)
  
    // Check the result of linking
    const linked = gl.getProgramParameter(program, gl.LINK_STATUS)
    if (!linked) {
      let error = gl.getProgramInfoLog(program)
      console.log('Failed to link program: ' + error)
      gl.deleteProgram(program)
      gl.deleteShader(fragmentShader)
      gl.deleteShader(vertexShader)
      return null
    }
   
    if (!program) {
      console.log('Failed to create program')
      return false
    }
    gl.useProgram(program)
    gl.program = program
    return program
  }

  





//   another code line


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

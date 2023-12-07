
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

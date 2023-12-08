let pokemons = [' '];

/**fetch pokemon name and id */
async function getAllNames() {
    let url = 'https://pokeapi.co/api/v2/pokemon/?limit=898';
    let response = await fetch(url);
    let responseAsJson = await response.json();

    for (let i = 0; i < responseAsJson.results.length; i++) {
        pokemons.push({
            id: i + 1,
            name: responseAsJson.results[i].name,
            types: []
        });
    };

    getAllTypes();
};

/**fetch pokemon types */
async function getAllTypes() {
    for (let i = 0; i < 18; i++) {
        let url = 'https://pokeapi.co/api/v2/type/' + (i + 1)
        let response = await fetch(url)
        let responseAsJson = await response.json()

        const pokemonInType = responseAsJson.pokemon
        
        for(j = 0; j < pokemonInType.length; j++) {
            const pokemonId = pokemonInType[j].pokemon.url.replace('https://pokeapi.co/api/v2/pokemon/', '').replace('/', '');

            if(pokemonId <= pokemons.length && pokemons[pokemonId]) {
                pokemons[pokemonId].types.push(responseAsJson.name);
            };
        };
    };

    loadingCompletion();
};

/**hide loading div after completion */
function loadingCompletion() {
    const loadingDiv = document.getElementById('loading-div');
    loadingDiv.classList.add('hideLoading');

    setTimeout(function() {
        loadingDiv.classList.replace('hideLoading', 'hide');
        document.body.style.overflow = 'unset';
    }, 500);

    pokemons.splice(0, 1);
    currentList = pokemons;

    updatePokemonList();
};




// poke man list


let currentlyShowingAmount = 0;
let maxIndex = 29;
let currentList = [];

const typeColors = {
    'normal': '#BCBCAC',
    'fighting': '#BC5442',
    'flying': '#669AFF',
    'poison': '#AB549A',
    'ground': '#DEBC54',
    'rock': '#BCAC66',
    'bug': '#ABBC1C',
    'ghost': '#6666BC',
    'steel': '#ABACBC',
    'fire': '#FF421C',
    'water': '#2F9AFF',
    'grass': '#78CD54',
    'electric': '#FFCD30',
    'psychic': '#FF549A',
    'ice': '#78DEFF',
    'dragon': '#7866EF',
    'dark': '#785442',
    'fairy': '#FFACFF',
    'shadow': '#0E2E4C'
};

/**update pokemon list to */
function updatePokemonList() {
    if (currentlyShowingAmount <= maxIndex) {
        renderPokemonListItem(currentlyShowingAmount);
    };
};

/**render */
function renderPokemonListItem(index) {
    if (currentList[index]) {
        document.getElementById('pokedex-list-render-container').insertAdjacentHTML('beforeend', `<div onclick="openInfo(${currentList[index].id})" class="pokemon-render-result-container container center column">
                                                                                                    <img class="search-pokemon-image" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${currentList[index].id}.png">
                                                                                                    <span class="bold font-size-12">N° ${currentList[index].id}</span>
                                                                                                    <h3>${dressUpPayloadValue(currentList[index].name)}</h3>
                                                                                                    ${getTypeContainers(currentList[index].types)}
                                                                                                </div>`);

        currentlyShowingAmount += 1;

        updatePokemonList();
    };
};

function increaseMaxIndex(by) {
    if (maxIndex + by <= currentList.length) {
        maxIndex += by;
    } else {
        maxIndex = currentList.length - 1;
    };
};

/**get type containers for pokemon infos */
function getTypeContainers(typesArray) {
    let htmlToReturn = '<div class="row">';

    for (let i = 0; i < typesArray.length; i++) {
        htmlToReturn += `<div class="type-container" style="background: ${typeColors[typesArray[i]]};">
                                ${dressUpPayloadValue(typesArray[i])}
                            </div>`;
    };

    return htmlToReturn + '</div>';
};

/**on search input keydown*/
function search() {
    setTimeout(function () {
        let searchResults = [];

        for (let i = 0; i < pokemons.length; i++) {
            if (pokemons[i].name) {
                if (pokemons[i].name.replaceAll('-', ' ').includes(document.getElementById('search-input').value.toLowerCase())) {
                    searchResults.push(pokemons[i]);
                };
            };
        };

        document.getElementById('pokedex-list-render-container').innerHTML = '';

        currentList = searchResults;
        currentlyShowingAmount = 0;
        maxIndex = 0;

        increaseMaxIndex(30);
        updatePokemonList();
    }, 1);
};


/** Scroll */
window.addEventListener('scroll', function () {
    addNewScrollPokemon();
    updateBackToTopVisibility();
});

/**add new scroll pokemon when bottom is reached */
function addNewScrollPokemon() {
    if (window.scrollY + 100 >= document.documentElement.scrollHeight - document.documentElement.clientHeight) {
        increaseMaxIndex(30);
        updatePokemonList();
    };
};

/**make back to top button visible */
function updateBackToTopVisibility() {
    if(window.scrollY > window.innerHeight) {
        document.getElementById('back-to-top-button').classList.remove('hide');
    } else {
        document.getElementById('back-to-top-button').classList.add('hide');
    };
};

function backToTop() {
    window.scrollTo(0, 0);
};


/**dress up payload value */
function dressUpPayloadValue(string) {
    let splitStr = string.toLowerCase().split('-');
    for (let i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    };
    return splitStr.join(' ');
};



//  improved code readbility 

import World from "./world.class.js";
import Drawer from "./utils/drawer.class.js";
import Events from "./utils/events.class.js";
import UI from "./ui.class.js";
import Sounds from "./utils/sounds.class.js";

export default class Game {

    static instance;

    constructor(canvas) {
        /**Singleton */
        if (Game.instance) {
            return Game.instance;
        };
        Game.instance = this;

        /**Setup everything */
        this.loadAssets()

        this.canvas = canvas;
        this.drawer = new Drawer();
        this.events = new Events()
        this.world = new World()
        this.ui = new UI()

        this.update();
    }

    /** on win */
    win() {
        /** freeze character */
        this.world.level.character.freeze = true;

        /**play win sound */
        this.sounds.playSound('../assets/sounds/win.mp3', false, 0.4, 2000);

        /**show win container */
        this.ui.showWinContainer();

        /**clear boss interval */
        clearInterval(this.world.level.boss.attackInterval);
    }

    /**on death */
    lose() {
        /**freeze character */
        this.world.level.character.freeze = true;

        /**clear gsap */
        gsap.globalTimeline.clear();

        clearInterval(this.world.level.boss.attackInterval);

        /**show deatth container */
        this.ui.showDeadContainer();

        /**play dead sound and fade out music */
        this.sounds.playSound('../assets/sounds/dead-sound.mp3', false, 0.4);
        this.sounds.fadeOutAllMusic();
    };

    /**start new game, after death or win */
    restart() {
        /**clear keyup and keydown event callbacks */
        this.events.callbacks.base = {};

        /**new world */
        this.world = new World();

        /**reset UI */
        this.ui = new UI();

        /**play music */
        this.sounds.playMainMusic();

        /**unfreeze character */
        this.world.level.character.freeze = false;
    };

    /**update on every frame */
    update() {
        if (this.world) {
            this.world.update();
        };

        window.requestAnimationFrame(() => {
            this.update();
        });
    };

    loadAssets() {
        /**load bubbles */
        this.bubble = new Image();
        this.bubble.src = '../assets/sharkie/attack/bubble-tap/bubble.png';

        this.poisonBubble = new Image();
        this.poisonBubble.src = '../assets/sharkie/attack/bubble-tap/poison-bubble.png';

        /**load barriers */
        this.barrier0 = new Image();
        this.barrier1 = new Image();
        this.barrier2 = new Image();
        this.barrier3 = new Image();
        this.barrier0.src = '../assets/barriers/0.png';
        this.barrier1.src = '../assets/barriers/1.png';
        this.barrier2.src = '../assets/barriers/2.png';
        this.barrier3.src = '../assets/barriers/3.png';
    };
};




//  level class

import Character from "./entities/character.class.js";
import Jellyfish from "./entities/jellyfish.class.js";
import Pufferfish from "./entities/pufferfish.class.js";
import Coin from "./entities/coin.class.js";
import Poison from "./entities/poison.class.js";
import Barrier from "./entities/barrier.class.js";
import Boss from "./entities/boss.class.js";

/**
 * Level design
 * put following here:
 * - character
 * - boss
 * - enemies
 * - coins
 * - poision
 * - barriers
 * - background objects
 */

export default class Level {
    /**
     * Character
     */
    character = new Character();

    /**
     * Boss
     */
    boss = new Boss()

    /**
     * Enemies
     */
    enemies = [
        new Pufferfish(1930, 550),
        new Pufferfish(3700, 140),
        new Pufferfish(3680, 340),
        new Jellyfish(2300, 'regular'), 
        new Jellyfish(4500, 'regular'), 
        new Jellyfish(4700, 'regular'), 
        new Jellyfish(4900, 'regular'), 
        new Jellyfish(5100, 'regular'), 
        new Pufferfish(6400, 400),
        new Jellyfish(6850, 'electric'),
    ];

    /**
     * Coins
     */
    coins = [
        new Coin(1200, 400),
        new Coin(1400, 400),
        new Coin(1800, 400),
        new Coin(2000, 400),
        new Coin(3150, 330),
        new Coin(3300, 330),
        new Coin(3450, 330),
        new Coin(3150, 190),
        new Coin(3450, 190),
        new Coin(4540, 500),
        new Coin(4740, 500),
        new Coin(4940, 500),
        new Coin(5140, 500),
        new Coin(7050, 300),
        new Coin(7050, 500),
        new Coin(7050, 700),
        new Coin(7700, 450),
        new Coin(7900, 450),
        new Coin(8100, 450),
        new Coin(8300, 450),
    ];

    /**
     * Poison
     */
    poison = [
        new Poison(1585, 330),
        new Poison(2300, 50),
        new Poison(3285, 145),
        new Poison(4825, 780),
        new Poison(7035, 50),
    ];

    /**Barriers */
    barriers = [
        new Barrier(750, 400, 0),
        new Barrier(950, -100, 1),
        new Barrier(2500, -100, 3),
        new Barrier(3100, -100, 2),
        new Barrier(3800, 350, 3),
        new Barrier(5350, 400, 1),
        new Barrier(6000, 0, 2),
        new Barrier(7200, 400, 0),
        new Barrier(7400, -100, 1),
    ];

    /**
     * Background
     */
    backgroundFiles = [
        {
            path: './assets/landscape/bg/1.png',
            position: 0
        },
        {
            path: './assets/landscape/bg/2.png',
            position: 1920
        },
        {
            path: './assets/landscape/bg-0/1.png',
            position: 0
        },
        {
            path: './assets/landscape/bg-0/2.png',
            position: 1920
        },
        {
            path: './assets/landscape/light/2.png',
            position: 1920
        },
        {
            path: './assets/landscape/light/1.png',
            position: 0
        },
        {
            path: './assets/landscape/bg-1/1.png',
            position: 0
        },
        {
            path: './assets/landscape/bg-1/2.png',
            position: 1920
        },
        {
            path: './assets/landscape/floor/1.png',
            position: 0
        },
        {
            path: './assets/landscape/floor/2.png',
            position: 1920
        },
    ];
};


//  ui class

import Sounds from "./utils/sounds.class.js";
import Game from "./game.class.js";

export default class UI {
    constructor() {
        this.game = new Game();

        this.setup();
    };

    /**define all required elements */
    defineElements() {
        this.coinCounter = document.getElementById('coin-amount-label');
        this.poisonCounter = document.getElementById('poison-amount-label');
        this.winContainer = document.getElementById('win-container');
        this.deadContainer = document.getElementById('dead-container');
        this.healthbar = document.getElementById('health-bar');
        this.bossHealthbar = document.getElementById('final-boss-health-bar');
        this.soundButton = document.getElementById('sound-button');
        this.musicButton = document.getElementById('music-button');
        this.controlButton = document.getElementById('control-button');
        this.tutorialContainer = document.getElementById('tutorial-container');
        this.controlsContainer = document.getElementById('controls-container');
        this.questContainer = document.getElementById('quest-dialog-container');
    };

    /**setup everything and hide win and death containers */
    setup() {
        this.defineElements();
        this.setupCoins();
        this.setupPoison();
        this.updateHealthbar();
        this.restartButtonClick();
        this.updateBossHealthbar();
        this.setupSoundsButton();
        this.setupMusicButton();

        this.winContainer.classList.add('hide');
        this.deadContainer.classList.add('hide');
    };

    /**on play button click */
    playClick() {
        if (!this.game.sounds) {
            /**init sounds on main sceen's play button click */
            this.game.sounds = new Sounds();
            this.game.sounds.playSound('../assets/sounds/button-click.mp3', false, 0.2);

            /**show tutorial */
            this.openControls();

            gsap.to(document.getElementById('opening-screen'), { opacity: 0, duration: .4 })
            setTimeout(() => {
                document.getElementById('opening-screen').classList.add('hide');
            }, 500);
        };
    };

    /**On Controls Button Click */
    openControls() {
        /**show controls only */
        this.tutorialContainer.classList.remove('hide');
        this.controlsContainer.classList.remove('hide');
        this.questContainer.classList.add('hide');

        /**freez character during controls open */
        this.game.world.level.character.freeze = true;

        /**play button click sound */
        if (this.questShown) {
            this.game.sounds.playSound('../assets/sounds/button-click.mp3', false, 0.2);
        };

        /** zomm in */
        gsap.fromTo(this.controlsContainer, { scale: 0 }, { scale: 1, duration: .2 });
    };

    /**show quest after controls during tutorial (only if tutorial wasn't played yet) */
    showQuest() {
        if (this.game.questShown) {
            this.closeTutorial();
        } else {
            this.game.questShown = true;

            /**hide controls and show quest */
            this.controlsContainer.classList.add('hide');
            this.questContainer.classList.remove('hide');

            /**play button sound */
            this.game.sounds.playSound('../assets/sounds/button-click.mp3', false, 0.2);
        };
    };

    /**close tutorial (quest is last) */
    closeTutorial() {
        this.tutorialContainer.classList.add('hide');

        /**play button click sound */
        this.game.sounds.playSound('../assets/sounds/button-click.mp3', false, 0.2);

        /**unfreeze character */
        this.game.world.level.character.freeze = false;
    };

    /**set sounds button background to gray if local storage contains muted sounds == true */
    setupSoundsButton() {
        if (localStorage.getItem('soundsMuted') == 'true') {
            this.soundButton.style.background = 'gray';
        };
    };

    /**mute or unmute sounds */
    muteSounds() {
        if (this.game.sounds.soundsMuted) {
            /**unmute sounds and update local storage*/
            this.game.sounds.soundsMuted = false;
            this.soundButton.style.background = 'rgb(54, 162, 250)';
            this.game.sounds.playSound('../assets/sounds/button-click.mp3', false, 0.2);
            localStorage.setItem('soundsMuted', false);
        } else {
            /**mute sounds and update local storage */
            this.game.sounds.soundsMuted = true;
            this.soundButton.style.background = 'gray';
            localStorage.setItem('soundsMuted', true);
        };
    };

    /**set music button background to gray if local storage contains muted music == true */
    setupMusicButton() {
        if (localStorage.getItem('musicMuted') == 'true') {
            this.musicButton.style.background = 'gray';
        };
    };

    /**mute or unmute music */
    muteMusic() {
        if (this.game.sounds.musicMuted) {
            /**unmute music and update local storage */
            this.game.sounds.musicMuted = false;
            this.musicButton.style.background = 'rgb(54, 162, 250)';
            this.game.sounds.resumeMusic();
            localStorage.setItem('musicMuted', false);
        } else {
            /**mute music and update local storage */
            this.game.sounds.musicMuted = true;
            this.musicButton.style.background = 'gray';
            this.game.sounds.pauseAllMusic();
            localStorage.setItem('musicMuted', true);
        };
        /**play button click sound */
        this.game.sounds.playSound('../assets/sounds/button-click.mp3', false, 0.2);
    };

    /**Win Screen */
    showWinContainer() {
        /**show win container */
        this.winContainer.classList.remove('hide');

        /***animation */
        gsap.fromTo(this.winContainer, { opacity: 0 }, { opacity: 1, delay: 2, duration: .3 });
        gsap.fromTo(document.getElementById('win-sharkie'), { y: this.game.canvas.height / 2 }, { y: 0, duration: 0.4, delay: 2, ease: Power1.easeOut });

        /*set total coins collected in win screen */
        document.getElementById('win-collected-coins-label').innerHTML = 'You collected ' + this.collectedCoins + ' out of ' + this.totalCoins + ' coins!';
    };

    /**show dead container */
    showDeadContainer() {
        this.deadContainer.classList.remove('hide');

        /**animation */
        gsap.fromTo(this.deadContainer, { opacity: 0 }, { opacity: 1, delay: 2, duration: 1 });
    };

    /**
     * on restart button click -> win or lose screen
     */ 
    restartButtonClick() {
        this.game.events.on('restart', () => {
            this.game.restart();

            /**play button click sound */
            this.game.sounds.playSound('../assets/sounds/button-click.mp3', false, 0.2);
        });
    };

    /**
     * Character healthbar
     */
    /**update characer healthbar */
    updateHealthbar() {
        let character = this.game.world.level.character;

        /**set healthbar width */
        this.healthbar.style.width = character.health + '%';

        /**set color gradient of healthbar */
        if (character.health > 50) {
            this.healthbar.style.background = 'linear-gradient(#b5ff2b, #82c900)';
        } else if (character.health <= 50 && character.health > 30) {
            this.healthbar.style.background = 'linear-gradient(#FFE47C, #FFCF00)';
        } else {
            this.healthbar.style.background = 'linear-gradient(#FF9C75, #FF4B00)';
        };
    };

    /**fill character healthbar */
    fillHealthbar() {
        this.healthbar.style.width = '100%';
        this.updateHealthbar();
    };

    /**
     * Boss healthbar
     */
    /**update boss healthbar */
    updateBossHealthbar() {
        let boss = this.game.world.level.boss;

        /**set width */
        this.bossHealthbar.style.width = boss.health + '%';

        /**set color gradient */
        if (boss.health > 50) {
            this.bossHealthbar.style.background = 'linear-gradient(#b5ff2b, #82c900)';
        } else if (boss.health <= 50 && boss.health > 30) {
            this.bossHealthbar.style.background = 'linear-gradient(#FFE47C, #FFCF00)';
        } else {
            this.bossHealthbar.style.background = 'linear-gradient(#FF9C75, #FF4B00)';
        };

        /**hide boss healtbar if boss isnt introduced yet */
        if (!this.game.world.level.boss.isIntroducing) {
            document.getElementById('final-boss-health-bar-container').classList.add('hide');
        };
    };


    /**fade in boss healthbar during introduction and update*/
    fadeInBossHealthbar() {
        document.getElementById('final-boss-health-bar-container').classList.remove('hide');
        gsap.fromTo(document.getElementById('final-boss-health-bar-container'), { opacity: 0, }, { opacity: 1, duration: 0.5, delay: 1.6 });

        this.updateBossHealthbar();
    };

    /**
     * Coins
     */
    /** reset coins */
    setupCoins() {
        this.collectedCoins = 0;
        this.totalCoins = this.game.world.level.coins.length;

        this.updateCoins();
    };

    /**update coin counter */
    updateCoins() {
        this.coinCounter.innerHTML = this.collectedCoins + ' / ' + this.totalCoins;
    };

    /**add coin and update */
    addCoin() {
        this.collectedCoins += 1;
        this.updateCoins();
    };

    /**
     * Poison
     */
    /** reset poison counter*/
    setupPoison() {
        this.collectedPoison = 0;
        this.totalPoison = this.game.world.level.poison.length;

        document.getElementById('poison-container').classList.remove('unlocked-poison');

        this.updatePoison();
    };

    /**update poison UI */
    updatePoison() {
        this.poisonCounter.innerHTML = this.collectedPoison + ' / ' + this.totalPoison;

        if (this.collectedPoison == this.totalPoison) {
            this.unlockPoisonBubbles();
        };
    };

    /**on poison collected add poison adn update */
    addPoison() {
        this.collectedPoison += 1;
        this.updatePoison();
    };

    /**unlock poison bubble */
    unlockPoisonBubbles() {
        let poisonContainer = document.getElementById('poison-container');

        poisonContainer.classList.add('unlocked-poison');

        this.game.world.level.character.poisonBubbles = true;
    };
};

const calculator = {
    displayValue: '0',
    firstOperand: null,
    waitingForSecondOperand: false,
    operator: null,
  };
  
  function inputDigit(digit) {
    const { displayValue, waitingForSecondOperand } = calculator;
  
    if (waitingForSecondOperand === true) {
      calculator.displayValue = digit;
      calculator.waitingForSecondOperand = false;
    } else {
      calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
    }
  }
  
  function inputDecimal(dot) {
    if (calculator.waitingForSecondOperand === true) {
        calculator.displayValue = "0."
      calculator.waitingForSecondOperand = false;
      return
    }
  
    if (!calculator.displayValue.includes(dot)) {
      calculator.displayValue += dot;
    }
  }
  
  function handleOperator(nextOperator) {
    const { firstOperand, displayValue, operator } = calculator
    const inputValue = parseFloat(displayValue);
    
    if (operator && calculator.waitingForSecondOperand)  {
      calculator.operator = nextOperator;
      return;
    }
  
  
    if (firstOperand == null && !isNaN(inputValue)) {
      calculator.firstOperand = inputValue;
    } else if (operator) {
      const result = calculate(firstOperand, inputValue, operator);
  
      calculator.displayValue = `${parseFloat(result.toFixed(7))}`;
      calculator.firstOperand = result;
    }
  
    calculator.waitingForSecondOperand = true;
    calculator.operator = nextOperator;
  }
  
  function calculate(firstOperand, secondOperand, operator) {
    if (operator === '+') {
      return firstOperand + secondOperand;
    } else if (operator === '-') {
      return firstOperand - secondOperand;
    } else if (operator === '*') {
      return firstOperand * secondOperand;
    } else if (operator === '/') {
      return firstOperand / secondOperand;
    }
  
    return secondOperand;
  }
  
  function resetCalculator() {
    calculator.displayValue = '0';
    calculator.firstOperand = null;
    calculator.waitingForSecondOperand = false;
    calculator.operator = null;
  }
  
  function updateDisplay() {
    const display = document.querySelector('.calculator-screen');
    display.value = calculator.displayValue;
  }
  
  updateDisplay();
  
  const keys = document.querySelector('.calculator-keys');
  keys.addEventListener('click', event => {
    const { target } = event;
    const { value } = target;
    if (!target.matches('button')) {
      return;
    }
  
    switch (value) {
      case '+':
      case '-':
      case '*':
      case '/':
      case '=':
        handleOperator(value);
        break;
      case '.':
        inputDecimal(value);
        break;
      case 'all-clear':
        resetCalculator();
        break;
      default:
        if (Number.isInteger(parseFloat(value))) {
          inputDigit(value);
        }
    }
  
    updateDisplay();
  });

  /*
 * > Coded By Thomas Hj
 * > 31102016
 * 
 * > #31
 */

// Word selection
// New word = ["Word name", "Hint"]
var word = [["Hangman", "That game you are playing right now."], ["Thomas Hj", "About the creator of this game."], ["HTML", "Markup language for creating Web pages."], ["CSS", "Wep page styles"], ["PHP", "A very popular server scripting language."], ["JavaScript", "Make web-page dynamic without reload the web page."], ["Java", "Run 15 billion devices.\nA program can be run in Windows, Linux and Mac"], ["SoloLearn", "A company that everyone can code for fun and share."], ["Love", "What is ?\nBaby don't hurt me\nDon't hurt me\nNo more"], ["Document", "A lot of text in the a file."], ["Playground", "There school kids go to."], ["Run", "Usain bolt."], ["Code", "var hw = 'Hello World';"], ["Samsung", "A company create Phone, Tv, Monitor, SDD, Memory chip..."], ["Super Mario", "A very popular game in Nintendo 64 that have red hat."], ["Star", "Super Mario like to get."], ["Clock", "14:12 or 14pm"], ["Binary Clock", "A clock that only use 0 or 1."], ["Sword", "Link from Zelda have on the hand."], ["Girl", "Not boy but ?"], ["Boy", "Not girl but ?"], ["Female", "Other name as girl."], ["Male", "Other name as boy."], ["Smartphone", "Something you've always on you."]]

// Game keyboard
var tastatur = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

// Game memory
var select = 0
var wordLeft = []
var fail = 0

// Web-page onload
window.onload = function() {
    gId("moveKeybord").addEventListener('touchmove', function(e) {
        wH = window.innerHeight
        tY = e.touches[0].clientY
        eL = gId("tastatur")
        resY = wH - tY - eL.offsetHeight
        if(resY < 0) {
            resY = 0
        } else if(resY > wH / 2) {
            resY = wH / 2
        }
        eL.style.bottom = resY + "px"
    }, false)
    createTastur()
}

// Start game
function startGame() {
    gId("home").className = "h"
    gId("result").className = "h"
    newGame()
}

// New game
function newGame() {
    clearTastatur()
    clearPlayer()
    createWord()
}

// Clear keyboard
function clearTastatur() {
    var e = document.getElementsByClassName("b")
    for(a = 0; a < e.length; a++) {
        e[a].setAttribute("data", "")
    }
}

// Clear player
function clearPlayer() {
    fail = 0
    wordLeft = []
    gId("g0").setAttribute("data", "false")
    gId("g1").setAttribute("data", "false")
    gId("g2").setAttribute("data", "false")
    gId("g3").setAttribute("data", "false")
    gId("g4").setAttribute("data", "false")
    gId("g5").setAttribute("data", "false")
    gId("g5").setAttribute("r", "false")
    gId("g5").setAttribute("l", "false")
    gId("g6").setAttribute("data", "false")
    gId("g6").setAttribute("l", "false")
    gId("g6").setAttribute("r", "false")
    gId("hintButton").setAttribute("data", "false")
    gId("hint").style.display = "none"
}

// Get new word
function createWord() {
    var d = gId("letter")
    d.innerHTML = ""
    select = Math.floor(Math.random() * word.length)
    for(a = 0; a < word[select][0].length; a++) {
        var x = word[select][0][a].toUpperCase()
        var b = document.createElement("span")
        b.className = "l" + (x == " " ? " ls" : "")
        b.innerHTML = "&nbsp"
        b.id = "l" + a;
        d.appendChild(b)
        
        if(x != " ") {
            if(wordLeft.indexOf(x) == -1) {
                wordLeft.push(x)
            }
        }
    }
}

// Create keyboard
function createTastur() {
    var tas = gId("keybord")
    tas.innerHTML = ""
    for(a = 0; a < tastatur.length; a++) {
        var b = document.createElement("span")
        b.className = "b"
        b.innerText = tastatur[a]
        b.setAttribute("data", "")
        b.onclick = function() {
            bTas(this)
        }
        tas.appendChild(b)
    }
}

// Game check, If show next error / game end
function bTas(a) {
    if(a.getAttribute("data") == "") {
        var x = isExist(a.innerText)
        a.setAttribute("data", x)
        if(x) {
            if(wordLeft.length == 0) {
                gameEnd(true)
            }
        } else {
            showNextFail()
        }
    }
}

// If letter "X" exist
function isExist(e) {
    e = e.toUpperCase()
    var x = wordLeft.indexOf(e)
    if(x != -1) {
        wordLeft.splice(x, 1)
        typeWord(e)
        return true
    }
    return false
}

// Show next fail drawing
function showNextFail() {
    fail++
    switch(fail) {
        case 1:
            gId("g0").setAttribute("data", "true")
            break;
        
        case 2:
            gId("g1").setAttribute("data", "true")
            break;
        
        case 3:
            gId("g2").setAttribute("data", "true")
            break;
        
        case 4:
            gId("g3").setAttribute("data", "true")
            gId("hintButton").setAttribute("data", "true")
            break;
        
        case 5:
            gId("g4").setAttribute("data", "true")
            break;
        
        case 6:
            gId("g5").setAttribute("data", "true")
            break;
        
        case 7:
            gId("g5").setAttribute("l", "true")
            break;
        
        case 8:
            gId("g5").setAttribute("r", "true")
            break;
        
        case 9:
            gId("g6").setAttribute("data", "true")
            gId("g6").setAttribute("l", "true")
            break;
        
        case 10:
            gId("g6").setAttribute("r", "true")
            gameEnd(false)
            break;
    }
}

function typeWord(e) {
    for(a = 0; a < word[select][0].length; a++) {
        if(word[select][0][a].toUpperCase() == e) {
            gId("l" + a).innerText = e
        }
    }
}

// Game result
function gameEnd(e) {
    var d = gId("result")
    d.setAttribute("data", e)
    if(e) {
        gId("rT").innerText = "You Win!"
        gId("rM").innerHTML = "Congratulations, you found the word!<br/><br/>Good Job!"
    } else {
        gId("rT").innerText = "You Lose!"
        gId("rM").innerHTML = "The word was <br/><br/>\"" + word[select][0].toUpperCase() + "\"<br/><br/>Better luck next time."
    }
    d.className = ""
}

// Show hint
function hint() {
    gId("hintText").innerText = word[select][1]
    gId("hint").style.display = "block"
}

// Exit hint
function hintExit() {
    gId("hint").style.display = "none"
}

// Get HTML ID element by name
function gId(a) {
    return document.getElementById(a)
}


/*
 *> Coded by Thomas Hj             { 2280953 }
 *> 14.11.2018
 *> 1.10
 *> #4B-W6J2oSwjgf1S
 *
 *
 *> Change Log [v1.10]
 *  :: Re-Written terminal.
 *  :: Added connect command.
 *  :: Added 2 new games.
 *  :: Update Hangman word list.
 *
 *
 *> TODO
 *  :: Finding bUgS.
 * 
 */

 var sys = {
    author: 'Thomas Hj',
    version: 1.10,
    onPhone: false,
    io: {
        ix: 0,
        createOutput: function(t, i) {
            var b = false
            switch(t) {
                case 0:
                    b = true
                    break
                case 1:
                    if(i.length != 0 && i.length != sys.io.ix) {
                        b = true
                        sys.io.ix += 1
                    }
                    break
                case 2:
                case 3:
                    if(i.length != 0 && sys.io.ix != 0) {
                        b = true
                        sys.io.ix -= 1
                    }
                    break
            }
            if(b) {
                ui_value.innerHTML = ""
                var out = sys.createElement('span')
                out.className = 'target'
                if(i.length == 0) {
                    sys.io.ix = 0
                }
                if(sys.io.ix != 0) {
                    out.innerText = i.substr(0, i.length - sys.io.ix)
                    ui_value.appendChild(out)
                    out = sys.createElement('span')
                    out.innerText = i.substr(i.length - sys.io.ix)
                    ui_value.appendChild(out)
                } else {
                    out.innerText = i
                    ui_value.appendChild(out)
                }  
            }
        }
    },
    history: {
        index: 0,
        limit: 100,
    },
    log: function(d, c, i) {
        var d1, d2
        if(sys.history.index > sys.history.limit) {
            ui_history.removeChild(ui_history.childNodes[0])
        }
        d1 = sys.createElement('div')
        d1.id = 'log_' + sys.history.index
        if(d == 1 && app.logUser) {
            d2 = sys.createElement('span')
            d2.className = 'user'
            d2.innerText = app.user == undefined ? user.name : app.user
            if(app.logPath != undefined) {
                d2.innerText += '@' + user.path
            }
            d1.appendChild(d2)
        }
        d2 = sys.createElement('span')
        d2.className = 'log'
        if(c == 1) {
            d2.innerHTML = sys.setColor(i)
        } else {
            d2.innerText = i
        }
        d1.appendChild(d2)
        ui_history.appendChild(d1)
        sys.history.index++
        scrollTo(0, document.body.scrollHeight)
    },
    init: function() {
        var c = ['C', 'C#', 'C++', 'CSS', 'HTML', 'Java', 'JavaScript', 'Jquery', 'PHP', 'Python', 'Ruby', 'SQL', 'Swift']
        cmd.cmd_mkdir(['Document'])
        cmd.cmd_mkdir(['SoloLearn'])
        user.path = 'home/SoloLearn'
        for(var i = 0; i < c.length; i++) {
            cmd.cmd_mkdir([c[i]])
        }
        user.path = 'home'
        sys.log(0, 0, 'Welcome to Thomas Hj - Terminal. { v' + sys.version.toFixed(2) + ' }')
        sys.log(0, 1, 'Type §ohelp§r for getting started.')
        sys.log(0, 0, ' ')
        user.name += sys.rand(255).toString(16)
        sys.setInputName(user.name)
        user.online = new Date().getTime()
        if(innerWidth < 384) {
            document.documentElement.style.fontSize = '3.2vw'
            sys.log(0, 1, '§e[!]§m Oh no, look like you have a small screen. :-(')
            sys.log(0, 1, '§e[!]§m This terminal will look better if you have a wider screen. sowwy...')
            sys.log(0, 0, ' ')
        }
        if(navigator.userAgent.match(/MSIE 9.0/i)) {
            sys.log(0, 1, '§e[!]§m Look like you are using a old web-browser version.')
            sys.log(0, 1, '§e[!]§m Please upgrade your web-browser to a newer version.')
            sys.log(0, 1, '§m    sowwy...')
            sys.log(0, 0, ' ')
        }
        if(navigator.userAgent.match(/iPhone|mac/i)) {
            sys.log(0, 1, '§e[!]§m It\'s a bit tricky to trigger the keyboard.')
            sys.log(0, 1, '§m    sowwy...')
            sys.log(0, 0, ' ')
        }
    },
    initEvent: function() {
        ui_input.command.onkeydown = function(key) {
            if(key.keyCode == '37') {
                sys.io.createOutput(1, this.value)
            } else if(key.keyCode == '39') {
                sys.io.createOutput(2, this.value)
            } else if(key.keyCode == '46') {
                sys.io.createOutput(3, this.value)
            }
        }
    },
    createElement: function(e) {
        return document.createElement(e)
    },
    createName: function(i) {
        var n = ''
        var c = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        for(var x = 0; x < i; x++) {
            n += c.charAt(sys.rand(c.length) - 1)
        }
        return n
    },
    fileSystem: function(b, i) {
        if(i.length === 0) {
            sys.log(0, 1, '§mError: ' + (b ? 'Directory' : 'Filename') + ' cannot have a empty name!')
            return false
        }
        if(i.match(b ? /[/\:?*<>|§.]/g : /[/\:?*<>|§]/g)) {
            sys.log(0, 1, '§mError: Unwanted characters was detected!')
            return false
        }
        if(b) {
            if(ssd.dir[user.path + '/' + i] !== undefined) {
                sys.log(0, 1, '§mError: Directory \'§o' + i + '§m\' already exist!')
                return false
            }
        } else {
            for(var f in ssd.files[user.path]) {
                if(ssd.files[user.path][f][1] === i) {
                    sys.log(0, 1, '§mError: Filename \'§o' + i + '§m\' already exist!')
                    return false
                }
            }
        }
        return true
    },
    getDate: function() {
        var d = new Date()
        var s = ('0' + d.getDate()).slice(-2) + '.'
        s += ('0' + (d.getMonth() + 1)).slice(-2) + '.'
        s += d.getFullYear() + '  '
        s += ('0' + d.getHours()).slice(-2) + ':'
        return s + ('0' + d.getMinutes()).slice(-2)
    },
    newArray: function(i, s) {
        i = new Array(i)
        for(var x = 0; x < i.length; x++) {
            i[x] = s
        }
        return i
    },
    rand: function(i) {
        return Math.floor(Math.random() * i) + 1
    },
    numberFormat: function(v) {
        return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
    },
    setCenter: function(v, i) {
        return new Array(v - Math.floor(i.length / 2)).join(' ') + i
    },
    setColor: function(i) {
        var c, l, b = false
        i = i.replace(/&/g, '&amp;')
        i = i.replace(/</g, '&lt;')
        i = i.replace(/>/g, '&gt;')
        l = (i.match(/\§/g) || []).length
        for(var x = 0; x < l; x++) {
            c = i.substr(i.indexOf('§'), 2)
            if(c === '§r') {
                i = i.replace(c, '</c>')
                b = false
            } else {
                i = i.replace(c, (b ? '</c>' : '') + '<c ' + c.substr(1) + '>')
                b = true
            }
        }
        return i + (b ? '</c>' : '')
    },
    setInputName: function(i) {
        ui_name.innerText = i + (app.logPath != undefined ? '@' + user.path : '')
    },
    setSpaces: function(v, l, i) {
        return new Array(v - l).join(' ') + i
    },
    setUserInput: function(b) {
        if(b) {
            ui_input.command.removeAttribute('disabled')
            ui_user.removeAttribute('style')
            return ui_input.command.focus()
        }
        ui_input.command.setAttribute('disabled', '')
        ui_user.style.display = 'none'
    },
    shuffle: function(a) {
        var j, x, i
        for(i = a.length - 1; i > 0; i--) {
            j = sys.rand(i)
            x = a[i]
            a[i] = a[j]
            a[j] = x
        }
        return a
    },
    updateLog: function(p, l) {
        document.getElementById('log_' + p).children[0].innerText = l
    }
}

var app = null

var user = {
    name: 'U#',
    coins: 1000,
    path: 'home',
    online: null,
    games: []
}

var ssd = {
    size: 1000000,
    dir: { home: [] },
    files: { home: [] }
}

var cmd = {
    logUser: true,
    logInput: true,
    logPath: true,
    commands: {
        'about': 'About Thomas Hj - Terminal.',
        'base64': 'Encode / Decode text.',
        'battery': 'Get battery status.',
        'binary': 'Encode text to binary.',
        'calendar': 'Get current month.',
        'cd': 'Change the current directory.',
        'cd.': '!cd1',
        'cd..': '!cd2',
        'cls': 'Clear the terminal.',
        'connect': 'Connect to the internet?',
        'date': 'Get the current date.',
        'dir': 'List of files and subdirectories.',
        'editor': 'Text editor for writen some text.',
        'exit': 'Exit the terminal.',
        'games': 'Text-based games.',
        'help': 'List of all the commands.',
        'hex': 'Convert text to Numeral System.',
        'hack': '!hack',
        'ls': '!dir',
        'mkdir': 'Create a directory.',
        'roll': 'Output a number between 1 - 100',
        'setname': 'Set username.',
        'time': 'Get the time of the day.',
        'tree': "Displays the directory structure.",
        'touch': 'Create a new file.',
        'vibrate': 'Make your device vibrate.',
        'user': 'User-information.'
    },
    commandHandler: function(a) {
        if(a.join(' ') == 'do a barrel roll') {
            document.documentElement.setAttribute('roll', '')
        }
        for(var c in cmd.commands) {
            if(c == a[0].toLowerCase()) {
                if(cmd.commands[c].indexOf('!', 0) === 0) {
                    return cmd['cmd_' + cmd.commands[c].substr(1)](a.splice(1, a.length))
                } else {
                    return cmd['cmd_' + c](a.splice(1, a.length))
                }
            }
        }
        if(a[0] !== '' && /^[0-9]*\.?[0-9]*$/.test(a[0])) {
            try {
                return sys.log(1, 0, eval(a.join('').toString().replace(/;/ig, '')), 0)
            } catch(e) {}
        }
        if(a[0] !== '') {
            sys.log(0, 0, '\'' + a[0] + '\' was not found as command!')
        }
    },
    cmd_about: function() {
        sys.log(0, 0, "------- Thomas Hj - Terminal -----------------")
        sys.log(0, 0, " ")
        sys.log(0, 0, '   A "small" prodject that I wanted to build for long time ago...')
        sys.log(0, 0, '   A terminal with a text-based games and some functionality...')
        sys.log(0, 0, '   So here it is. I hope you enjoy!')
        sys.log(0, 1,  '   §i* Most of the semicolon is on the vacation.')
        sys.log(0, 1, '   §i* Happy coding.')
        sys.log(0, 0, ' ')
        sys.log(0, 0, '   Author: ' + sys.author)
        sys.log(0, 0, '   Version: ' + sys.version.toFixed(2))
        sys.log(0, 0, ' ')
    },
    cmd_base64: function(a) {
        if(a.length > 1) {
            var s = a.splice(1, a.length).join(' ')
            switch(a[0].toLowerCase()) {
                case "en":
                    return sys.log(0, 0, btoa(encodeURIComponent(s)))
                case "de":
                    try {
                        return sys.log(0, 0, atob(decodeURIComponent(s)))
                    } catch(e) {
                        return sys.log(0, 1, "§mFailed to executed" + e.toString().substr(e.toString().lastIndexOf(':')))
                    }
            }
        }
        sys.log(0, 1, '§mUsage: base64 <en|de> [String... ]')
    },
    cmd_battery: function() {
        try {
            navigator.getBattery().then(function(e) {
                sys.log(0, 1, 'Level:       ' + (e.level * 100) + '%')
                sys.log(0, 1, 'Is Charging: ' + (e.charging ? 'Yes' : 'No'))
            })
        } catch(e) {
            sys.log(0, 1, '§mSorry, your web-browser does not support this method.')
        }
    },
    cmd_binary: function(a) {
        if(a.length > 0) {
            var s = ''
            a = a.join(' ')
            for(var i = 0; i < a.length; i++) {
                s += ('00000000' + a.charCodeAt(i).toString(2)).slice(-8) + ' '
            }
            return sys.log(0, 0, s)
        }
        sys.log(0, 1, '§mUsage: binary [String... ]')
    },
    cmd_calendar: function() {
        var m = [
            'January', 'February', 'March', 'April', 'May', 'June', 
            'July', 'August', 'September', 'October', 'November', 'December'
        ]
        var w = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
        var d = new Date()
        var td = d.getDate()
        var wd = new Date(d.getFullYear(), d.getMonth(), 1).getDay()
        var ed = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
        var s = [' ']
        var l = ''
        var i = 1
        wd = wd === 0 ? 7 : wd;
        s.push(sys.setCenter(11, m[d.getMonth()] + ' ' + d.getFullYear()))
        w.forEach(function(e) { l += e + ' ' })
        s.push(l)
        l = new Array(wd).join('   ')
        while(i <= ed) {
            l += (i > 9 ? '' : ' ') + (i === td ? '§o' + i + '§r' : i) + ' '
            if(wd === 7) {
                s.push(l)
                l = ''
                wd = 1
            } else {
                wd++
            }
            i++
        }
        if(l.length !== 0) {
            s.push(l)
        }
        s.forEach(function(e) {
            sys.log(0, 1, e)
        })
        sys.log(0, 1, ' ')
    },
    cmd_cd: function(a) {
        a = a.join(' ')
        if(a.length === 0 || a === '.' || (a === '..' && user.path === 'home')) {
            return
        } else if(a === '..') {
            user.path = user.path.split('/').slice(0, -1).join('/')
            return sys.setInputName(user.name)
        } else if(ssd.dir[user.path + '/' + a] === undefined) {
            return sys.log(0, 1, '§mError: Can not find the directory you are looking for...')
        }
        user.path = user.path + '/' + a
        sys.setInputName(user.name)
    },
    cmd_cd1: function() {
        cmd.cmd_cd(['.'])
    },
    cmd_cd2: function() {
        cmd.cmd_cd(['..'])
    },
    cmd_cls: function() {
        ui_history.innerHTML = ''
        sys.history.index = 0
    },
    cmd_connect: function(a, i) {
        if(i === undefined) {
            a = [
                'BRRRRRRRR|700', 'BEEP|100', 'BUH|100', 'BUP|100', 'BUH|100', 'BUP|100', 'BUP|100', 'BUP|100', ' |800', 'EEEEEEE|400', 'BOOP|80', 
                'ERRRRRRRRRRRR|420', ' |500', 'EEEEE|400', 'BLEEE|150', 'OOO|80', 'UUUUHHHHHH|700', 'ERRRRRRRRRRRR|500',
                'OOOOOOOOOPP|250', ' |900', 'EEEEEEEEEEEEE|1210', 'ERRRRRRRRRRRR|900', 'ERRRRRRRR|70', 'ERRRRRRRR|1000', 'EEEEEEEEEE|400', 
                'UUUUHHHHHH|400', 'EEEEEEEE|400', 'UUUUHHHHHH|400', 'ERRRRRRRR|400', '*HWHITE NOISE*|3000'
            ]
            i = 0
            sys.setUserInput(false)
            sys.log(0, 1, 'Connecting: ')
        }
        if(a[i] !== undefined) {
            var l  = a[i].split('|')
            sys.updateLog(sys.history.index - 1, 'Connecting:')
            setTimeout(function() {
                sys.updateLog(sys.history.index - 1, 'Connecting: ' + l[0])
                setTimeout(function() {
                    cmd.cmd_connect(a, i + 1)
                }, l[1])
            }, 80)
        } else {
            sys.updateLog(sys.history.index - 1, 'Connecting: ' + (navigator.onLine ? 'Successful!' : 'Failed, try again later...'))
            sys.setUserInput(true)
        }
    },
    cmd_date: function(a) {
        if(a.length === 0) {
            return sys.log(0, 0, new Date())
        }
        var d = new Date(a)
        sys.log(0, 1, (isNaN(d.getTime()) ? '§m' : '') + d)
    },
    cmd_dir: function() {
        var d = 0, f = 0; s = 0; t = ssd.size, b = 0
        sys.log(0, 0, 'Directory of ' + user.path)
        sys.log(0, 0, ' ')
        for(var fID in ssd.files[user.path]) {
            if(sys.numberFormat(ssd.files[user.path][fID][2]).length > b) {
                b = sys.numberFormat(ssd.files[user.path][fID][2]).length
            }
            f++
        }
        if(user.path !== 'home') {
            sys.log(0, 0, '                    <DIR> ' + sys.setSpaces(b + 4, 0, '.'))
            sys.log(0, 0, '                    <DIR> ' + sys.setSpaces(b + 4, 0, '..'))
            d = 2
        }
        for(dID in ssd.dir[user.path]) {
            dID = ssd.dir[user.path][dID]
            sys.log(0, 0, dID[0] + '   <DIR> ' + sys.setSpaces(b + 4, 0, dID[1]))
            d++
        }
        for(var fID in ssd.files[user.path]) {
            fID = ssd.files[user.path][fID]
            sys.log(0, 0, fID[0] + '        ' + sys.setSpaces(b + 4, sys.numberFormat(fID[2]).length, sys.numberFormat(fID[2] + ' ' + fID[1])))
            s += fID[2]
        }
        d = sys.numberFormat(d)
        f = sys.numberFormat(f)
        s = sys.numberFormat(s)
        t = sys.numberFormat(t)
        if(s.length >= t.length) {
            t = new Array(s.length - f.length + 1).join(' ') + t
        } else {
            s = new Array(t.length - s.length + 1).join(' ') + s
        }
        if(f.length >= d.length) {
            d = new Array(f.length - d.length + 1).join(' ') + d
        } else {
            f = new Array(d.length - f.length + 1).join(' ') + f
        }
        sys.log(0, 0, '\t   ' + f + ' File(s)      ' + s + ' bytes')
        sys.log(0, 0, '\t   ' + d + ' dir(s)       ' + t + ' bytes free')
        sys.log(0, 0, ' ')
    },
    cmd_editor: function(a) {
        var f = null;
        a = a.join(' ')
        if(a.length === 0) {
            return sys.log(0, 1, '§mUsage: editor <filename>')
        }
        if(a.match(/[/\:?*<>|§]/g)) {
            return sys.log(0, 1, '§mError: Unwanted characters was detected!')
        }
        for(var i in ssd.files[user.path]) {
            if(ssd.files[user.path][i][1] === a) {
                f = ssd.files[user.path][i]
                break
            }
        }
        if(f === null) {
            cmd.cmd_touch([a])
            return cmd.cmd_editor([a])
        }
        sys.setUserInput(false)

        var elEditor = sys.createElement('div')
        var elTextArea = sys.createElement('textarea')
        var buttonSave = sys.createElement('button')
        var buttonExit = sys.createElement('button')
        var buttonMsg = sys.createElement('button')
        var buttonSize = sys.createElement('button')
        elEditor.id = 'terminal_editor'
        elEditor.setAttribute('filename', f[1])
        elTextArea.value = f[3]
        buttonSave.className = 'save'
        buttonSave.innerText = 'SAVE'
        buttonExit.className = 'exit'
        buttonExit.innerText = 'EXIT'
        buttonMsg.className = 'msg'
        buttonSize.className = 'size'
        buttonSize.innerText = 'length: ' + sys.numberFormat(f[2])

        elTextArea.oninput = function() {
            buttonSize.innerText = 'length: ' + sys.numberFormat(this.value.length)
            buttonMsg.innerText = 'Modified'
        }

        buttonSave.onclick = function() {
            var size = elTextArea.value.length
            for(var i in ssd.files[user.path]) {
                if(ssd.files[user.path][i][1] === f[1]) {
                    if(ssd.size + f[2] < size) {
                        buttonMsg.innerText = 'Error, No hard drive space.'
                        setTimeout(function() {
                            if(buttonMsg !== undefined) {
                                buttonMsg.innerText = 'Modified'
                            }
                        }, 1800)
                        return
                    }
                    ssd.size += f[2]
                    ssd.files[user.path][i][0] = sys.getDate()
                    ssd.files[user.path][i][2] = size
                    ssd.files[user.path][i][3] = elTextArea.value
                    ssd.size -= size
                    buttonMsg.innerText = 'Saved!'
                    setTimeout(function() {
                        if(buttonMsg !== undefined) {
                            buttonMsg.innerText = ''
                        }
                    }, 1800)
                    return
                }
            }
            buttonMsg.innerText = 'Failed to save the document...'
            setTimeout(function() {
                if(buttonMsg !== undefined) {
                    buttonMsg.innerText = 'Modified'
                }
            }, 1800)
        }

        buttonExit.onclick = function() {
            elEditor.parentNode.removeChild(elEditor)
            document.documentElement.removeAttribute('style')
            sys.setUserInput(true)
        }

        elEditor.appendChild(elTextArea)
        elEditor.appendChild(buttonSave)
        elEditor.appendChild(buttonExit)
        elEditor.appendChild(buttonMsg)
        elEditor.appendChild(buttonSize)
        document.body.appendChild(elEditor)
        document.documentElement.style.overflow = 'hidden'
        elTextArea.focus()
    },
    cmd_exit: function() {
        sys.setUserInput(false)
        sys.log(0, 0, 'Shutting down terminal...')
        sys.log(0, 0, ' ')
        app = appExit
        setTimeout(function() {
            app.init([].concat(
                Object.keys(sys), Object.keys(cmd), Object.keys(user), Object.keys(appBlackjack),
                Object.keys(appFloor), Object.keys(appHangman), Object.keys(appLottery), 
                Object.keys(appTicTacToe), Object.keys(appUNO), sys.newArray(38, '! '), '!<>', '! ',
                '!§o:: Terminal ::', '!Written by Thomas Hj @ SoloLearn -> User',
                '!2018 - 2022', '! ', '!</>', sys.newArray(Math.floor(innerHeight / 2 / 18), '! '),
                '!Goodbye ' + user.name)
            )
            cmd = {}
        }, 1200)
    },
    cmd_games: function(a) {
        var games = [
            {c: 'Blackjack', d: 'Blackjack'}, {c: 'Floor', d: 'Floor'}, 
            {c: 'Hangman', d: 'Hangman'}, {c: 'Lottery', d: 'Lottery'},
            {c: 'TicTacToe', d: 'Tic-Tac-Toe'}, {c: 'UNO', d: 'UNO'}
        ]
        a = parseInt(a)
        if(a.length != 0 && !isNaN(a) && games[a -1] !== undefined) {
            a -= 1
            if('app' + games[a].c in window) {
                app = window['app' + [games[a].c]]
                return app.init()
            }
            return sys.log(0, 1, '§mSorry, ' + games[a].d + ' is not install on this terminal yet.')
        }
        sys.log(0, 0, 'List of games:')
        for(var i = 0; i < games.length; i++) {
            sys.log(0, 1, '   ' + (i + 1) + ': ' + games[i].d + ('app' + games[i].c in window ? '' : ' §m(Not installed)'))
        }
        sys.log(0, 0, ' ')
    },
    cmd_hack: function(a, b) {
        if(a.length > 0 && b == undefined) {
            sys.setUserInput(false)
            var tools = 'EzExploit,wx3Exploit,wtool,ftpEx,port73,ackHack,cmdHack,ctsHack'.split(',')
            var tool = {t: 0, d: []}
            for(var i = 0; i < sys.rand(tools.length); i++) {
                var x = tools.splice(sys.rand(tools.length - 1), 1)[0]
                sys.log(0 , 0, 'Import: \'' + x + '\' -> 0%')
                tool.d[i] = { n: x, i: sys.history.index - 1, p: 0 }
            }
            for(var j = 0; j < sys.rand(15); j++) {
                x = sys.createName(sys.rand(8) + 4)
                sys.log(0 , 0, 'Import: \'' + x + '\' -> 0%')
                tool.d[i + j] = { n: x, i: sys.history.index - 1, p: 0 }
            }
            return cmd.cmd_hack(a, tool)
        }
        if(b != undefined) {
            if(!navigator.onLine) {
                sys.setUserInput(true)
                sys.log(0, 1, '§mFailed, connection lost...')
                return sys.log(0, 0, ' ')
            }
            if(b.t == 0) {
                setTimeout(function() {
                    var i = 0
                    b.d.forEach(function(e) {
                        if(e.p != 100) {
                            e.p += sys.rand(e.n.length)
                            if(e.p > 100) {
                                e.p = 100
                                i++
                            }
                            sys.updateLog(e.i, 'Import: \'' + e.n + '\' -> ' + e.p + '%')
                        } else {
                            i++
                        }
                    })
                    if(i == b.d.length) {
                        b.t = 1
                        b.d = [' |0', 'Connection to \'' + a[0] + '\' (' + sys.rand(255) + '.' + sys.rand(255) + '.' + sys.rand(255) + '.' + sys.rand(255) + ')|' + (sys.rand(5000) + 500)]
                        b.d = b.d.concat(sys.newArray(sys.rand(10) + 5, '.|20'))
                        b.d.push(' |100')
                        for(var j = 0; j < sys.rand(25) + 2; j++) {
                            var y = sys.rand(30)
                            for(var x = 0; x < y; x++) {
                                b.d.push((y * (x + 1)) + ' / ' + (y * y) + ' bytes|' + (sys.rand(10) + 20))
                            }
                            b.d.push(' |120')
                        }
                        for(var j = 0; j < sys.rand(20000) + 500; j++) {
                            b.d.push(sys.createName(Math.floor(innerWidth / 8.44) - 1) + '|5')
                        }
                    }
                    cmd.cmd_hack(a, b)
                }, sys.rand(69) + 100)
                return
            } else if(b.t == 1) {
                if(b.d.length !== 0) {
                    var l = b.d.shift().split('|')
                    sys.log(0, 0, l[0])
                    setTimeout(function() {
                        cmd.cmd_hack(a, b)
                    }, parseInt(l[1]))
                    return
                } else {
                    b.t = 2
                    sys.setUserInput(true)
                    sys.log(0, 0, ' ')
                    sys.log(0, 0, 'Target \'' + a[0] + '\'')
                    sys.log(0, 0, 'Database: phpMyAdmin v1.52.1a')
                    sys.log(0, 0, 'Database Login: lkjsdlkfjsdf@løksjdflksjdf')
                    sys.log(0, 0, ' ')
                    return sys.log(0, 0, ' ')
                }
            }
        }
        sys.log(0, 1, '§mUsage: hack <target>')
    },
    cmd_help: function() {
        var i = 0
        for(var c in cmd.commands) {
            if(c.length > i) {
                i = c.length
            }
        }
        sys.log(0, 0, 'List of commands:')
        for(var c in cmd.commands) {
            if(cmd.commands[c].indexOf('!', 0) === -1) {
                sys.log(0, 0, '   ' + c.toUpperCase() + sys.setSpaces(i + 4, c.length, cmd.commands[c]))
            }
        }
        sys.log(0, 0, ' ')
    },
    cmd_hex: function(a) {
        if(a.length > 1 && !isNaN(a[0]) && (a[0] > 2 && a[0] < 37)) {
            var l, s = ''
            l = a.splice(1, a.length).join(' ')
            for(var i = 0; i < l.length; i++) {
                s += l.charCodeAt(i).toString(a[0]) + ' '
            }
            return sys.log(0, 0, s)
        }
        sys.log(0, 1, '§mUsage: hex <int (3 - 36)> [string... ]')
    },
    cmd_mkdir: function(a) {
        a = a.join(' ')
        if(sys.fileSystem(true, a)) {
            ssd.dir[user.path].push([sys.getDate(), a])
            ssd.dir[user.path].sort(function(b, c) {
                return b[1].toUpperCase() > c[1].toUpperCase() ? 1 : -1
            })
            ssd.dir[user.path + '/' + a] = []
            ssd.files[user.path + '/' + a] = []
        }
    },
    cmd_roll: function(a) {
        if(a.length !== 0) {
            a = parseInt(a)
        }
        if(isNaN(a) || a.length === 0) {
            a = 1
        }
        for(var i = 0; i < a; i++) {
            sys.log(0, 0, 'Roll ' + (i + 1) + ': ' + (sys.rand(100) + 1))
            if(i > 18) {
                break
            }
        }
    },
    cmd_setname: function(a) {
        if(a.length !== 0) {
            user.name = a.join('_')
            return sys.setInputName(user.name)
        }
        sys.log(0, 1, '§mUsage: setname [String... ]')
    },
    cmd_tree: function(p, i) {
        if(i == undefined) {
            p = user.path
            i = 0
            sys.log(0, 0, 'Directory path listing')
            sys.log(0, 0, '.')
        }
        if(ssd.dir[p].length !== 0) {
            for(var x = 0; x < ssd.dir[p].length; x++) {
                var d = ssd.dir[p][x][1]
                var s = '|'
                for(var y = 0; y < i; y++) {
                    s += '  |'
                }
                sys.log(0, 0, s + '---' + d)
                cmd.cmd_tree(p + '/' + d, i + 1)
            }
        }
    },
    cmd_time: function() {
        var d = new Date()
        sys.log(0, 0, ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2) + ':' + ('0' + d.getSeconds()).slice(-2))
    },
    cmd_touch: function(a) {
        a = a.join(' ')
        if(sys.fileSystem(false, a)) {
            ssd.files[user.path].push([sys.getDate(), a, 0, ''])
            ssd.files[user.path].sort(function(b, c) {
                return b[1].toUpperCase() > c[1].toUpperCase() ? 1 : -1
            })
        }
    },
    cmd_vibrate: function(a) {
        if(a.length !== 0) {
            try {
                return navigator.vibrate(a)
            } catch(e) {
                return sys.log(0, 1, '§mSorry, your web-browser does not support this method.')
            }
        }
        sys.log(0, 1, '§mUsage: Vibrate [Numbers... ]')
    },
    cmd_user: function() {
        var s = ((new Date().getTime() - user.online) / 1000).toFixed(0)
        var m = s >= 60 ? Math.floor(s / 60) : 0
        sys.log(0, 0, 'User information')
        sys.log(0, 0, '   Username:  ' + user.name)
        sys.log(0, 0, '   Coins:     ' + sys.numberFormat(user.coins))
        sys.log(0, 0, ' ')
        sys.log(0, 0, '   Language:  ' + navigator.language)
        sys.log(0, 0, '   Online:    ' + (m != 0 ? m + ' Min,' : '') + (s - (60 * m)) + ' Sec')
        sys.log(0, 0, '   On Phone:  ' + sys.onPhone)
        sys.log(0, 0, ' ')
    }
}

var appExit = {
    hasRun: false,
    init: function(a) {
        if(a.length != 0) {
            var i = a.shift()
            if(app.hasRun) {
                sys.log(0, 1, i.length === 0 ? ' ' : i)
            } else {
                sys.log(0, 1, i.indexOf('!', 0) === 0 ? i.substr(1) : 'Remove: ' + i + sys.setSpaces(Math.floor(innerWidth / 12) - 2, i.length, '[ OK ]'))
            }
            return setTimeout(function() {
                app.init(a)
            }, app.hasRun ? 25 : sys.rand(i.trim().length * 3) + 5)
        }
        setTimeout(app.clean, app.hasRun ? 10000 : 500)
    },
    clean: function(a, i) {
        if(a == undefined) {
            a = document.querySelectorAll('.log'), i = 0
        }
        if(a[i] != undefined) {
            a[i].innerText = ' '
            return setTimeout(function() {
                app.clean(a, i + 1)
            }, 25)
        }
        app.hasRun = true
        document.documentElement.setAttribute('exit', '')
        ui_history.innerHTML = ''
        sys.history.index = 0
        setTimeout(app.message, 250)
    },
    message: function() {
        var a = [], i = sys.rand(10)
        switch(i) {
            case 1:
                a.push(
                    'If you find a bug like me, well you can reported', 
                    'to me if you want, I will be glad to fixed it,', 'when I have time.',
                    ' ', ' ', '   \\ /         //  \\\\         \\ /',
                    '   >v<        _\\\\()//_        >v<', '   >o<       / //  \\\\ \\       >o<', 
                    '   >o<        | \\__/ |        >o<'
                )
                break
            case 2:
                a.push(
                    'Most of this code is written in by my phone, well',
                    'when I think about it... all my code is actually',
                    'written in by my phone.', ' ',
                    'But with version 1.10 I re-written in by a',
                    'computer instead of my silly phone.', 'WHAHT!!! you nev...', ' ',' ', 
                    '§h<!DOCTYPE html>', '§h<§mhtml§h>', '\t§h<§mhead§h>', 
                    '\t\t§h<§mmeta §kcharset=§o"utf-8"§h>', '\t\t§h<§mtitle§h>§hThomas Hj§h</§mtitle§h>', 
                    '\t§h</§mhead§h>', '\t§h<§mbody§h>', '\t\t§i<!-- insert code here -->', 
                    '\t§h</§mbody§h>', '§h</§mhtml§h>'
                )
                break
            case 6:
                var l = []
                for(var x in ssd.files) {
                    if(ssd.files[x].length !== 0) {
                        for(var y = 0; y < ssd.files[x].length; y++) {
                            l.push(ssd.files[x][y])
                        }
                    }
                }
                if(l.length !== 0) {
                    l = l[sys.rand(l.length) - 1]
                    a.push(l[1],'===============', ' ')
                    a = a.concat(l[3].split('\n'))
                    a.push(' ', '============', user.name)
                    return app.init(a)
                }
            default:
                a.push(
                    'A very special thank you for trying this', 'web-based terminal code.',
                    'I really hope you enjoy it as much as I', 'coded / written it.',
                    ' ', ' '
                )
                if(a == 7) {
                    a.push(
                        '         \\|||||/', '        d{ o O }b', '/--ooO-----(_)----------\\',
                        '| Is math               |', '|       related to      |', '|               science |',
                        '\\------------------Ooo--/', '         |__||__|', '          ||  ||',
                        '         ooO  Ooo'
                    )
                } else {
                    a.push(
                        '         \\|||||/', '        d{ o O }b', '/--ooO-----(_)----------\\',
                        '|                       |', '|       Thank You       |', '|                       |',
                        '\\------------------Ooo--/', '         |__||__|', '          ||  ||',
                        '         ooO  Ooo'
                    )
                }
        }
        a.push(' ', ' ', '============', 'Thomas Hj')
        app.init(a)
    }
}

var appBlackjack = {
    cardType: ['H', 'S', 'D', 'C'],
    cardNumber: ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'j', 'Q', 'K'],
    playerTurn: true,
    price: 50,
    player: [],
    computer: [],
    deck: [],
    init: function() {
        if(user.games['blackjack'] === undefined) {
            user.games.blackjack = {w: 0, l: 0, d: 0, p: 0}
        }
        sys.setInputName('>')
        app.commandHandler([])
    },
    commandHandler: function(a) {
        if(app.deck.length == 0) {
            if(a.length > 0) {
                switch(a[0].toLowerCase()) {
                    case 'y':
                        if(user.coins < app.price) {
                            return sys.log(0, 1, '[GAME] §mSorry, look like you are running little too low with your coins here...')
                        }
                        user.coins -= app.price
                        user.games.blackjack.p++
                        app.playerTurn = true
                        app.cardType.forEach(function(t) {
                            app.cardNumber.forEach(function(n) {
                                app.deck.push({n: n, t: t, p: (!isNaN(n) ? parseInt(n) : n === 'A' ? 11 : 10)})
                            })
                        })
                        app.deck = sys.shuffle(app.deck)
                        app.player.push(app.deck.pop())
                        app.computer.push(app.deck.pop())
                        app.player.push(app.deck.pop())
                        app.computer.push(app.deck.pop())
                        return app.commandHandler([])
                    case 'e':
                        app = cmd
                        sys.setInputName(user.name)
                        return sys.log(0, 0, ' ')
                }
            }
            cmd.cmd_cls()
            sys.log(0, 0, 'Welcome to Blackjack!')
            sys.log(0, 1, 'You\'ve §m' + sys.numberFormat(user.coins) +'§r coins on your account.')
            sys.log(0, 0, ' ')
            sys.log(0, 0, '/---\\ /---\\ /---\\ /---\\ /---\\')
            sys.log(0, 0, '|  5| |  7| |  A| |  4| |XXX|')
            sys.log(0, 0, '|   | |   | |   | |   | |XXX|')
            sys.log(0, 0, '|H  | |S  | |D  | |C  | |XXX|')
            sys.log(0, 0, '\\---/ \\---/ \\---/ \\---/ \\---/')
            sys.log(0, 0, ' ')
            return app.displayCommands(0)
        }
        if(app.playerTurn && a.length == 1) {
            switch(a[0].toLowerCase()) {
                case 'h':
                    app.player.push(app.deck.pop())
                    break
                case 's':
                    app.playerTurn = false
                    sys.setUserInput(false)
                    break
            }
        }
        var w, c, p
        cmd.cmd_cls()
        c = app.rendreCards('Dealer', app.computer, !app.playerTurn)
        p = app.rendreCards('You', app.player, true)
        w = app.isWin(c, p)
        if(w.w) {
            sys.log(0, 0, '-----------------------------------------------')
            if(w.e) {
                sys.log(0, 1, ' §oYou won the game!')
                sys.log(0, 1, ' ' + (app.price * 2) + '§o coins was added to your account.')
                user.coins += app.price * 2
                user.games.blackjack.w++
            } else if(w.e == null) {
                sys.log(0, 1, ' §hDraw! No one won the game.')
                sys.log(0, 1, ' ' + app.price + '§o coins was added to your account.')
                user.coins += app.price
                user.games.blackjack.d++
            } else {
                sys.log(0, 1, ' §mDealer won the game!')
                user.games.blackjack.l++
            }
            sys.log(0, 0, '-----------------------------------------------')
            sys.log(0, 0, ' ')
            app.player = []
            app.computer = []
            app.deck = []
            if(!app.playerTurn) {
                sys.setUserInput(true)
            }
            app.playerTurn = true
            return app.displayCommands(2)
        }
        if(app.playerTurn) {
            return app.displayCommands(1)
        }
        app.computer.push(app.deck.pop())
        setTimeout(function() {
            app.commandHandler([])
        }, 1000)
    },
    displayCommands: function(i) {
        switch(i) {
            case 1:
                sys.log(0, 1, '§m[H]§r - Hit')
                sys.log(0, 1, '§m[S]§r - Stand')
                break
            default:
                sys.log(0, 1, '§m[Y]§r - ' + (i == 0 ? 'Start the game' : 'Play again') + '? §h(§m' + app.price + ' §hCoins)' + (i == 0 ? '' : ' §h(§m' + sys.numberFormat(user.coins) + '§h Coins left)'))
                sys.log(0, 1, '§m[E]§r - Leave the game?')
        }
        sys.log(0, 0, ' ')
    },
    rendreCards: function(e, c, b) {
        var l0 = '', l1 = '', l2 = '', l3 = '', l4 = '', p = 0, a = 0
        c.some(function(i) {
            if(l0 != '' && !b) {
                l0 += '/---\\'
                l1 += '|XXX|'
                l2 += '|XXX|'
                l3 += '|XXX|'
                l4 += '\\---/'
                return true
            }
            if(i.p === 11) {
                a++
            }
            l0 += '/---\\ '
            l1 += '| ' + (' ' + i.n).slice(-2) + '| '
            l2 += '|   | '
            l3 += '|'+ i.t +'  | '
            l4 += '\\---/ '
            p += i.p
        })
        for(var i = 0; i < a; i++) {
            if(p > 21) {
                p -= 10
            }
        }
        sys.log(0, 1, '§o' + e + ' (' + p + ')')
        sys.log(0, 0, l0)
        sys.log(0, 0, l1)
        sys.log(0, 0, l2)
        sys.log(0, 0, l3)
        sys.log(0, 0, l4)
        sys.log(0, 0, ' ')
        return p
    },
    isWin: function(c, p) { 
        if(c === 21 || p > 21) {
            return { w: true, e: false }
        } else if(p == 21 || c > 21) {
            return { w: true, e: true }
        } else if(!app.playerTurn && (c > 16 || c > p)) {
            if(c == p) {
                return { w: true, e: null }
            } else if(c > p) {
                return { w: true, e: false }
            } else {
                return { w: true, e: true }
            }
        }
        return { w: false, e: null }
    }
}

var appFloor = {
    playing: false,
    lvl: 1,
    loot: 0,
    lootBox: [0, 0, 0, 0, 0],
    lootSpot: [5, 10, 20, 30, 50],
    lootSpotTrigger: false,
    init: function() {
        if(user.games['floor'] === undefined) {
            user.games.floor = {w: 0, l: 0, p: 0}
        }
        sys.setInputName('>')
        app.lvl = 1
        app.loot = 0
        app.commandHandler([])
    },
    commandHandler: function(a) {
        if(!app.playing) {
            if(a.length > 0) {
                switch(a[0].toLowerCase()) {
                    case 'y':
                        user.games.floor.p++
                        app.playing = true
                        app.createLoot()
                        sys.setInputName('Select A Number:')
                        return app.commandHandler([])
                    case 'e':
                        app = cmd
                        sys.setInputName(user.name)
                        return sys.log(0, 0, ' ')
                }
            }
            cmd.cmd_cls()
            sys.log(0, 0, 'Welcome to Floor!')
            sys.log(0, 0, ' ')
            sys.log(0, 0, 'Are you able to reach the floor 50?')
            sys.log(0, 0, 'Some floor are checkpoints.')
            sys.log(0, 0, ' ')
            sys.log(0, 1, 'Type §mexit§r when you want to quit the game.')
            sys.log(0, 0, ' ')
            sys.log(0, 1, '§m[Y]§r - Start the game?')
            sys.log(0, 1, '§m[E]§r - Leave the game?')
            return sys.log(0, 0, ' ')
        }
        var loot = null;
        if(a.length > 0) {
            if(a[0].toLowerCase() === 'exit') {
                app.playing = false
                return app.commandHandler(['e'])
            }
            a = parseInt(a)
            if(!isNaN(a) && (a > 0 && a < 6)) {
                loot = app.lootBox[a - 1]
            }
        }
        cmd.cmd_cls()
        app.printFloor(app.lvl)
        sys.log(0, 0, '-------------------')
        sys.log(0, 0, '|\\_______________/|')
        sys.log(0, 0, '|                 |')
        sys.log(0, 0, '|                 |')
        sys.log(0, 0, '|  [ 1 ]   [ 2 ]  |')
        sys.log(0, 0, '|                 |[^]')
        sys.log(0, 0, '|      [ 3 ]      || |')
        sys.log(0, 0, '|                 |[v]')
        sys.log(0, 0, '|  [ 4 ]   [ 5 ]  |')
        sys.log(0, 0, '|                 |')
        sys.log(0, 0, '| _______________ |')
        sys.log(0, 0, '|/---------------\\|')
        sys.log(0, 0, '-------------------')
        app.printLoot()
        if(app.isLootSpot() && !app.lootSpotTrigger && app.loot !== 0) {
            sys.setUserInput(false)
            app.lootSpotTrigger = true
            sys.log(0, 1, '[GAME] §oCongrats, you got §m' + sys.numberFormat(app.loot) + '§o coins.')
            user.coins += app.loot
            app.loot = 0
            setTimeout(function() {
                if(app.lvl == 50) {
                    app.playing = false
                    app.lvl = 1
                    user.games.floor.w++
                    sys.log(0, 0, ' ')
                    sys.log(0, 0, '-------------------')
                    sys.log(0, 1, ' §oCongratulations you beet the game.')
                    sys.log(0, 0, '-------------------')
                    sys.log(0, 0, ' ')
                    sys.log(0, 1, '§m[Y]§r - Play again?')
                    sys.log(0, 1, '§m[E]§r - Leave the game?')
                    sys.log(0, 0, ' ')
                    sys.setInputName('>')
                    return sys.setUserInput(true)
                }
                sys.log(0, 1, '[GAME] §oYou got this.')
                sys.log(0, 0, ' ')
                sys.setUserInput(true)
            }, 2500)
            return
        }
        if(app.loot == 0) {
            sys.log(0, 0, ' ')
        }
        if(loot != null) {
            sys.setUserInput(false)
            sys.log(0, 1, '[GAME] §oOpen box: §m' + a)
            setTimeout(function() {
                if(loot > 0) {
                    sys.log(0, 1, '[GAME] §oYou found: §r' + sys.numberFormat(loot) + '§o Coins.')
                    app.loot += loot
                    setTimeout(function() {
                        app.nextFloor(0, 0, true)
                    }, 1000)
                } else {
                    sys.log(0, 1, '[GAME] §mSorry, you found a empty box.')
                    setTimeout(function() {
                        app.checkpointFloor()
                    }, 1000)
                }
            }, 1500)
        }
    },
    createLoot: function() {
        var i = sys.rand(5) - 1
        for(var x = 0; x < 5; x++) {
            app.lootBox[x] = x === i ? -1 : sys.rand(50) * app.lvl
        }
    },
    nextFloor: function(a, b, d) {
        cmd.cmd_cls()
        app.printFloor('--')
        sys.log(0, 0, '-------------------')
        if(b == 0 || b == 2) {
            var x = b == 0 ? a : 7 - a
            var s = sys.setSpaces(x + 1, 0, '')
            var l = '|' + s + '|' + ('       ').slice(x) + ' ' + ('       ').slice(0, 7 - x) + '|' + s + '|'
            sys.log(0, 0, '|' + s + '|' + ('_______').slice(x) + '_' + ('_______').slice(0, 7 - x) + '|' + s + '|')
            sys.log(0, 0, l)
            sys.log(0, 0, l)
            sys.log(0, 0, l)
            sys.log(0, 1, l + '[^]')
            sys.log(0, 0, l + '| |')
            sys.log(0, 0, l + '[v]')
            sys.log(0, 0, l + '')
            sys.log(0, 0, l + '')
            sys.log(0, 0, '|' + s + '|' + ('_______').slice(x) + '_' + ('_______').slice(0, 7 - x) + '|' + s + '|')
            sys.log(0, 0, '|' + s + '|' + ('-------').slice(x) + '-' + ('-------').slice(0, 7 - x) + '|' + s + '|')
            if(a == 7 && b == 0) {
                a = -1
                b = 1
            }
        } else if(b == 1) {
            if(d) {
                sys.log(0, 1, '|       |' + (a == 1 ? '§o|§r' : '|') + '|       |')
                sys.log(0, 1, '|       |' + (a == 2 ? '§o|§r' : '|') + '|       |')
                sys.log(0, 1, '|       |' + (a == 3 ? '§o|§r' : '|') + '|       |')
                sys.log(0, 1, '|       |' + (a == 4 ? '§o|§r' : '|') + '|       |')
                sys.log(0, 1, '|       |' + (a == 5 ? '§o|§r' : '|') + '|       |[§o^§r]')
                sys.log(0, 1, '|       |' + (a == 6 ? '§o|§r' : '|') + '|       || |')
                sys.log(0, 1, '|       |' + (a == 7 ? '§o|§r' : '|') + '|       |[v]')
                sys.log(0, 1, '|       |' + (a == 8 ? '§o|§r' : '|') + '|       |')
                sys.log(0, 1, '|       |' + (a == 9 ? '§o|§r' : '|') + '|       |')
                sys.log(0, 1, '|       |' + (a == 10 ? '§o|§r' : '|') + '|       |')
                sys.log(0, 1, '|       |' + (a == 11 ? '§o|§r' : '|') + '|       |')
            } else {
                sys.log(0, 1, '|       |' + (a == 11 ? '§o|§r' : '|') + '|       |')
                sys.log(0, 1, '|       |' + (a == 10 ? '§o|§r' : '|') + '|       |')
                sys.log(0, 1, '|       |' + (a == 9 ? '§o|§r' : '|') + '|       |')
                sys.log(0, 1, '|       |' + (a == 8 ? '§o|§r' : '|') + '|       |')
                sys.log(0, 1, '|       |' + (a == 7 ? '§o|§r' : '|') + '|       |[^]')
                sys.log(0, 1, '|       |' + (a == 6 ? '§o|§r' : '|') + '|       || |')
                sys.log(0, 1, '|       |' + (a == 5 ? '§o|§r' : '|') + '|       |[§mv§r]')
                sys.log(0, 1, '|       |' + (a == 4 ? '§o|§r' : '|') + '|       |')
                sys.log(0, 1, '|       |' + (a == 3 ? '§o|§r' : '|') + '|       |')
                sys.log(0, 1, '|       |' + (a == 2 ? '§o|§r' : '|') + '|       |')
                sys.log(0, 1, '|       |' + (a == 1 ? '§o|§r' : '|') + '|       |')
            }
            if(a == 12) {
                a = 0
                b = 2
            }
        }
        sys.log(0, 0, '-------------------')
        app.printLoot()
        if(b == 2 && a == 7) {
            app.lvl++
            app.lootSpotTrigger = false
            app.createLoot()
            sys.setUserInput(true)
            return app.commandHandler([])
        }
        setTimeout(function() {
            app.nextFloor(a + 1, b, d)
        }, 100)
    },
    checkpointFloor: function() {
        user.games.floor.l++
        app.loot = 0
        var x = 1
        for(var i in app.lootSpot) {
            if(app.lootSpot[i] <= app.lvl) {
                x = app.lootSpot[i]
            }
        }
        app.lvl = x - 1
        app.nextFloor(0, 0, false)
    },
    isLootSpot: function() {
        for(var i in app.lootSpot) {
            if(app.lootSpot[i] == app.lvl) {
                return true
            }
        }
        return false
    },
    printLoot: function() {
        if(app.loot !== 0) {
            sys.log(0, 0, ' ')
            sys.log(0, 1, '§j-------------------------------------')
            sys.log(0, 1, ' Loot: §o' + sys.numberFormat(app.loot) + '§r coins')
            sys.log(0, 1, '§j-------------------------------------')
            sys.log(0, 0, ' ')
        }
    },
    printFloor: function(a) {
        sys.log(0, 0, '       [ ' + ('0' + a).slice(-2) + ' ]')
    }
}

var appHangman = {
    wordsList: {
        default: 'account,act,addition,adjustment,advertisement,agreement,air,amount,amusement,animal,answer,apparatus,approval,argument,art,attack,attempt,attention,attraction,authority,back,balance,base,behavior,belief,birth,bit,bite,blood,blow,body,brass,bread,breath,brother,building,burn,burst,business,butter,canvas,care,cause,chalk,chance,change,cloth,coal,color,comfort,committee,company,comparison,competition,condition,connection,control,cook,copper,copy,cork,cotton,cough,country,cover,crack,credit,crime,crush,cry,current,curve,damage,danger,daughter,day,death,debt,decision,degree,design,desire,destruction,detail,development,digestion,direction,discovery,discussion,disease,disgust,distance,distribution,division,doubt,drink,driving,dust,earth,edge,education,effect,end,error,event,example,exchange,existence,expansion,experience,expert,fact,fall,family,father,fear,feeling,fiction,field,fight,fire,flame,flight,flower,fold,food,force,form,friend,front,fruit,glass,gold,government,grain,grass,grip,group,growth,guide,harbor,harmony,hate,hearing,heat,help,history,hole,hope,hour,humor,ice,idea,impulse,increase,industry,ink,insect,instrument,insurance,interest,invention,iron,jelly,join,journey,judge,jump,kick,kiss,knowledge,land,language,laugh,law,lead,learning,leather,letter,level,lift,light,limit,linen,liquid,list,look,loss,love,machine,man,manager,mark,market,mass,meal,measure,meat,meeting,memory,metal,middle,milk,mind,mine,minute,mist,money,month,morning,mother,motion,mountain,move,music,name,nation,need,news,night,noise,note,number,observation,offer,oil,operation,opinion,order,organisation,ornament,owner,page,pain,paint,paper,part,paste,payment,peace,person,place,plant,play,pleasure,point,poison,polish,porter,position,powder,power,price,print,process,produce,profit,property,prose,protest,pull,punishment,purpose,push,quality,question,rain,range,rate,ray,reaction,reading,reason,record,regret,relation,religion,representative,request,respect,rest,reward,rhythm,rice,river,road,roll,room,rub,rule,run,salt,sand,scale,science,sea,seat,secretary,selection,self,sense,servant,sex,shade,shake,shame,shock,side,sign,silk,silver,sister,size,sky,sleep,slip,slope,smash,smell,smile,smoke,sneeze,snow,soap,society,son,song,sort,sound,soup,space,stage,start,statement,steam,steel,step,stitch,stone,stop,story,stretch,structure,substance,sugar,suggestion,summer,support,surprise,swim,system,talk,taste,tax,teaching,tendency,test,theory,thing,thought,thunder,time,tin,top,touch,trade,transport,trick,trouble,turn,twist,unit,use,value,verse,vessel,view,voice,walk,war,wash,waste,water,wave,wax,way,weather,week,weight,wind,wine,winter,woman,wood,wool,word,work,wound,writing,year',
        computer: 'algorithm,analog,app,application,array,backup,bandwidth,binary,bit,bite,bitmap,blog,blogger,bookmark,boot,broadband,browser,buffer,bug,bus,byte,cache,caps lock,captcha,cd,cd rom,client,clip art,clip board,cloud computing,command,compile,compress,computer,computer program,configure,cookie,copy,cpu,cybercrime,cyberspace,dashboard,data,data mining,database,debug,decompress,delete,desktop,development,digital,disk,dns,document,domain,domain name,dot,dot matrix,download,drag,dvd,dynamic,email,emoticon,encrypt,encryption,enter,exabyte,faq,file,finder,firewall,firmware,flaming,flash,flash drive,floppy disk,flowchart,folder,font,format,frame,freeware,gigabyte,graphics,hack,hacker,hardware,home page,host,html,hyperlink,hypertext,icon,inbox,integer,interface,internet,ip address,iteration,java,joystick,junk mail,kernel,key,keyboard,keyword,laptop,laser printer,link,linux,log out,logic,login,lurking,macintosh,macro,mainframe,malware,media,memory,mirror,modem,monitor,motherboard,mouse,multimedia,net,network,node,notebook computer,offline,online,open source,operating system,option,output,page,password,paste,path,phishing,piracy,pirate,platform,plug in,podcast,pop up,portal,print,printer,privacy,process,program,programmer,protocol,queue,qwerty,ram,real time,reboot,resolution,restore,rom,root,router,runtime,save,scan,scanner,screen,screenshot,script,scroll,scroll bar,search engine,security,server,shareware,shell,shift,shift key,snapshot,social networking,software,sololearn,spam,spammer,spreadsheet,spyware,status bar,storage,supercomputer,surf,syntax,table,tag,teminal,template,terabyte,text editor,thread,toolbar,trash,trojan horse,typeface,undo,unix,upload,url,user,user interface,username,utility,version,virtual,virtual memory,virus,web,web host,webmaster,website,widget,wiki,window,windows,wireless,word processor,workstation,world wide web,worm,www,xml,zip'
    },
    words: null,
    guessed: [],
    init: function() {
        if(user.games['hangman'] === undefined) {
            user.games.hangman = {w: 0, l: 0, p: 0}
        }
        sys.setInputName('>')
        app.commandHandler([])
    },
    commandHandler: function(a) {
        if(app.words === null) {
            if(a.length == 1) {
                switch(a[0].toLowerCase()) {
                    case 'y':
                        user.games.hangman.p++
                        app.words = sys.rand(10) < 5 ? app.wordsList.computer : app.wordsList.default
                        app.words = app.words.split(',')
                        app.words = app.words[sys.rand(app.words.length) - 1]
                        sys.setInputName('Choose a letter:')
                        return app.commandHandler([])
                    case 'e':
                        app = cmd
                        sys.setInputName(user.name)
                        return sys.log(0, 0, ' ')
                }
            }
            cmd.cmd_cls()
            sys.log(0, 0, 'Welcome to Hangman!')
            sys.log(0, 0, ' ')
            sys.log(0, 0, 'In this game you will try to guess')
            sys.log(0, 0, 'the word before it\'s too late.')
            sys.log(0, 0, ' ')
            sys.log(0, 0, '   _______')
            sys.log(0, 0, '  |       |')
            sys.log(0, 0, '  |       0')
            sys.log(0, 0, '  |      /|\\')
            sys.log(0, 0, '  |       |')
            sys.log(0, 0, '  |      / \\')
            sys.log(0, 0, '  |     /   \\')
            sys.log(0, 0, '  |')
            sys.log(0, 0, '__|_____________')
            sys.log(0, 0, ' ')
            sys.log(0, 1, '§m[Y]§r - Start the game?', 2)
            sys.log(0, 1, '§m[E]§r - Leave the game?', 2)
            sys.log(0, 0, ' ')
            return
        }
        if(a.length == 1 && a[0].length == 1) {
            a = a[0].toLowerCase()
            if(app.guessed.indexOf(a) === -1) {
                app.guessed.push(a)
            }
        }
        var w = '', e = [], p = 0, l = 0
        cmd.cmd_cls()
        sys.log(0, 0, 'Your word look like this:')
        app.words.split('').forEach(function(i) {
            if(i === ' ') {
                w += '  '
            } else if(app.guessed.indexOf(i) !== -1) {
                w += i.toUpperCase() + ' '
                p++
            } else {
                w += '_ '
                l++
            }
        })
        sys.log(0, 0, w)
        app.guessed.forEach(function(i) {
            if(app.words.indexOf(i) === -1) {
                e.push(i.toUpperCase())
            }
        })
        sys.log(0, 0, '   ' + (e.length > 2 ? '_______' : ''))
        sys.log(0, 0, '  ' + (e.length > 1 ? '|' : '') + '       ' + (e.length > 3 ? '|' : ''))
        sys.log(0, 0, '  ' + (e.length > 1 ? '|' : '') + '       ' + (e.length > 4 ? '0' : ''))
        sys.log(0, 0, '  ' + (e.length > 1 ? '|' : '') + '      ' + (e.length > 6 ? '/' : ' ') + (e.length > 5 ? '|' : '') + (e.length > 7 ? '\\' : ''))
        sys.log(0, 0, '  ' + (e.length > 1 ? '|' : '') + '       ' + (e.length > 5 ? '|' : ''))
        sys.log(0, 0, '  ' + (e.length > 1 ? '|' : '') + '      ' + (e.length > 8 ? '/ ' : '') + (e.length > 9 ? '\\' : ''))
        sys.log(0, 0, '  ' + (e.length > 1 ? '|' : '') + '     ' + (e.length > 8 ? '/   ' : '') + (e.length > 9 ? '\\' : ''))
        sys.log(0, 0, '  ' + (e.length > 1 ? '|' : ''))
        sys.log(0, 0, (e.length > 0 ? '__' : '') + (e.length > 1 ? '|' : (e.length > 0 ? '_' : ' ')) + (e.length > 0 ? '_____________' : ''))
        sys.log(0, 0, ' ')
        sys.log(0, 0, 'Your points: ' + p)
        sys.log(0, 0, 'You\'ve entered (wrong): ' + e)
        sys.log(0, 0, ' ')
        if(l == 0 || e.length > 9) {
            sys.log(0, 0, '-------------------------------------')
            sys.log(0, 0, ' ')
            if(l === 0) {
                sys.log(0, 1, '§oGood job, you found the word!')
                user.games.hangman.w++
            } else {
                sys.log(0, 1, '§mSorry, you lost the game!')
                sys.log(0, 1, 'The word was §o' + app.words.toUpperCase() + '§r.')
                user.games.hangman.l++
            }
            sys.log(0, 0, ' ')
            sys.log(0, 1, '§m[Y]§r - Play again?')
            sys.log(0, 1, '§m[E]§r - Leave the game?')
            sys.log(0, 0, ' ')
            app.words = null
            app.guessed = []
            sys.setInputName('>')
        }
    }
}

var appLottery = {
    frame: 0,
    price: 7,
    player: [[], []],
    result: [[], []],
    logInput: true,
    logUser: true,
    user: '>',
    commands: {
        'about': 'About the Thomas Lottery.',
        'cls': 'Clear the screen.',
        'exit': 'Leave the game.',
        'help': 'This help screen.',
        'money': 'Show how much money you have on your account.',
        'start': 'Start the game of lottery.',
        'stats': 'Game stats.'
    },
    init: function() {
        if(user.games['lottery'] === undefined) {
            user.games.lottery = {w: 0, l: 0, p: 0}
        }
        sys.setInputName('>')
        app.commandHandler(['cls'])
    },
    commandHandler: function(a) {
        if(a.length === 0 || a[0] === '') {
            return
        }
        if(app.frame === 0) {
            switch(a[0].toLowerCase()) {
                case 'about':
                    sys.log(0, 1, '§o   ------------------ About --------------------')
                    sys.log(0, 0, '   This game is original written by me')
                    sys.log(0, 0, '   (Thomas Hj) in \'C\' language.')
                    sys.log(0, 0, ' ')
                    sys.log(0, 0, '   I hope you will enjoy my little silly')
                    sys.log(0, 0, '   lottery game.')
                    return sys.log(0, 0, ' ')
                case 'cls':
                    app.setHeader('Home')
                    sys.log(0, 1, ' Need any help? Just type §ohelp')
                    return sys.log(0, 0, ' ')
                case 'exit':
                    app = cmd
                    sys.setInputName(user.name)
                    return sys.log(0, 0, ' ')
                case '?':
                case 'help':
                    var i = 0
                    for(var c in app.commands) {
                        if(c.length > i) {
                            i = c.length
                        }
                    }
                    sys.log(0, 1, '§o   ------------------ Help --------------------')
                    for(var c in app.commands) {
                        sys.log(0, 1, '   ' + c + '§o' + sys.setSpaces(i + 4, c.length, app.commands[c]))
                    }
                    return sys.log(0, 0, ' ')
                case 'money':
                    return sys.log(0, 1, ' You\'ve §m' + sys.numberFormat(user.coins) + '§r coins.')
                case 's':
                case 'start':
                    app.frame = 1
                    app.logInput = false
                    app.player = [[], []]
                    app.result = [[], []]
                    app.user = '[Ball 1] >'
                    sys.setInputName(app.user)
                    app.setHeader('Lottery Ticket Setup')
                    sys.log(0, 1, '§o-----------------------------------------------')
                    sys.log(0, 0, ' ')
                    sys.log(0, 1, ' §oPlease writen in your favorit numbers.')
                    sys.log(0, 1, ' §oYou can select between 1 - 34.')
                    return sys.log(0, 0, ' ')
                case 'stats':
                    sys.log(0, 1, '§o   ------------------ Stats --------------------')
                    sys.log(0, 1, '   Game Played: §m' + user.games.lottery.p)
                    sys.log(0, 1, '   Total Win: §m' + user.games.lottery.w)
                    sys.log(0, 1, '   Total Lost: §m' + user.games.lottery.l)
                    return sys.log(0, 0, ' ')
                default:
                    sys.log(0, 0, 'Unknown command.')
            }
        } else if(app.frame === 1) {
            if(a[0] === 'r') {
                a = sys.rand(34)
            }
            a = parseInt(a)
            if(isNaN(a) || (a < 1 || a > 34)) {
                return sys.log(0, 1, '[GAME] §mSorry, you can only select between 1 - 34.')
            }
            if(app.player[0].indexOf(a) !== -1 || app.player[1].indexOf(a) !== -1) {
                return sys.log(0, 1, '[GAME] §mSorry, number \'' + a + '\' is already selected.')
            }
            if(app.player[0].length != 7) {
                sys.log(1, 1, '§m' + a)
                app.player[0].push(a)
                if(app.player[0].length != 7) {
                    app.user = '[Ball ' + (app.player[0].length + 1) + '] >'
                    return sys.setInputName(app.user)
                }
                app.user = '[Ball Other ' + (app.player[1].length + 1) + '] >'
                sys.setInputName(app.user)
            } else {
                sys.log(1, 1, '§m' + a)
                app.player[1].push(a)
                app.user = '[Ball Other ' + (app.player[1].length + 1) + '] >'
                sys.setInputName(app.user)
                if(app.player[1].length == 3) {
                    app.frame = 2
                    app.user = '>'
                    sys.setInputName(app.user)
                    app.setHeader('Lottery Ticket Result')
                    sys.log(0, 1, '§o-----------------------------------------------')
                    sys.log(0, 0, ' ')
                    app.displayTicket(app.player)
                    sys.log(0, 0, ' ')
                    sys.log(0, 1, '§o-----------------------------------------------')
                    sys.log(0, 0, ' ')
                    sys.log(0, 1, ' §oPrice for this ticket: §m' + app.price + '§o coins.')
                    sys.log(0, 0, ' ')
                    sys.log(0, 1, '§m[Y]§o - Buy and start the game.')
                    sys.log(0, 1, '§m[N]§o - New lottery ticket?')
                    sys.log(0, 1, '§m[E]§o - Go back to home page?')
                    sys.log(0, 0, ' ')
                }
            }
        } else if(app.frame === 2) {
            switch(a[0].toLowerCase()) {
                case 'y':
                    if(user.coins < app.price) {
                        return sys.log(0, 1, '[GAME] §mOh noo, look like you don\'t have the coins to buy this ticket...')
                    }
                    app.frame = 3
                    user.coins -= app.price
                    sys.setUserInput(false)
                    app.setHeader('Lottery Game')
                    sys.log(0, 1, '§o-----------------------------------------------')
                    sys.log(0, 0, ' ')
                    app.displayTicket(app.player)
                    sys.log(0, 0, ' ')
                    sys.log(0, 1, '§o-----------------------------------------------')
                    sys.log(0, 0, ' ')
                    var r, p = 0, n = [], i, s = 3
                    for(i = 1; i < 35; i++) {
                        n.push(i)
                    }
                    r = setInterval(function() {
                        switch(p) {
                            case 0:
                                if(s === 0) {
                                    sys.log(0, 1, '[GAME] §oLet the lottery begin!')
                                    sys.log(0, 0, ' ')
                                    p++
                                    break
                                }
                                sys.log(0, 1, '[GAME] §oStarting in §m' + s + ' §osec.')
                                s--
                                break
                            case 1:
                                s = n[sys.rand(n.length) - 1]
                                n.splice(n.indexOf(s), 1)
                                if(app.result[0].length < 7) {
                                    app.result[0].push(s)
                                    sys.log(0, 1, '[Ball ' + (app.result[0].length) + '] §m' + s)
                                    if(app.result[0].length == 7) {
                                        sys.log(0, 0, ' ')
                                    }
                                    break
                                }
                                app.result[1].push(s)
                                sys.log(0, 1, '[Ball Other ' + (app.result[1].length) + '] §m' + s)
                                if(app.result[1].length == 3) {
                                    sys.log(0, 0, ' ')
                                    sys.log(0, 1, '[GAME] §oLoading in the results...')
                                    p++
                                }
                                break
                            case 2:
                                clearInterval(r)
                                app.displayResult()
                                app.frame = 0
                                app.logInput = true
                                sys.setUserInput(true)
                                break
                        }
                    }, 1000)
                    return
                case 'n':
                    app.frame = 0
                    app.player = []
                    return app.commandHandler(['s'])
                case 'e':
                    app.frame = 0
                    app.logInput = true
                    return app.commandHandler(['cls'])
            }
        }
    },
    displayResult: function() {
        var w = sys.rand(10000000) + 1000000
        var g = [], r = { f: 0, s: 0 }
        var l = [], b = '§o'
        for(var i = 0; i < 7; i++) {
            g[6 - i] = Math.floor(w / (3 + Math.pow(7, i)))
            w -= g[6 - i]
        }
        app.result[0].sort(function(i, j) { return i - j })
        app.result[1].sort(function(i, j) { return i - j })
        app.result[0].forEach(function(n) {
            if(app.player[0].indexOf(n) !== -1) {
                r.f++
            }
        })
        app.result[1].forEach(function(n) {
            if(app.player[1].indexOf(n) !== -1) {
                r.s++
            }
        })
        l.push('§o-----------------------------------------------')
        l.push('§o Lottery               : Your Lottery Ticket')
        l.push('§o                       :')
        app.result[0].forEach(function(n) {
            b += ('  ' + n).slice(-3)
        })
        b += '  :'
        app.player[0].forEach(function(n) {
            b += app.setColor(app.result, n, 'k', 'm')
        })
        l.push(b)
        b = '§o            '
        app.result[1].forEach(function(n) {
            b += ('  ' + n).slice(-3)
        })
        b += '  :            '
        app.player[1].forEach(function(n) {
            b += app.setColor(app.result, n, 'm', 'k')
        })
        l.push(b, '                       §o:')
        l.push('§o-----------------------------------------------', ' ')
        l.push(app.setWinColorMore(r, 7, 1) + '                7 + 1     ' + sys.numberFormat(g[6]))
        l.push(app.setWinColorEqual(r, 7, 0) + '                7         ' + sys.numberFormat(g[5]))
        l.push(app.setWinColorMore(r, 6, 1) + '                6 + 1     ' + sys.numberFormat(g[4]))
        l.push(app.setWinColorEqual(r, 6, 0) + '                6         ' + sys.numberFormat(g[3]))
        l.push(app.setWinColorFirst(r, 5) + '                5         ' + sys.numberFormat(g[2]))
        l.push(app.setWinColorFirst(r, 4) + '                4         ' + sys.numberFormat(g[1]))
        l.push(app.setWinColorFirst(r, 3) + '                3         ' + sys.numberFormat(g[0]))
        l.push('§o-----------------------------------------------', ' ')
        if(r.f === 7 && r.s > 0) {
            l.push('[GAME] §oCongrats! You get§m 7 + 1§o correct!')
            l.push('[GAME] §k' + sys.numberFormat(g[6]) + '§o coins was added to your account.')
            user.coins += g[6]
            user.games.lottery.w++
        } else if(r.f === 7 && r.s === 0) {
            l.push('[GAME] §oCongrats! You get§m 7§o correct!')
            l.push('[GAME] §k' + sys.numberFormat(g[5]) + '§o coins was added to your account.')
            user.coins += g[5]
            user.games.lottery.w++
        } else if(r.f === 6 && r.s > 0) {
            l.push('[GAME] §oCongrats! You get§m 6 + 1§o correct!')
            l.push('[GAME] §k' + sys.numberFormat(g[4]) + '§o coins was added to your account.')
            user.coins += g[4]
            user.games.lottery.w++
        } else if(r.f === 6 && r.s === 0) {
            l.push('[GAME] §oCongrats! You get§m 6§o correct!')
            l.push('[GAME] §k' + sys.numberFormat(g[3]) + '§o coins was added to your account.')
            user.coins += g[3]
            user.games.lottery.w++
        } else if(r.f === 5) {
            l.push('[GAME] §oCongrats! You get§m 5§o correct!')
            l.push('[GAME] §k' + sys.numberFormat(g[2]) + '§o coins was added to your account.')
            user.coins += g[2]
            user.games.lottery.w++
        } else if(r.f === 4) {
            l.push('[GAME] §oCongrats! You get§m 4§o correct!')
            l.push('[GAME] §k' + sys.numberFormat(g[1]) + '§o coins was added to your account.')
            user.coins += g[1]
            user.games.lottery.w++
        } else if(r.f === 3) {
            l.push('[GAME] §oCongrats! You get§m 3§o correct!')
            l.push('[GAME] §k' + sys.numberFormat(g[0]) + '§o coins was added to your account.')
            user.coins += g[0]
            user.games.lottery.w++
        } else {
            l.push('[GAME] §oSorry, you get §m' + r.f + (r.s > 0 ? ' + ' + r.s : '') + ' §ocorrect.')
            l.push('[GAME] §oBetter luck next time.')
            user.games.lottery.l++
        }
        l.push(' ')
        app.setHeader('Lottery Result')
        l.forEach(function(i) {
            sys.log(0, 1, i)
        })
    },
    displayTicket: function(a) {
        a[0].sort(function(i, j) { return i - j })
        a[1].sort(function(i, j) { return i - j })
        var s = '§o'
        a[0].forEach(function(i) { s += ('  ' + i).slice(-3) })
        sys.log(0, 1, s)
        s = '§o            '
        a[1].forEach(function(i) { s += ('  ' + i).slice(-3) })
        sys.log(0, 1, s)
    },
    setWinColorMore: function(a, f, s) {
        return '§' + (a.f === f && a.s > s ? 'k' : 'o')
    },
    setWinColorEqual: function(a, f, s) {
        return '§' + (a.f === f && a.s === s ? 'k' : 'o')
    },
    setWinColorFirst: function(a, f) {
        return '§' + (a.f === f ? 'k' : 'o')
    },
    setColor: function(a, n, c0, c1) {
        return a[0].indexOf(n) !== -1 ? '§' + c0 + ('  ' + n).slice(-3) + '§o' : a[1].indexOf(n) !== -1 ? '§' + c1 + ('  ' + n).slice(-3) + '§o' : ('  ' + n).slice(-3)
    },
    setHeader: function(i) {
        cmd.cmd_cls()
        sys.log(0, 1, '§j-----------------------------------------------')
        sys.log(0, 1, sys.setSpaces(20, Math.floor(i.length / 2), '§j<<<§m ' + i + ' §j>>>'))
        sys.log(0, 0, ' ')
        sys.log(0, 1, ' Player: §m' + user.name + '§r!')
        sys.log(0, 1, ' You\'ve §m' + sys.numberFormat(user.coins) + '§r coins on you account.')
        sys.log(0, 0, ' ')
    }
}

var appTicTacToe = {
    board: null,
    lvl: 2,
    lvlName: ['Easy', 'Normal', 'Hard'],
    isPlayerTurn: true,
    winCheck: [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]],
    init: function() {
        if(user.games['ticTacToe'] === undefined) {
            user.games.ticTacToe = {w: 0, l: 0, d: 0, p: 0}
        }
        sys.setInputName('>')
        app.commandHandler([])
    },
    commandHandler: function(a) {
        if(app.board === null) {
            if(a.length > 0) {
                switch(a[0].toLowerCase()) {
                    case 'y':
                        if(a.length > 1 && !isNaN(a[1]) && (a[1] > 0 && a[1] < 4)) {
                            app.lvl = parseInt(a[1]) - 1
                        } else if(a.length > 1) {
                            return sys.log(0, 1, '[GAME] §mUsage: y <1-3> §i(1: Easy, 2: Normal, 3: Hard)')
                        }
                        user.games.ticTacToe.p++
                        app.board = [0, 1, 2, 3, 4, 5, 6, 7, 8]
                        if(app.lvl === 0) {
                            app.isPlayerTurn = sys.rand(100) <= 20
                        }
                        sys.setInputName('It\'s your turn:')
                        return app.rendreBoard('')
                    case 'e':
                        app = cmd
                        sys.setInputName(user.name)
                        return sys.log(0, 0, ' ')
                }
            }
            cmd.cmd_cls()
            sys.log(0, 0, 'Welcome to Tic-Tac-Toe.')
            sys.log(0, 0, ' ')
            sys.log(0, 0, 'In this game you will be playing against')
            sys.log(0, 0, 'computer, and you are mark as \'X\'.')
            sys.log(0, 0, ' ')
            sys.log(0, 1, '§hYou can change the difficulty by this command below.')
            sys.log(0, 1, '§hy <1-3> §i(Easy - Normal - Hard)')
            sys.log(0, 0, ' ')
            sys.log(0, 0, '         :   :')
            sys.log(0, 0, '       O : X : O')
            sys.log(0, 0, '      ---:---:---')
            sys.log(0, 0, '       X : O : X')
            sys.log(0, 0, '      ---:---:---')
            sys.log(0, 0, '       X : O : X')
            sys.log(0, 0, '         :   :')
            sys.log(0, 0, ' ')
            sys.log(0, 1, '§m[Y]§r - Start the game? §i[' + app.lvlName[app.lvl] + ']')
            sys.log(0, 1, '§m[E]§r - Leave the game?')
            return sys.log(0, 0, ' ')
        }
        app.rendreBoard(a[0])
    },
    comEasy: function(a) {
        return a[sys.rand(a.length) - 1]
    },
    comNormal: function() {
        var m = app.comHard(app.board, 'O', true)
        m.sort(function(a, b) { return b.pts - a.pts })
        if(sys.rand(100) <= 50) {
            return m[0].id
        }
        return m.length >= 2 ? m[1].id : m[0].id
    },
    comHard: function(b, w, c) {
        var s = app.getFreeSpot(b)
        if(app.isWin(b, 'X') !== null) {
            return { pts: -10 }
        } else if(app.isWin(b, 'O') !== null) {
            return { pts: 10 }
        } else if(s.length === 0) {
            return { pts: 0 }
        }
        var nums = []
        for(var i = 0; i < s.length; i++) {
            var num = {}
            num.id = b[s[i]]
            b[s[i]] = w
            num.pts = app.comHard(b, w === 'O' ? 'X' : 'O', false).pts
            b[s[i]] = num.id
            nums.push(num)
        }
        var m, i = w === 'O' ? -10000 : 10000
        for(var x = 0; x < nums.length; x++) {
            if(w === 'O' && nums[x].pts > i) {
                i = nums[x].pts
                m = x
            } else if(w === 'X' && nums[x].pts < i) {
                i = nums[x].pts
                m = x
            }
        }
        if(c) {
            return nums
        } else {
            return nums[m]
        }
    },
    getFreeSpot: function(b) {
        return b.filter(function(n) { return typeof n === 'number' })
    },
    isWin: function(b, p) {
        var c = b.reduce(function(a, e, i) {
            return e === p ? a.concat(i) : a
        }, [])
        for(var i in app.winCheck) {
            if(app.winCheck[i].every(function(e) {
                return c.indexOf(e) > -1
            })) {
                return p
            }
        }
        return null
    },
    rendreBoard: function(n) {
        var b = [], c = []
        if(n.length == 1) {
            n = parseInt(n)
            if(app.isPlayerTurn && !isNaN(n) && (n > 0 && n < 10) && app.board.indexOf(n - 1) !== -1) {
                app.board[n - 1] = 'X'
                app.isPlayerTurn = false
            }
        }
        var w = app.isWin(app.board, app.isPlayerTurn ? 'O' : 'X')
        for(var i = 0; i < app.board.length; i++) {
            b.push(isNaN(app.board[i]) ? app.board[i] : ' ')
            c.push(isNaN(app.board[i]) ? ' ' : i + 1)
        }
        app.board.forEach(function(x) {
            b.push(isNaN(x) ? x : ' ')
        })
        if(w === 'X') {
            user.games.ticTacToe.w++
        } else if(w === 'O') {
            user.games.ticTacToe.l++
        }
        cmd.cmd_cls()
        sys.log(0, 1, '      §oGame Board§j       :      §oHelp input', 2)
        sys.log(0, 1, '                       §j:', 2)
        sys.log(0, 1, '         :   :         §j:§i         :   :', 2)
        sys.log(0, 1, '       ' + b[0] + ' : ' + b[1] + ' : ' + b[2] + '       §j:§i       ' + c[0] + ' : ' + c[1] + ' : ' + c[2])
        sys.log(0, 1, '      ---:---:---      §j:§i      ---:---:---', 2)
        sys.log(0, 1, '       ' + b[3] + ' : ' + b[4] + ' : ' + b[5] + '       §j:§i       ' + c[3] + ' : ' + c[4] + ' : ' + c[5])
        sys.log(0, 1, '      ---:---:---      §j:§i      ---:---:---', 2)
        sys.log(0, 1, '       ' + b[6] + ' : ' + b[7] + ' : ' + b[8] + '       §j:§i       ' + c[6] + ' : ' + c[7] + ' : ' + c[8])
        sys.log(0, 1, '         :   :         §j:§i         :   :')
        sys.log(0, 1, '                       §j:')
        sys.log(0, 0, ' ')
        sys.log(0, 1, '§j----------------------------------------------')
        sys.log(0, 1, ' §mScore: §oYou §i[X] §k' + user.games.ticTacToe.w + '§o, Computer §i[O][' + app.lvlName[app.lvl] + '] §k' + user.games.ticTacToe.l + '§o.')
        sys.log(0, 1, '§j----------------------------------------------')
        sys.log(0, 0, ' ')
        if(w == null && app.getFreeSpot(app.board).length !== 0) {
            if(app.isPlayerTurn) {
                return sys.setUserInput(true)
            }
            sys.setUserInput(false)
            setTimeout(function() {
                switch(app.lvl) {
                    case 1:
                        n = app.comNormal()
                        break
                    case 2:
                        n = app.comHard(app.board, 'O', false).id
                        break
                    default:
                        n = app.comEasy(app.getFreeSpot(app.board))
                }
                app.board[n] = 'O'
                app.isPlayerTurn = true
                app.commandHandler([''])
            }, 1000)
            return
        }
        if(w === 'X') {
            sys.log(0, 1, '§oYou won the game!')
        } else if(w === 'O') {
            sys.log(0, 1, '§mComputer won the game!')
        } else {
            sys.log(0, 1, '§hDraw, no one won the game...')
            user.games.ticTacToe.d++
        }
        sys.log(0, 0, ' ')
        sys.log(0, 1, '§m[Y]§r - Play again? §i[' + app.lvlName[app.lvl] + ']')
        sys.log(0, 1, '§m[E]§r - Leave the game?')
        sys.log(0, 0, ' ')
        app.board = null
        app.isPlayerTurn = true
        sys.setInputName('>')
        sys.setUserInput(true)
    }
}

var appUNO = {
    aiPlayer: ['Aerwen', 'Celine', 'Elijah', 'Nataly', 'Nathan', 'Roland'],
    cardColor: ['k', 'j', 'm', 'o'],
    cardNumbers: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'S', 'R', '+2'],
    cardNonColor: ['C', '+4'],
    deck: [],
    deckBorad: [],
    displayHelp: false,
    gameAction: {
        bySkip: false,
        byDraw: false,
        card: [],
        isNext: false,
        isColorChange: false,
        isPlussCard: false,
        isSkip: false,
        plussCardFrom: null,
        plussCardPts: 0,
        direction: 1,
        whoTurn: 0
    },
    players: [],
    init: function() {
        if(user.games['uno'] === undefined) {
            user.games.uno = {w: 0, l: 0, p: 0}
        }
        sys.setInputName('>')
        app.commandHandler([])
    },
    commandHandler: function(a) {
        if(app.deck.length === 0) {
            if(a.length > 0) {
                switch(a[0].toLowerCase()) {
                    case 'y':
                        var ai = app.aiPlayer.slice()
                        app.players.push({ n: 'You', c: [] })
                        for(var i = 0; i < 3; i++) {
                            app.players.push({ n: ai.splice(sys.rand(ai.length) - 1, 1)[0], c: [] })
                        }
                        app.cardColor.forEach(function(c) {
                            app.cardNumbers.forEach(function(n) {
                                if(n !== '0') {
                                    app.deck.push({ c: n, o: '§' + c + n + '§r', f: c + (n === '+2' ? 'x' : '') + n.toLowerCase() })
                                }
                                app.deck.push({ c: n, o: '§' + c + n + '§r', f: c + (n === '+2' ? 'x' : '') + n.toLowerCase() })
                            })
                        })
                        app.cardNonColor.forEach(function(n) {
                            for(var i = 0; i < 4; i++) {
                                app.deck.push({ c: n, o: '§h' + n + '§r', f: 'x' + (n === '+4' ? 'x' : '' ) + n.toLowerCase() })
                            }
                        })
                        app.deck = sys.shuffle(app.deck)
                        for(var i = 0; i < 7; i++) {
                            app.players.forEach(function(p) {
                                p.c.push(app.deck.shift())
                                if(i == 6) {
                                    app.sort(p.c)
                                }
                            })
                        }
                        for(var i = 0; i < app.deck.length; i++) {
                            if(app.deck[i].c !== '+4') {
                                app.deckBorad.push(app.deck.splice(i, 1)[0])
                                app.deck.push(app.deckBorad[0])
                                app.updateAction(false)
                                app.gameAction.plussCardFrom = null
                                break
                            }
                        }
                        sys.setUserInput(false)
                        return app.commandHandler([])
                    case 'h':
                        app.displayHelp = true
                        break 
                    case 'e':
                        app = cmd
                        sys.setInputName(user.name)
                        return sys.log(0, 0, ' ')
                }
            }
            cmd.cmd_cls()
            if(app.displayHelp) {
                app.displayHelp = false
                sys.log(0, 0, 'Card Information')
                sys.log(0, 0, '================')
                sys.log(0, 0, ' ')
                sys.log(0, 0, '/---\\')
                sys.log(0, 1, '|§oS§r  |')
                sys.log(0, 0, '|   |')
                sys.log(0, 0, '|   |')
                sys.log(0, 0, '\\---/')
                sys.log(0, 0, 'This card will skip the next player.')
                sys.log(0, 0, ' ')
                sys.log(0, 0, '/---\\')
                sys.log(0, 1, '|§oR§r  |')
                sys.log(0, 0, '|   |')
                sys.log(0, 0, '|   |')
                sys.log(0, 0, '\\---/')
                sys.log(0, 0, 'This card will change the direction of the game.')
                sys.log(0, 0, ' ')
                sys.log(0, 0, '/---\\ /---\\')
                sys.log(0, 1, '|§hC§r  | |§h+4§r |')
                sys.log(0, 0, '|   | |   |')
                sys.log(0, 0, '|   | |   |')
                sys.log(0, 0, '\\---/ \\---/')
                sys.log(0, 0, 'This is a color change card.')
                sys.log(0, 0, ' ')
                sys.log(0, 0, '/---\\ /---\\')
                sys.log(0, 1, '|§o+2§r | |§h+4§r |')
                sys.log(0, 0, '|   | |   |')
                sys.log(0, 0, '|   | |   |')
                sys.log(0, 0, '\\---/ \\---/')
                sys.log(0, 0, 'Those card will stack or give next player some more cards.')
                sys.log(0, 0, ' ')
                sys.log(0, 0, ' ')
                sys.log(0, 0, 'Commands Information')
                sys.log(0, 0, '====================')
                sys.log(0, 0, ' ')
                sys.log(0, 0, 'So you\'re probably wondering how to play this game? Well all you need to do it to type like this.')
                sys.log(0, 0, ' ')
                sys.log(0, 1, 'g 7   §i(green 7)')
                sys.log(0, 1, 'y 7   §i(yellow 7)')
                sys.log(0, 1, 'b s   §i(blue skip)')
                sys.log(0, 1, 'r r   §i(red resvers)')
                sys.log(0, 0, ' ')
                sys.log(0, 1, 'draw  §i(Draw a card)')
                sys.log(0, 1, 'c     §i(Color change)')
                sys.log(0, 1, '+4    §i(Color change with +4)')
                sys.log(0, 0, ' ')
                sys.log(0, 1, 'r     §i(color change to red card)')
                sys.log(0, 1, 'g     §i(color change to green card)')
                sys.log(0, 1, 'b     §i(color change to blue card)')
                sys.log(0, 1, 'y     §i(color change to yellow card)')
                sys.log(0, 0, ' ')
                return sys.log(0, 1, '§hPress enter to continue.')
            }
            sys.log(0, 0, 'Welcome to UNO!')
            sys.log(0, 0, ' ')
            sys.log(0, 0, 'In this game you\'re playing against computers.')
            sys.log(0, 0, 'Good luck.')
            sys.log(0, 0, ' ')
            sys.log(0, 0, '  /--/--/--/--/---\\')
            sys.log(0, 1, '  |§j0§r |§k3§r |§m7§r |§o2+§r|§h+4§r |')
            sys.log(0, 0, '  |  |  |  |  |   |')
            sys.log(0, 0, '  |  |  |  |  |   |')
            sys.log(0, 0, '  \\--\\--\\--\\--\\---/')
            sys.log(0, 0, ' ')
            sys.log(0, 1, '§m[Y]§r - Start the game?')
            sys.log(0, 1, '§m[H]§r - How to play this games?')
            sys.log(0, 1, '§m[E]§r - Leave the game?')
            return sys.log(0, 0, ' ')
        }
        app.gameCommand(a)
        app.rendreBoard()
        app.gamePlayAction()
    },
    gameCommand: function(a) {
        if(a.length < 1) {
            return
        }
        sys.setUserInput(false)
        if(app.gameAction.byDraw) {
            switch(a[0].toLowerCase()) {
                case 'y':
                    app.playCard(app.gameAction.card.c)
                case 'n':
                    app.gameAction.card = []
                    app.gameAction.byDraw = false
                    if(!app.gameAction.isColorChange) {
                        app.gameAction.isNext = true
                    }
                    return
            }
        }
        if(app.gameAction.isColorChange) {
            switch(a[0].toLowerCase()) {
                case 'b':
                    return app.setNewColor('§j')
                case 'g':
                    return app.setNewColor('§k')
                case 'r':
                    return app.setNewColor('§m')
                case 'y':
                    return app.setNewColor('§o')
            }
            return
        } else if(a.length === 1) {
            switch(a[0].toLowerCase()) {
                case '+4':
                    return app.playCard('xx+4')
                case 'c':
                    return app.playCard('xc')
                case 'draw':
                    app.drawCard(app.gameAction.isPlussCard ? app.gameAction.plussCardPts : 1)
                    if(!app.gameAction.isPlussCard) {
                        app.gameAction.byDraw = true
                    } else {
                        app.gameAction.isNext = true
                    }
                    app.gameAction.isPlussCard = false
                    app.gameAction.plussCardPts = 0
                    return
            }
        } else if(a.length === 2) {
            if(a[1] == '+2') {
                a[1] = 'x+2'
            }
            switch(a[0].toLowerCase()) {
                case 'b':
                    return app.playCard('j' + a[1].toLowerCase())
                case 'g':
                    return app.playCard('k' + a[1].toLowerCase())
                case 'r':
                    return app.playCard('m' + a[1].toLowerCase())
                case 'y':
                    return app.playCard('o' + a[1].toLowerCase())
            }
        }
    },
    ai: function() {
        var a = app.players[app.gameAction.whoTurn]
        var d = app.deckBorad[app.deckBorad.length - 1]
        if(app.gameAction.isColorChange) {
            return app.aiColorSelection()
        } else if(app.gameAction.byDraw) {
            return app.getCard(app.gameAction.card.c) === null ? 'n' : 'y'
        } else if(app.gameAction.isPlussCard) {
            var c = a.c[app.getCard(d.c)]
            return d.c === '+4' ? '+4' : app.getCardColor(c).substr(0, 1).toLowerCase() + ' ' + c.c
        }
        var s = []
        a.c.forEach(function(x) {
            if(app.getCard(x.f) !== null) {
                s.push(x)
            }
        })
        if(s.length !== 0) {
            s = sys.rand(100) < 65 ? s[0] : s[sys.rand(s.length) - 1]
            if(s.c === 'C' || s.c === '+4') {
                return s.c
            }
            return app.getCardColor(s).substr(0, 1).toLowerCase() + ' ' + s.c
        } 
        return 'draw'
    },
    aiColorSelection: function() {
        var s = [], i = -1, v = 'y'
        app.players[app.gameAction.whoTurn].c.forEach(function(c) {
            if(c.f.substr(0, 1) !== 'x') {
                if(s[c.f.substr(0, 1)] === undefined) {
                    s[c.f.substr(0, 1)] = 1
                } else {
                    s[c.f.substr(0, 1)] += 1
                }
            }
        })
        for(var k in s) {
            if(s[k] > i) {
                i = s[k]
                v = k
            }
        }
        switch(v) {
            case 'j':
                return 'b'
            case 'k':
                return 'g'
            case 'm':
                return 'r'
            default:
                return 'y'
        }
    },
    gamePlayAction: function() {
        if(app.isWin() !== -1) {
            var winner = app.isWin()
            sys.log(0, 1, '§j--------------------------------------')
            if(winner === 0) {
                sys.log(0, 1, ' §oCongrulation! You won the game.')
                user.games.uno.w++
            } else {
                sys.log(0, 1, ' §mSorry you lost the game.')
                sys.log(0, 1, ' Ai §o' + app.players[winner].n + '§r won the game.')
                user.games.uno.l++
            }
            sys.log(0, 1, '§j--------------------------------------')
            sys.log(0, 0, ' ')
            sys.log(0, 1, '§m[Y]§r - Play again?')
            sys.log(0, 1, '§m[E]§r - Leave the game?')
            sys.log(0, 0, ' ')
            sys.setInputName('>')
            sys.setUserInput(true)
            app.deck = []
            app.deckBorad = []
            app.players = []
            app.gameAction = { bySkip: false, isNext: false, isColorChange: false, isPlussCard: false, isSkip: false, plussCardFrom: null, plussCardPts: 0, direction: 1, whoTurn: 0 }
            return
        } else if(app.gameAction.isNext) {
            app.gameAction.bySkip = false
            app.gameAction.isNext = false
            if(app.gameAction.direction > 0) {
                app.gameAction.whoTurn = app.gameAction.whoTurn === 3 ? 0 : app.gameAction.whoTurn + 1
            } else {
                app.gameAction.whoTurn = app.gameAction.whoTurn === 0 ? 3 : app.gameAction.whoTurn - 1
            }
            return app.wait(1000)
        } else if(app.gameAction.isSkip) {
            app.gameAction.bySkip = true
            app.gameAction.isNext = true
            app.gameAction.isSkip = false
            return app.wait(0)
        } else if(app.gameAction.isPlussCard && !app.gameAction.isColorChange) {
            var c = app.getCard(app.deckBorad[app.deckBorad.length -1].c)
            if(c == null) {
                app.gameAction.bySkip = true
                return app.commandHandler(['draw'])
            }
        }
        if(app.gameAction.whoTurn !== 0) {
            setTimeout(function() {
                app.commandHandler(app.ai().split(' '))
            }, 1000)
            return
        }
        sys.setInputName('Pick a card:')
        if(app.gameAction.isColorChange) {
            sys.setInputName('What color do you want to change to?')
        } else if(app.gameAction.byDraw) {
            if(app.getCard(app.gameAction.card.c) === null) {
                app.gameAction.card = []
                app.gameAction.byDraw = false
                app.gameAction.isNext = true
                return app.wait(0)
            } else {
                sys.setInputName('Play ' + app.getCardInfo(app.gameAction.card) + ' card?')
            }
        }
        sys.setUserInput(true)
    },
    displayCards: function(d) {
        if(d.length === 0) {
            return [' ', ' ', ' ', ' ', ' ']
        }
        var l = [], x = 0
        var i = d.length > 15 ? 15 : d.length
        l[x++] = sys.newArray(i, '/--').join('') + '-\\'
        for(var j = 0; j < Math.ceil(d.length / 15); j++) {
            if(j > 0) {
                l[x++] = sys.newArray(i, '/--').join('') + '-\\'
            }
            for(var c = 0; c < i; c++) {
                if(d[j * 15 + c] == undefined) {
                    break
                }
                if(l[x] === undefined) {
                    l[x] = ''
                }
                l[x] += '|' + d[j * 15 + c].o + (d[j * 15 + c].c.length == 2 ? '' : ' ')
            }
            if(i == 15 && c < 15) {
                l[x] += sys.newArray(i - c, '|  ').join('')
            }
            l[x++] += ' |'
        }
        l[x++] = sys.newArray(i, '|  ').join('') + ' |'
        l[x++] = sys.newArray(i, '|  ').join('') + ' |'
        l[x++] = sys.newArray(i, '\\--').join('') + '-/'
        return l
    },
    drawCard: function(n) {
        for(var i = 0; i < n; i++) {
            if(app.deck.length === 0) {
                break
            }
            app.gameAction.card = app.deck.shift()
            app.players[app.gameAction.whoTurn].c.push(app.gameAction.card)
        }
        app.sort(app.players[app.gameAction.whoTurn].c)
    },
    isWin: function() {
        for(var i = 0; i < app.players.length; i++) {
            if(app.players[i].c.length === 0) {
                return i
            }
        }
        return -1
    },
    getCard: function(s) {
        var d = app.deckBorad[app.deckBorad.length - 1]
        var c = null
        var p = app.players[app.gameAction.whoTurn]
        for(var i = 0; i < p.c.length; i++) {
            if(p.c[i].f === s) {
                c = p.c[i]
                s = i
                break
            }
        }
        if(c === null) {
            for(var i = 0; i < p.c.length; i++) {
                if(p.c[i].c === s) {
                    c = p.c[i]
                    s = i
                    break
                }
            }
        }
        if(c !== null && app.gameAction.isPlussCard) {
            if(d.c === c.c) {
                return s
            }
            return null
        } else if(c !== null && (d.o.indexOf(c.o.substr(0, 2), 0) === 0 || d.c === c.c || c.c === '+4' || c.c === 'C')) {
            return s
        }
        return null
    },
    getCardColor: function(c) {
        switch(c.f.substr(0, 1)) {
            case 'j':
                return 'Blue'
            case 'k':
                return 'Green'
            case 'm':
                return 'Red'
            case 'o':
                return 'Yellow'
        }
    },
    getCardInfo: function(c) {
        switch(c.c) {
            case 'C':
                return 'Color Change'
            case '+4':
                return '+4'
            case 'R':
                return app.getCardColor(c) + ' Revurse'
            case 'S':
                return app.getCardColor(c) + ' Skip'
            case '+2':
                return app.getCardColor(c) + ' +2'
            default:
                return app.getCardColor(c) + ' ' + c.c
        }
    },
    rendreBoard: function() {
        var s = app.gameAction.bySkip
        var i = app.gameAction.whoTurn;
        var p0 = app.players[0], p1 = app.players[1]
        var p2 = app.players[2], p3 = app.players[3]
        var d = app.displayCards(app.deckBorad)
        cmd.cmd_cls()
        sys.log(0, 1, (i === 2 ? (s ? '§m' : '§o') : '') + sys.setSpaces(28, 6 + ('' + p2.c.length).length, p2.n + ' §h[' + p2.c.length + ']'))
        sys.log(0, 0, ' ')
        sys.log(0, 1, sys.setSpaces(22, 0, '§i ' + (app.gameAction.direction > 0 ? '-->' : '<--')))
        sys.log(0, 0, sys.setSpaces(24, Math.floor(d[0].length / 2), d[0]))
        sys.log(0, 1, sys.setSpaces(24, Math.floor(d[0].length / 2), d[1]))
        sys.log(0, 1, '§h[' + p1.c.length + ']§r' + sys.setSpaces(22 - ('' + p1.c.length).length, Math.floor(d[0].length / 2), d[2]) + sys.setSpaces(17, app.deckBorad.length, '§h[' + p3.c.length + ']'))
        sys.log(0, 1, (i === 1 ? (s ? '§m' : '§o') : '') + p1.n + '§r' + sys.setSpaces(18, Math.floor(d[0].length / 2), d[3]) + sys.setSpaces(17, app.deckBorad.length, (i === 3 ? (s ? '§m' : '§o') : '') + p3.n))
        sys.log(0, 0, sys.setSpaces(24, Math.floor(d[0].length / 2), d[4]))
        sys.log(0, 1, sys.setSpaces(22, 0, '§i ' + (app.gameAction.direction < 0 ? '-->' : '<--')))
        sys.log(0, 0, ' ')
        sys.log(0, 1, (i === 0 ? (s ? '§m' : '§o') : '') + sys.setSpaces(28, 5 + ('' + p0.c.length).length, p0.n + ' §h[' + p0.c.length + ']'))
        d = app.displayCards(p0.c)
        d.forEach(function(e) {
            if(p0.c.length > 15) {
                sys.log(0, 1, e)
            } else {
                sys.log(0, 1, sys.setSpaces(24, Math.floor(((3 * p0.c.length) + 2) / 2), e))
            }
        })
        sys.log(0, 0, ' ')
    },
    playCard: function(s) {
        s = app.getCard(s)
        if(s == null) {
            return
        }
        var c = app.players[app.gameAction.whoTurn].c.splice(s, 1)[0]
        app.deck.push(c)
        app.deckBorad.push(c)
        if(app.deckBorad.length > 3) {
            app.deckBorad.shift()
        }
        app.updateAction(true)
    },
    setNewColor: function(e) {
        var c = app.deckBorad[app.deckBorad.length - 1]
        c.o = e + c.c + '§r'
        app.gameAction.isColorChange = false
        if(app.deckBorad.length !== 1) {
            app.gameAction.isNext = true
        }
    },
    sort: function(d) {
        return d.sort(function(a, b) { return a.f > b.f ? 1 : -1 })
    },
    updateAction: function(b) {
        var c = app.deckBorad[app.deckBorad.length - 1]
        switch(c.c) {
            case '+2':
                app.gameAction.isPlussCard = true
                app.gameAction.plussCardPts += 2
                break
            case '+4':
                app.gameAction.isPlussCard = true
                app.gameAction.plussCardPts += 4
            case 'C':
                app.gameAction.isColorChange = true
                break
            case 'R':
                app.gameAction.direction = app.gameAction.direction === 1 ? -1 : 1
                break
            case 'S':
                app.gameAction.isSkip = true
                break
        }
        app.gameAction.isNext = app.gameAction.isColorChange ? false : b
    },
    wait: function(n) {
        setTimeout(function() {
            app.commandHandler([])
        }, n)
    }
}

window.onload = function() {
    sys.onPhone = navigator.userAgent.match(/Mobile/i) != null ? true : false
    app = cmd
    ui_input.onsubmit = function() {
        if(app.logInput) {
            sys.log(1, 0, this.command.value)
        }
        app.commandHandler(this.command.value.split(' '))
        this.command.value = ''
        ui_value.innerText = ''
        sys.io.ix = 0
        sys.io.createOutput(0, '')
        return false
    }

    ui_input.command.onblur = function() {
        setTimeout(function() {
            ui_input.command.focus()
        }, 1)
    }

    ui_input.command.oninput = function() {
        sys.io.createOutput(0, this.value)
        scrollTo(0, document.body.scrollHeight)
    }

    if(!sys.onPhone) {
        sys.initEvent()
    }

    sys.init()
    ui_input.command.focus()
}
// There is nothing more here, sowwy.









/*
 *> Coded by Thomas Hj
 *> 20.11.2020
 *> 0.77
 * 
 */

 let menuObj

 // User profile storage.
 const user = {
     name: 'Thomas Hj',
     title: 'Web / Java developer',
     tagName: 'DEV',
     xp: 11427,
     db: {
         courses: [
             ['Angular + NestJS', 0,  45,    0,          0,        ''],
             ['React + Redux',    0,  23,    0,          0,        ''],
             ['DS with Python',   3,  35,   29,          0,        ''],
             ['Machine Learning', 0,  48,    0,          0,        ''],
             ['C',                46, 46,  259, 1541894400,     'com'],
             ['C++',              80, 80,  411, 1496102400,     'com'],
             ['C#',               72, 72,  348, 1496102400,     'com'],
             ['Swift 4',          53, 53,  273, 1496102400,     'app'],
             ['Ruby',             57, 57,  294, 1496016000,     'wea'],
             ['jQuery',           26, 26,  168, 1483315200,     'wfd'],
             ['Python 3',         94, 94,  400, 1481760000,     'wea'],
             ['Java',             65, 65,  376, 1479945600, 'com wea'],
             ['SQL',              27, 27,  176, 1479340800,     'bwd'],
             ['PHP',              51, 51,  282, 1479340800,     'bwd'],
             ['CSS',              76, 76,  389, 1479254400,     'wfd'],
             ['HTML',             44, 44,  257, 1479254400,     'wfd'],
             ['JavaScript',       59, 59, 1868, 1500595200,     'wfd']
         ],
         codes: [
             ['My Page',                                                'web',  0, 1605830400,             '', 'SwA5gaC',     ''],
             ['Gradient Animation',                                     'web',  0, 1552780800, 'WRR0cApbve1q', 'swvScme',     ''],
             ['#GoDataGo',                                              'web',  0, 1552608000, 'Wqae846YBuON', 'aO2Khzj',     ''],
             ['Python while loop (Animation)',                          'web',  0, 1552262400, 'WZAL7AWXfazp', 'HEhxNOj',     ''],
             ['Movie Countdown',                                        'web',  0, 1543449600, 'W8FuZD7OCSk4', 'Dbhs4kP',     ''],
             ['Thomas Hj - Terminal (6 Games)',                         'web',  0, 1542153600, 'W6J2oSwjgf1S', 'GXX3tVH',     ''],
             ['JS-Filters: For Loop, ForEach, Filter & Arrow function', 'web',  0, 1518307200, 'WGv556ERc56U', 'NJCyLKA', '#fff'],
             ['3D Cube v2',                                             'web',  0, 1506470400, 'W1kO5W2haUff', 'ENOHxJY', '#fff'],
             ['Shuffle Text',                                           'web',  0, 1506124800, 'WEIYt2spCVr5', '4F6ff4n',     ''],
             ['Spawn Text Characters (Mini Game)',                      'web',  0, 1505001600, 'WXbrLAGjrFac', '4A8cw8s',     ''],
             ['Rainbow (Text-Shadow)',                                  'web',  0, 1503878400, 'W7niieql94eJ', 'r3I9QMl',     ''],
             ['JavaScript - Button Slide',                              'web',  0, 1503619200, 'WtwcBJjLI7Rv', 'RpiXROp',     ''],
             ['Text-Shadow',                                            'web',  0, 1503532800, 'WM537MOIH4Ip', '9Rdguqw',     ''],
             ['Analog Clock - Intro Animation (Original)',              'web',  0, 1498953600, 'W9NRGxeDd3i6', 'rsvPM2H',     ''],
             ['Text Digital Clock',                                     'web',  0, 1498867200, 'WmFpZ7MGiN1A', 'svp1SJM',     ''],
             ['CSS3: Linear-Gradient Animation',                        'web',  0, 1498262400, 'W0pByMYG2PPL', 'wyCua1x',     ''],
             ['Thomas Hj - Code List',                                  'web',  0, 1497484800, 'WUlqWFpxoh6I', 'IOQnATh',     ''],
             ['IPv4 Subnet Calculator',                                 'web',  0, 1497052800,             '', '6NdeX3g',     ''],
             ['Text-based Clock',                                       'web',  0, 1496880000, 'WA1xw7W1SaXm', 'AsDp4nj',     ''],
             ['Blinking Text',                                          'web',  0, 1492646400, 'WYvDN0aVce0a', 'wRYaBh5', '#fff'],
             ['Zelda - Ocarina of Time - Master Sword',                 'web',  0, 1486080000, 'WXwM7TXuaPwS', 'r52n0QD',     ''],
             ['Javascript Date -> Get Methods',                         'web',  0, 1483401600, 'Wkpmg7y9xHoz', 'MgYqG0b', '#fff'],
             ['Merry Christmas',                                        'web',  0, 1481500800, 'WBsNTPTDCRo7', 'nxUb2oK',     ''],
             ['Vibrate',                                                'web',  0, 1481068801, 'WWfy1FSZ7pM0', 'Pj2z2Ay', '#fff'],
             ['Minecraft Block',                                        'web',  0, 1481068800, 'WbiYyJSH0VX7', 'SnteERH', '#ccc'],
             ['LED Board',                                              'web',  0, 1480118400, 'WnID9ak7ZNJ1', 'hppINsn',     ''],
             ['XML to Text',                                            'web',  0, 1480118400, 'WJYGO1c1dQaw', 'Uge1KWg', '#fff'],
             ['Battery',                                                'web',  0, 1480032000, 'W3B0T9w6S142', 'nHBwyI9', '#fff'],
             ['List of Unicode characters',                             'web',  0, 1479686401, 'Wr5uQn2OZh74', 'tY3nKB7',     ''],
             ['Convert letter to Numeral System',                       'web',  0, 1479686400, 'WCue37iVpE2f', 'mugP5k4',     ''],
             ['Different hash algorithm in PHP',                        'php',  0, 1479427200, 'wYLAv41iZVF9', 'QRcfWTU',     ''],
             ['Chess Clock',                                            'web',  0, 1479168000, 'WBBC4dpYZs3y', 'Sk4js6r',     ''],
             ['Loading Animation',                                      'web',  0, 1478908800, 'WrFmru5PQ338', 'nVrGEHa',     ''],
             ['!Show All Variables / Functions in Javascript',          'web',  0, 1478563200,             '', '3lf6hM0',     ''],
             ['Convert Text to Binary',                                 'web',  0, 1478217600, 'Wq92JCYyr735', 'OHjxjJO', '#fff'],
             ['Terminal',                                               'web',  0, 1478044800, 'W9ggJwNFl88v', 'zxCCKYG',     ''],
             ['Bubble Level (Only works for phone user)',               'web',  0, 1477958400,             '', 'vizo1cw',     ''],
             ['Hangman (Game)',                                         'web',  0, 1477872000, 'WyyBylG1NvdU', 'PPxzqXe', '#fff'],
             ['3D Cube',                                                'web',  0, 1477699200, 'WFn79u7U1ckX', '6MOaQjE', '#fff'],
             ['Online / Offline Event',                                 'web',  0, 1477612802, 'WR2qwBY7j9p6', 'vP0tx2b',     ''],
             ['Pointless Button',                                       'web',  0, 1477612801, 'WneUQspspCn8', 'SCPQ7s2', '#fff'],
             ['Moving Block By Phone Movement',                         'web',  0, 1477612800,             '', 'CrLq8zx', '#fff'],
             ['Clubs',                                                  'web',  0, 1477526401, 'WUCHMnrdKD03', 'NgdT7QA', '#fff'],
             ['Spades',                                                 'web',  0, 1477526400, 'WFtYMucNBcuG', 'U0Lpraa', '#fff'],
             ['Country Flags',                                          'web',  0, 1477180800, 'WQkX0T3VrVi3', '3irODfu', '#fff'],
             ['Card Spinner (Heart | Diamond) (Loader)',                'web',  0, 1477008001, 'WSj4116dTAzU', 'oOBws9C',     ''],
             ['Card Spinner (Heart)',                                   'web',  0, 1477008000, 'WgtJ4ue187mN', 'SP5gnow',     ''],
             ['Happy Halloween!',                                       'web',  0, 1476835200, 'W8NUszbBvrJw', 'JCK4pGq',     ''],
             ['Simple Analog Clock',                                    'web',  0, 1476748801, 'WeIu905urn4Q', 'nma5I1s',     ''],
             ['Simple Calendar',                                        'web',  0, 1476748800, 'WY1yFJYLQsya', 'dRqzgoK',     ''],
             ['Calculator',                                             'web',  0, 1476576000, 'WxRbhos0KLHI', 'GMcJTPX',     ''],
             ['!Heart > Broken Heart',                                  'web',  0, 1476489601,             '', 'vfZHYBz',     ''],
             ['Heart',                                                  'web',  0, 1476489600, 'W76Jxj27m86U', 'B3RGywm',     ''],
             ['Binary Clock v2',                                        'web',  0, 1476403200, 'W2w5E3WA5uMf', 'AwsdoBu',     ''],
             ['How Secure Is My Password',                              'web',  0, 1476230400, 'W86RxPNJMfI7', 'fCZE2Lg',     ''],
             ['Random Background Color',                                'web',  0, 1476057600, 'W2a5IM1VovIp', '8k7rwtF',     ''],
             ['Math Test',                                              'web',  0, 1475884800, 'WkPRLklZGA5N', 'oG5Y5i8',     ''],
             ['Stop Watch',                                             'web',  0, 1475798401, 'WvI7zXux8fRV', '4G4f3xH', '#fff'],
             ['Base64 - Encode / Decode',                               'web',  0, 1475798400, 'Wj5iAHT9NUNv', 'vROo4u7', '#fff'],
             ['Dj Launchpad',                                           'web',  0, 1475712000, 'WtbxUOxVTq1f', '1LoKyY8',     ''],
             ['Pokéball',                                               'web',  0, 1475539200, 'W6sL3zo5yY68', 'y7iek3e', '#fff'],
             ['Code Generator',                                         'web',  0, 1475452801, 'WM4UzTf0PlD7', 'D9ot45a',     ''],
             ['Password Generator',                                     'web',  0, 1475452800, 'W7STLYiPdJ4q', 'sTvHhPG',     ''],
             ['Notepad Note',                                           'web',  0, 1475280000, 'W2CXFYL61ykl', 'CWOIzST', '#fff'],
             ['Analog Clock (CSS)',                                     'web',  0, 1475193602, 'W5skwVZ6A1Wu', 'vdTzdhI',     ''],
             ['Traffic Light',                                          'web', 10, 1475193601, 'WsMPnVsbdeSq', '7dvQEjS',     ''],
             ['Binary Clock',                                           'web', 21, 1475193600, 'Wp8K12LEcpbw', 'TDPeNup',     ''],
             ['Calendar',                                               'web', 15, 1475107201, 'WBlPTfQ2hE77', 'unnpU6t',     ''],
             ['Digital Clock',                                          'web', 29, 1475107200, 'WIXCX7brmxFA', 'x1nVC9e',     '']
         ]
     }
 }
 
 // SoloLearn functions.
 const sololearn = {
     levels: [
         0, 50, 150, 300, 500, 1000, 2000, 3000, 4000, 
         5000, 6500, 8000, 10000, 13000, 15000, 20000, 
         100000, 500000, 750000, 1000000
     ],
     getLevelStatus: (num) => {
         let lvl = -1
         let progress = 0
         
         for(let i = 0; i < sololearn.levels.length; i++) {
             if(num < sololearn.levels[i]) {
                 lvl = i
                 break;
             }
         }
         
         if(lvl === -1) {
             lvl = sololearn.levels.length
             progress = 100
         } else {
             let min = sololearn.levels[lvl - 1]
             let max = sololearn.levels[lvl]
             progress = (num - min) * 100 / (max - min)
         }
         
         return {lvl: lvl, progress: progress}
     }
 }
 
 // System function.
 const sys = {
     buildCodes: (data, page, title, filter, limit, pageNr) => {
         data.forEach(e => {
             let el1 = $.new('div')
             let el2 = $.new('div')
             let el3 = $.new('div')
             let sp1 = $.new('span')
             let sp2 = $.new('span')
             
             el1.className = 'code'
             el2.className = 'code-bg'
             el2.style.backgroundColor = e[6] === '' ? '#000' : e[6]
             el2.style.backgroundImage = 'url(' + lib.imgur(e[5]) + ')'
             el3.className = 'code-label'
             sp2.className = 'code-tag'
             sp1.innerText = e[0]
             sp2.innerText = e[1]
             
             el3.appendChild(sp1)
             el3.appendChild(sp2)
             el1.appendChild(el2)
             el1.appendChild(el3)
             uPage.appendChild(el1)
         })
         if(pageNr === undefined) {
             return
         }
         let el1 = $.new('div')
         el1.className = 'page-index'
         if(pageNr > 0) {
             let sp1 = $.new('span')
             sp1.onclick = function() {
                 sys.pageLoad(page, filter, limit, title, pageNr - 1)
             }
             sp1.innerText = 'Previous Page'
             el1.appendChild(sp1)
         }
         if(sys.getCodes(filter, 0).length > limit * (pageNr + 1)) {
             let sp1 = $.new('span')
             sp1.onclick = function() {
                 sys.pageLoad(page, filter, limit, title, pageNr + 1)
             }
             sp1.innerText = 'Next Page'
             el1.appendChild(sp1)
         }
         uPage.appendChild(el1)
     },
     buildCourses: (data) => {
         data.forEach(e => {
             let el1 = $.new('div')
             let el2 = $.new('div')
             let el3 = $.new('div')
             let sp1 = $.new('span')
             let sp2 = $.new('span')
             
             el1.className = 'row-bar'
             el2.className = 'row-progress'
             el2.style.width = (e[1] * 100 / e[2]) + '%'
             el3.className = 'row-label'
             sp1.innerText = e[0]
             if(e[1] !== e[2]) {
                 sp2.className = 'tag-work'
                 sp2.innerText = lib.num(e[2] - e[1]) + ' Task left'
             } else {
                 sp2.className = 'tag-done'
                 sp2.innerText = lib.num(e[3]) + ' XP'
             }
             el3.appendChild(sp1)
             el3.appendChild(sp2)
             el1.appendChild(el2)
             el1.appendChild(el3)
             uPage.appendChild(el1)
         })
         
     },
     buildHeader: (titles) => {
         let div = $.new('div')
         div.className = 'header'
         if(Array.isArray(titles)) {
             let select = $.new('select')
             for(let i = 0; i < titles.length; i++) {
                 let option = $.new('option')
                 let title = titles[i].split('|')
                 option = $.new('option')
                 option.innerText = title[0]
                 option.value = title[1]
                 select.appendChild(option)
             }
             div.appendChild(select)
         } else {
             let span = $.new('span')
             span.innerText = titles
             div.appendChild(span)
         }
         uPage.appendChild(div)
     },
     getCodes: (filter, limit, offset) => {
         let result = user.db.codes.slice()
         switch(filter) {
             case 'OLD':
                 result.sort((a, b) => a[3] - b[3])
                 break;
             
             default:
                 result.sort((a, b) => b[3] - a[3])
                 break;
         }
         return limit === 0 ? result : result.slice(offset, limit)
     },
     getCourses: (filter, limit, offset) => {
         let result = user.db.courses.slice()
         switch(filter) {
             case 'DONE':
                 result = result.filter(e => e[1] === e[2])
                 result.sort((a, b) => b[3] - a[3])
                 break;
             
             case 'NOT_DONE':
                 result = result.filter(e => e[1] !== e[2])
                 result.sort((a, b) => b[1] - a[1])
                 break;
             
             default:
                 result.sort((a, b) => b[3] - a[3])
                 break;
         }
         return limit === 0 ? result : result.slice(offset, limit)
     },
     pageLoad: (page, filter, limit, title, pageNr) => {
         let data
         uPage.innerHTML = ''
         window.scrollTo(0,0);
         
         switch(parseInt(page)) {
             case 1:
                 filter = filter === undefined ? '' : filter
                 limit = limit === undefined ? 10 : limit
                 title = title === undefined ? 'Latest work' : title
                 pageNr = pageNr === undefined ? 0 : pageNr
                 data = sys.getCodes(filter, limit + (pageNr * limit), (pageNr * limit))
                 sys.buildHeader(title)
                 sys.buildCodes(data, page, title, filter, limit, pageNr)
                 return
             
             case 2:
                 data = sys.getCourses('NOT_DONE', 0, 0)
                 if(data.length !== 0) {
                     sys.buildHeader('In progress')
                     sys.buildCourses(data)
                 }
                 data = sys.getCourses('DONE', 0, 0)
                 sys.buildHeader('Top courses')
                 sys.buildCourses(data)
                 return
             
             default:
                 data = sys.getCourses('NOT_DONE', 3, 0)
                 if(data.length !== 0) {
                     sys.buildHeader('In progress')
                     sys.buildCourses(data)
                 }
                 data = sys.getCodes('', 3, 0)
                 sys.buildHeader('Latest work')
                 sys.buildCodes(data)
                 data = sys.getCourses('DONE', 3, 0)
                 sys.buildHeader('Top courses')
                 sys.buildCourses(data)
                 return
         }
     }
 }
 
 // HTML shortcuts.
 const $ = {
     get: (id, attr) => {
         return id.getAttribute(attr)
     },
     has: (id, attr) => {
         return id.hasAttribute(attr)
     },
     new: (element) => {
         return document.createElement(element)
     },
     query: (search) => {
         return [...document.querySelectorAll(search)]
     },
     rm: (id, attr) => {
         id.removeAttribute(attr)
     },
     set: (id, attr, value) => {
         id.setAttribute(attr, value)
     },
     txt: (id, txt) => {
         id.innerText = txt
     }
 }
 
 // Custom libary.
 const lib = {
     img: (imgs) => {
         if(imgs.length === 0) {
             return
         }
         
         let img = imgs.shift()
         
         img.onload = function() {
             $.rm(img, 'data-img')
             img.onload = null
             img.onerror = null
             lib.img(imgs)
         }
         img.onerror = img.onload
         img.src = $.get(img, 'data-img')
     },
     imgur: (code) => {
         return 'https://i.imgur.com/' + (code === '' ? '0FiHZPd' : code) + '.jpg'
     },
     num: (num) => {
         return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
     }
 }
 
 // Trigger when the user click on the webpage.
 window.onclick = function(event) {
     let obj = event.target
     
     if(!$.has(obj, 'a')) {
         return
     }
     
     if(obj.className === 'active tap') {
         return
     }
     
     menuObj.className = 'tab'
     obj.className = 'active tap'
     menuObj = obj
     sys.pageLoad($.get(menuObj, 'a'))
 }
 
 // Trigger when the webpage is done loading.
 window.onload = function() {
     let stats = sololearn.getLevelStatus(user.xp)
     
     $.set(uImg, 'data-img', 'https://blob.sololearn.com/avatars/74ceb199-991b-4376-b409-01a94d83ba84.jpg')
     $.txt(uName, user.name)
     $.txt(uTitle, user.title)
     $.txt(uXp, lib.num(user.xp) + ' XP')
     $.txt(uLvl, 'LVL ' + stats.lvl)
     $.set(uBar, 'style', 'width: ' + stats.progress + '%')
     $.txt(uTag, user.tagName)
     
     for(let i = 0; i < uMenu.children.length; i++) {
         if(uMenu.children[0].className === 'active tap') {
             menuObj = uMenu.children[i]
             break;
         }
     }
     
     sys.pageLoad($.get(menuObj, 'a'))
     lib.img($.query('img[data-img]'))
 }
 











 /*
We store our game status element here to allow us to more easily 
use it later on 
*/
const statusDisplay = document.querySelector('.game--status');
/*
Here we declare some variables that we will use to track the 
game state throught the game. 
*/
/*
We will use gameActive to pause the game in case of an end scenario
*/
let gameActive = true;
/*
We will store our current player here, so we know whos turn 
*/
let currentPlayer = "X";
/*
We will store our current game state here, the form of empty strings in an array
 will allow us to easily track played cells and validate the game state later on
*/
let gameState = ["", "", "", "", "", "", "", "", ""];
/*
Here we have declared some messages we will display to the user during the game.
Since we have some dynamic factors in those messages, namely the current player,
we have declared them as functions, so that the actual message gets created with 
current data every time we need it.
*/
const winningMessage = () => `Player ${currentPlayer} has won!`;
const drawMessage = () => `Game ended in a draw!`;
const currentPlayerTurn = () => `It's ${currentPlayer}'s turn`;
/*
We set the inital message to let the players know whose turn it is
*/
statusDisplay.innerHTML = currentPlayerTurn();
function handleCellPlayed() {

}
function handlePlayerChange() {

}
function handleResultValidation() {

}
function handleCellClick() {

}
function handleRestartGame() {

}
/*
And finally we add our event listeners to the actual game cells, as well as our 
restart button
*/
document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handleCellClick));
document.querySelector('.game--restart').addEventListener('click', handleRestartGame);



function handleCellClick(clickedCellEvent) {
    /*
    We will save the clicked html element in a variable for easier further use
    */    
        const clickedCell = clickedCellEvent.target;
    /*
    Here we will grab the 'data-cell-index' attribute from the clicked cell to identify where that cell is in our grid. 
    Please note that the getAttribute will return a string value. Since we need an actual number we will parse it to an 
    integer(number)
    */
        const clickedCellIndex = parseInt(
          clickedCell.getAttribute('data-cell-index')
        );
    /* 
    Next up we need to check whether the call has already been played, 
    or if the game is paused. If either of those is true we will simply ignore the click.
    */
        if (gameState[clickedCellIndex] !== "" || !gameActive) {
            return;
        }
    /* 
    If everything if in order we will proceed with the game flow
    */    
        handleCellPlayed(clickedCell, clickedCellIndex);
        handleResultValidation();


        function handleCellPlayed(clickedCell, clickedCellIndex) {
            /*
            We update our internal game state to reflect the played move, 
            as well as update the user interface to reflect the played move
            */
                gameState[clickedCellIndex] = currentPlayer;
                clickedCell.innerHTML = currentPlayer;
            }

            const winningConditions = [
                [0, 1, 2],
                [3, 4, 5],
                [6, 7, 8],
                [0, 3, 6],
                [1, 4, 7],
                [2, 5, 8],
                [0, 4, 8],
                [2, 4, 6]
            ];
            function handleResultValidation() {
                let roundWon = false;
                for (let i = 0; i <= 7; i++) {
                    const winCondition = winningConditions[i];
                    let a = gameState[winCondition[0]];
                    let b = gameState[winCondition[1]];
                    let c = gameState[winCondition[2]];
                    if (a === '' || b === '' || c === '') {
                        continue;
                    }
                    if (a === b && b === c) {
                        roundWon = true;
                        break
                    }
                }
            if (roundWon) {
                    statusDisplay.innerHTML = winningMessage();
                    gameActive = false;
                    return;
                }
            }

            const winningConditions = [
                [0, 1, 2],
                [3, 4, 5],
                [6, 7, 8],
                [0, 3, 6],
                [1, 4, 7],
                [2, 5, 8],
                [0, 4, 8],
                [2, 4, 6]
            ];
            function handleResultValidation() {
                let roundWon = false;
                for (let i = 0; i <= 7; i++) {
                    const winCondition = winningConditions[i];
                    let a = gameState[winCondition[0]];
                    let b = gameState[winCondition[1]];
                    let c = gameState[winCondition[2]];
                    if (a === '' || b === '' || c === '') {
                        continue;
                    }
                    if (a === b && b === c) {
                        roundWon = true;
                        break
                    }
                }
            if (roundWon) {
                    statusDisplay.innerHTML = winningMessage();
                    gameActive = false;
                    return;
                }
            /* 
            We will check weather there are any values in our game state array 
            that are still not populated with a player sign
            */
                let roundDraw = !gameState.includes("");
                if (roundDraw) {
                    statusDisplay.innerHTML = drawMessage();
                    gameActive = false;
                    return;
                }
            /*
            If we get to here we know that the no one won the game yet, 
            and that there are still moves to be played, so we continue by changing the current player.
            */
                handlePlayerChange();
            }
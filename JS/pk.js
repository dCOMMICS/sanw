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
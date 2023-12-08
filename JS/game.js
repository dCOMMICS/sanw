// Define HTML elements
const board = document.getElementById('game-board');
const instructionText = document.getElementById('instruction-text');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highScoreText = document.getElementById('highScore');

// Define game variables
const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = generateFood();
let highScore = 0;
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;

// Draw game map, snake, food
function draw() {
  board.innerHTML = '';
  drawSnake();
  drawFood();
  updateScore();
}

// Draw snake
function drawSnake() {
  snake.forEach((segment) => {
    const snakeElement = createGameElement('div', 'snake');
    setPosition(snakeElement, segment);
    board.appendChild(snakeElement);
  });
}

// Create a snake or food cube/div
function createGameElement(tag, className) {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

// Set the position of snake or food
function setPosition(element, position) {
  element.style.gridColumn = position.x;
  element.style.gridRow = position.y;
}

// Testing draw function
// draw();

// Draw food function
function drawFood() {
  if (gameStarted) {
    const foodElement = createGameElement('div', 'food');
    setPosition(foodElement, food);
    board.appendChild(foodElement);
  }
}

// Generate food
function generateFood() {
  const x = Math.floor(Math.random() * gridSize) + 1;
  const y = Math.floor(Math.random() * gridSize) + 1;
  return { x, y };
}

// Moving the snake
function move() {
  const head = { ...snake[0] };
  switch (direction) {
    case 'up':
      head.y--;
      break;
    case 'down':
      head.y++;
      break;
    case 'left':
      head.x--;
      break;
    case 'right':
      head.x++;
      break;
  }

  snake.unshift(head);

  //   snake.pop();

  if (head.x === food.x && head.y === food.y) {
    food = generateFood();
    increaseSpeed();
    clearInterval(gameInterval); // Clear past interval
    gameInterval = setInterval(() => {
      move();
      checkCollision();
      draw();
    }, gameSpeedDelay);
  } else {
    snake.pop();
  }
}

// Test moving
// setInterval(() => {
//   move(); // Move first
//   draw(); // Then draw again new position
// }, 200);

// Start game function
function startGame() {
  gameStarted = true; // Keep track of a running game
  instructionText.style.display = 'none';
  logo.style.display = 'none';
  gameInterval = setInterval(() => {
    move();
    checkCollision();
    draw();
  }, gameSpeedDelay);
}

// Keypress event listener
function handleKeyPress(event) {
  if (
    (!gameStarted && event.code === 'Space') ||
    (!gameStarted && event.key === ' ')
  ) {
    startGame();
  } else {
    switch (event.key) {
      case 'ArrowUp':
        direction = 'up';
        break;
      case 'ArrowDown':
        direction = 'down';
        break;
      case 'ArrowLeft':
        direction = 'left';
        break;
      case 'ArrowRight':
        direction = 'right';
        break;
    }
  }
}

document.addEventListener('keydown', handleKeyPress);

function increaseSpeed() {
  //   console.log(gameSpeedDelay);
  if (gameSpeedDelay > 150) {
    gameSpeedDelay -= 5;
  } else if (gameSpeedDelay > 100) {
    gameSpeedDelay -= 3;
  } else if (gameSpeedDelay > 50) {
    gameSpeedDelay -= 2;
  } else if (gameSpeedDelay > 25) {
    gameSpeedDelay -= 1;
  }
}

function checkCollision() {
  const head = snake[0];

  if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
    resetGame();
  }

  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      resetGame();
    }
  }
}

function resetGame() {
  updateHighScore();
  stopGame();
  snake = [{ x: 10, y: 10 }];
  food = generateFood();
  direction = 'right';
  gameSpeedDelay = 200;
  updateScore();
}

function updateScore() {
  const currentScore = snake.length - 1;
  score.textContent = currentScore.toString().padStart(3, '0');
}

function stopGame() {
  clearInterval(gameInterval);
  gameStarted = false;
  instructionText.style.display = 'block';
  logo.style.display = 'block';
}

function updateHighScore() {
  const currentScore = snake.length - 1;
  if (currentScore > highScore) {
    highScore = currentScore;
    highScoreText.textContent = highScore.toString().padStart(3, '0');
  }
  highScoreText.style.display = 'block';
}



// middle ware code

import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    console.log(req.nextUrl.pathname);
    console.log(req.nextauth.token.role);

    if (
      req.nextUrl.pathname.startsWith("/CreateUser") &&
      req.nextauth.token.role != "admin"
    ) {
      return NextResponse.rewrite(new URL("/Denied", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = { matcher: ["/CreateUser"] };















//  REACT APP 

import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;



import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});

import React, {Component} from "react";

class TodoItems extends Component {
	constructor(props){
		super(props);
		this.createTasks = this.createTasks.bind(this);
	}
	createTasks(item){
		return <li onClick={() => this.delete(item.key)} key={item.key}>{item.text}</li>
	}
	delete(key){
		this.props.delete(key);
	}
	render(){
		var todoEntries = this.props.entries;
		var listItems = todoEntries.map(this.createTasks);

		return(
			<ul className="theList">
				{listItems}
			</ul>
		);
	}
};

export default TodoItems;

import React, {Component} from "react";
import TodoItems from "./TodoItems";

class TodoList extends Component {
	constructor(props){
		super(props);
		this.state = {items: []};
		this.addItem = this.addItem.bind(this);
		this.deleteItem = this.deleteItem.bind(this);
	}
	addItem(e){
		if(this._inputElement.value !== ""){
			var newItem = {
				text: this._inputElement.value, 
				key: Date.now()
			};
	
			this.setState((prevState) => {
				return {
					items: prevState.items.concat(newItem)
				};
			});
		
			this._inputElement.value = "";
		}
		console.log(this.state.items);
		e.preventDefault();
	}
	deleteItem(key){
		var filteredItems = this.state.items.filter(function(item) {
			return (item.key !== key);
		});
		
		this.setState({
			items: filteredItems
		});
	}
	render(){
		return(
			<div className="todoListMain">
			  <div className="header">
			    <form onSubmit={this.addItem}>
			      <input ref={(a) => this._inputElement = a} placeholder="enter task">
			      </input>
			      <button type="submit">add</button>
			    </form>
			    <TodoItems entries={this.state.items} delete={this.deleteItem} />
			  </div>
		        </div>
		);
	}
}

export default TodoList; 

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import TodoList from "./TodoList";


var destination = document.querySelector('#container');


ReactDOM.render(
  <div>
	<TodoList/>
  </div>, 
  destination
);

function removeTransition(event) {
    if (event.propertyName !== 'transform') return
    event.target.classList.remove('playing')
   }
   function playSound(event) {
    const audio = document.querySelector(`audio[data-key="${event.keyCode}"]`)
    const key = document.querySelector(`div[data-key="${event.keyCode}"]`)
    if (!audio) return
    key.classList.add('playing')
    audio.currentTime = 0
    audio.play()
   }
   const keys = Array.from(document.querySelectorAll('.key'))
   keys.forEach((key) => key.addEventListener('transitionend', removeTransition))
   window.addEventListener('keydown', playSound)




   import { useLayoutEffect } from 'react';

const useDocumentTitle = (title) => {
  useLayoutEffect(() => {
    if (title) {
      document.title = title;
    } else {
      document.title = 'Salinaka - eCommerce React App';
    }
  }, [title]);
};

export default useDocumentTitle;

import React from 'react'
import './styles/global.css';
import Header from './components/Header.js'
import TopCardList from './components/top-card-list.js'
import Overview from './components/Overview.js'
import Switch from './components/Switch.js'

function App() {
  return (
    <>
    <Header>
      <Switch/>
    </Header>
    <TopCardList/>
    <Overview/>
    </>
  );
}

export default App;

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(<App />,document.getElementById('root'));

import React from 'react'
import '../styles/Card-small.css'

function CardSmall({growth, pageViews, icon}) {
    return (
        <div className="card-small">
        <p className="card-small-views">page views</p>
        <p className="card-small-icon">
            <img src={icon} />
        </p>
        <p className="card-small-number">{pageViews}</p>
        <p className="card-small-percentage">
            <span>
                <img src="images/up.png"/>
                {growth}%
            </span>
         
        </p>
    </div>
    )
}

export default CardSmall
import React from 'react'
import '../styles/card.css'



function Card({userName,followers,todayFollowers, icon, name}) {
    const cardClass = `card ${name}`
    return (
        <article className={cardClass}>
            <p className="card-title">
                <img src= {icon}/>
                {userName}
            </p>
            <p className="card-followers">
            <span className="card-followers-number">{followers}</span>
                <span className="card-followers-title">Followers</span>
            </p>
            <p className="card-today">
                <img src="images/up.png"/>
                {todayFollowers} today
            </p>
        </article>
    )
}

export default Card;
import React from 'react'
import '../styles/header.css'
import './Switch.js'
import Switch from './Switch.js'

function Header({children}) {
    return (
        <header className="header" >
     <div className="wrapper">
      <div className="header-grid">
        <div>
          <h1>Social Media Dashboard</h1>
          <p className="header-total">Total Followers: 23, 004</p>
        </div>
        {children}
      </div>
     </div>
   </header>
    )
}

export default Header
import React from 'react'
import CardSmall from './Card-small'
import '../styles/overview.css'

const cardSmallList = [
    {
        icon: 'images/facebook.png',
        pageViews: '87',
        growth: 3,
        key: 1
    },
    {
        icon: 'images/twitter.png',
        pageViews: '52',
        growth:  2257,
        key: 2
    },
    {
        icon: 'images/instagram24.png',
        pageViews: '5462',
        growth: 1375,
        key: 3
    },
    {
        icon: 'images/youtube.png',
        pageViews: '117',
        growth: 303,
        key: 4
    }
]

function Overview() {
    return (
        <section className="overview">
        <div className="wrapper">
          <h2>Overview - Today</h2>

          <div className="grid">
              {
                  cardSmallList.map(({icon,pageViews, growth, key}) => (
                  <CardSmall
                    icon={icon}
                    key={key}
                    pageViews={pageViews}
                    growth={growth}
                  />
                  ))
              }
           
            {/* <div className="card-small">
                <p className="card-small-views">Likes</p>
                <p className="card-small-icon">
                    <img src="images/facebook.png" />
                </p>
                <p className="card-small-number">52</p>
                <p className="card-small-percentage is-danger">
                    <span>
                        <img src="images/up.png"/>
                        2%
                    </span>
                 
                </p>
            </div>
            <div className="card-small">
                <p className="card-small-views">Likes</p>
                <p className="card-small-icon">
                    <img src="images/instagram24.png" />
                </p>
                <p className="card-small-number">5462</p>
                <p className="card-small-percentage">
                    <span>
                        <img src="images/up.png"/>
                        2257%
                    </span>
                 
                </p>
            </div>
            <div className="card-small">
                <p className="card-small-views">profile Views</p>
                <p className="card-small-icon">
                    <img src="images/instagram24.png" />
                </p>
                <p className="card-small-number">52k</p>
                <p className="card-small-percentage">
                    <span>
                        <img src="images/up.png"/>
                        1375%
                    </span>
                 
                </p>
            </div>
            <div className="card-small">
                <p className="card-small-views">Retweets</p>
                <p className="card-small-icon">
                    <img src="images/twitter.png" />
                </p>
                <p className="card-small-number">117</p>
                <p className="card-small-percentage">
                    <span>
                        <img src="images/up.png"/>
                        303%
                    </span>
                 
                </p>
            </div>
            <div className="card-small">
                <p className="card-small-views">Likes</p>
                <p className="card-small-icon">
                    <img src="images/twitter.png" />
                </p>
                <p className="card-small-number">507</p>
                <p className="card-small-percentage">
                    <span>
                        <img src="images/up.png"/>
                        553%
                    </span>
                 
                </p>
            </div>
            <div className="card-small">
                <p className="card-small-views">Likes</p>
                <p className="card-small-icon">
                    <img src="images/youtube.png" />
                </p>
                <p className="card-small-number">107</p>
                <p className="card-small-percentage is-danger">
                    <span>
                        <img src="images/up.png"/>
                        19%
                    </span>
                 
                </p>
            </div>
            <div className="card-small">
                <p className="card-small-views">Total views</p>
                <p className="card-small-icon">
                    <img src="images/youtube.png" />
                </p>
                <p className="card-small-number">1407</p>
                <p className="card-small-percentage is-danger">
                    <span>
                        <img src="images/up.png"/>
                        12%
                    </span>
                 
                </p>
            </div>*/}
            </div>
        </div>

    </section> 
    )
}

export default Overview

import React, {useRef, useEffect, useState} from 'react'
import '../styles/switch.css'

function Switch(){
    const [checked, setChecked] = useState(false)

    const ref = useRef(null)
    function handleChange () {
      console.log(ref.current.checked)
      setChecked(ref.current.checked)
      if(ref.current.checked){
        document.body.classList.remove('is-light-mode')
        document.body.classList.add('is-dark-mode')
      } else {
        document.body.classList.remove('is-dark-mode')
        document.body.classList.add('is-light-mode')
      }
    }



    useEffect(() => {
      if(window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setChecked(true)
      }
    }, [])

  


    return (
        <div className="dark-mode">
          <p className="dark-mode-title">Dark Mode</p>
          <input ref={ref} type="checkbox" className="checkbox" checked={checked} id="checkbox" onChange={handleChange}/>
          <label className="switch" htmlFor="checkbox">

          </label>
        </div>
    )
}

export default Switch

import React from 'react'
import Card from './Card'
import '../styles/top-card-list.css'

import {generate as id} from 'shortid'

const cardListData = [
    {
        userName: '@pepito',
        followers: '1486',
        todayFollowers:12,
        icon: "images/facebook.png",
        name: 'facebook'
    },
    {
        userName: '@luisa',
        followers:'28540',
        todayFollowers:20,
        icon: "images/twitter.png",
        name: 'twitter'


    },
    {
        userName: '@osvaldo',
        followers:'4550',
        todayFollowers:30,
        icon: "images/instagram24.png",
        name: 'instagram'


    },
    {
        userName: '@jose',
        followers:'4140',
        todayFollowers:-50,
        icon: "images/youtube.png",
        name: 'youtube'


    },
]

function TopCardList() {
    return (
        <section className="top-card">
        <div className="wrapper">
            <div className="grid">
                {
                    cardListData.map((cardData)=> <Card key={id} {...cardData}/>)
                }
            </div>
        </div>
</section>
    )
}

export default TopCardList

import React, { Component } from 'react';
import Routes from './CityRoutes';
import logo from './Components/Images/headout.png';

class App extends Component {
  state = { width: 0, height: 0 };

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }
  updateWindowDimensions = () =>
    this.setState({ width: window.innerWidth, height: window.innerHeight });

  render() {
    const { width } = this.state;
    const mobileTablet = width <= 1100;

    if (mobileTablet) {
      return (
        <div className="mobile-tablet">
          <img src={logo} alt="Headout" />
          <p>
            Currently, we're not supporting Mobile & Tablets{' '}
            <span role="img" aria-label="Warn">
              🙏
            </span>
          </p>
        </div>
      );
    } else {
      return <Routes />;
    }
  }
}

export default App;

import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import MainHome from './Components/MainHome';
import NewYork from './Components/NewYork';
import AppStore from './Components/AppStore';

const CityRoutes = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={MainHome} />
      <Route exact path="/cities/new-york" component={NewYork} />
      <Route exact path="/cities/las-vegas" component={MainHome} />
      <Route exact path="/cities/rome" component={MainHome} />
      <Route exact path="/cities/paris" component={MainHome} />
      <Route exact path="/cities/london" component={MainHome} />
      <Route exact path="/cities/dubai" component={MainHome} />
      <Route exact path="/cities/barcelona" component={MainHome} />
      <Route exact path="/cities/madrid" component={MainHome} />
      <Route exact path="/cities/singapore" component={MainHome} />
      <Route exact path="/cities/venice" component={MainHome} />
      <Route exact path="/cities/milan" component={MainHome} />
      <Route exact path="/cities/naples" component={MainHome} />
      <Route exact path="/cities/budapest" component={MainHome} />
      <Route exact path="/cities/edinburg" component={MainHome} />
      <Route exact path="/cities/florence" component={MainHome} />
      <Route exact path="/app" component={AppStore} />
    </Switch>
  </BrowserRouter>
);

export default CityRoutes;

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

// This optional code is used to register a service worker.
// register() is not called by default.

// This lets the app load faster on subsequent visits in production, and gives
// it offline capabilities. However, it also means that developers (and users)
// will only see deployed updates on subsequent visits to a page, after all the
// existing tabs open on the page have been closed, since previously cached
// resources are updated in the background.

// To learn more about the benefits of this model and instructions on how to
// opt-in, read http://bit.ly/CRA-PWA

const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
      // [::1] is the IPv6 localhost address.
      window.location.hostname === '[::1]' ||
      // 127.0.0.1/8 is considered localhost for IPv4.
      window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
      )
  );
  
  export function register(config) {
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
      // The URL constructor is available in all browsers that support SW.
      const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
      if (publicUrl.origin !== window.location.origin) {
        // Our service worker won't work if PUBLIC_URL is on a different origin
        // from what our page is served on. This might happen if a CDN is used to
        // serve assets; see https://github.com/facebook/create-react-app/issues/2374
        return;
      }
  
      window.addEventListener('load', () => {
        const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
  
        if (isLocalhost) {
          // This is running on localhost. Let's check if a service worker still exists or not.
          checkValidServiceWorker(swUrl, config);
  
          // Add some additional logging to localhost, pointing developers to the
          // service worker/PWA documentation.
          navigator.serviceWorker.ready.then(() => {
            console.log(
              'This web app is being served cache-first by a service ' +
                'worker. To learn more, visit http://bit.ly/CRA-PWA'
            );
          });
        } else {
          // Is not localhost. Just register service worker
          registerValidSW(swUrl, config);
        }
      });
    }
  }
  
  function registerValidSW(swUrl, config) {
    navigator.serviceWorker
      .register(swUrl)
      .then(registration => {
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker == null) {
            return;
          }
          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // At this point, the updated precached content has been fetched,
                // but the previous service worker will still serve the older
                // content until all client tabs are closed.
                console.log(
                  'New content is available and will be used when all ' +
                    'tabs for this page are closed. See http://bit.ly/CRA-PWA.'
                );
  
                // Execute callback
                if (config && config.onUpdate) {
                  config.onUpdate(registration);
                }
              } else {
                // At this point, everything has been precached.
                // It's the perfect time to display a
                // "Content is cached for offline use." message.
                console.log('Content is cached for offline use.');
  
                // Execute callback
                if (config && config.onSuccess) {
                  config.onSuccess(registration);
                }
              }
            }
          };
        };
      })
      .catch(error => {
        console.error('Error during service worker registration:', error);
      });
  }
  
  function checkValidServiceWorker(swUrl, config) {
    // Check if the service worker can be found. If it can't reload the page.
    fetch(swUrl)
      .then(response => {
        // Ensure service worker exists, and that we really are getting a JS file.
        const contentType = response.headers.get('content-type');
        if (
          response.status === 404 ||
          (contentType != null && contentType.indexOf('javascript') === -1)
        ) {
          // No service worker found. Probably a different app. Reload the page.
          navigator.serviceWorker.ready.then(registration => {
            registration.unregister().then(() => {
              window.location.reload();
            });
          });
        } else {
          // Service worker found. Proceed as normal.
          registerValidSW(swUrl, config);
        }
      })
      .catch(() => {
        console.log(
          'No internet connection found. App is running in offline mode.'
        );
      });
  }
  
  export function unregister() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.unregister();
      });
    }
  }

  import React from 'react';
import './Styles/arrow.css';

export const Left = props => {
  const { style, onClick } = props;
  return (
    <div
      className="slick-arrow-left"
      style={{ ...style, display: 'block' }}
      onClick={onClick}
    >
      <i className="fas fa-arrow-left left-arrow" />
    </div>
  );
};

export const Right = props => {
  const { style, onClick } = props;
  return (
    <div
      className="slick-arrow-right"
      style={{ ...style, display: 'block' }}
      onClick={onClick}
    >
      <i className="fas fa-arrow-right right-arrow" />
    </div>
  );
};
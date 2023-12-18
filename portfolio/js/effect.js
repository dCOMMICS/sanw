// document.querySelector("h1").onmouseover = event => {
//     event.target.innerText = event.target.innerText.split(" ")
//     .map (letters => letters[Math.floor(Math.random() * 26)])
//     .join(" ");
//     // event.target.innerText = letters [Math.floor(Math.random () * 26)];
// }


const letters = "👋 Web  and Indie Game Developer";

let interval = null;

document.querySelector("h1").onmouseover = event => {  
  let iteration = 0;
  
  clearInterval(interval);
  
  interval = setInterval(() => {
    event.target.innerText = event.target.innerText
      .split("")
      .map((letter, index) => {
        if(index < iteration) {
          return event.target.dataset.value[index];
        }
      
        return letters[Math.floor(Math.random() * 16)]
      })
      .join("");
    
    if(iteration >= event.target.dataset.value.length){ 
      clearInterval(interval);
    }
    
    iteration += 1 / 3;
  }, 30);
}
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
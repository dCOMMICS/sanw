gsap.registerPlugin(ScrollTrigger);

let revealContainers = document.querySelectorAll(".reveal");

revealContainers.forEach((container) => {
  let image = container.querySelector("img");
  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      toggleActions: "restart none none reset"
    }
  });

  tl.set(container, { autoAlpha: 1 });
  tl.from(container, 1.5, {
    xPercent: -100,
    ease: Power2.out
  });
  tl.from(image, 1.5, {
    xPercent: 100,
    scale: 1.3,
    delay: -1.5,
    ease: Power2.out
  });
});

// OLD WAY USING INTERSECTION OBSERVER API AND CLIP-PATH

/*const options = {
  root: null,
  rootMargin: "0px",
  threshold: 0.9
};

let revealCallback = (entries, self) => {
  entries.forEach(entry => {
    let container = entry.target;
    let img = entry.target.querySelector("img");
    const easeInOut = "power3.out";
    const revealAnim = gsap.timeline({ ease: easeInOut });

    if (entry.isIntersecting) {
      revealAnim.set(container, {
        visibility: "visible"
      });
      revealAnim.fromTo(
        container,
        {
          clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)",
          webkitClipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)"
        },
        {
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
          webkitClipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
          duration: 1,
          ease: easeInOut
        }
      );
      revealAnim.from(img, 4, {
        scale: 1.4,
        ease: easeInOut,
        delay: -1
      });
      self.unobserve(entry.target);
    }
  });
};

let revealObserver = new IntersectionObserver(revealCallback, options);

document.querySelectorAll(".reveal").forEach(reveal => {
  revealObserver.observe(reveal);
});

*/

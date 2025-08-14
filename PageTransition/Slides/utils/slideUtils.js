import gsap from "gsap";
import slides from "./img.js";

export function createAndAnimateSlide(root, index, isScrollingForward, initMarqueeAnimation) {
  const carousel = root;
  if (!carousel) return;

  const currentSlide = carousel.querySelector(".slide");
  if (!currentSlide) {
    return false;
  }

  const slideData = slides[index];
  if (!slideData) return false;

  const newSlide = document.createElement("div");
  newSlide.className = "slide";
  newSlide.innerHTML = `
      <div class="slide-img">
          <img src="${slideData.image}" alt="" />
      </div>
      <div class="slide-copy">
          <div class="slide-tag">
          <p>${slideData.tag}</p>
          </div>
          <div class="slide-marquee">
          <div class="marquee-container">
              <h1>${slideData.marquee}</h1>
          </div>
          </div>
      </div>
  `;

  initMarqueeAnimation(newSlide.querySelector(".marquee-container h1"));

  const currentSlideImg = currentSlide.querySelector(".slide-img");
  const currentSlideCopy = currentSlide.querySelector(".slide-copy");

  if (!currentSlideImg || !currentSlideCopy) {
    return false;
  }

  gsap.killTweensOf(currentSlide);
  gsap.killTweensOf(currentSlideImg);
  gsap.killTweensOf(currentSlideCopy);

  if (isScrollingForward) {
    const newSlideImg = newSlide.querySelector(".slide-img img");
    const newSlideCopy = newSlide.querySelector(".slide-copy");

    gsap.set(newSlide, {
      clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
    });
    gsap.set(newSlideImg, { y: "25%" });
    gsap.set(newSlideCopy, { y: "100%" });

    carousel.appendChild(newSlide);

    gsap.to(newSlide, {
      clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
      duration: 1,
      ease: "power4.inOut",
    });

    gsap.to([newSlideCopy, newSlideImg], {
      y: "0%",
      duration: 1,
      ease: "power4.inOut",
    });

    gsap.to(currentSlide, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
      duration: 1,
      ease: "power4.inOut",
      onStart: () => {
        gsap.to(currentSlideImg, {
          y: "-25%",
          duration: 1,
          ease: "power4.inOut",
        });
        gsap.to(currentSlideCopy, {
          y: "-100%",
          duration: 1,
          ease: "power4.inOut",
        });
      },
      onComplete: () => {
        const oldH1 = currentSlide.querySelector(".marquee-container h1");
        if (oldH1 && oldH1._marqueeTick) {
          gsap.ticker.remove(oldH1._marqueeTick);
          oldH1._marqueeTick = null;
        }
        if (currentSlide.parentNode) {
          currentSlide.remove();
        }
      },
    });
  } else {
    const newSlideImg = newSlide.querySelector(".slide-img img");
    const newSlideCopy = newSlide.querySelector(".slide-copy");

    gsap.set(newSlide, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
    });
    gsap.set(newSlideImg, { y: "-25%" });
    gsap.set(newSlideCopy, { y: "-100%" });

    carousel.insertBefore(newSlide, currentSlide);

    gsap.to(newSlide, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      duration: 1,
      ease: "power4.inOut",
    });

    gsap.to([newSlideImg, newSlideCopy], {
      y: "0%",
      duration: 1,
      ease: "power4.inOut",
    });

    gsap.to(currentSlide, {
      clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
      duration: 1,
      ease: "power4.inOut",
      onStart: () => {
        gsap.to(currentSlideImg, {
          y: "25%",
          duration: 1,
          ease: "power4.inOut",
        });
        gsap.to(currentSlideCopy, {
          y: "100%",
          duration: 1,
          ease: "power4.inOut",
        });
      },
      onComplete: () => {
        const oldH1 = currentSlide.querySelector(".marquee-container h1");
        if (oldH1 && oldH1._marqueeTick) {
          gsap.ticker.remove(oldH1._marqueeTick);
          oldH1._marqueeTick = null;
        }
        if (currentSlide.parentNode) {
          currentSlide.remove();
        }
      },
    });
  }

  return true;
}

export function buildProgressBars(root) {
  const progressRoot = root.querySelector(".carousel-progress");
  if (!progressRoot) return;
  
  progressRoot.innerHTML = "";
  for (let i = 0; i < slides.length; i += 1) {
    const bar = document.createElement("div");
    bar.className = "progress-bar";
    progressRoot.appendChild(bar);
  }
}

export function updateProgressBars(root, progress) {
  const bars = root.querySelectorAll(".progress-bar");
  bars.forEach((bar, index) => {
    const barProgress = Math.min(Math.max(progress * slides.length - index, 0), 1);
    bar.style.setProperty("--progress", barProgress);
  });
}

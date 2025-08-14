import slides from "../img.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  let activeSlideIndex = 0;
  let previousProgress = 0;
  let isAnimatingSlide = false;
  let triggerDestroyed = false;

  const lenis = new Lenis();
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  const initialSlide = document.querySelector(".carousel .slide");
  gsap.set(initialSlide, {
    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
  });
  gsap.set(initialSlide.querySelector(".slide-img img"), { y: "0%" });

  initMarqueeAnimation(initialSlide.querySelector(".marquee-container h1"));
  
  // Build progress bars to match slides length and initialize counter
  function syncProgressBarsWithSlides() {
    const progressRoot = document.querySelector(".carousel-progress");
    if (!progressRoot) return;
    const bars = progressRoot.querySelectorAll(".progress-bar");
    bars.forEach((b) => b.remove());
    const total = slides.length;
    const counterEl = progressRoot.querySelector(".slide-counter");
    for (let i = 0; i < total; i += 1) {
      const bar = document.createElement("div");
      bar.className = "progress-bar";
      if (counterEl) {
        progressRoot.insertBefore(bar, counterEl);
      } else {
        progressRoot.appendChild(bar);
      }
    }
  }

  syncProgressBarsWithSlides();
  updateSlideCounter();

  function updateProgressBars(progress) {
    const progressBars = document.querySelectorAll(".progress-bar");
    const total = slides.length;
    progressBars.forEach((bar, index) => {
      const barProgress = Math.min(Math.max(progress * total - index, 0), 1);
      bar.style.setProperty("--progress", barProgress);
    });
  }

  function updateSlideCounter(currentIndex, targetIndex) {
    const counter = document.querySelector(".slide-counter");
    if (!counter) return;
    const currentEl = counter.querySelector(".current");
    const nextEl = counter.querySelector(".next");
    const totalEl = counter.querySelector(".total-count");
    if (!currentEl || !nextEl || !totalEl) return;

    const maxIndex = slides.length - 1;
    const safeCurrent = Math.max(0, Math.min(currentIndex, maxIndex));
    const safeTarget = Math.max(0, Math.min(targetIndex, maxIndex));

    currentEl.textContent = safeCurrent + 1;
    nextEl.textContent = safeTarget + 1;
    totalEl.textContent = slides.length;
  }

  function initMarqueeAnimation(h1Element) {
    const baseText = h1Element.getAttribute("data-text") || h1Element.textContent.trim();
    h1Element.setAttribute("data-text", baseText);
    h1Element.innerHTML = `<span class="marquee-unit">${baseText}</span><span class="marquee-unit">${baseText}</span>`;

    const firstUnit = h1Element.querySelector(".marquee-unit");
    if (!firstUnit) return;

    requestAnimationFrame(() => {
      const unitWidth = firstUnit.offsetWidth;
      const pixelsPerSecond = 150; // speed

      // Clean up any previous ticker bound to this element
      if (h1Element._marqueeTick) {
        gsap.ticker.remove(h1Element._marqueeTick);
      }

      let x = 0;
      const tick = () => {
        x -= (pixelsPerSecond / 60) * gsap.ticker.deltaRatio();
        if (x <= -unitWidth) x += unitWidth;
        gsap.set(h1Element, { x });
      };

      h1Element._marqueeTick = tick;
      gsap.ticker.add(tick);
    });
  }

  function createAndAnimateSlide(index, isScrollingForward) {
    const carousel = document.querySelector(".carousel");
    if (!carousel) return;

    const currentSlide = document.querySelector(".carousel .slide");
    if (!currentSlide) {
      isAnimatingSlide = false;
      return;
    }

    const slideData = slides[index];

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
      isAnimatingSlide = false;
      return;
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
          isAnimatingSlide = false;
        },
        onInterrupt: () => {
          isAnimatingSlide = false;
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
          isAnimatingSlide = false;
        },
        onInterrupt: () => {
          isAnimatingSlide = false;
        },
      });
    }
  }

  const scrollTrigger = ScrollTrigger.create({
    trigger: ".carousel",
    start: "top top",
    end: `+=${window.innerHeight * 15}px`,
    pin: true,
    pinSpacing: true,
    scrub: 1,
    onUpdate: (self) => {
      if (triggerDestroyed) return;

      const progress = self.progress;
      updateProgressBars(progress);

      if (isAnimatingSlide) {
        previousProgress = progress;
        return;
      }

      const isScrollingForward = progress > previousProgress;
      const maxIndex = slides.length - 1;
      const targetSlideIndex = Math.min(Math.floor(progress * slides.length), maxIndex);

      updateSlideCounter();

      if (targetSlideIndex !== activeSlideIndex) {
        isAnimatingSlide = true;

        try {
          createAndAnimateSlide(targetSlideIndex, isScrollingForward);
          activeSlideIndex = targetSlideIndex;
          updateSlideCounter();
        } catch (err) {
          isAnimatingSlide = false;
        }
      }

      previousProgress = progress;
    },
    onKill: () => {
      triggerDestroyed = true;
    },
  });
});
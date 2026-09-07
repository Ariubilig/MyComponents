import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import slides from "../utils/img.js";
import { createAndAnimateSlide, updateProgressBars } from "../utils/slideUtils";
import { useMarquee } from "./useMarquee.js";

gsap.registerPlugin(ScrollTrigger);


export function useCarousel() {

  const carouselRef = useRef(null);
  const { initMarqueeAnimation } = useMarquee();

  useLayoutEffect(() => {
    let activeSlideIndex = 0;
    let previousProgress = 0;
    let isAnimatingSlide = false;
    let triggerDestroyed = false;
    let root = null;

    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    const tickerFn = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0);

    root = carouselRef.current;
    if (!root) return;

    let initialSlide = root.querySelector(".slide");
    if (!initialSlide) {
      // Build a minimal first slide and progress container if missing
      const first = document.createElement("div");
      first.className = "slide";
      first.innerHTML = `
        <div class="slide-img"><img src="${slides[0].image}" alt="" /></div>
        <div class="slide-copy">
          <div class="slide-tag"><p>${slides[0].tag}</p></div>
          <div class="slide-marquee"><div class="marquee-container"><h1 data-text="${slides[0].marquee}">${slides[0].marquee}</h1></div></div>
        </div>`;
      root.appendChild(first);
      const progress = document.createElement("div");
      progress.className = "carousel-progress";
      root.appendChild(progress);
      initialSlide = first;
    }

    gsap.set(initialSlide, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    });
    gsap.set(initialSlide.querySelector(".slide-img img"), { y: "0%" });
    const initialH1 = initialSlide.querySelector(".marquee-container h1");
    if (initialH1) initMarqueeAnimation(initialH1);

    const scrollTrigger = ScrollTrigger.create({
      trigger: root,
      start: "top top",
      end: () => `+=${window.innerHeight * slides.length * 4}px`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      snap: 1 / slides.length,
      onUpdate: (self) => {
        if (triggerDestroyed) return;

        const progress = self.progress;
        updateProgressBars(root, progress);

        if (isAnimatingSlide) {
          previousProgress = progress;
          return;
        }

        const isScrollingForward = progress > previousProgress;
        let targetSlideIndex = Math.floor(progress * slides.length);
        const maxIndex = slides.length - 1;
        targetSlideIndex = Math.max(0, Math.min(targetSlideIndex, maxIndex));

        if (targetSlideIndex !== activeSlideIndex) {
          isAnimatingSlide = true;
          try {
            // Pass the actual marquee function from useMarquee
            const result = createAndAnimateSlide(
              root,
              targetSlideIndex,
              isScrollingForward,
              initMarqueeAnimation,
              () => {
                isAnimatingSlide = false;
              }
            );

            if (result) {
              activeSlideIndex = targetSlideIndex;
            } else {
              isAnimatingSlide = false;
            }
          } catch (err) {
            console.error("Slide animation error:", err);
            isAnimatingSlide = false;
          }
        }

        previousProgress = progress;
      },
      onKill: () => {
        triggerDestroyed = true;
      },
    });

    return () => {
      // Kill ScrollTrigger first (sets triggerDestroyed and reverts pin)
      try {
        scrollTrigger.kill(true);
      } catch {}

      // As a safety net, unwrap pin-spacer if it remains
      try {
        if (root && root.parentNode && root.parentNode.classList && root.parentNode.classList.contains('pin-spacer')) {
          const pinSpacer = root.parentNode;
          const parent = pinSpacer.parentNode;
          if (parent) {
            parent.insertBefore(root, pinSpacer);
            pinSpacer.remove();
          }
        }
      } catch {}

      // Stop marquee tickers on all h1s to avoid late ticks during unmount
      if (root) {
        const marqueeEls = root.querySelectorAll('.marquee-container h1');
        marqueeEls.forEach((el) => {
          if (el._marqueeTick) {
            gsap.ticker.remove(el._marqueeTick);
            el._marqueeTick = null;
          }
        });
        // Kill all tweens targeting carousel and descendants to prevent onComplete DOM removals
        try {
          gsap.killTweensOf(root);
          const all = root.querySelectorAll('*');
          gsap.killTweensOf(all);
        } catch {}
      }

      // Remove raf ticker and destroy lenis
      gsap.ticker.remove(tickerFn);
      lenis.destroy();
      gsap.ticker.lagSmoothing(1000, 16);
    };
  }, []);

  return carouselRef;
}
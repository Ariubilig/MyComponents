import { useEffect, useRef } from "react";
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

  useEffect(() => {
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

    const root = carouselRef.current;
    if (!root) return;

    const initialSlide = root.querySelector(".slide");
    if (initialSlide) {
      gsap.set(initialSlide, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      });
      gsap.set(initialSlide.querySelector(".slide-img img"), { y: "0%" });
      
      // Initialize marquee animation for initial slide
      const initialH1 = initialSlide.querySelector(".marquee-container h1");
      if (initialH1) {
        initMarqueeAnimation(initialH1);
      }
    }

    const scrollTrigger = ScrollTrigger.create({
      trigger: root,
      start: "top top",
      end: `+=${window.innerHeight * slides.length * 4}px`,
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
          console.log(`Switching from slide ${activeSlideIndex} to ${targetSlideIndex}`);
                      try {
              // Pass the actual marquee function from useMarquee
              const result = createAndAnimateSlide(root, targetSlideIndex, isScrollingForward, initMarqueeAnimation);
            
            if (result) {
              activeSlideIndex = targetSlideIndex;
            }
            isAnimatingSlide = false;
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
      scrollTrigger.kill();
      gsap.ticker.lagSmoothing(1000, 16);
    };
  }, []);

  return carouselRef;
}

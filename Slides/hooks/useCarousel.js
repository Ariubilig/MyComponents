import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import slides from "../utils/img.js";
import { createAndAnimateSlide, updateProgressBars } from "../utils/slideUtils";

gsap.registerPlugin(ScrollTrigger);

export function useCarousel() {
  const carouselRef = useRef(null);

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
            // We need to pass a function that can be called from slideUtils
            const result = createAndAnimateSlide(root, targetSlideIndex, isScrollingForward, (h1Element) => {
              // This will be replaced by the actual marquee function from useMarquee
              if (h1Element) {
                const baseText = h1Element.textContent.trim();
                h1Element.innerHTML = `<span class="marquee-unit">${baseText}</span><span class="marquee-unit">${baseText}</span>`;
              }
            });
            
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

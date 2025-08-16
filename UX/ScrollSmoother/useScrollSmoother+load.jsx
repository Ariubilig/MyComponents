import { useEffect } from 'react';
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap } from "gsap";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export const useScrollSmoother = (wrapperRef, loadingFinished) => {
  useEffect(() => {
    if (!loadingFinished || !wrapperRef.current) return;

    let smoother = null;
    
    const timer = setTimeout(() => {
      smoother = ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: 1.5,
        effects: true,
        normalizeScroll: true,
        ignoreMobileResize: true
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      if (smoother) {
        smoother.kill();
      }
    };
  }, [wrapperRef, loadingFinished]);
};
"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";


export const useScrollSmootherLoad = (wrapperRef, PreloaderDone) => {

  useEffect(() => {
    if (!PreloaderDone || !wrapperRef.current) return;
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    ScrollSmoother.get()?.kill(); // // Kill previous instance
    if (ScrollTrigger.isTouch === 1) return; // Disable on touch devices

    const content = wrapperRef.current.querySelector("#smooth-content");
    if (!content) return;

    const smoother = ScrollSmoother.create({
      wrapper: wrapperRef.current,
      content,
      smooth: 1.5,
      effects: true,
      normalizeScroll: true,
      ignoreMobileResize: true,
    });

    ScrollTrigger.normalizeScroll({ allowNestedScroll: true });
    ScrollTrigger.refresh(); // GSAP doesn't always refresh properly when DOM changes
    
    return () => {
      smoother.kill();
    };
  }, [wrapperRef, PreloaderDone]);

};
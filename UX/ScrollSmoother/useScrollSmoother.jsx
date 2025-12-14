"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";


export const useScrollSmoother = (wrapperRef) => {

  useEffect(() => {
    if (!wrapperRef.current) return;

    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    ScrollSmoother.get()?.kill(); // Kill any existing smoother StrictMode/route changes

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

    ScrollTrigger.normalizeScroll({ allowNestedScroll: true }); // Allow nested scrolling (modals, dropdowns, etc.)

    return () => {
      smoother.kill();
    };
  }, []);

};
/**
 * usePreloaderGuard
*
* A production-ready controller for preloaders.
* Handles:
*  - Session-based skipping
*  - Minimum display time (prevents animation cut-off)
*  - Safety timeout (escape hatch if animation gets stuck)
*  - prefers-reduced-motion accessibility
*  - Safe cleanup on unmount
*
* The hook is animation-agnostic:
* GSAP, CSS, SplitText, Lottie, or plain timers can all use it.
*/

import { useEffect, useRef, useState } from 'react';


export function usePreloaderGuard({

  duration = 3000,        // Expected animation duration
  minDisplayTime = 1200,  // Minimum time preloader must stay visible
  sessionKey = 'sessionLoaded', // SessionStorage key
} = {}) {

  // Controls whether the preloader should be rendered
  const [shouldShow, setShouldShow] = useState(true);

  // Timestamp when the preloader mounted (used for min display time)
  const startTimeRef = useRef(null);

  useEffect(() => {
    startTimeRef.current = Date.now();
  }, []);

  // Prevents finish logic from running more than once
  const finishedRef = useRef(false);

  // Stores the safety timeout ID (escape hatch)
  // TypeScript
  // const hardFailRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hardFailRef = useRef(null);


  /**
   * Immediately hides the preloader and marks the session as loaded.
   * This is the ONLY place where we finalize the preloader.
   */
  const forceFinish = () => {
    if (finishedRef.current) return;

    finishedRef.current = true;
    sessionStorage.setItem(sessionKey, 'true');
    setShouldShow(false);
  };

  useEffect(() => {
    // --- Session-based skip ---
    // If the site was already loaded in this tab, skip the preloader entirely.
    const sessionLoaded = sessionStorage.getItem(sessionKey);
    if (sessionLoaded) {
      setShouldShow(false);
      return;
    }

    // --- Accessibility: prefers-reduced-motion ---
    // Users who disable motion should never see animated preloaders.
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      forceFinish();
      return;
    }

    // --- Safety timeout (escape hatch) ---
    // Ensures the user never gets stuck if an animation fails or hangs.
    hardFailRef.current = setTimeout(() => {
      forceFinish();
    }, duration + 2000);

    // Cleanup on unmount or re-run
    return () => {
      if (hardFailRef.current) {
        clearTimeout(hardFailRef.current);
      }
    };
  }, [duration, sessionKey]);

  /**
   * Signals that the animation has completed.
   * Respects the minimum display time to avoid abrupt cut-offs.
   */
  const finish = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;

    // How long the preloader has already been visible
    const elapsed = Date.now() - startTimeRef.current;

    // Remaining time needed to satisfy minDisplayTime
    const remaining = Math.max(0, minDisplayTime - elapsed);

    // Cancel safety timeout since we are handling completion manually
    if (hardFailRef.current) {
      clearTimeout(hardFailRef.current);
    }

    // Finish immediately or after the remaining delay
    setTimeout(forceFinish, remaining);
  };

  // Public API
  return {
    shouldShow, // Used to conditionally render the preloader
    finish,     // Called by the animation when it ends
  };
  
}
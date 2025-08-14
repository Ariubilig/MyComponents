"use client";

import { useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { gsap } from "gsap";

/**
 * ReusablePageTransition
 * - Drop-in wrapper to animate route transitions in Next.js App Router
 * - Self-contained styles via inline styles, no global CSS required
 *
 * Props:
 * - blockCount: number of covering blocks (default 20)
 * - overlayColor: color of cover blocks (default "#222")
 * - backgroundColor: used when logo fills (default "#e3e4d8")
 * - showLogo: toggle logo overlay (default true)
 * - renderLogo: optional render function ({ref}) => ReactNode (must render an SVG with a <path>)
 * - durations: { cover: .4, reveal: .4, blockStagger: .02, logoDraw: 2, logoFill: 1, logoFade: .25 }
 * - interceptLinks: intercept internal anchor clicks (default true)
 * - onTransitionStart / onTransitionEnd: lifecycle callbacks
 */
export default function BlockPageTransition({
  children,
  blockCount = 20,
  overlayColor = "#222",
  durations = {},
  interceptLinks = true,
  onTransitionStart,
  onTransitionEnd,
}) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const overlayRef = useRef(null);
  const blocksRef = useRef([]);
  const isTransitioning = useRef(false);
  const revealTimeoutRef = useRef(null);

  const resolvedDurations = {
    cover: 0.4,
    reveal: 0.4,
    blockStagger: 0.02,
    ...durations,
  };

  // Styles as objects
  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100svh',
    display: 'flex',
    pointerEvents: 'none',
    zIndex: 9999,
  };

  const blockStyle = {
    flex: 1,
    height: '100%',
    background: overlayColor,
    transform: 'scaleX(0)',
    transformOrigin: 'left',
  };

  const handleRouteChange = useCallback(
    (url) => {
      if (isTransitioning.current) return;
      isTransitioning.current = true;
      if (onTransitionStart) onTransitionStart(url);
      coverPage(url);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const onAnchorClick = useCallback(
    (e) => {
      if (!interceptLinks) return;
      if (isTransitioning.current) {
        e.preventDefault();
        return;
      }

      if (
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey ||
        e.button !== 0 ||
        e.currentTarget.target === "_blank"
      ) {
        return;
      }

      const href = e.currentTarget.href;
      if (!href) return;
      const url = new URL(href).pathname;
      if (url !== pathname) {
        e.preventDefault();
        handleRouteChange(url);
      }
    },
    [pathname, handleRouteChange, interceptLinks]
  );

  const revealPage = useCallback(() => {
    if (revealTimeoutRef.current) {
      clearTimeout(revealTimeoutRef.current);
    }

    gsap.set(blocksRef.current, { scaleX: 1, transformOrigin: "right" });

    gsap.to(blocksRef.current, {
      scaleX: 0,
      duration: resolvedDurations.reveal,
      stagger: resolvedDurations.blockStagger,
      ease: "power2.out",
      transformOrigin: "right",
      onComplete: () => {
        isTransitioning.current = false;
        if (overlayRef.current) overlayRef.current.style.pointerEvents = "none";
        if (onTransitionEnd) onTransitionEnd();
      },
    });

    revealTimeoutRef.current = setTimeout(() => {
      if (blocksRef.current.length > 0) {
        const firstBlock = blocksRef.current[0];
        if (firstBlock && gsap.getProperty(firstBlock, "scaleX") > 0) {
          gsap.to(blocksRef.current, {
            scaleX: 0,
            duration: Math.min(0.25, resolvedDurations.reveal),
            ease: "power2.out",
            transformOrigin: "right",
            onComplete: () => {
              isTransitioning.current = false;
              if (overlayRef.current) overlayRef.current.style.pointerEvents = "none";
              if (onTransitionEnd) onTransitionEnd();
            },
          });
        }
      }
    }, 1000);
  }, [resolvedDurations, onTransitionEnd]);

  useEffect(() => {
    const createBlocks = () => {
      if (!overlayRef.current) return;
      overlayRef.current.innerHTML = "";
      blocksRef.current = [];
      const count = Math.max(1, Number(blockCount) || 20);
      for (let i = 0; i < count; i++) {
        const block = document.createElement("div");
        // Apply styles directly to the element
        Object.assign(block.style, blockStyle);
        overlayRef.current.appendChild(block);
        blocksRef.current.push(block);
      }
    };

    createBlocks();
    gsap.set(blocksRef.current, { scaleX: 0, transformOrigin: "left" });

    const links = interceptLinks ? document.querySelectorAll('a[href^="/"]') : [];
    links.forEach((link) => link.addEventListener("click", onAnchorClick));

    return () => {
      links.forEach((link) => link.removeEventListener("click", onAnchorClick));
      if (revealTimeoutRef.current) clearTimeout(revealTimeoutRef.current);
    };
  }, [pathname, onAnchorClick, revealPage, blockCount, interceptLinks, blockStyle]);

  // Reveal only after a navigation occurred (not on initial load)
  useEffect(() => {
    if (isTransitioning.current) {
      revealPage();
    }
  }, [pathname, revealPage]);

  const coverPage = (url) => {
    if (overlayRef.current) overlayRef.current.style.pointerEvents = "auto";

    const tl = gsap.timeline({ onComplete: () => navigate(url) });

    tl.to(blocksRef.current, {
      scaleX: 1,
      duration: resolvedDurations.cover,
      stagger: resolvedDurations.blockStagger,
      ease: "power2.out",
      transformOrigin: "left",
    });
  };

  return (
    <>
      <div ref={overlayRef} style={overlayStyle} />
      {children}
    </>
  );
}
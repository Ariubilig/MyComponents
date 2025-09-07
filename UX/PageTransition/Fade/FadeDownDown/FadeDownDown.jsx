import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import './FadeDownUpText.css';

const FadeDownDown = ({ children, transitionImage, routeNames }) => {
  const location = useLocation();
  const overlayRef = useRef(null);
  const contentRef = useRef(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayLocation, setDisplayLocation] = useState(location);

  // Custom easing from the original code
  const slideEase = "cubic-bezier(0.65,0.05,0.36,1)";

  useEffect(() => {
    // Only run transition if location actually changed (pathname or search)
    if (location.pathname !== displayLocation.pathname ||
        location.search !== displayLocation.search) {
      setIsTransitioning(true);

      // First, reset overlay to top position (in case it was at bottom from previous transition)
      gsap.set(overlayRef.current, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)"
      });

      // Phase 1: Transition out (fade down)
      const exitTimeline = gsap.timeline({
        onComplete: () => {
          // Update the displayed location ONLY after overlay fully covers
          setDisplayLocation(location);

          // Brief pause between phases
          setTimeout(() => {
            // Phase 2: Continue fade down and reveal new content
            const enterTimeline = gsap.timeline({
              onComplete: () => {
                setIsTransitioning(false);
              }
            });

            // Continue sliding the overlay down and out of view
            enterTimeline.to(overlayRef.current, {
              clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
              duration: 0.64,
              ease: slideEase
            });

            // Fade in new content - start slightly after overlay begins moving
            enterTimeline.to(contentRef.current, {
              opacity: 1,
              duration: 0.3
            }, "-=0.2");
          }, 200);
        }
      });

      // Fade out current content
      exitTimeline.to(contentRef.current, {
        opacity: 0,
        duration: 0.3
      });

      // Phase 1: Animate overlay down to cover screen
      exitTimeline.to(overlayRef.current, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        duration: 0.64,
        ease: slideEase
      }, "-=0.1");
    }
  }, [location.pathname, location.search, displayLocation.pathname, displayLocation.search]);

  // Initialize overlay position on mount (starts from top, hidden)
  useEffect(() => {
    if (overlayRef.current) {
      gsap.set(overlayRef.current, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)"
      });
    }
  }, []);

  return (
    <div className="page-transition-container">
      {/* Transition overlay with image */}
      <div 
        ref={overlayRef}
        className="page-transition-overlay"
        style={{
          backgroundImage: transitionImage ? `url(${transitionImage})` : 'none'
        }}
      >
      </div>

      <div 
        ref={contentRef}
        className="page-transition-content"
        style={{
          // Ensure content is hidden during transition
          opacity: isTransitioning ? 0 : 1
        }}
      >
        {/* Render children with the current display location */}
        <div key={displayLocation.pathname}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default FadeDownDown;
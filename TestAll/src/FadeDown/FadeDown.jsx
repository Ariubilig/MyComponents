import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import './FadeDown.css';

const FadeDown = ({ children, transitionImage }) => {
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
      
      // Transition out (fade down)
      const exitTimeline = gsap.timeline({
        onComplete: () => {
          // CRITICAL: Update the displayed location ONLY after overlay fully covers
          setDisplayLocation(location);
          
          // Small delay to ensure content has updated
          requestAnimationFrame(() => {
            // Transition in (fade up)
            const enterTimeline = gsap.timeline({
              onComplete: () => {
                setIsTransitioning(false);
              }
            });
            
            // Reset overlay position for enter animation
            gsap.set(overlayRef.current, {
              clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"
            });
            
            // Animate overlay out (fade up)
            enterTimeline.to(overlayRef.current, {
              clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
              duration: 0.64,
              ease: slideEase
            });
            
            // Fade in new content - start slightly after overlay begins moving
            enterTimeline.to(contentRef.current, {
              opacity: 1,
              duration: 0.3
            }, "-=0.2");
          });
        }
      });
      
      // Fade out current content
      exitTimeline.to(contentRef.current, {
        opacity: 0,
        duration: 0.3
      });
      
      // Animate overlay in (fade down) - make sure this completes before content update
      exitTimeline.to(overlayRef.current, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        duration: 0.64,
        ease: slideEase
      }, "-=0.1");
    }
  }, [location.pathname, location.search, displayLocation.pathname, displayLocation.search]);
  
  // Initialize overlay position on mount
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
      />
      
      {/* Content wrapper */}
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

export default FadeDown;
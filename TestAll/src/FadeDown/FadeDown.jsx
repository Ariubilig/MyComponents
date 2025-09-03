import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import './FadeDown.css';

const FadeDown = ({ children, transitionImage, routeNames }) => {
  const location = useLocation();
  const overlayRef = useRef(null);
  const contentRef = useRef(null);
  const routeTextRef = useRef(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayLocation, setDisplayLocation] = useState(location);
  
  // Custom easing from the original code
  const slideEase = "cubic-bezier(0.65,0.05,0.36,1)";
  
  // Function to get route display name
  const getRouteName = (pathname) => {
    // If custom route names are provided, use them
    if (routeNames && routeNames[pathname]) {
      return routeNames[pathname];
    }
    
    // Default route name extraction
    if (pathname === '/') return 'HOME';
    
    // Remove leading slash and convert to uppercase
    const routeName = pathname.replace('/', '').toUpperCase();
    
    // Handle nested routes (e.g., /about/team -> ABOUT / TEAM)
    return routeName.replace(/\//g, ' / ');
  };
  
  useEffect(() => {
    // Only run transition if location actually changed (pathname or search)
    if (location.pathname !== displayLocation.pathname || 
        location.search !== displayLocation.search) {
      setIsTransitioning(true);
      
      // Get the destination route name
      const destinationRoute = getRouteName(location.pathname);
      
      // Transition out (fade down)
      const exitTimeline = gsap.timeline({
        onComplete: () => {
          // CRITICAL: Update the displayed location ONLY after overlay fully covers
          setDisplayLocation(location);
          
          // Longer delay to let users read the route text
          setTimeout(() => {
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
            
            // Fade out route text before overlay moves up
            enterTimeline.to(routeTextRef.current, {
              opacity: 0,
              duration: 0.4
            });
            
            // Animate overlay out (fade up)
            enterTimeline.to(overlayRef.current, {
              clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
              duration: 0.64,
              ease: slideEase
            }, "-=0.1");
            
            // Fade in new content - start slightly after overlay begins moving
            enterTimeline.to(contentRef.current, {
              opacity: 1,
              duration: 0.3
            }, "-=0.2");
          }, 400); // Reduced to 400ms - enough to read but not sluggish
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
      
      // Set route text immediately before overlay animation starts
      exitTimeline.set(routeTextRef.current, {
        textContent: `[ ${destinationRoute} ]`
      }, 0);
      
      // Show route text after overlay covers screen with smoother animation
      exitTimeline.to(routeTextRef.current, {
        opacity: 1,
        duration: 0.5,
        ease: "power2.out"
      }, "-=0.3");
    }
  }, [location.pathname, location.search, displayLocation.pathname, displayLocation.search, routeNames]);
  
  // Initialize overlay position on mount
  useEffect(() => {
    if (overlayRef.current) {
      gsap.set(overlayRef.current, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)"
      });
    }
    if (routeTextRef.current) {
      gsap.set(routeTextRef.current, {
        opacity: 0
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
        {/* Route indicator text */}
        <div 
          ref={routeTextRef}
          className="page-transition-route-text"
>
        </div>
      </div>
      
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
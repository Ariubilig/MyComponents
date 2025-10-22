import { useEffect, useState } from 'react';
import gsap from 'gsap';
import "./Preloader.css"


const Preloader = ({ onFinish }) => {
  const [shouldShow, setShouldShow] = useState(true);

  useEffect(() => {
    // Check if session has already loaded
    const sessionLoaded = sessionStorage.getItem('sessionLoaded');
    
    if (sessionLoaded) {
      // Skip loading screen if already loaded session
      setShouldShow(false);
      if (onFinish) onFinish();
      return;
    }

    const tl = gsap.timeline({ // GSAP timeline animation
      delay: 0.25,
      onComplete: () => {
        // Mark session as loaded
        sessionStorage.setItem('sessionLoaded', 'true');
        if (onFinish) onFinish();
      },
    });

    
    tl.to(".progress-bar", { // Animate progress bar
      scaleX: 1,
      duration: 3,
      ease: "power3.inOut",
    })
      .set(".progress-bar", { transformOrigin: "right" })
      .to(".progress-bar", {
        scaleX: 0,
        duration: 2,
        ease: "power3.in",
      });


    tl.to(".preloader", { // Hide preloader, fade up
      clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
      duration: 1.75,
      ease: "power4.inOut",
    });

    return () => {
      tl.kill();
    };
  }, [onFinish]);

  // Don't render anything if we should skip the loading screen!!!
  if (!shouldShow) {
    return null;
  }

  return (
    <div className="preloader">
      <div className="progress-bar"></div>
    </div>
  );
};

export default Preloader
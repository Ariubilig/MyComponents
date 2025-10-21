import { useEffect, useState } from 'react';
import gsap from 'gsap';
import "./Preloader.css"


const Preloader = ({ onFinish }) => {

  useEffect(() => {
    const tl = gsap.timeline({
      delay: 0.25,
      onComplete: () => {
        if (onFinish) onFinish();
      },
    });

    // Animate progress bar
    tl.to(".progress-bar", {
      scaleX: 1,
      duration: 4,
      ease: "power3.inOut",
    })
      .set(".progress-bar", { transformOrigin: "right" })
      .to(".progress-bar", {
        scaleX: 0,
        duration: 1,
        ease: "power3.in",
      });

    // Hide preloader, fade up
    tl.to(".preloader", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
      duration: 1.75,
      ease: "power4.inOut",
    });

    return () => {
      tl.kill();
    };
  }, [onFinish]);

  
  return (
    <div className="preloader">
      <div className="progress-bar"></div>
    </div>
  );

};

export default Preloader
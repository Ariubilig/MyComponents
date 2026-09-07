import React, { useEffect, useRef } from 'react';
import { useMarquee } from './useMarquee';
import './MarqueeExample.css';

const Marquee = () => {
  const { initMarqueeAnimation } = useMarquee();
  const marqueeRef = useRef(null);

  useEffect(() => {
    if (marqueeRef.current) {
      initMarqueeAnimation(marqueeRef.current);
    }
  }, []);

  return (
    <div className="marquee-example">
      <h2>Custom Marquee Text</h2>
      
      <div className="marquee-container">
        <h3 
          ref={marqueeRef}
          className="marquee-text"
          data-text="Your custom text here - Change this to anything you want for your project"
        >
          Your custom text here - Change this to anything you want for your project
        </h3>
      </div>
    </div>
  );
};

export default Marquee;

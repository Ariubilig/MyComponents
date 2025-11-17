import './Preloader.css'
import { useEffect, useState } from 'react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';


export default function Preloader({ onFinish }) {

  const [shouldShow, setShouldShow] = useState(true);

  // EARLY EXIT — do NOT render preloader DOM
  // This prevents unnecessary paints + effects.
  if (!shouldShow) return null;

useEffect(() => {

  const sessionLoaded = sessionStorage.getItem('sessionLoaded');

  if (sessionLoaded) {
    setShouldShow(false);
    onFinish?.();
    return;
  }

  gsap.registerPlugin(SplitText);

  let tl; // <-- so cleanup can kill it later

  const splitTextIntoLines = (selector, options = {}) => {
    const defaults = {
      type: 'lines',
      mask: 'lines',
      linesClass: 'line',
      ...options,
    };

    return SplitText.create(selector, defaults);
  };

  // Counter animation stays the same
  const animateCounter = (selector, duration = 4.5, delay = 0) => {
    const counterElement = document.querySelector(selector);
    let currentValue = 0;
    const updateInterval = 200;
    const maxDuration = duration * 1000;
    const startTime = Date.now();

    setTimeout(() => {
      const updateCounter = () => {
        const elapsedTime = Date.now() - startTime;
        const progress = elapsedTime / maxDuration;

        if (currentValue < 100 && elapsedTime < maxDuration) {
          const target = Math.floor(progress * 100);
          const jump = Math.floor(Math.random() * 25) + 5;
          currentValue = Math.min(currentValue + jump, target, 100);

          counterElement.textContent = currentValue
            .toString()
            .padStart(2, '0');

          setTimeout(updateCounter, updateInterval + Math.random() * 100);
        } else {
          counterElement.textContent = '100';
        }
      };

      updateCounter();
    }, delay * 1000);
  };

  animateCounter('.preloader-counter p', 4.5, 2);


  // --- Run Split + GSAP animation ---
  const runSplitAndAnimation = () => {
    splitTextIntoLines('.preloader-copy p');
    splitTextIntoLines('.preloader-counter p');

    tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem('sessionLoaded', 'true');
        setShouldShow(false);
        onFinish?.();
      },
    });

    tl.to(['.preloader-copy p .line', '.preloader-counter p .line'], {
      y: '0%',
      duration: 1,
      stagger: 0.075,
      ease: 'power3.out',
      delay: 1,
    })
      .to('.preloader', {
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
        duration: 1.25,
        ease: 'power3.out',
        delay: 3.5,
      });
  };


  // --- Version 2's font loading logic (kept exactly) ---
  if (document.fonts.status === 'loaded') {
    runSplitAndAnimation();
  } else {
    document.fonts.ready.then(runSplitAndAnimation);
  }

  
  // --- GSAP CLEANUP (from Version 2) ---
  return () => {
    tl?.kill();
  };

}, [onFinish]);
  

  return (
    <>

      <div className="preloader">
        <div className="preloader-copy">
          <div className="preloader-copy-col">
            <p>
              Handpicked collections shaped by artistry, balancing rare elements
              with a focus on purity.
            </p>
          </div>
          <div className="preloader-copy-col">
            <p>
              Explore timeless essentials built with care, thoughtfully designed
              to guide you.
            </p>
          </div>
        </div>

        <div className="preloader-counter">
          <p>00</p>
        </div>
      </div>

    </>
  );
}
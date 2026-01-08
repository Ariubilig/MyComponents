import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import "./Preloader.css";
import { usePreloaderGuard } from '../../hooks/useGuard';



const Preloader = ({ onFinish }) => {

  const { shouldShow, finish } = usePreloaderGuard({
    duration: 5000,        // total GSAP timeline time
    minDisplayTime: 1200,  // prevent flash
  });

  // Track if onFinish has been called to prevent double-calling
  const hasCalledFinish = useRef(false);

  // Ensure onFinish is called when preloader is dismissed (regardless of how)
  useEffect(() => {
    if (!shouldShow && !hasCalledFinish.current) {
      hasCalledFinish.current = true;
      onFinish?.();
    }
  }, [shouldShow, onFinish]);

  useEffect(() => {
    if (!shouldShow) return;

    const tl = gsap.timeline({
      delay: 0.25,
      onComplete: () => {
        if (!hasCalledFinish.current) {
          hasCalledFinish.current = true;
          finish();     // tell guard animation done
          onFinish?.(); // tell App animation finished
        }
      },
    });

    tl.to(".progress-bar", {
      scaleX: 1,
      duration: 3,
      ease: "power3.inOut",
    })
      .set(".progress-bar", { transformOrigin: "right" })
      .to(".progress-bar", {
        scaleX: 0,
        duration: 2,
        ease: "power3.in",
      })
      .to(".preloader", {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        duration: 1.75,
        ease: "power4.inOut",
      });

    return () => {
      tl.kill();
    };
  }, [shouldShow, finish, onFinish]);

  if (!shouldShow) return null;

  return (
    <div className="preloader">
      <div className="progress-bar"></div>
    </div>
  );
};


export default Preloader;
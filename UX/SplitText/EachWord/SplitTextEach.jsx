import React, { useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(SplitText, ScrollTrigger);

/**
 * SplitTextEach - A reusable component that animates text by splitting it into characters
 * and animating each character from bottom to top
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Text content to animate
 * @param {boolean} props.animateOnScroll - Whether to trigger animation on scroll (default: true)
 * @param {number} props.delay - Initial delay before animation starts (default: 0)
 * @param {number} props.duration - Animation duration in seconds (default: 1)
 * @param {number} props.stagger - Delay between each character animation (default: 0.03)
 * @param {string} props.ease - GSAP easing function (default: "power4.out")
 * @param {string} props.scrollTriggerStart - Scroll trigger start position (default: "top 75%")
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.style - Additional inline styles
 * @param {string} props.wrapperTag - HTML tag for wrapper element (default: "div")
 */
export default function Each({ 
  children, 
  animateOnScroll = true, 
  delay = 0,
  duration = 1,
  stagger = 0.03,
  ease = "power4.out",
  scrollTriggerStart = "top 75%",
  className = "",
  style = {},
  wrapperTag = "div"
}) {
  const containerRef = useRef(null);
  const elementRefs = useRef([]);
  const splitRefs = useRef([]);
  const chars = useRef([]);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      // Clean up previous splits
      splitRefs.current.forEach((split) => {
        if (split) {
          split.revert();
        }
      });

      splitRefs.current = [];
      chars.current = [];
      elementRefs.current = [];

      let elements = [];
      if (containerRef.current.hasAttribute("data-text-wrapper")) {
        elements = Array.from(containerRef.current.children);
      } else {
        elements = [containerRef.current];
      }

      elements.forEach((element) => {
        elementRefs.current.push(element);

        try {
          const split = SplitText.create(element, {
            type: "chars",
            mask: "chars",
            charsClass: "char++",
          });

          splitRefs.current.push(split);
          chars.current.push(...split.chars);
        } catch (error) {
          console.warn("SplitTextEach: Failed to split element", error);
        }
      });

      if (chars.current.length === 0) return;

      // Set initial position
      gsap.set(chars.current, { y: "100%" });

      const animationProps = {
        y: "0%",
        duration: duration,
        stagger: stagger,
        ease: ease,
        delay: delay,
      };

      if (animateOnScroll) {
        gsap.to(chars.current, {
          ...animationProps,
          scrollTrigger: {
            trigger: containerRef.current,
            start: scrollTriggerStart,
            once: true,
          },
        });
      } else {
        gsap.to(chars.current, animationProps);
      }

      return () => {
        splitRefs.current.forEach((split) => {
          if (split) {
            split.revert();
          }
        });
      };
    },
    { scope: containerRef, dependencies: [animateOnScroll, delay, duration, stagger, ease, scrollTriggerStart] }
  );

  // If single child, clone it with ref
  if (React.Children.count(children) === 1) {
    return React.cloneElement(children, { 
      ref: containerRef,
      className: `${children.props.className || ""} ${className}`.trim(),
      style: { ...children.props.style, ...style }
    });
  }

  // Multiple children need wrapper
  const WrapperComponent = wrapperTag;
  return (
    <WrapperComponent 
      ref={containerRef} 
      data-text-wrapper="true"
      className={className}
      style={style}
    >
      {children}
    </WrapperComponent>
  );
}
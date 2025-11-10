import React, { useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(SplitText, ScrollTrigger);

/**
 * SplitTextLines - A reusable component that animates text by splitting it into lines
 * and animating each line from bottom to top
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Text content to animate
 * @param {boolean} props.animateOnScroll - Whether to trigger animation on scroll (default: true)
 * @param {number} props.delay - Initial delay before animation starts (default: 0)
 * @param {number} props.duration - Animation duration in seconds (default: 1)
 * @param {number} props.stagger - Delay between each line animation (default: 0.1)
 * @param {string} props.ease - GSAP easing function (default: "power4.out")
 * @param {string} props.scrollTriggerStart - Scroll trigger start position (default: "top 75%")
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.style - Additional inline styles
 * @param {string} props.wrapperTag - HTML tag for wrapper element (default: "div")
 */
export default function SplitTextLines({ 
  children, 
  animateOnScroll = true, 
  delay = 0,
  duration = 1,
  stagger = 0.1,
  ease = "power4.out",
  scrollTriggerStart = "top 75%",
  className = "",
  style = {},
  wrapperTag = "div"
}) {
  const containerRef = useRef(null);
  const elementRefs = useRef([]);
  const splitRefs = useRef([]);
  const lines = useRef([]);

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
      lines.current = [];
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
            type: "lines",
            mask: "lines",
            linesClass: "line++",
            lineThreshold: 0.1,
          });

          splitRefs.current.push(split);

          // Handle text-indent CSS property
          const computedStyle = window.getComputedStyle(element);
          const textIndent = computedStyle.textIndent;

          if (textIndent && textIndent !== "0px") {
            if (split.lines.length > 0) {
              split.lines[0].style.paddingLeft = textIndent;
            }
            element.style.textIndent = "0";
          }

          lines.current.push(...split.lines);
        } catch (error) {
          console.warn("SplitTextLines: Failed to split element", error);
        }
      });

      if (lines.current.length === 0) return;

      // Set initial position
      gsap.set(lines.current, { y: "100%" });

      const animationProps = {
        y: "0%",
        duration: duration,
        stagger: stagger,
        ease: ease,
        delay: delay,
      };

      if (animateOnScroll) {
        gsap.to(lines.current, {
          ...animationProps,
          scrollTrigger: {
            trigger: containerRef.current,
            start: scrollTriggerStart,
            once: true,
          },
        });
      } else {
        gsap.to(lines.current, animationProps);
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
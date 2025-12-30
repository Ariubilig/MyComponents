import React, { useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(SplitText, ScrollTrigger);

export default function Up({ 
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
  const splitRefs = useRef([]);
  const lines = useRef([]);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      document.fonts.ready.then(() => {
        splitRefs.current.forEach(split => split?.revert()); // revert previous SplitText
        splitRefs.current = [];
        lines.current = [];

        const elements = containerRef.current.hasAttribute("data-text-wrapper")
          ? Array.from(containerRef.current.children)
          : [containerRef.current];

        elements.forEach(element => {
          try {
            const split = SplitText.create(element, {
              type: "lines",
              mask: "lines",
              linesClass: "line++",
              lineThreshold: 0.1,
            });

            splitRefs.current.push(split);

            const computedStyle = window.getComputedStyle(element); // Handle text-indent
            const textIndent = computedStyle.textIndent;

            if (textIndent && textIndent !== "0px") {
              if (split.lines.length > 0) {
                split.lines[0].style.paddingLeft = textIndent;
              }
              element.style.textIndent = "0";
            }

            lines.current.push(...split.lines);
          } catch (error) {
            console.warn("SplitTextUp: Failed to split element", error);
          }
        });

        if (lines.current.length === 0) return;

        gsap.set(lines.current, { y: "100%" });

        const animationProps = {
          y: "0%",
          duration,
          stagger,
          ease,
          delay,
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

          ScrollTrigger.refresh(); // Refresh ScrollTrigger for smoothScroll
        } else {
          gsap.to(lines.current, animationProps);
        }
      });

      return () => {
        splitRefs.current.forEach(split => split?.revert()); // revert SplitText
        ScrollTrigger.getAll().forEach(st => { // Clean up ScrollTriggers
          if (st.trigger === containerRef.current) {
            st.kill();
          }
        });
      };
    },
    {
      scope: containerRef,
      dependencies: [animateOnScroll, delay, duration, stagger, ease, scrollTriggerStart],
    }
  );

  if (React.Children.count(children) === 1) { // Single child
    return React.cloneElement(children, { 
      ref: containerRef,
      className: `${children.props.className || ""} ${className}`.trim(),
      style: { ...children.props.style, ...style }
    });
  }

  const WrapperComponent = wrapperTag; // Multiple children
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
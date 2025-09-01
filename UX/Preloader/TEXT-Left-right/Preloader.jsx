"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import CustomEase from "gsap/CustomEase";

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(CustomEase);

export default function Preloader({
  loadingText = "Eloo",
  duration = 2,
  barColor = "",
  maxValue = 100,
  onComplete,
  storageKey = "preloaderSeen" // key for session storage
}) {
  const container = useRef();
  const [shouldShow, setShouldShow] = useState(true);
  const customEase = CustomEase.create("custom", ".87,0,.13,1");

  // Check if preloader already seen this session
  useEffect(() => {
    if (sessionStorage.getItem(storageKey)) {
      setShouldShow(false);
      if (typeof onComplete === "function") onComplete();
    } else {
      sessionStorage.setItem(storageKey, "true");
    }
  }, [onComplete, storageKey]);

  useGSAP(
    () => {
      if (!shouldShow) return;

      if (typeof window !== "undefined" && document.readyState === "complete") {
        const counter = document.getElementById("counter");
        const progressBar = document.querySelector(".progress-bar");
        if (progressBar && counter) {
          gsap.to(progressBar, {
            width: "100vw",
            duration,
            ease: customEase,
            background: barColor,
          });
          gsap.to(counter, {
            innerHTML: maxValue,
            duration,
            ease: customEase,
            snap: { innerHTML: 1 },
          });
        }
        gsap.to(".progress-bar", {
          opacity: 0,
          duration: 0.3,
          delay: duration + 0.3,
          onComplete: () => {
            if (typeof onComplete === "function") onComplete();
          }
        });
      }
    },
    { scope: container, dependencies: [shouldShow, loadingText, duration, barColor, maxValue, onComplete] }
  );

  if (!shouldShow) return null; // skip rendering preloader if already seen

  return (
    <div className="preloader" ref={container}>
      <div className="progress-bar" style={{ background: barColor }}>
        <p>{loadingText}</p>
        <p>
          /<span id="counter">0</span>
        </p>
      </div>
    </div>
  );
}
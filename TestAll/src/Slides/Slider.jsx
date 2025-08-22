import React from "react";
import { useCarousel } from "./hooks/useCarousel.js";
import { buildProgressBars } from "./utils/slideUtils.js";
import "./Slider.css";


export default function Slider() {
  
  const carouselRef = useCarousel();

  // Initialize progress bars when component mounts
  React.useEffect(() => {
    const root = carouselRef.current;
    if (!root) return;

    buildProgressBars(root);
  }, [carouselRef]);

  return (
    <>
      
      <section className="intro">
        <p>Where Vision Ignites and Boundaries Fade.</p>
      </section>
      
      <section className="carousel" ref={carouselRef}></section>
      
      <section className="outro">
        <p>Endless Horizons Await Beyond the Canvas.</p>
      </section>
      
    </>
  );
}
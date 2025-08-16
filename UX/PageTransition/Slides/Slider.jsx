import React from "react";
import { useCarousel } from "./hooks/useCarousel.js";
import { buildProgressBars } from "./utils/slideUtils.js";
import "./Slider.css";


export default function Slider() {
  
  const carouselRef = useCarousel();

  React.useEffect(() => {
    const root = carouselRef.current;
    if (!root) return;

    buildProgressBars(root);
  }, [carouselRef]);

  return (
    <>
      <nav>
        <div className="logo">
          <a href="#">nova</a>
        </div>
        <div className="nav-items">
          <a href="#">Home</a>
          <a href="#">Projects</a>
          <a href="#">Gallery</a>
          <a href="#">Experiences</a>
          <a href="#">Contact</a>
        </div>
      </nav>
      
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
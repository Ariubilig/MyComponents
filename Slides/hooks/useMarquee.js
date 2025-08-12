import { useEffect } from "react";
import gsap from "gsap";

export function useMarquee() {
  const initMarqueeAnimation = (h1Element) => {
    if (!h1Element) return;

    const baseText = h1Element.getAttribute("data-text") || h1Element.textContent.trim();
    h1Element.setAttribute("data-text", baseText);
    h1Element.innerHTML = `<span class="marquee-unit">${baseText}</span><span class="marquee-unit">${baseText}</span>`;

    const firstUnit = h1Element.querySelector(".marquee-unit");
    if (!firstUnit) return;

    requestAnimationFrame(() => {
      const unitWidth = firstUnit.offsetWidth;
      const pixelsPerSecond = 150; // speed

      if (h1Element._marqueeTick) {
        gsap.ticker.remove(h1Element._marqueeTick);
      }

      let x = 0;
      const tick = () => {
        x -= (pixelsPerSecond / 60) * gsap.ticker.deltaRatio();
        if (x <= -unitWidth) x += unitWidth;
        gsap.set(h1Element, { x });
      };

      h1Element._marqueeTick = tick;
      gsap.ticker.add(tick);
    });
  };

  return { initMarqueeAnimation };
}

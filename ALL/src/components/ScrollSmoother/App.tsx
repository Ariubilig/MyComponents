import "./App.css";
import smootherCss from "./ScrollSmoother.css?inline";
import { useRef } from "react";
import { useScrollSmoother } from "./useScrollSmoother";
import { useScopedStyle } from "../../useScopedStyle";

/**
 * GSAP ScrollSmoother over a fixed wrapper/content pair.
 *
 * The hook bails on touch (`ScrollTrigger.isTouch`) and leaves native
 * scrolling alone, so on a phone this page should feel completely ordinary —
 * that is the case worth checking, not just the smoothing.
 *
 * `data-speed` is what `effects: true` reads: the two marked blocks should
 * drift against the rest of the page as it scrolls.
 *
 * The stylesheet is injected rather than imported because it styles `html,
 * body` globally — see `useScopedStyle`.
 */
export default function App() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  useScopedStyle(smootherCss);
  useScrollSmoother(wrapperRef);

  return (
    <div id="smooth-wrapper" ref={wrapperRef}>
      <div id="smooth-content">
        <div className="smoother-demo">
          <h1>ScrollSmoother</h1>
          <p>
            Scroll. The page should lag your input slightly and settle, rather
            than tracking the wheel one-to-one.
          </p>

          {Array.from({ length: 12 }, (_, i) => (
            <section key={i}>
              <span>{i + 1}</span>
            </section>
          ))}

          <section data-speed="0.5">
            <span>data-speed 0.5 — drifts slower</span>
          </section>
          <section data-speed="1.5">
            <span>data-speed 1.5 — drifts faster</span>
          </section>

          <p>End of the page.</p>
        </div>
      </div>
    </div>
  );
}

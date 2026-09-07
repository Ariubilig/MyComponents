import "./App.css";
import ScrollBar from "./ScrollBar";
import { smootherScroller } from "./smootherScroller";

/**
 * The bar only has something to do on a page that actually overflows, so the
 * filler below is the test fixture — scroll it, drag the thumb, click the
 * track, and resize the window to check the thumb is re-measured.
 *
 * Nothing here creates a ScrollSmoother, so `smootherScroller` is exercising
 * its window-scroll fallback. Swap the prop out to test the bar standalone.
 */
export default function App() {
  return (
    <>
      <ScrollBar className="sb-demo__bar" scroller={smootherScroller} />
      <div className="sb-demo">
        <h1>ScrollBar</h1>
        <p>
          Drag the thumb, click the track, resize the window. The bar parks its
          rAF loop once the position settles, so an idle page costs nothing.
        </p>
        {Array.from({ length: 40 }, (_, i) => (
          <p key={i} className="sb-demo__filler">
            {i + 1}
          </p>
        ))}
        <p>End of the page.</p>
      </div>
    </>
  );
}

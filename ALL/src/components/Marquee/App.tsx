import "./App.css";
import { useState } from "react";
import Marquee from "./Marquee";

/**
 * A gsap.ticker loop translating a doubled copy of the text, wrapping when the
 * first copy has fully scrolled past. Worth checking: the seam never shows a
 * gap, and remounting doesn't leave the old ticker running — `useMarquee`
 * stashes its tick on the element and removes it before adding a new one.
 */
export default function App() {
  const [run, setRun] = useState(0);

  return (
    <div className="marquee-demo">
      <button onClick={() => setRun((n) => n + 1)}>Remount</button>
      {/* A new key forces a full teardown, which is the leak worth watching. */}
      <Marquee key={run} />
    </div>
  );
}

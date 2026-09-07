import "./App.css";
import { useState } from "react";
import Reveal from "./SplitTextReveal";

/**
 * Splits text into masked lines or chars and staggers them up from below.
 *
 * The three blocks cover the branches worth checking: a single child (cloned,
 * so the reveal keeps your own element and classes), several children (wrapped
 * in `data-text-wrapper`, each split separately), and `type="chars"`, which
 * switches to a tighter default stagger.
 *
 * The lower blocks wait for `animateOnScroll` — scroll them into view rather
 * than expecting them on load.
 */
export default function App() {
  const [run, setRun] = useState(0);

  return (
    <div className="reveal-demo" key={run}>
      <button onClick={() => setRun((n) => n + 1)}>Replay</button>

      <section>
        <h2>single child · lines · on load</h2>
        <Reveal animateOnScroll={false} type="lines">
          <p>
            One element in, one element out. The reveal clones your node rather
            than wrapping it, so whatever classes and styles it carries survive
            the split intact.
          </p>
        </Reveal>
      </section>

      <section>
        <h2>multiple children · lines · on scroll</h2>
        <Reveal>
          <p>Several children get a wrapper element instead of a clone.</p>
          <p>Each one is split on its own, then animated as a single run.</p>
        </Reveal>
      </section>

      <section>
        <h2>chars · on scroll</h2>
        <Reveal type="chars">
          <p>Character by character.</p>
        </Reveal>
      </section>
    </div>
  );
}

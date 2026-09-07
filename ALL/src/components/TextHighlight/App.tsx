import "./App.css";
import { useRef } from "react";
import TextHighlight from "./TextHighlight";
import type { TextHighlightRef } from "./TextHighlight";

/** Every trigger and direction `TextHighlight` supports, in one page. */
export default function App() {
  const manual = useRef<TextHighlightRef>(null);

  return (
    <div className="App th-demo">
      {/* Default: sweeps once when it scrolls into view. */}
      <section>
        <h2>inView</h2>
        <TextHighlight as="p">
          Fires once when it enters the viewport — the default, and the one you
          want for body copy.
        </TextHighlight>
      </section>

      {/* Hover: follows the pointer in and back out again. */}
      <section>
        <h2>hover</h2>
        <TextHighlight as="p" triggerType="hover" highlightColor="hsl(180 70% 80%)">
          Draws on pointer enter and undraws on leave, so it reads as a state
          rather than a one-shot.
        </TextHighlight>
      </section>

      {/* Auto: plays on mount, no trigger at all. */}
      <section>
        <h2>auto</h2>
        <TextHighlight
          as="p"
          triggerType="auto"
          highlightColor="hsl(330 90% 85%)"
          transition={{ type: "spring", duration: 2, bounce: 0 }}
        >
          Plays as soon as it mounts, here slowed to two seconds.
        </TextHighlight>
      </section>

      {/* Ref: you decide when, and can override the direction per run. */}
      <section>
        <h2>ref</h2>
        <TextHighlight as="p" triggerType="ref" ref={manual}>
          Driven from outside — replay it as many times as you like.
        </TextHighlight>
        <div className="th-demo__controls">
          <button onClick={() => manual.current?.animate()}>animate</button>
          <button onClick={() => manual.current?.animate("rtl")}>
            animate rtl
          </button>
          <button onClick={() => manual.current?.reset()}>reset</button>
        </div>
      </section>

      {/* Direction changes which edge the gradient grows from. */}
      <section>
        <h2>direction</h2>
        {(["ltr", "rtl", "ttb", "btt"] as const).map((direction) => (
          <TextHighlight
            key={direction}
            as="p"
            triggerType="hover"
            direction={direction}
            highlightColor="hsl(60 90% 68%)"
          >
            {direction} — hover me
          </TextHighlight>
        ))}
      </section>

      {/* The highlight is a background on an inline span, so it wraps. */}
      <section>
        <h2>multi-line</h2>
        <TextHighlight as="p" className="th-demo__wrap" highlightColor="hsl(25 90% 80%)">
          Because the highlight is a background rather than a box behind the
          text, it follows every line break instead of painting one rectangle
          over the whole paragraph. Resize the window and it re-wraps with the
          copy.
        </TextHighlight>
      </section>
    </div>
  );
}

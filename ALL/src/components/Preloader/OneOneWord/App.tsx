import "./App.css";
import { useState } from "react";
import Preloader from "./Preloader";

/**
 * Cycles a list of names every 500ms, then hands off after 3s.
 *
 * It guards on `sessionStorage.sessionLoaded` so it only ever runs once per
 * session — which makes it untestable without a way to clear that flag, hence
 * the replay button. Remounting with a fresh key restarts the interval too.
 *
 * Note that it never takes itself down: on a first run it fires `onFinish` and
 * then keeps rendering, because only the `sessionLoaded` branch ever calls
 * `setShouldShow(false)`. Dismissing it is the parent's job, which is why it is
 * mounted conditionally here rather than left to hide itself.
 */
export default function App() {
  const [run, setRun] = useState(0);
  const [done, setDone] = useState(false);

  const replay = () => {
    sessionStorage.removeItem("sessionLoaded");
    setDone(false);
    setRun((n) => n + 1);
  };

  return (
    <div className="preloader-demo">
      <h1>OneOneWord</h1>
      <p>{done ? "onFinish fired — the page is live." : "Loading…"}</p>
      <button onClick={replay}>Replay preloader</button>
      {!done && <Preloader key={run} onFinish={() => setDone(true)} />}
    </div>
  );
}

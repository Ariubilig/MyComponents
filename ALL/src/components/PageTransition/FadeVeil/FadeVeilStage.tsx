import "../../../hooks/useTheme/theme.css";
import "./FadeVeilStage.css";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import useTheme from "../../../hooks/useTheme/useTheme";
import type { Theme } from "../../../hooks/useTheme/useTheme";

/**
 * Replay harness for `FadeVeil`, and a local copy of `../TransitionStage` for
 * one reason: the shared stage is painted a fixed `#e3e4d8`. A veil is supposed
 * to be the page's own background colour, so over that stage it would be a
 * white rectangle appearing on beige — a panel passing over the page, which is
 * the effect this component exists to avoid.
 *
 * So this stage takes its colours from `theme.css`, and puts the `useTheme`
 * switcher on the page. Flip to dark and the veil goes black with it, with no
 * prop change and nothing passed down: `FadeVeil` is reading the same
 * `data-theme` the hook writes to `<html>`.
 *
 * As in the shared stage, both halves render the same content and the button is
 * a `<Link>` — `FadeVeil` intercepts the click, so a programmatic `navigate()`
 * would skip the half of the component that holds the URL back until the screen
 * is covered.
 */

const REPLAY_PATH = "b";

const THEMES: Theme[] = ["light", "dark", "system"];

export default function FadeVeilRoutes({ base }: { base: string }) {
  return (
    <Routes>
      <Route path="/" element={<Stage base={base} side="a" />} />
      <Route path={REPLAY_PATH} element={<Stage base={base} side="b" />} />
    </Routes>
  );
}

function Stage({ base, side }: { base: string; side: "a" | "b" }) {
  const { pathname } = useLocation();
  const { theme, setTheme } = useTheme();
  const other = side === "a" ? `/${base}/${REPLAY_PATH}` : `/${base}`;

  return (
    <div className="veil-stage">
      <div className="veil-stage__inner">
        <p className="veil-stage__marker">[{side}]</p>
        <h1>Dissolve, don&rsquo;t wipe.</h1>
        <p className="veil-stage__copy">
          The screen fades to the background colour, the route swaps while it is
          solid, and it fades back. Because the veil is the same colour as the
          page, there is no edge to see — only the content going and coming.
        </p>

        <Link className="veil-stage__replay" to={other}>
          Replay transition
        </Link>

        <div className="veil-stage__theme">
          <span className="veil-stage__label">theme</span>
          {THEMES.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setTheme(option)}
              aria-pressed={theme === option}
              className={theme === option ? "is-active" : undefined}
            >
              {option}
            </button>
          ))}
        </div>

        <p className="veil-stage__path">
          <code>{pathname}</code>
        </p>
      </div>
    </div>
  );
}

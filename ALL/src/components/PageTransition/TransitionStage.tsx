import "./TransitionStage.css";
import { Link, Route, Routes, useLocation } from "react-router-dom";

/**
 * Replay harness for the transition wrappers.
 *
 * All four of them are driven by `useLocation` — they watch the pathname and
 * animate when it changes — so there is no way to fire one without a real
 * navigation. Building two different pages just to see a transition is a lot
 * of scaffolding for something you want to watch twenty times in a row.
 *
 * So the route is mounted twice under two paths that render the *same* stage,
 * and the button flips between them. The wrapper sees a genuine pathname
 * change and runs its full cover/reveal cycle, while the content underneath is
 * identical — the transition plays over a page that never actually goes
 * anywhere. The `[a]` / `[b]` marker is the only thing that changes, so you can
 * still tell the navigation happened.
 *
 * The button is a `<Link>` rather than an `onClick`, because
 * `BlockPageTransition` works by intercepting clicks on `a[href^="/"]` — a
 * programmatic `navigate()` would skip the half of that component under test.
 */

const REPLAY_PATH = "b";

export default function TransitionRoutes({ base }: { base: string }) {
  return (
    <Routes>
      <Route path="/" element={<Stage base={base} side="a" />} />
      <Route path={REPLAY_PATH} element={<Stage base={base} side="b" />} />
    </Routes>
  );
}

function Stage({ base, side }: { base: string; side: "a" | "b" }) {
  const { pathname } = useLocation();
  const other = side === "a" ? `/${base}/${REPLAY_PATH}` : `/${base}`;

  return (
    <div className="stage">
      <div className="stage__inner">
        <p className="stage__marker">[{side}]</p>
        <h1>Same page, either way.</h1>
        <p className="stage__copy">
          Both halves of this test render this exact stage, so the wrapper runs
          a real transition over content that never changes. Press replay as
          many times as you like.
        </p>
        <Link className="stage__replay" to={other}>
          Replay transition →
        </Link>
        <p className="stage__path">
          <code>{pathname}</code>
        </p>
      </div>
    </div>
  );
}

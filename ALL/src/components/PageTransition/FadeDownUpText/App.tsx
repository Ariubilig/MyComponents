import FadeDownUpTextRaw from "./FadeDownUpText";
import type { TransitionWrapper } from "../types";

const FadeDownUpText = FadeDownUpTextRaw as TransitionWrapper;
import TransitionRoutes from "../TransitionStage";

/**
 * FadeDownUp with the destination route named on the overlay while it covers.
 *
 * `routeNames` maps a pathname to the label; anything unmapped falls back to
 * the uppercased path, and `/` becomes HOME. The replay button alternates
 * between the two paths below, so both labels get a turn.
 */
const routeNames = {
  "/fade-down-up-text": "STAGE A",
  "/fade-down-up-text/b": "STAGE B",
};

export default function App() {
  return (
    <FadeDownUpText routeNames={routeNames}>
      <TransitionRoutes base="fade-down-up-text" />
    </FadeDownUpText>
  );
}

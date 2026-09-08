import FadeDownDownRaw from "./FadeDownDown";
import type { TransitionWrapper } from "../types";

const FadeDownDown = FadeDownDownRaw as TransitionWrapper;
import TransitionRoutes from "../TransitionStage";

/**
 * The same clip-path overlay as FadeDownUp, but it keeps travelling in one
 * direction: down to cover, then further down and out. Watch the second half —
 * the overlay should leave past the bottom edge, never retreat upward.
 */
export default function App() {
  return (
    <FadeDownDown>
      <TransitionRoutes base="fade-down-down" />
    </FadeDownDown>
  );
}

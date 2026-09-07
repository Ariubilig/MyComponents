import BlockPageTransitionRaw from "./BlockPageTransition";
import type { TransitionWrapper } from "../types";

const BlockPageTransition = BlockPageTransitionRaw as TransitionWrapper;
import TransitionRoutes from "../TransitionStage";

/**
 * Vertical blocks wipe across the screen, the route changes underneath, then
 * they wipe back out — with the navigation held until the cover finishes.
 *
 * `interceptLinks` is on (the default), so the replay button is caught by the
 * component's own `a[href^="/"]` handler rather than by the router. That is
 * the path worth testing: it is what makes the cover run *before* the URL
 * changes instead of racing it.
 */
export default function App() {
  return (
    <BlockPageTransition blockCount={20} overlayColor="#222">
      <TransitionRoutes base="block-page-transition" />
    </BlockPageTransition>
  );
}

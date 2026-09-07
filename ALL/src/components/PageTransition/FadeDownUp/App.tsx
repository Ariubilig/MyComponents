import FadeDownUpRaw from "./FadeDownUp";
import type { TransitionWrapper } from "../types";

const FadeDownUp = FadeDownUpRaw as TransitionWrapper;
import TransitionRoutes from "../TransitionStage";

/**
 * An overlay clips down over the page, the content swaps behind it, then it
 * clips back up the way it came — down to cover, up to reveal.
 *
 * Pass `transitionImage` to fill the overlay with a picture instead of a flat
 * panel; the stylesheet darkens it automatically when one is set.
 */
export default function App() {
  return (
    <FadeDownUp transitionImage="/slide-img-1.jpg">
      <TransitionRoutes base="fade-down-up" />
    </FadeDownUp>
  );
}

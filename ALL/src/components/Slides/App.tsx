import sliderCss from "./Slider.css?inline";
import Slider from "./Slider";
import { useScopedStyle } from "../../useScopedStyle";

/**
 * Lenis-smoothed carousel: slides are built and animated on scroll, each with
 * its own marquee caption and a progress bar row.
 *
 * `Slider.css` is injected rather than imported — it styles `*`, `html, body`,
 * `h1`, `p`, `a`, `img`, `nav` and `section` globally, which would restyle
 * every other test in the harness for the rest of the session. The stylesheet
 * itself is untouched; see `useScopedStyle`. The component's own
 * `import "./Slider.css"` is the one line of it changed.
 *
 * Images come from `public/slide-img-*.jpg`, referenced absolutely by
 * `utils/img.js`.
 */
export default function App() {
  useScopedStyle(sliderCss);
  return <Slider />;
}

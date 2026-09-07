import SpotlightGallery from "./SpotLight";

/**
 * The gallery paints its own full-bleed black stage and carries every style
 * inline, so there is nothing for the page to supply — mount it and hover.
 *
 * Under 1000px wide it switches to 10 items driven by tap instead of hover,
 * so resize across that line to exercise both modes. Images are served from
 * `public/spotlight/`.
 */
export default function App() {
  return <SpotlightGallery />;
}

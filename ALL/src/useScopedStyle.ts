import { useEffect } from "react";

/**
 * Mounts a stylesheet for exactly as long as the component using it is on
 * screen, then takes it back out of the document.
 *
 * Some of the components here ship page-level CSS — `Slider.css` alone styles
 * `*`, `html, body`, `h1`, `p`, `a`, `img`, `nav` and `section`. That is fine
 * in the app each was written for, where it is the only thing on the page, but
 * a normal `import "./Slider.css"` in the harness is permanent and global: one
 * visit to that route would restyle every other test for the rest of the
 * session.
 *
 * Pair it with Vite's `?inline`, which hands you the CSS as a string instead of
 * injecting it:
 *
 *   import css from "./Slider.css?inline";
 *   useScopedStyle(css);
 *
 * The stylesheet stays byte-identical to the original — the isolation lives
 * here rather than in a rewritten copy of someone else's CSS.
 */
export function useScopedStyle(css: string): void {
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = css;
    document.head.append(style);
    return () => style.remove();
  }, [css]);
}

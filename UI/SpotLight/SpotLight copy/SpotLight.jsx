import { useEffect, useState } from "react";

const EASE = "cubic-bezier(0.075, 0.82, 0.165, 1)";

/* Hover-vs-tap is a breakpoint decision, not a per-pixel one, so the mode is
 * read from a media query. The old `resize` listener fired on every pixel of a
 * window drag and unconditionally reset the gallery each time — a 1px nudge on
 * a desktop threw away the open panel. This fires only when 1000px is crossed. */
const DESKTOP_QUERY = "(min-width: 1000px)";

const COLLAPSED_WIDTH = 20;
const GAP = 5;
const STRIDE = COLLAPSED_WIDTH + GAP;
const HEIGHT = 400;

/* Item count and open width move together, so they travel together rather than
 * as two states that can disagree. */
const DESKTOP = { itemCount: 20, expandedWidth: 400 };
const MOBILE = { itemCount: 10, expandedWidth: 100 };

/* Static style objects, hoisted out of render. Nothing here depends on props
 * or state, and hovering re-renders all twenty items — so rebuilding these
 * every time was roughly sixty throwaway objects per pointer move. */
const STAGE = {
  position: "relative",
  width: "100%",
  height: "100vh",
  backgroundColor: "#000000",
  overflow: "hidden",
};

const CONTAINER = {
  position: "absolute",
  top: "50%",
  left: "50%",
  width: "90vw",
  maxWidth: "1400px",
  display: "flex",
  justifyContent: "center",
  padding: 0,
  transform: "translate(-50%, -50%)",
  transformOrigin: "center",
};

/* The strip is a fixed pixel width centred by the flex parent. The previous
 * build measured the parent through a ref instead — and a ref is null on the
 * first render, so the strip painted at left: -437px and then slid in from the
 * left under the live 1s transition once the measurement landed. That entrance
 * was an artefact of the measurement, not a design. Strip width depends only on
 * the item count, so it is computed and the ref is gone. */
const STRIP = {
  position: "relative",
  height: `${HEIGHT}px`,
  flexShrink: 0,
};

/* The box is always `expandedWidth` wide and never resizes: `clip-path` decides
 * how much of it you see and `transform` decides where it sits, so a hover
 * costs paint and composite but no layout at all. Both properties are named
 * explicitly — under `transition: all`, every property added to this object
 * would silently animate for a second. */
const FRAME = {
  position: "absolute",
  top: 0,
  left: 0,
  height: `${HEIGHT}px`,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#000",
  overflow: "hidden",
  transition: `transform 1s ${EASE}, clip-path 1s ${EASE}`,
  willChange: "transform, clip-path",
};

/* The image style only ever takes two shapes, so they are constants rather
 * than a factory invoked once per item per render. */
const IMAGE_BASE = {
  width: "400px",
  height: "100%",
  objectFit: "contain",
  transition: `transform 0.6s ${EASE}`,
};
const IMAGE_EXPANDED = { ...IMAGE_BASE, transform: "scale(1)" };
const IMAGE_COLLAPSED = { ...IMAGE_BASE, transform: "scale(1.5)" };

const SpotlightGallery = () => {
  const [isDesktop, setIsDesktop] = useState(
    () => window.matchMedia(DESKTOP_QUERY).matches,
  );
  const [expandedIndex, setExpandedIndex] = useState(0);
  const [clickedItems, setClickedItems] = useState(() => new Set());

  const { itemCount, expandedWidth } = isDesktop ? DESKTOP : MOBILE;

  useEffect(() => {
    const query = window.matchMedia(DESKTOP_QUERY);

    /* Only a breakpoint crossing invalidates the gallery, and it genuinely
     * does: the item count changes, so a remembered index can point past the
     * end and the mobile tap history no longer means anything. */
    const onChange = (event) => {
      setIsDesktop(event.matches);
      setExpandedIndex(0);
      setClickedItems(new Set());
    };

    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  /* Every item owns a STRIDE-wide slot. The single open panel is the only thing
   * that pushes, and it pushes exactly `push` onto everything after it — which
   * is why the strip's total width is constant and it never re-centres as the
   * open panel travels along it. */
  const push = expandedWidth - COLLAPSED_WIDTH;
  const stripWidth = expandedWidth + (itemCount - 1) * STRIDE;

  const handleMouseEnter = (index) => {
    if (isDesktop) setExpandedIndex(index);
  };

  const handleClick = (index) => {
    if (isDesktop) return;

    const next = new Set(clickedItems);

    if (next.has(index) && expandedIndex === index) {
      next.delete(index);
      setExpandedIndex(next.size > 0 ? Math.min(...next) : 0);
    } else {
      next.add(index);
      setExpandedIndex(index);
    }

    setClickedItems(next);
  };

  /* The only values that vary per item. */
  const frameStyle = (index) => {
    /* Half the hidden box on each side, so the window stays centred on the
     * image exactly as `overflow: hidden` on a narrow box used to. */
    const clip = index === expandedIndex ? 0 : push / 2;
    const offset = index * STRIDE + (index > expandedIndex ? push : 0);

    return {
      ...FRAME,
      width: `${expandedWidth}px`,
      /* Shifted left by the clip so the *visible* edge lands on `offset`.
       * Both halves run on one transition, so the visible edge holds still
       * while the window opens, frame for frame. */
      transform: `translateX(${offset - clip}px)`,
      clipPath: `inset(0px ${clip}px)`,
      cursor: isDesktop ? "default" : "pointer",
    };
  };

  return (
    <div style={STAGE}>
      <div style={CONTAINER}>
        <div style={{ ...STRIP, width: `${stripWidth}px` }}>
          {Array.from({ length: itemCount }, (_, index) => (
            <div
              key={index}
              style={frameStyle(index)}
              onMouseEnter={() => handleMouseEnter(index)}
              onClick={() => handleClick(index)}
            >
              <img
                src={`/spotlight/spotlight-${index + 1}.jpg`}
                alt={`Spotlight ${index + 1}`}
                style={
                  index === expandedIndex ? IMAGE_EXPANDED : IMAGE_COLLAPSED
                }
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpotlightGallery;

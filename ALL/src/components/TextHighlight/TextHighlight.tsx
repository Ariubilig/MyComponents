import "./TextHighlight.css";
import { useImperativeHandle, useRef, useState } from "react";
import type {
  CSSProperties,
  ElementType,
  HTMLAttributes,
  ReactNode,
  Ref,
} from "react";
import { motion, useInView } from "motion/react";
import type { Transition, UseInViewOptions } from "motion/react";

/**
 * Marker-pen highlight that sweeps across its text.
 *
 * Port of `@fancy/text-highlighter` (fancycomponents.dev, Daniel Petho),
 * adapted to this repo: no Tailwind and no `cn` / `@/lib/utils`. The static
 * styling moved to `TextHighlight.css`; only the colour and the animated
 * `background-size` are still inline, because they depend on props.
 *
 * The highlight is a `linear-gradient` background grown from zero along one
 * axis — not an element layered behind the text — so it reflows with the copy,
 * costs no extra DOM, and leaves the text selectable and searchable.
 *
 * Requires `motion` (`npm i motion`) and React 19: the imperative handle is
 * exposed through a plain `ref` prop instead of `forwardRef`.
 */

export type HighlightDirection = "ltr" | "rtl" | "ttb" | "btt";

/** Imperative handle, for `triggerType="ref"`. */
export interface TextHighlightRef {
  /** Play the sweep, optionally overriding the direction for this run. */
  animate: (direction?: HighlightDirection) => void;
  /** Collapse the highlight back to nothing. */
  reset: () => void;
}

export interface TextHighlightProps extends HTMLAttributes<HTMLElement> {
  /** Text to highlight. Inline markup is fine; it wraps with the sweep. */
  children: ReactNode;

  /** Element to render as. @default "span" */
  as?: ElementType;

  /** What starts the sweep. @default "inView" */
  triggerType?: "hover" | "ref" | "inView" | "auto";

  /** Motion transition for the sweep. */
  transition?: Transition;

  /** Forwarded to `useInView`, used when `triggerType` is `"inView"`. */
  useInViewOptions?: UseInViewOptions;

  /** Class for the highlighted span itself, not the `as` element. */
  className?: string;

  /** Any CSS colour. @default "hsl(25, 90%, 80%)" */
  highlightColor?: string;

  /** Axis and origin of the sweep. @default "ltr" */
  direction?: HighlightDirection;

  ref?: Ref<TextHighlightRef>;
}

/** Fully drawn. */
const EXPANDED = "100% 100%";

/** Zero size the sweep grows from: flat for ltr/rtl, thin for ttb/btt. */
const COLLAPSED: Record<HighlightDirection, string> = {
  ltr: "0% 100%",
  rtl: "0% 100%",
  ttb: "100% 0%",
  btt: "100% 0%",
};

/** Edge the sweep is anchored to — this is what makes rtl/btt run backwards. */
const ORIGIN: Record<HighlightDirection, string> = {
  ltr: "0% 0%",
  rtl: "100% 0%",
  ttb: "0% 0%",
  btt: "0% 100%",
};

const cx = (...classes: (string | false | undefined)[]) =>
  classes.filter(Boolean).join(" ");

export function TextHighlight({
  children,
  as = "span",
  triggerType = "inView",
  transition = { type: "spring", duration: 1, delay: 0, bounce: 0 },
  useInViewOptions = { once: true, initial: false, amount: 0.1 },
  className,
  highlightColor = "hsl(25, 90%, 80%)",
  direction = "ltr",
  ref,
  ...props
}: TextHighlightProps) {
  const elementRef = useRef<HTMLElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  /*
   * `animate()` may override the direction for a single run, so it has to be
   * state — but a new `direction` prop must win over that override. Syncing
   * during render rather than in an effect means an in-flight sweep never
   * paints a frame with the stale direction.
   */
  const [current, setCurrent] = useState(direction);
  const [lastProp, setLastProp] = useState(direction);
  if (lastProp !== direction) {
    setLastProp(direction);
    setCurrent(direction);
  }

  /*
   * Called unconditionally: hooks can't be skipped per `triggerType` (upstream
   * does, which trips `react/rules-of-hooks`). An idle IntersectionObserver is
   * cheaper than the bug that branch invites.
   */
  const inView = useInView(elementRef, useInViewOptions);

  useImperativeHandle(ref, () => ({
    animate: (override?: HighlightDirection) => {
      if (override) setCurrent(override);
      setIsAnimating(true);
    },
    reset: () => setIsAnimating(false),
  }));

  const shouldAnimate =
    triggerType === "auto" ||
    (triggerType === "hover" && isHovered) ||
    (triggerType === "inView" && inView) ||
    (triggerType === "ref" && isAnimating);

  const Tag = as;
  const collapsed = COLLAPSED[current];

  const style: CSSProperties = {
    backgroundImage: `linear-gradient(${highlightColor}, ${highlightColor})`,
    backgroundPosition: ORIGIN[current],
  };

  return (
    <Tag
      ref={elementRef}
      onMouseEnter={() => triggerType === "hover" && setIsHovered(true)}
      onMouseLeave={() => triggerType === "hover" && setIsHovered(false)}
      {...props}
    >
      <motion.span
        className={cx("text-highlight", className)}
        style={style}
        initial={{ backgroundSize: collapsed }}
        animate={{ backgroundSize: shouldAnimate ? EXPANDED : collapsed }}
        transition={transition}
      >
        {children}
      </motion.span>
    </Tag>
  );
}

export default TextHighlight;

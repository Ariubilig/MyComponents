/*
 * oxlint's `react/static-components` is purely syntactic: it flags any
 * capitalised local used as a JSX tag. Here that local is a cached lookup, not
 * a fresh component — see `motionTag` below — so the warning is a false
 * positive, and the `as` prop can't be supported without tripping it.
 */
// oxlint-disable react/static-components

import "./MediaBetweenText.css";
import { useImperativeHandle, useRef, useState } from "react";
import type { ElementType, Ref, RefObject } from "react";
import { motion, useInView } from "motion/react";
import type { UseInViewOptions, Variants } from "motion/react";

/**
 * Two lines of text that part to reveal an image or video between them.
 *
 * Port of `@fancy/media-between-text` (fancycomponents.dev, Daniel Petho),
 * adapted to this repo: no Tailwind and no `cn` / `@/lib/utils`. The layout
 * lives in `MediaBetweenText.css`; only the media's *size* is left to you,
 * through `mediaContainerClassName`.
 *
 * The push-apart is free: the media container animates from `width: 0` and the
 * two text nodes are `layout` children, so Motion's layout animation slides
 * them to their new positions without either one being measured by hand.
 *
 * Requires `motion` (`npm i motion`) and React 19: the imperative handle is
 * exposed through a plain `ref` prop instead of `forwardRef`.
 */

/** Imperative handle, for `triggerType="ref"`. */
export interface MediaBetweenTextRef {
  /** Open the gap and show the media. */
  animate: () => void;
  /** Close it again. */
  reset: () => void;
}

export interface MediaBetweenTextProps {
  /** Text before the media. */
  firstText: string;

  /** Text after the media. */
  secondText: string;

  /** Source of the image or video revealed between them. */
  mediaUrl: string;

  mediaType: "image" | "video";

  /**
   * Sizing class for the media box. Required in practice — the box starts at
   * `width: 0` and clips, so with no height it has nothing to reveal.
   */
  mediaContainerClassName?: string;

  /** Video poster, and the still shown before playback starts. */
  fallbackUrl?: string;

  /** Element the two text nodes render as. @default "p" */
  as?: ElementType;

  /** @default true */
  autoPlay?: boolean;

  /** @default true */
  loop?: boolean;

  /** Leave on — browsers block autoplay with sound. @default true */
  muted?: boolean;

  /** Keeps iOS from going fullscreen on play. @default true */
  playsInline?: boolean;

  /** Alt text; falls back to the two text halves. */
  alt?: string;

  /** What opens the gap. @default "hover" */
  triggerType?: "hover" | "ref" | "inView";

  /** Scroll container to measure against when `triggerType` is `"inView"`. */
  containerRef?: RefObject<HTMLDivElement | null>;

  /** Forwarded to `useInView`. */
  useInViewOptionsProp?: UseInViewOptions;

  /** Override the reveal itself — width is what upstream animates. */
  animationVariants?: {
    initial: Variants["initial"];
    animate: Variants["animate"];
  };

  /** Class for the flex row wrapping everything. */
  className?: string;

  leftTextClassName?: string;
  rightTextClassName?: string;

  ref?: Ref<MediaBetweenTextRef>;
}

const cx = (...classes: (string | false | undefined)[]) =>
  classes.filter(Boolean).join(" ");

/*
 * `motion.create` mints a new component *type* on every call, so calling it
 * during render (as upstream does) hands React a different type each pass —
 * remounting both text nodes and killing the layout animation they exist for.
 * Cached at module scope rather than in a `useMemo` so the identity is stable
 * across instances too, and can't be lost if React evicts the memo.
 */
const motionTags = new Map<ElementType, ElementType>();

function motionTag(as: ElementType): ElementType {
  let tag = motionTags.get(as);
  if (!tag) {
    tag = motion.create(as as string);
    motionTags.set(as, tag);
  }
  return tag;
}

export function MediaBetweenText({
  firstText,
  secondText,
  mediaUrl,
  mediaType,
  mediaContainerClassName,
  fallbackUrl,
  as = "p",
  autoPlay = true,
  loop = true,
  muted = true,
  playsInline = true,
  alt,
  triggerType = "hover",
  containerRef,
  useInViewOptionsProp = { once: true, amount: 0.5, root: containerRef },
  animationVariants = {
    initial: { width: 0, opacity: 1 },
    animate: {
      width: "auto",
      opacity: 1,
      transition: { duration: 0.4, type: "spring", bounce: 0 },
    },
  },
  className,
  leftTextClassName,
  rightTextClassName,
  ref,
}: MediaBetweenTextProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  /*
   * Called unconditionally: hooks can't be skipped per `triggerType` (upstream
   * does, which trips `react/rules-of-hooks`). An idle IntersectionObserver is
   * cheaper than the bug that branch invites.
   */
  const inView = useInView(elementRef, useInViewOptionsProp);

  useImperativeHandle(ref, () => ({
    animate: () => setIsAnimating(true),
    reset: () => setIsAnimating(false),
  }));

  const shouldAnimate =
    (triggerType === "hover" && isHovered) ||
    (triggerType === "inView" && inView) ||
    (triggerType === "ref" && isAnimating);

  const Text = motionTag(as);

  return (
    <div
      className={cx("media-between-text", className)}
      ref={elementRef}
      onMouseEnter={() => triggerType === "hover" && setIsHovered(true)}
      onMouseLeave={() => triggerType === "hover" && setIsHovered(false)}
    >
      <Text layout className={leftTextClassName}>
        {firstText}
      </Text>
      <motion.div
        className={cx("media-between-text__media", mediaContainerClassName)}
        variants={animationVariants}
        initial="initial"
        animate={shouldAnimate ? "animate" : "initial"}
      >
        {mediaType === "video" ? (
          <video
            autoPlay={autoPlay}
            loop={loop}
            muted={muted}
            playsInline={playsInline}
            poster={fallbackUrl}
          >
            <source src={mediaUrl} type="video/mp4" />
          </video>
        ) : (
          <img src={mediaUrl} alt={alt ?? `${firstText} ${secondText}`} />
        )}
      </motion.div>
      <Text layout className={rightTextClassName}>
        {secondText}
      </Text>
    </div>
  );
}

export default MediaBetweenText;

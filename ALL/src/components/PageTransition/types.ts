import type { ComponentType, ReactNode } from "react";

/**
 * The four transition wrappers are `.jsx` with no prop types of their own, so
 * TypeScript infers their signature from the destructuring — and every
 * parameter without a default reads as *required*, including the optional
 * ones (`transitionImage`, `routeNames`, `onTransitionStart`, …).
 *
 * Casting through this shape at the import site restores the contract the
 * components actually document, without editing the copies.
 */
export interface TransitionProps {
  children: ReactNode;

  /** Fade*: fills the overlay; the stylesheet darkens it when set. */
  transitionImage?: string;
  /** FadeDownUpText: pathname -> label shown while covered. */
  routeNames?: Record<string, string>;

  /** BlockPageTransition. */
  blockCount?: number;
  overlayColor?: string;
  durations?: Record<string, number>;
  interceptLinks?: boolean;
  onTransitionStart?: (url: string) => void;
  onTransitionEnd?: () => void;
}

export type TransitionWrapper = ComponentType<TransitionProps>;

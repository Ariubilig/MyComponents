"use client";

import BlockPageTransition from "./BlockPageTransition";

/**
 * PageTransitionNoLogo
 * - Preconfigured wrapper that hides the logo overlay during transitions
 */
export default function PageTransition({
  children,
  blockCount,
  overlayColor,
  backgroundColor,
  durations,
  interceptLinks,
  onTransitionStart,
  onTransitionEnd,
}) {
  return (
    <BlockPageTransition
      blockCount={blockCount}
      overlayColor={overlayColor}
      backgroundColor={backgroundColor}
      showLogo={false}
      durations={durations}
      interceptLinks={interceptLinks}
      onTransitionStart={onTransitionStart}
      onTransitionEnd={onTransitionEnd}
    >
      {children}
    </BlockPageTransition>
  );
}
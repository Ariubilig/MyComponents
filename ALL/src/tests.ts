import type { ComponentType } from "react";
import HoverLineShow from "./components/HoverLineShow/App";
import MediaBetweenText from "./components/MediaBetweenText/App";
import Overview from "./components/overview/App";
import ScrollBar from "./components/ScrollBar/App";
import SpotLight from "./components/SpotLight/App";
import TextHighlight from "./components/TextHighlight/App";
import BlockPageTransition from "./components/PageTransition/BlockPageTransition/App";
import FadeDownDown from "./components/PageTransition/FadeDownDown/App";
import FadeDownUp from "./components/PageTransition/FadeDownUp/App";
import FadeDownUpText from "./components/PageTransition/FadeDownUpText/App";
import FadeVeil from "./components/PageTransition/FadeVeil/App";
import Marquee from "./components/Marquee/App";
import Preloader from "./components/Preloader/OneOneWord/App";
import ScrollSmoother from "./components/ScrollSmoother/App";
import Slides from "./components/Slides/App";
import SplitTextReveal from "./components/SplitTextReveal/App";
import UseTheme from "./hooks/useTheme/App";

/**
 * The registry every test page is reached through.
 *
 * Single source of truth on purpose: `App` builds its `<Route>`s from this and
 * `Home` builds the nav list from it, so adding a test is one import plus one
 * entry here — there is no second place to forget.
 */
export interface Test {
  /** URL segment, without the leading slash. */
  path: string;
  title: string;
  /** Heading the entry is filed under on the index. */
  group: "UI" | "UX" | "page transitions" | "hooks";
  /**
   * Mount the page under a wildcard so it can run its own nested routes. The
   * transition wrappers need this: they only animate on a pathname change, so
   * their test pages navigate between two sub-paths of themselves.
   */
  nested?: boolean;
  /** One line on the index saying what the page is for. */
  blurb: string;
  /** Where the component itself lives, so the index doubles as a map. */
  source: string;
  Component: ComponentType;
}

export const tests: Test[] = [
  {
    path: "scrollbar",
    title: "ScrollBar",
    group: "UI",
    blurb: "Custom page scrollbar driven by a GSAP ScrollSmoother adapter.",
    source: "src/components/ScrollBar",
    Component: ScrollBar,
  },
  {
    path: "text-highlight",
    title: "TextHighlight",
    group: "UI",
    blurb: "Marker-pen highlight that sweeps across text. Four triggers, four directions.",
    source: "src/components/TextHighlight",
    Component: TextHighlight,
  },
  {
    path: "media-between-text",
    title: "MediaBetweenText",
    group: "UI",
    blurb: "Two words that part to reveal an image or video between them.",
    source: "src/components/MediaBetweenText",
    Component: MediaBetweenText,
  },
  {
    path: "spotlight",
    title: "SpotLight",
    group: "UI",
    blurb: "Accordion gallery: hover to expand a slat, tap instead below 1000px.",
    source: "src/components/SpotLight",
    Component: SpotLight,
  },
  {
    path: "overview",
    title: "Overview",
    group: "UI",
    blurb: "Project table that blurs every row except the one under the cursor.",
    source: "src/components/overview",
    Component: Overview,
  },
  {
    path: "hover-line-show",
    title: "HoverLineShow",
    group: "UI",
    blurb: "Client list whose underline grows from the left and retracts to the right.",
    source: "src/components/HoverLineShow",
    Component: HoverLineShow,
  },
  {
    path: "marquee",
    title: "Marquee",
    group: "UX",
    blurb: "Seamless ticker on a gsap.ticker loop, wrapping on a doubled copy.",
    source: "src/components/Marquee",
    Component: Marquee,
  },
  {
    path: "split-text-reveal",
    title: "SplitTextReveal",
    group: "UX",
    blurb: "Masked line and character reveals, on load or on scroll.",
    source: "src/components/SplitTextReveal",
    Component: SplitTextReveal,
  },
  {
    path: "preloader-one-word",
    title: "Preloader · OneOneWord",
    group: "UX",
    blurb: "Name-cycling splash, guarded to once per session. Replay clears the flag.",
    source: "src/components/Preloader/OneOneWord",
    Component: Preloader,
  },
  {
    path: "scroll-smoother",
    title: "ScrollSmoother",
    group: "UX",
    blurb: "GSAP smooth scrolling with data-speed parallax; opts out on touch.",
    source: "src/components/ScrollSmoother",
    Component: ScrollSmoother,
  },
  {
    path: "slides",
    title: "Slides",
    group: "UX",
    blurb: "Lenis-driven carousel with per-slide marquee captions and progress bars.",
    source: "src/components/Slides",
    Component: Slides,
  },
  {
    path: "fade-veil",
    title: "FadeVeil",
    group: "page transitions",
    nested: true,
    blurb:
      "Fades to the theme's own background colour, swaps the route, fades back.",
    source: "src/components/PageTransition/FadeVeil",
    Component: FadeVeil,
  },
  {
    path: "block-page-transition",
    title: "BlockPageTransition",
    group: "page transitions",
    nested: true,
    blurb: "Blocks wipe across, the route swaps behind them, they wipe back out.",
    source: "src/components/PageTransition/BlockPageTransition",
    Component: BlockPageTransition,
  },
  {
    path: "fade-down-up",
    title: "FadeDownUp",
    group: "page transitions",
    nested: true,
    blurb: "Overlay clips down to cover, then back up to reveal.",
    source: "src/components/PageTransition/FadeDownUp",
    Component: FadeDownUp,
  },
  {
    path: "fade-down-down",
    title: "FadeDownDown",
    group: "page transitions",
    nested: true,
    blurb: "Same overlay, one direction — down to cover, down again to leave.",
    source: "src/components/PageTransition/FadeDownDown",
    Component: FadeDownDown,
  },
  {
    path: "fade-down-up-text",
    title: "FadeDownUpText",
    group: "page transitions",
    nested: true,
    blurb: "FadeDownUp with the destination route named on the overlay.",
    source: "src/components/PageTransition/FadeDownUpText",
    Component: FadeDownUpText,
  },
  {
    path: "use-theme",
    title: "useTheme",
    group: "hooks",
    blurb: "light / dark / system preference, persisted and written to <html>.",
    source: "src/hooks/useTheme",
    Component: UseTheme,
  },
];

/** The registry grouped for the index, in first-seen order. */
export function testsByGroup(): [string, Test[]][] {
  const groups = new Map<string, Test[]>();
  for (const test of tests) {
    const group = groups.get(test.group) ?? [];
    group.push(test);
    groups.set(test.group, group);
  }
  return [...groups];
}

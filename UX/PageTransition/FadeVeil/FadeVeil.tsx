import "./FadeVeil.css";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import type { CSSProperties, ReactNode } from "react";
import { gsap } from "gsap";

/**
 * A full-screen veil in the page's own background colour: it fades up over the
 * current route, the navigation happens underneath it, and it fades back out
 * onto the new one. Nothing slides, wipes or flies — the page dissolves into
 * the ground colour and reappears out of it.
 *
 * Three things do most of the work:
 *
 * - **The colour is the theme's, not the component's.** It reads how the app
 *   has marked `<html>` — `data-theme="dark"` or a `.dark` class, both out of
 *   the box — so the veil is white on a white page and black on a black one. A
 *   veil that matches the ground has no visible edge, which is what makes it
 *   read as the page dissolving rather than as a panel passing over it.
 * - **The click is intercepted, so the cover runs before the URL changes.**
 *   Letting the router navigate first means the new page is already mounted
 *   when the cover starts — you would see it flash. Here the anchor's default
 *   is prevented, the veil closes, and `navigate` only fires once the screen is
 *   solid.
 * - **Leaving is quicker than arriving.** `revealDuration` is longer than
 *   `coverDuration` by default; that asymmetry is why it reads as considered
 *   rather than merely slow.
 *
 * The only hard dependency is `gsap`. The router is injected (see
 * `RouterAdapter`), so the same component works wherever you can name the
 * current location and navigate to a new one.
 *
 * ```tsx
 * // React Router — the adapter ships alongside this file.
 * const router = useReactRouterAdapter();
 * return (
 *   <FadeVeil router={router}>
 *     <Routes>…</Routes>
 *   </FadeVeil>
 * );
 * ```
 */

/**
 * What the component needs from a router, and all it needs.
 *
 * Writing one for a router that is not React Router is a few lines. Next.js
 * App Router, for instance:
 *
 * ```tsx
 * "use client";
 * import { usePathname, useRouter, useSearchParams } from "next/navigation";
 *
 * function useNextAdapter(): RouterAdapter {
 *   const pathname = usePathname();
 *   const params = useSearchParams().toString();
 *   const router = useRouter();
 *   return useMemo(
 *     () => ({
 *       location: params ? `${pathname}?${params}` : pathname,
 *       navigate: (href) => router.push(href),
 *     }),
 *     [pathname, params, router],
 *   );
 * }
 * ```
 */
export interface RouterAdapter {
  /**
   * The current location as one string — pathname plus search. A change to it
   * is the signal to clear the veil, so it has to change on every navigation
   * the transition should cover.
   */
  location: string;

  /** Go to an internal href. Called once the veil is solid, not before. */
  navigate: (href: string) => void;
}

export interface FadeVeilProps {
  /** Whatever renders the routes this should transition between. */
  children: ReactNode;

  /** How to read the current location and how to leave it. */
  router: RouterAdapter;

  /** Veil colour while the resolved theme is light. @default "#ffffff" */
  lightColor?: string;

  /** Veil colour while the resolved theme is dark. @default "#0a0a0a" */
  darkColor?: string;

  /**
   * How the app marks dark mode on `<html>`, as a selector. The default
   * matches both dominant conventions — `data-theme="dark"` and the `.dark`
   * class that Tailwind and next-themes use — so most apps never set it.
   * @default '[data-theme="dark"], .dark'
   */
  darkSelector?: string;

  /**
   * The same for an explicit light preference. Matching neither selector means
   * the app has expressed no preference, and the OS setting decides.
   * @default '[data-theme="light"], .light'
   */
  lightSelector?: string;

  /** Seconds the veil takes to close over the old page. @default 0.5 */
  coverDuration?: number;

  /**
   * Seconds the veil takes to clear off the new one. Longer than the cover on
   * purpose — see the note above. @default 0.7
   */
  revealDuration?: number;

  /**
   * Seconds held fully covered after the route swaps. Not only for rhythm: the
   * reveal is started from an effect that runs *before* the browser has painted
   * the new route, so a hold of zero can start clearing the veil off a page
   * that is not on screen yet. @default 0.15
   */
  holdDuration?: number;

  /**
   * Scale the page recedes to while it is covered, and rises back from on the
   * way in. `1` turns it off, which is the default for a reason: any non-`none`
   * transform makes this wrapper a containing block, so a `position: fixed`
   * child of your page would be positioned against it instead of the viewport.
   * The transform is cleared once the reveal ends, so that only applies
   * mid-transition — under the veil, where nothing is visible — but a page with
   * fixed chrome still jumps on the first frame of the cover. Turn it on when
   * the wrapped pages have none.
   *
   * Shrinking also opens a gutter between the page and the wrapper; the
   * stylesheet paints the wrapper `--fade-veil-color` so that gutter is the
   * ground colour rather than the white browser canvas. See `FadeVeil.css`.
   * @default 1
   */
  contentScale?: number;

  /**
   * Catch clicks on internal links inside the wrapper and cover *before*
   * navigating. Turn it off and the veil still runs, but as a cross-fade after
   * the fact — the same path back/forward takes. @default true
   */
  interceptLinks?: boolean;

  /** Jump to the top of the new page while it is still covered. @default true */
  scrollToTop?: boolean;

  onTransitionStart?: (href: string) => void;
  onTransitionEnd?: () => void;
}

/** Closing: eases in and out, so the cover settles rather than slams shut. */
const COVER_EASE = "power2.inOut";

/** Clearing: thins off steadily instead of snapping away at the end. */
const REVEAL_EASE = "power2.out";

/** The optional scale, which trails the veil and lands after it. */
const SETTLE_EASE = "expo.out";

/** How much longer than the reveal that scale takes to settle. */
const SETTLE_STRETCH = 1.6;

const DARK_QUERY = "(prefers-color-scheme: dark)";
const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

const DEFAULT_DARK_SELECTOR = '[data-theme="dark"], .dark';
const DEFAULT_LIGHT_SELECTOR = '[data-theme="light"], .light';

type ResolvedTheme = "light" | "dark";

/** What `<html>` says now, or the OS preference if it says nothing. */
function readTheme(darkSelector: string, lightSelector: string): ResolvedTheme {
  const root = document.documentElement;
  if (root.matches(darkSelector)) return "dark";
  if (root.matches(lightSelector)) return "light";
  return window.matchMedia(DARK_QUERY).matches ? "dark" : "light";
}

/**
 * There is no `document` to read on a server, and no theme to speak of either.
 * React renders this value, hydrates with it, and then swaps in the real one
 * from `readTheme` — which is invisible, because the veil is transparent at
 * rest and the wrapper's ground colour only shows through a page that does not
 * paint its own.
 */
const readServerTheme = (): ResolvedTheme => "light";

/**
 * The theme the page is *painted* in — observed, not owned.
 *
 * Owning it (a `useTheme` call in here) would mean a second copy of the
 * preference and a second writer of the attribute. Watching `<html>` instead
 * means the veil follows whatever actually landed on the element, so it works
 * the same whether the app drives that with a hook of its own, with
 * next-themes, or not at all.
 *
 * `useSyncExternalStore` rather than `useState` + `useEffect`: the DOM
 * attribute and the media query are exactly the external store it exists for,
 * it takes a server snapshot so this survives SSR, and it lands the value in
 * the first committed render instead of a second one.
 */
function useResolvedTheme(
  darkSelector: string,
  lightSelector: string,
): ResolvedTheme {
  const subscribe = useCallback((onChange: () => void) => {
    /*
     * Every attribute, not just `data-theme`: the selectors are the caller's,
     * and the `.dark` convention lives in `class`. Attributes on `<html>`
     * change rarely enough that the wider net costs nothing.
     */
    const observer = new MutationObserver(onChange);
    observer.observe(document.documentElement, { attributes: true });

    // Still needed when neither selector matches and `readTheme` is falling
    // back to the OS preference, which nothing else would report moving.
    const media = window.matchMedia(DARK_QUERY);
    media.addEventListener("change", onChange);

    return () => {
      observer.disconnect();
      media.removeEventListener("change", onChange);
    };
  }, []);

  const getSnapshot = useCallback(
    () => readTheme(darkSelector, lightSelector),
    [darkSelector, lightSelector],
  );

  return useSyncExternalStore(subscribe, getSnapshot, readServerTheme);
}

export default function FadeVeil({
  children,
  router,
  lightColor = "#ffffff",
  darkColor = "#0a0a0a",
  darkSelector = DEFAULT_DARK_SELECTOR,
  lightSelector = DEFAULT_LIGHT_SELECTOR,
  coverDuration = 0.5,
  revealDuration = 0.7,
  holdDuration = 0.15,
  contentScale = 1,
  interceptLinks = true,
  scrollToTop = true,
  onTransitionStart,
  onTransitionEnd,
}: FadeVeilProps) {
  const { location: currentLocation, navigate } = router;
  const theme = useResolvedTheme(darkSelector, lightSelector);

  const rootRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  /** The one animation in flight, kept so the next one can kill it. */
  const animationRef = useRef<gsap.core.Animation | null>(null);

  /** True between a click and the veil clearing. Blocks a second one. */
  const busyRef = useRef(false);

  /** True once *we* raised the veil, so the route change knows to clear it. */
  const coveredRef = useRef(false);

  /**
   * The location the content on screen belongs to. Seeded with the mount
   * location so the first render is not mistaken for a navigation — which also
   * makes this correct under StrictMode's double mount, where a flag flipped on
   * the first run would be wrong on the second.
   */
  const shownRef = useRef(currentLocation);

  const [covering, setCovering] = useState(false);

  /** Read per transition, not cached: the preference can change mid-session. */
  const prefersReducedMotion = () => window.matchMedia(REDUCED_QUERY).matches;

  /**
   * Close the veil, then navigate. The fade stays even under reduced motion —
   * it is a cross-fade, not travel — but the scale, which is real movement,
   * does not.
   *
   * `useCallback` even with the React Compiler on: the click listener below is
   * attached in an effect that depends on this, and a new identity every render
   * would mean tearing the listener down and putting it back on every one.
   */
  const cover = useCallback(
    (href: string) => {
      const veil = veilRef.current;
      if (!veil || busyRef.current) return;

      busyRef.current = true;
      coveredRef.current = true;
      setCovering(true);
      onTransitionStart?.(href);

      animationRef.current?.kill();
      const timeline = gsap.timeline({
        onComplete: () => {
          if (scrollToTop) {
            window.scrollTo({ top: 0, left: 0, behavior: "instant" });
          }
          navigate(href);
        },
      });

      timeline.to(veil, {
        opacity: 1,
        duration: coverDuration,
        ease: COVER_EASE,
      });

      if (contentRef.current && contentScale !== 1 && !prefersReducedMotion()) {
        timeline.to(
          contentRef.current,
          { scale: contentScale, duration: coverDuration, ease: COVER_EASE },
          0,
        );
      }

      animationRef.current = timeline;
    },
    [contentScale, coverDuration, navigate, onTransitionStart, scrollToTop],
  );

  /*
   * The route changed. Either we covered for it, or it arrived some other way —
   * back/forward, or a `navigate()` call from inside the page.
   */
  useEffect(() => {
    if (currentLocation === shownRef.current) return;
    shownRef.current = currentLocation;

    const veil = veilRef.current;
    const content = contentRef.current;
    if (!veil || !content) return;

    animationRef.current?.kill();

    /*
     * Nobody covered for this one, so the new page is already on screen.
     * Raising the veil now would show it, hide it, and show it again; fade the
     * swap in instead. Less ceremony than a full cycle, which is the honest
     * signal — a back button did not go through the transition.
     */
    if (!coveredRef.current) {
      animationRef.current = gsap.fromTo(
        content,
        { opacity: 0 },
        { opacity: 1, duration: revealDuration * 0.5, ease: REVEAL_EASE },
      );
      return;
    }

    coveredRef.current = false;

    const timeline = gsap.timeline({
      delay: holdDuration,
      onComplete: () => {
        /*
         * Take the inline transform back off instead of leaving `scale(1)`
         * sitting there. An identity transform is still a transform: it goes
         * on making this element a containing block, and every
         * `position: fixed` child of the page stays pinned to it rather than
         * to the viewport. Only `transform: none` gives them the viewport
         * back, and only removing the property gets you there. (GSAP writes
         * `translate`, `rotate` and `scale` beside `transform`; `"transform"`
         * clears the group, not just the one longhand.)
         */
        gsap.set(content, { clearProps: "transform" });
        onTransitionEnd?.();
      },
    });

    timeline.to(veil, {
      opacity: 0,
      duration: revealDuration,
      ease: REVEAL_EASE,
      /*
       * Both of these belong to the veil, not to the timeline: the scale below
       * outlasts it deliberately, and the transition is over as far as anyone
       * clicking is concerned the moment there is nothing on top of the page.
       * Releasing `busyRef` on the timeline instead would leave a window where
       * the veil is gone, the links look live, and `cover` still refuses —
       * every click in it swallowed by the `preventDefault` that precedes it.
       */
      onComplete: () => {
        busyRef.current = false;
        setCovering(false);
      },
    });

    /*
     * Only when there is something to settle. Left in unconditionally it would
     * tween 1 to 1 for the default `contentScale`, holding the timeline — and
     * so `onTransitionEnd` — open well past the point anything is moving.
     */
    if (contentScale !== 1) {
      timeline.to(
        content,
        {
          scale: 1,
          duration: revealDuration * SETTLE_STRETCH,
          ease: SETTLE_EASE,
        },
        0,
      );
    }

    animationRef.current = timeline;
  }, [
    currentLocation,
    contentScale,
    holdDuration,
    revealDuration,
    onTransitionEnd,
  ]);

  /*
   * Interception is scoped to this wrapper's own subtree rather than the
   * document: the component animates the pages it renders, and a nav bar
   * mounted outside it should go on behaving normally.
   *
   * Capture phase, because React dispatches `onClick` from a listener on the
   * root container — an ancestor of this one, and so later in the bubble than
   * anything down here. Capturing gets us in first, and a well-behaved `Link`
   * checks `defaultPrevented` before it navigates, so `preventDefault` alone
   * holds the navigation; there is no need to also stop propagation and silence
   * every other handler on the link. (Verified against React Router 7's `Link`,
   * which is what the adapter beside this file drives. Worth confirming for any
   * router you bring your own adapter for — `interceptLinks={false}` falls back
   * to a cross-fade if one navigates regardless.)
   */
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !interceptLinks) return;

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      // Modified clicks belong to the browser: new tab, new window, download.
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const anchor = (event.target as Element | null)?.closest("a");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.hasAttribute("download")) return;
      if (anchor.target && anchor.target !== "_self") return;
      // Per-link opt-out, for anything that should not be transitioned.
      if (anchor.dataset.noTransition !== undefined) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;

      // Same page: a `#hash` jump, or a link back to where we already are.
      const href = `${url.pathname}${url.search}`;
      const here = `${window.location.pathname}${window.location.search}`;
      if (href === here) return;

      event.preventDefault();
      cover(href);
    };

    root.addEventListener("click", onClick, true);
    return () => root.removeEventListener("click", onClick, true);
  }, [interceptLinks, cover]);

  /* A transition that outlived its component would leave the page scaled. */
  useEffect(() => () => void animationRef.current?.kill(), []);

  return (
    <div
      ref={rootRef}
      className={covering ? "fade-veil is-covering" : "fade-veil"}
      aria-busy={covering || undefined}
      style={
        {
          "--fade-veil-color": theme === "dark" ? darkColor : lightColor,
        } as CSSProperties
      }
    >
      <div ref={contentRef} className="fade-veil__content">
        {children}
      </div>
      {/*
        The colour reaches the veil through a custom property on the wrapper
        rather than an inline style here, so React never writes to this
        element's `style` and cannot race GSAP for the `opacity` it animates.
      */}
      <div ref={veilRef} className="fade-veil__veil" aria-hidden="true" />
    </div>
  );
}

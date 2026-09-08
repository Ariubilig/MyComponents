# FadeVeil

A page transition that fades the screen to the page's **own background colour** — white in light mode, black in dark — swaps the route while the screen is solid, then fades back. Because the veil matches the ground, there is no edge to see: the page dissolves rather than being covered by a panel.

The navigation is **held until the cover finishes**, so the incoming page is never briefly visible. The colour is read from however you mark the theme on `<html>` (`data-theme="dark"` or a `.dark` class), so it follows your theme toggle with nothing passed down.

Router-agnostic: the only hard dependency is GSAP.

---

## Dependencies

```bash
npm install gsap
```

That is the whole list. `react-router-dom` is needed only for the bundled adapter — see [Using another router](#using-another-router).

React 18+ (the theme subscription uses `useSyncExternalStore`).

---

## Files

| File                       | What it is                                                       |
| -------------------------- | ---------------------------------------------------------------- |
| `FadeVeil.tsx`             | The component. Imports no router.                                |
| `FadeVeil.css`             | Its stylesheet. Imported by the component; nothing to wire up.   |
| `useReactRouterAdapter.ts` | The React Router binding. **The only file that names a router.** |
| `index.ts`                 | Public exports. Import from here.                                |
| `App.tsx`                  | A realistic integration example.                                 |

Copy the folder in and import from `index.ts`.

---

## Quick start

```tsx
import { Route, Routes } from "react-router-dom";
import { FadeVeil, useReactRouterAdapter } from "./FadeVeil";

export default function App() {
  const router = useReactRouterAdapter();

  return (
    <FadeVeil router={router}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </FadeVeil>
  );
}
```

`router` is the only required prop. Everything else has a default.

Two placement rules, both easy to get wrong:

- **Anything with links belongs inside the wrapper.** Interception is scoped to `FadeVeil`'s own subtree, so a `<Navbar />` mounted as a _sibling_ above it navigates instantly with no transition.
- **`useReactRouterAdapter` must run inside your `<BrowserRouter>`**, because it wraps `useLocation` and `useNavigate`.

---

## How the sequence runs

| Phase      | Default | What happens                                                                                      |
| ---------- | ------- | ------------------------------------------------------------------------------------------------- |
| **Cover**  | `0.5s`  | Click is intercepted, its default prevented. Veil fades `0 → 1`. **The URL has not changed yet.** |
| **Swap**   | —       | At full opacity: scroll to top, then `navigate()`. The new route mounts behind a solid screen.    |
| **Hold**   | `0.15s` | Held covered so the new route can paint before anything starts clearing.                          |
| **Reveal** | `0.7s`  | Veil fades `1 → 0` onto the new page.                                                             |

About **1.35s** end to end. The reveal is deliberately longer than the cover — leaving decisive, arriving gentle. That asymmetry is most of what separates this from a plain cross-fade, so if you shorten one, shorten `coverDuration`.

---

## Props

| Prop                | Type                     | Default                          | Description                                                                                                       |
| ------------------- | ------------------------ | -------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `children`          | `ReactNode`              | required                         | Whatever renders your routes.                                                                                     |
| `router`            | `RouterAdapter`          | required                         | How to read the current location and how to leave it. See [Using another router](#using-another-router).          |
| `lightColor`        | `string`                 | `"#ffffff"`                      | Veil colour when the resolved theme is light. Any CSS colour.                                                     |
| `darkColor`         | `string`                 | `"#0a0a0a"`                      | Veil colour when the resolved theme is dark.                                                                      |
| `darkSelector`      | `string`                 | `'[data-theme="dark"], .dark'`   | How your app marks dark mode on `<html>`, as a selector. Covers both common conventions already.                  |
| `lightSelector`     | `string`                 | `'[data-theme="light"], .light'` | The same for an explicit light preference.                                                                        |
| `coverDuration`     | `number`                 | `0.5`                            | Seconds to close over the old page.                                                                               |
| `revealDuration`    | `number`                 | `0.7`                            | Seconds to clear off the new one.                                                                                 |
| `holdDuration`      | `number`                 | `0.15`                           | Seconds held fully covered after the swap. Not just rhythm — see [Timing](#tuning-the-timing).                    |
| `contentScale`      | `number`                 | `1`                              | Scale the page recedes to. `1` is off. **Read [the caveats](#contentscale-and-its-two-caveats) before enabling.** |
| `interceptLinks`    | `boolean`                | `true`                           | Catch internal link clicks and cover before navigating.                                                           |
| `scrollToTop`       | `boolean`                | `true`                           | Jump to the top of the new page while still covered.                                                              |
| `onTransitionStart` | `(href: string) => void` | —                                | Fires on the intercepted click, with the destination.                                                             |
| `onTransitionEnd`   | `() => void`             | —                                | Fires when the whole sequence has settled.                                                                        |

---

## Theming

The veil colour is **observed, not owned**. The component never writes a theme; it reads `<html>` and follows. That means it works the same with your own `useTheme` hook, with `next-themes`, with Tailwind's dark mode, or with nothing at all.

Resolution order, first match wins:

| `<html>`                | Result                    |
| ----------------------- | ------------------------- |
| matches `darkSelector`  | `darkColor`               |
| matches `lightSelector` | `lightColor`              |
| matches neither         | OS `prefers-color-scheme` |

Both defaults are selector _lists_, so all of these already work with no configuration:

```html
<html data-theme="dark">
  <!-- data-theme convention -->
  <html class="dark">
    <!-- Tailwind / next-themes convention -->
  </html>
</html>
```

Using something else? Pass your own selector:

```tsx
<FadeVeil
  router={router}
  darkSelector='[data-mode="night"]'
  lightSelector='[data-mode="day"]'
/>
```

Changes are picked up live — a `MutationObserver` watches `<html>`, and a `matchMedia` listener covers the OS-preference fallback.

### Match your page background exactly

This is the one thing that decides whether it looks expensive or cheap. The veil should be the **same colour as the page it covers**. If your page background comes from a token, spell the same value into the props:

```tsx
/* theme.css
   :root              { --color-bg: hsl(0, 0%, 100%); }
   [data-theme=dark]  { --color-bg: hsl(0, 0%, 10%);  } */

<FadeVeil
  router={router}
  lightColor="hsl(0, 0%, 100%)"
  darkColor="hsl(0, 0%, 10%)"
>
```

Get this wrong and you see a rectangle fade in over your page, which is exactly the effect the component exists to avoid.

---

## Using another router

`FadeVeil` needs two things, and nothing else:

```ts
interface RouterAdapter {
  /** Current location as one string — pathname + search. Must change on every navigation. */
  location: string;
  /** Go to an internal href. Called once the veil is solid, not before. */
  navigate: (href: string) => void;
}
```

`useReactRouterAdapter.ts` is the entire React Router binding. Swap it for the equivalent and the component is untouched.

### Next.js App Router

```tsx
"use client";
import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { RouterAdapter } from "./FadeVeil";

export function useNextAdapter(): RouterAdapter {
  const pathname = usePathname();
  const params = useSearchParams().toString();
  const router = useRouter();

  return useMemo(
    () => ({
      location: params ? `${pathname}?${params}` : pathname,
      navigate: (href) => router.push(href),
    }),
    [pathname, params, router],
  );
}
```

Memoise the object. It is a dependency of the effect that attaches the click listener, so a fresh identity every render would detach and reattach it every render.

One thing to confirm for a router that is not React Router: interception works by calling `preventDefault()` in the capture phase, which relies on that router's `<Link>` checking `event.defaultPrevented` before it navigates. React Router 7's does. If yours does not, it will navigate anyway — set `interceptLinks={false}` and you still get a transition, just as a cross-fade after the fact instead of a cover-then-swap.

---

## Usage examples

### Default — a pure fade

```tsx
<FadeVeil router={router}>
  <Routes>…</Routes>
</FadeVeil>
```

White in light, near-black in dark, 1.35s end to end. No transforms are applied to your page at all.

### Tuning the timing

```tsx
<FadeVeil router={router} coverDuration={0.35} revealDuration={0.55} holdDuration={0.1}>
```

Snappier, and still asymmetric. Keep `revealDuration` above `coverDuration`.

`holdDuration` is not only pacing. The reveal is started from an effect that runs _before_ the browser has painted the new route, so a hold of `0` can begin clearing the veil off a page that is not on screen yet. If your pages are heavy, raise it rather than lower it.

### Lifecycle hooks

```tsx
<FadeVeil
  router={router}
  onTransitionStart={(href) => analytics.track("nav", { href })}
  onTransitionEnd={() => lenis.scrollTo(0, { immediate: true })}
>
```

`onTransitionStart` fires on the click with the destination href; `onTransitionEnd` when everything has settled.

### Opting a single link out

Any link marked `data-no-transition` navigates normally:

```tsx
<Link to="/downloads" data-no-transition>
  Downloads
</Link>
```

### Turning interception off entirely

```tsx
<FadeVeil router={router} interceptLinks={false}>
```

The transition still runs, but as a **cross-fade after the navigation** rather than cover-then-swap — the same path a browser back button takes. Use this if something else in your app owns link clicks.

---

## Which clicks get intercepted

Interception is deliberately conservative. A click is **left alone** if any of these is true:

| Condition                             | Why                                         |
| ------------------------------------- | ------------------------------------------- |
| Already `defaultPrevented`            | Something else has handled it.              |
| Not the left button                   | Middle/right click belongs to the browser.  |
| `Cmd` / `Ctrl` / `Shift` / `Alt` held | New tab, new window, download.              |
| No `<a>` ancestor                     | Nothing to intercept.                       |
| Has a `download` attribute            | It is a file, not a page.                   |
| `target` set to anything but `_self`  | It is leaving this document.                |
| Has `data-no-transition`              | Explicit opt-out.                           |
| Different origin                      | External link.                              |
| Same `pathname` + `search`            | A `#hash` jump, or a link to where you are. |

Everything else gets `preventDefault()` and the full transition.

---

## `contentScale` and its two caveats

`contentScale` makes the page recede slightly as it is covered and rise back as it clears — a nice touch, and **off by default** because it carries two real costs.

```tsx
<FadeVeil router={router} contentScale={0.985}>
```

**1. It creates a containing block.** Any non-`none` transform makes the wrapper a containing block, so a `position: fixed` child of your page is positioned against _it_ rather than the viewport. The transform is removed once the reveal ends, so this only applies mid-transition — under the veil, where nothing is visible — but a page with fixed chrome (a sticky header, a cookie bar) still jumps on the first frame of the cover, before the veil is opaque enough to hide it.

> **Only enable this if the wrapped pages have no `position: fixed` elements.**

**2. Shrinking opens a gutter.** At `0.985` on a 1200×800 viewport the page sits 9px in from the sides and 6px from top and bottom. Whatever is behind shows through. `FadeVeil.css` handles this by painting the wrapper `--fade-veil-color`, so the gutter is the ground colour instead of the white browser canvas — but it is why that background rule exists, and why removing it produces a pale frame around the page that is invisible in light mode and obvious in dark.

If you are unsure, leave it off. The fade is the effect; the scale is seasoning.

---

## Accessibility

- **`prefers-reduced-motion`** is honoured: the scale is dropped, the fade stays. A cross-fade is not travel, and removing it entirely would mean an abrupt cut, which is worse.
- The veil is `aria-hidden`, and the wrapper carries `aria-busy` while covered.
- While covering, the veil takes `pointer-events` so a second navigation cannot be queued behind the one in flight.

---

## Server rendering

Safe. There is no DOM access during render — the theme comes through `useSyncExternalStore` with a server snapshot of `"light"`, which React swaps for the real value on hydration. Nothing at module scope touches `document` or `window` either, so it imports cleanly on a server.

The one-frame `"light"` at hydration is invisible: the veil is transparent at rest, and the wrapper's ground colour only shows through a page that does not paint its own background.

---

## Gotchas

- **Links outside the wrapper are not intercepted.** By design — the component animates the pages it renders. If a nav needs transitions, mount it inside.
- **Backgrounding the tab pauses a transition mid-flight.** The navigation is gated on a GSAP timeline, and GSAP runs on `requestAnimationFrame`, which browsers suspend in hidden tabs. It resumes and completes when you come back. Inherent to any animation-gated transition, not specific to this one.
- **The page should paint its own background.** The wrapper paints `--fade-veil-color` behind it, which is a reasonable ground, but a page that relies on `body` for its colour will look right only if that colour matches.
- **`100dvh`** is used with a `100vh` fallback, so there is no strip below the fold on mobile.

---

## When not to use this

- **Transitions between pages of very different colours.** The whole idea is that the veil matches the ground. Fading white → white → dark-page draws attention to the seam. Use a wipe (`BlockPageTransition`) instead.
- **Navigation-heavy interfaces.** 1.35s is right for a portfolio or a marketing site; it is a tax on a dashboard someone clicks through fifty times an hour.
- **When you need the URL to change instantly** — a search-as-you-type route, say. The cover deliberately holds it for `coverDuration` first.

# SplitTextReveal

A reusable React component that animates text reveal using GSAP SplitText. Splits text into lines or characters and animates each piece from below into a masked container, either on scroll or on mount.

---

## Dependencies

```bash
npm install gsap @gsap/react
```

You also need the **SplitText** plugin, which is part of [Club GSAP](https://gsap.com/pricing/). Make sure your GSAP package is configured to include it.

The component imports:

```js
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
```

---

## Quick start

```jsx
import SplitTextReveal from "./SplitTextReveal";

export default function Hero() {
  return (
    <SplitTextReveal>
      <h1>Hello world</h1>
    </SplitTextReveal>
  );
}
```

By default it splits the text into **lines**, masks them, and reveals each line from `y: 100%` to `y: 0%` when the element scrolls into view.

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | required | Text content to animate. Can be a single element or multiple children. |
| `type` | `"lines" \| "chars"` | `"lines"` | Whether to split by lines or characters. |
| `animateOnScroll` | `boolean` | `true` | If `true`, animates when scrolled into view. If `false`, animates immediately on mount. |
| `delay` | `number` | `0` | Initial delay in seconds before animation starts. |
| `duration` | `number` | `1` | Duration of each piece's animation in seconds. |
| `stagger` | `number` | `0.1` for lines, `0.03` for chars | Delay between each piece. If you don't pass a value, a sensible default based on `type` is used. |
| `ease` | `string` | `"power4.out"` | Any [GSAP easing string](https://gsap.com/docs/v3/Eases/). |
| `scrollTriggerStart` | `string` | `"top 75%"` | ScrollTrigger `start` position. See [Footers section](#footers-and-elements-near-the-bottom). |
| `className` | `string` | `""` | Extra CSS classes applied to the wrapping element. |
| `style` | `object` | `{}` | Extra inline styles applied to the wrapping element. |
| `wrapperTag` | `string` | `"div"` | Tag name used when multiple children are passed (single children are cloned directly, no wrapper). |

---

## Usage examples

### Lines (default)

```jsx
<SplitTextReveal>
  <p>Long paragraph text that will be split into lines and revealed line by line.</p>
</SplitTextReveal>
```

### Characters

```jsx
<SplitTextReveal type="chars">
  <h1>Title</h1>
</SplitTextReveal>
```

### Animate on mount instead of scroll

```jsx
<SplitTextReveal animateOnScroll={false}>
  <h1>Loads in immediately</h1>
</SplitTextReveal>
```

Useful for above-the-fold hero text that's already visible on page load.

### Custom timing

```jsx
<SplitTextReveal
  type="chars"
  duration={1.2}
  delay={0.4}
  stagger={0.05}
  ease="expo.out"
>
  <h1>Stylized reveal</h1>
</SplitTextReveal>
```

### Multiple children

When you pass more than one child, the component wraps them in a `<div>` (or whatever `wrapperTag` you specify) and splits each child independently:

```jsx
<SplitTextReveal wrapperTag="section">
  <h2>Heading</h2>
  <p>Subheading underneath</p>
</SplitTextReveal>
```

### Single child (no wrapper)

When passing a single element, the component clones it and attaches the ref directly — no extra DOM is added:

```jsx
<SplitTextReveal>
  <h1 className="my-heading">Clean DOM</h1>
</SplitTextReveal>
```

The rendered output stays just `<h1 class="my-heading">…</h1>` with the split spans inside.

---

## Footers and elements near the bottom

The default `scrollTriggerStart` is `"top 75%"`, which means **"fire when the top of the element is 25% above the bottom of the viewport"**. This is a nice early reveal for mid-page content.

**Problem**: elements near the bottom of the page (footers, last sections) may never scroll high enough to cross the 75% line, so the animation never fires.

**Fix**: pass a later start position for those elements:

```jsx
<SplitTextReveal scrollTriggerStart="top 100%">
  <p>Footer text</p>
</SplitTextReveal>
```

`"top 100%"` (or equivalently `"top bottom"`) fires the moment the top of the element enters the viewport, which always happens for any element you can scroll to.

Quick reference:

| Start value | Fires when… |
|---|---|
| `"top bottom"` / `"top 100%"` | top of element enters the viewport — safest for footers |
| `"top 90%"` | top is 10% inside viewport — gentle |
| `"top 75%"` (default) | top is 25% inside viewport — good for mid-page |
| `"top center"` / `"top 50%"` | top reaches middle — dramatic |

---

## CSS / styling notes

### text-indent

For `type="lines"`, the component automatically transfers any `text-indent` on the element to `padding-left` on the first line, so the indent survives the split. You don't need to handle this yourself.

### Mask styling

SplitText creates the mask wrappers automatically (`mask: "lines"` / `mask: "chars"`). You don't need extra CSS for the reveal to work, but you can target the generated classes if you want:

- `linesClass: "line++"` → produces `line1`, `line2`, `line3`, …
- `charsClass: "char++"` → produces `char1`, `char2`, `char3`, …

Example:

```css
.line1 { color: red; }
.char3 { font-weight: bold; }
```

### Fonts

The component waits for `document.fonts.ready` before splitting. This avoids splitting against a fallback font and getting wrong widths once the real font swaps in. If you use `font-display: swap` or any custom font loading, you don't need to do anything extra — it's handled.

---

## Smooth scroll (Lenis, Locomotive, etc.)

If you use a smooth-scroll library, ScrollTrigger needs to be told about it or triggers won't fire correctly. The component calls `ScrollTrigger.refresh()` after creating a scroll trigger, but you still need a one-time setup somewhere in your app:

```js
// Example with Lenis
import Lenis from "lenis";

const lenis = new Lenis();
lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);
```

Without something like this, scroll-triggered reveals may never fire.

---

## Debugging

If a reveal isn't firing, the fastest way to see what's going on is to enable ScrollTrigger markers temporarily. Edit the component's scrollTrigger config to add `markers: true`:

```js
scrollTrigger: {
  trigger: containerRef.current,
  start: scrollTriggerStart,
  once: true,
  markers: true, // <-- temporary
},
```

You'll see green (`start`) and red (`end`) lines on the page. If you don't see any markers at all, the trigger never got created — likely the element wasn't in the DOM yet or fonts never resolved. If you see markers but the animation doesn't fire when you cross the green line, suspect a smooth-scroll integration issue.

---

## Cleanup

The component handles cleanup automatically on unmount:

- All `SplitText` instances are reverted (DOM restored to original)
- All `ScrollTrigger` instances tied to the element are killed

You don't need to do anything.

---

## When not to use this

- **Very large blocks of body text** — splitting hundreds of lines is expensive and the staggered reveal looks noisy. Better to reveal whole paragraphs.
- **Text that changes frequently** — `children` isn't in the dependency array, so dynamic text won't re-split on change. If you need that, add `children` to the `useGSAP` dependencies.
- **SSR-rendered text that needs to be SEO-readable as-is** — SplitText wraps text in spans, which can interfere with screen readers and copy-paste. Consider whether the reveal is worth it for the content.
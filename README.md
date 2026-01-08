# Animations must have :

## Must have Session-based skip
###### Users dont wanna see same Animation every refresh the page
```
const sessionLoaded = sessionStorage.getItem(sessionKey);
if (sessionLoaded) {
  setShouldShow(false);
  return;
}
```

## After animation Cleanup
###### No memory leaks, no DOM pollution
| You create           | You must clean          |
| -------------------- | ----------------------- |
| `gsap.timeline()`    | `tl.kill()`             |
| `setTimeout()`       | `clearTimeout()`        |
| `setInterval()`      | `clearInterval()`       |
| `SplitText.create()` | `split.revert()`        |
| `addEventListener()` | `removeEventListener()` |

## setTimeout (If animation freezes user still enters site)
```
hardFailRef.current = setTimeout(() => {
  if (!finishedRef.current) forceFinish();
}, duration);
```

## Minimum display time
###### prevents page loaded 500ms but Animation still animating ts instanly force finish
```

```

## prefers-reduced-motion: reduce
###### idk why peaple enable this settings
###### Accessibility & OS-level user preference
```
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;
```
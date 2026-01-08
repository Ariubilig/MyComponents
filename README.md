# Animations must have :

## Must have Session-based skip
###### Users dont wanna see same Animation every refresh the page
```
if (sessionLoaded) {
  setShouldShow(false);
  if (onFinish) onFinish();
  return;
}
const sessionLoaded = sessionStorage.getItem('sessionLoaded');
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
setTimeout(() => forceFinish(), MAX_TIME);
```

## prefers-reduced-motion: reduce
###### idk why peaple enable this settings
###### Accessibility & OS-level user preference
```
window.matchMedia('(prefers-reduced-motion: reduce)')
```
import { FadeVeil, useReactRouterAdapter } from "./index";
import FadeVeilRoutes from "./FadeVeilStage";

/**
 * The screen fades to the page's own background colour — white in light, black
 * in dark — the route swaps behind it, and it fades back off.
 *
 * Things worth checking here:
 *
 * - The URL does not change until the screen is solid. Watch the address bar
 *   against the fade: `FadeVeil` catches the click on the replay `<Link>` and
 *   holds the navigation, so the new page is never briefly visible.
 * - Switch the theme and replay. The veil follows, without being told: it reads
 *   how `<html>` is marked, and `useTheme` writes `data-theme` there. A `.dark`
 *   class would work the same — both are in the default selector.
 * - The way back is slower than the way out — a fade-out that outlasts its
 *   fade-in is most of what separates this from a cross-fade.
 * - Browser back mid-sequence. Nothing covered for that navigation, so it gets
 *   a short cross-fade rather than a veil that would have to hide a page you
 *   had already seen.
 * - `prefers-reduced-motion`. The fade stays, the scale below goes.
 *
 * The colours are `theme.css`'s `--color-bg` in each mode, spelled out rather
 * than inherited so that the veil and the stage match exactly and the dissolve
 * has no edge. `contentScale` is off by default and turned on here because this
 * stage has nothing `position: fixed` in it — see the prop's note.
 *
 * `useReactRouterAdapter` is the one line that binds this to React Router;
 * `FadeVeil` itself imports no router at all.
 */
export default function App() {
  const router = useReactRouterAdapter();

  return (
    <FadeVeil
      router={router}
      lightColor="hsl(0, 0%, 100%)"
      darkColor="hsl(0, 0%, 10%)"
      contentScale={0.985}
    >
      <FadeVeilRoutes base="fade-veil" />
    </FadeVeil>
  );
}

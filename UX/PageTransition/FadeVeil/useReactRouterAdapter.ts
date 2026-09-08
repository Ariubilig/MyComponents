import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { RouterAdapter } from "./FadeVeil";

/**
 * Binds `FadeVeil` to React Router. This is the only file in the folder that
 * imports a router — swap it for one of your own (see `RouterAdapter` for a
 * Next.js version) and the component itself needs no changes.
 *
 * ```tsx
 * const router = useReactRouterAdapter();
 * return <FadeVeil router={router}>{children}</FadeVeil>;
 * ```
 *
 * Must be called inside a `<Router>`, like the two hooks it wraps.
 */
export function useReactRouterAdapter(): RouterAdapter {
  const { pathname, search } = useLocation();
  const routerNavigate = useNavigate();

  /*
   * Memoised because the object is a dependency of the effect that attaches
   * `FadeVeil`'s click listener. A fresh identity every render would take that
   * listener off and put it back on every one — harmless, but pointless, and
   * this component is meant to survive projects that do not run the React
   * Compiler.
   */
  return useMemo(
    () => ({
      location: `${pathname}${search}`,
      navigate: (href: string) => routerNavigate(href),
    }),
    [pathname, search, routerNavigate],
  );
}

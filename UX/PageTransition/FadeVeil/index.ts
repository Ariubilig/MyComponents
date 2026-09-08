/**
 * The public surface. Copy the folder into a project and import from here;
 * everything else in it is either the stylesheet or the harness test page.
 *
 * `FadeVeil` itself imports no router. `useReactRouterAdapter` is the binding
 * for this project's; write the equivalent four lines for another and the
 * component is unchanged.
 */
export { default as FadeVeil } from "./FadeVeil";
export type { FadeVeilProps, RouterAdapter } from "./FadeVeil";
export { useReactRouterAdapter } from "./useReactRouterAdapter";

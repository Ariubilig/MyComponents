import { Route, Routes } from "react-router-dom";

import { FadeVeil, useReactRouterAdapter } from "./index";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";

/**
 * Where `FadeVeil` goes in a real app.
 *
 * Two things about this layout are load-bearing:
 *
 * 1. **`<Navbar />` is inside the wrapper.** Link interception is scoped to
 *    `FadeVeil`'s own subtree, so a nav mounted as a sibling above it would
 *    navigate instantly with no transition at all. If your nav has to live
 *    outside, put `FadeVeil` higher up the tree instead of moving the nav.
 *
 * 2. **`useReactRouterAdapter` is called inside the `<BrowserRouter>`**, since
 *    it wraps `useLocation` and `useNavigate`. In a typical setup `App` is
 *    rendered by the router, so this is already true — but it is why the
 *    adapter is a hook and not a module-level object.
 *
 * That is the whole integration. Every prop below is optional.
 */
export default function App() {
  const router = useReactRouterAdapter();

  return (
    <FadeVeil router={router}>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </FadeVeil>
  );
}

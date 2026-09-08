import "./App.css";
import {
  BrowserRouter,
  Link,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { useAwayTitle } from "./hooks/usePageVisibility";
import Home from "./Home";
import { tests } from "./tests";

/**
 * Test harness for the components in this repo. `/` is the index; every entry
 * in `tests.ts` gets its own route, so a page can be reloaded and linked to
 * directly instead of being swapped in and out of this file by hand.
 */
export default function App() {
  useAwayTitle();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route element={<TestChrome />}>
          {tests.map(({ path, nested, Component }) => (
            <Route
              key={path}
              path={nested ? `${path}/*` : path}
              element={<Component />}
            />
          ))}
        </Route>
        {/* Unknown path: back to the index rather than a blank screen. */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

/**
 * The only thing wrapped around a test page: a way back to the index. Kept
 * deliberately small and pinned top-left, since a test is free to take over
 * the viewport and the bar itself defaults to the right edge.
 */
function TestChrome() {
  const { pathname } = useLocation();

  /*
   * Canonicalise the trailing slash before rendering anything. A relative asset
   * URL resolves against a different base on `/spotlight/` than on `/spotlight`,
   * so a component that shipped one would 404 every image on a URL the router
   * otherwise matches happily. Components in here reference `public/` absolutely
   * and no longer depend on this, but it still keeps the two spellings of a path
   * from being two different pages.
   */
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return <Navigate to={pathname.replace(/\/+$/, "")} replace />;
  }

  return (
    <>
      <Link to="/" className="harness-back">
        ← tests
      </Link>
      <Outlet />
    </>
  );
}

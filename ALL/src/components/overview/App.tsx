import "./App.css";
import Overview from "./Overview";

/**
 * The table dims and blurs every row except the hovered one, so the thing to
 * check is the crossfade between neighbours — and that leaving the table
 * clears the state rather than leaving the last row lit.
 *
 * `Overview.css` styles its text for a dark ground, so the page supplies one.
 */
export default function App() {
  return (
    <div className="ov-demo">
      <Overview />
    </div>
  );
}

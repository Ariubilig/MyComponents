import "./App.css";
import HoverLineShow from "./HoverLineShow";

/**
 * Hover across the names quickly: the underline should grow from the left and
 * retract to the right, so two adjacent names never look like one bar sliding
 * between them.
 */
export default function App() {
  return (
    <div className="hls-demo">
      <HoverLineShow />
    </div>
  );
}

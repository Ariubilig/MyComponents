import "./index.css";
import useTheme from "./useTheme";

function App() {
  const { theme, setTheme, toggle } = useTheme();

  return (
    <>
      <button onClick={toggle}>Toggle theme</button>

      {/* Three-way selector: the stored preference, not the resolved one. */}
      {["light", "dark", "system"].map((t) => (
        <button key={t} onClick={() => setTheme(t)} aria-pressed={theme === t}>
          {t}
        </button>
      ))}
    </>
  );
}

export default App;

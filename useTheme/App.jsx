import useTheme from "./hook/useTheme";

  function App(){

    const { theme, toggleTheme } = useTheme();

    return (
      <>
      
      <button onClick={toggleTheme}>
        {theme === "light"} Toggle Theme
      </button>

      </>
    );
  }

export default App
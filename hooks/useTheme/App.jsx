import './App.css'
import useTheme from './hooks/useTheme/useTheme';


function App() {


  const { theme, toggle } = useTheme();


  return (
    <>

    <button onClick={toggle}>
      Toggle Theme
    </button>

    </>
  )
}


export default App

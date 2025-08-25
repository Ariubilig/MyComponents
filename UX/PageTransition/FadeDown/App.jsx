import { Routes, Route } from 'react-router-dom';

import FadeDown from './FadeDownUp.jsx';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home.jsx';
import AboutPage from './pages/AboutPage';


function App() {

  return (
    <>
    {/* <FadeDown> */}
    {/* <PageTransition transitionImage="/zero.png"> */}
      <Navbar /> 

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/AboutPage" element={<AboutPage />} />
      </Routes>

    {/* </FadeDown> */}
    </>
  );
}

export default App;
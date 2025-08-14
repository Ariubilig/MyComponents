import './App.css'
// import BlockPageTransition from './BlockPageTransition';
import PageTransitionNoLogo from './PageTransitionNoLogo';
import Navbar from './navbar';
import Index from "./pages/Index";
import Archive from "./pages/Archive";
import Contact from "./pages/Contact";

import { Routes, Route } from 'react-router-dom'; // <-- you need this import

function App() {

  return (
    <>
      <PageTransitionNoLogo>
        <Navbar />

        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/archive" element={<Archive />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>

      </PageTransitionNoLogo>
    </>
  );
}

export default App;

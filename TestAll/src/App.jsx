import { Routes, Route } from "react-router-dom";
import { useRef, useState } from "react";

import './App.css'

import Loading from './Preloader/LoadingScreen';
import Navbar from './Navbar/Navbar';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Slider from './Slides/Slider';
import ScrollSlider from './Slider/ScrollSlider';
import AboutPage from "./pages/about";
import Overview from "./overview/Overview";
import SpotlightGallery from "./SpotLight/SpotLight";

import { useScrollSmoother } from './hooks/useScrollSmoother+load';
import Marquee from './InfObjectMove/Marquee';
import PageTransition from './PageTransition/PageTransition';
import FadeDown from "./FadeDown/FadeDown";


function App() {

  const smoothWrapperRef = useRef(null);
  const [loadingFinished, setLoadingFinished] = useState(false);
  useScrollSmoother(smoothWrapperRef, loadingFinished);

  return (
    <>

    {!loadingFinished ? (
        <Loading onComplete={() => setLoadingFinished(true)} />
      ) : (
        <>
        <PageTransition>
        {/* <FadeDown> */}
          

          <Navbar /> 

          <div id="smooth-wrapper" ref={smoothWrapperRef}>
            <div id="smooth-content">

              <Routes>

                <Route path="/" element={<Home />} />
                <Route path="/Cart" element={<Cart />} />
                <Route path="/Slider" element={<Slider />} />
                <Route path="/Marquee" element={<Marquee />} />
                <Route path="/ScrollSlider" element={<ScrollSlider />} />
                <Route path="/AboutPage" element={<AboutPage />} />
                <Route path="/Overview" element={<Overview />} />
                <Route path="/SpotlightGallery" element={<SpotlightGallery />} />

                
              </Routes>

            </div>
          </div>

        {/* </FadeDown> */}
        </PageTransition>
        </>
      )}
    </>
  )
}

export default App
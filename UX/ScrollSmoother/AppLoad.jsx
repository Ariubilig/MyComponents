import { useRef, useState } from "react";
import { useScrollSmoother } from "./components/hooks/useScrollSmoother.jsx";
import Preloader from "./components/ux/preloader/Preloader";


function App() {

  const [preloaderDone, setPreloaderDone] = useState(false);
  const wrapperRef = useRef(null);
  useScrollSmoother(wrapperRef, { enabled: preloaderDone });

  return (
    <>
      {!preloaderDone && (
        <Preloader onFinish={() => setPreloaderDone(true)} />
      )}

      <div id="smooth-wrapper" ref={wrapperRef}>
        <div id="smooth-content">

          

        </div>
      </div>
    </>
  );
}

export default App;
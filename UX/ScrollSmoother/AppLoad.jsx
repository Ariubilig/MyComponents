import { useRef, useState } from "react";
import { useScrollSmoother } from "./components/hooks/useScrollSmoother";
import Preloader from "./components/ux/preloader/Preloader";


function App() {


  const [preloaderDone, setPreloaderDone] = useState(false);
  const wrapperRef = useRef(null);
  useScrollSmoother(wrapperRef, preloaderDone);

  
  return (
    <>


      {!preloaderDone ? (
        <Preloader onFinish={() => setPreloaderDone(true)} />
      ) : (

        <div id="smooth-wrapper" ref={wrapperRef}>
          <div id="smooth-content">

            

          </div>
        </div>
        
      )}


    </>
  );
}

export default App;
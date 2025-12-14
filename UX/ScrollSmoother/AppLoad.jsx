import { useRef, useState } from "react";
import { useScrollSmoother } from "./components/hooks/useScrollSmoother";
import Preloader from "./components/ux/preloader/Preloader";


function App() {


  const [loadingFinished, setLoadingFinished] = useState(false);
  const wrapperRef = useRef(null);
  useScrollSmoother(wrapperRef, loadingFinished);

  
  return (
    <>
      {!loadingFinished ? (
        <Preloader onFinish={() => setLoadingFinished(true)} />
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
import { useRef, useState } from "react";
import { useScrollSmoother } from "./components/hooks/useScrollSmoother";


function App() {


  const wrapperRef = useRef(null);
  useScrollSmoother(wrapperRef, );

  
  return (
    <>

        <div id="smooth-wrapper" ref={wrapperRef}>
          <div id="smooth-content">
            


          </div>
        </div>

    </>
  );
}

export default App;
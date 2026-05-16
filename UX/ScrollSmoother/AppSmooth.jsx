import { useRef } from "react";
import { useScrollSmoother } from "./components/hooks/useScrollSmoother";


function App() {

  const wrapperRef = useRef(null);
  useScrollSmoother(wrapperRef); // enabled defaults to true

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
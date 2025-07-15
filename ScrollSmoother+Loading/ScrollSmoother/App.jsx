import { useRef } from "react";
import { useScrollSmoother } from './useScrollSmoother';

function App() {
  const smoothWrapperRef = useRef(null);
  useScrollSmoother(smoothWrapperRef);

  return (
    <>


    <Navbar />

    <div id="smooth-wrapper" ref={smoothWrapperRef}>
      <div id="smooth-content">

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Cart" element={<Cart />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>

      </div>
    </div>

    
    </>
  );
}

export default App;
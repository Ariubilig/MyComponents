import { useRef, useState } from "react";
import Load from './load';
import { useScrollSmoother } from './useScrollSmoother';


function App() {

/////////////////////////////////////////////////////////////////////////
  const [loadingDone, setLoadingDone] = useState(false);
  const smoothWrapperRef = useRef(null);

  useScrollSmoother(smoothWrapperRef, loadingDone);
/////////////////////////////////////////////////////////////////////////


  return (
    <>

      {!loadingDone ? (
        <Load onFinish={() => setLoadingDone(true)} />
      ) : (
        <>

          <div id="smooth-wrapper" ref={smoothWrapperRef}>
            <div id="smooth-content">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nostrum natus, eius quos soluta, quam hic ipsam atque tempora voluptas ducimus iusto incidunt magnam provident, fugit at rem in quisquam beatae.
              <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Explicabo in ratione totam, sapiente placeat dolore repellat corrupti unde, aliquam nam error officiis odio, consequatur molestiae suscipit ducimus veritatis neque quam?
              <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
            </div>
          </div>
        </>
      )}

    </>
  );
}

export default App;
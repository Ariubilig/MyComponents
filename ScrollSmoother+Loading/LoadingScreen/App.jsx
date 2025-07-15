import { useState } from "react";
import Loading from './load/load.js';

function App() {

  const [loadingFinished, setLoadingFinished] = useState(false);

  return (
    <>

      {!loadingFinished ? (
        <Loading onLoadingFinish={() => setLoadingFinished(true)} />
      ) : (
        <>
          
          <Aaa /> // ene dotor route bnu func bnu hamgu
          
        </>
      )}

    </>
  );
}

export default App;
import { useState } from "react";
import Loading from './LoadingScreen/LoadingScreen.js';


function App() {

  const [loadingFinished, setLoadingFinished] = useState(false);

  return (
    <>

      {!loadingFinished ? (
        <Loading onComplete={() => setLoadingFinished(true)} />
      ) : (
        <>
          
        <h1></h1>

        </>
      )}

    </>
  );
}

export default App;
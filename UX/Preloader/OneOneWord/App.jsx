import { useState } from "react";
import Preloader from './Preloader/Preloader.jsx';


function App() {

  
  const [loadingFinished, setLoadingFinished] = useState(false);

  return (
    <>

    {!loadingFinished ? (
      <Preloader onComplete={() => setLoadingFinished(true)} />
    ) : (
      <>
        


      </>
    )}

    </>
  );
}

export default App;
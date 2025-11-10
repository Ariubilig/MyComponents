import { useState } from "react";
import Preloader from "../Preloader/Preloader.jsx";

function App() {


  const [loadingFinished, setLoadingFinished] = useState(false);


  return (
    <div>

      {!loadingFinished ? (
        <Preloader onFinish={() => setLoadingFinished(true)} />
      ) : (

        <main className="hero">
          aaaaaaaaaaa
        </main>
        
      )}

    </div>
  );
};


export default App;
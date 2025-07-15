// One loadingNames = 500ms

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

////////////////////////////////////////////////////

import './load.css';
import React from 'react';

const loadingNames = ["RARI", "EMURACS", "SITAN", "SANDAN", "BELLATTIX", "NOEL"];

const Loading = ({ onLoadingFinish }) => {

  const [currentLoadName, setCurrentLoadName] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLoadName((prev) => (prev + 1) % loadingNames.length);
    }, 500);

    const timer = setTimeout(() => {
      onLoadingFinish();
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [onLoadingFinish]);

  return (

    <div className="loading-screen">
      {loadingNames[currentLoadName]}
    </div>

  );
};

export default Loading;

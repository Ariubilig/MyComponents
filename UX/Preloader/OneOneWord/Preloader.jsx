import React from 'react';
import './Preloader.css';

const PreloaderNames = ["RARI", "EMURACS", "SITAN", "SANDAN", "BELLATTIX", "NOEL"];

const Preloader = ({ onFinish }) => {
  const [currentLoadName, setCurrentLoadName] = React.useState(0);
  const [shouldShow, setShouldShow] = React.useState(true);

  React.useEffect(() => {

    // Check if session has already loaded
    const sessionLoaded = sessionStorage.getItem('sessionLoaded');
    if (sessionLoaded) {
      // Skip Preloader screen if already loaded session
      setShouldShow(false);
      onFinish();
      return;
    }

    // Show Preloader screen for first load in this session
    const interval = setInterval(() => {
      setCurrentLoadName((prev) => (prev + 1) % PreloaderNames.length);
    }, 500);

    const timer = setTimeout(() => {
      // Mark the site has been loaded in session
      sessionStorage.setItem('sessionLoaded', 'true');
      onFinish();
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [onFinish]);

  // Don't render anything if we should skip the Preloader screen
  if (!shouldShow) {
    return null;
  }

  return (
    <div className="Preloader-screen">
      {PreloaderNames[currentLoadName]}
    </div>
  );
};

export default Preloader;
import React from 'react';
import './LoadingScreen.css';


const loadingNames = ["RARI", "EMURACS", "SITAN", "SANDAN", "BELLATTIX", "NOEL"];

const Loading = ({ onLoadingFinish }) => {

  const [currentLoadName, setCurrentLoadName] = React.useState(0);
  const [shouldShow, setShouldShow] = React.useState(true);

  React.useEffect(() => {

    // Check if session has already loaded
    const sessionLoaded = sessionStorage.getItem('sessionLoaded');
    if (sessionLoaded) {
      // Skip loading screen if already loaded session
      setShouldShow(false);
      onLoadingFinish();
      return;
    }

    // Show loading screen for first load in this session
    const interval = setInterval(() => {
      setCurrentLoadName((prev) => (prev + 1) % loadingNames.length);
    }, 500);

    const timer = setTimeout(() => {
      // Mark the site has been loaded in session
      sessionStorage.setItem('sessionLoaded', 'true');
      onLoadingFinish();
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [onLoadingFinish]);

  // Don't render anything if we should skip the loading screen
  if (!shouldShow) {
    return null;
  }

  return (
    <div className="loading-screen">
      {loadingNames[currentLoadName]}
    </div>
  );
};

export default Loading;

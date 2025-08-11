import React from 'react';
// import './load.css';

const loadingNames = ["RARI", "EMURACS", "SITAN", "SANDAN", "BELLATTIX", "NOEL"];

const Loading = ({ onFinish }) => {
  const [currentLoadName, setCurrentLoadName] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLoadName((prev) => (prev + 1) % loadingNames.length);
    }, 500);

    const timer = setTimeout(() => {
      if (typeof onFinish === 'function') {
        onFinish();
      }
    }, loadingNames.length * 500); // 500ms per name

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [onFinish]);

  return (
    <div className="loading-screen">
      {loadingNames[currentLoadName]}
    </div>
  );
};

export default Loading;
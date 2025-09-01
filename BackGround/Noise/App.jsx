import Noise from './components/Noise/Noise';


function App() {

  const [loadingFinished, setLoadingFinished] = useState(false);

  return (
    <>

    <Noise
    patternSize={250}
    patternScaleX={1}
    patternScaleY={1}
    patternRefreshInterval={2}
    patternAlpha={15}
    />

      {!loadingFinished ? (
        <Preloader onComplete={() => setLoadingFinished(true)} />
      ) : (
      // <FadeDown>
      <FadeDown transitionImage="/zero.png">
        <Navbar /> 

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/AboutPage" element={<AboutPage />} />
          <Route path="/ExampleMenu" element={<ExampleMenu />} />
        </Routes>

      </FadeDown>
      )}

    </>
  );
}

export default App;
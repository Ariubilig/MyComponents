

const App = () => {


  const [preloaderDone, setPreloaderDone] = useState(false);


  return (
    <div>
      {!preloaderDone ? (
        <Preloader onFinish={() => setPreloaderDone(true)} />
      ) : (
        <main className="hero">
          aaaaaaaaaaa
        </main>
      )}
    </div>
  );
};


export default App;
import useGMTplus8 from '../../hooks/useGMT+8'

  function App(){

    const currentTime = useGMTplus8()

    return (
      <>
      
      <div>{currentTime}</div>


      </>
    );
  }

export default App
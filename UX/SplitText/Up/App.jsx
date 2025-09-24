import SplitTextUp from './SplitTextUp';

function App() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>SplitTextUp Examples</h1>
      
      {/* Basic usage */}
      <SplitTextUp delay={0.5}>
        <h2>We craft identities and experiences for the bold.</h2>
      </SplitTextUp>

      {/* Custom styling and animation */}
      <SplitTextUp 
        delay={1} 
        duration={1.5} 
        stagger={1.15}
        className="custom-text"
      >
        <h3 style={{ color: '#ff6b6b', fontSize: '2rem' }}>
          This text has custom styling and slower animation
        </h3>
      </SplitTextUp>

      {/* Multiple elements */}
      <SplitTextUp 
        delay={1.5} 
        stagger={0.2}
        style={{ marginTop: '3rem' }}
      >
        <p>First paragraph with line-by-line animation</p>
        <p>Second paragraph with line-by-line animation</p>
        <p>Third paragraph with line-by-line animation</p>
      </SplitTextUp>

      {/* Without scroll trigger */}
      <SplitTextUp 
        animateOnScroll={false} 
        delay={2}
        style={{ marginTop: '3rem' }}
      >
        <h4>This animates immediately without scroll trigger</h4>
      </SplitTextUp>
    </div>
  );
}

export default App;
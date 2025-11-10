import SplitTextChar from './SplitTextChar';

function App() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>SplitTextChar Examples</h1>
      
      {/* Basic usage */}
      <SplitTextChar delay={0.5}>
        <h2>Timeless Form</h2>
      </SplitTextChar>

      {/* Custom styling and animation */}
      <SplitTextChar 
        delay={1} 
        duration={1.5} 
        stagger={0.05}
        className="custom-text"
        style={{ marginTop: '3rem' }}
      >
        <h3 style={{ color: '#4ecdc4', fontSize: '2rem' }}>
          Character by character animation
        </h3>
      </SplitTextChar>

      {/* Multiple elements */}
      <SplitTextChar 
        delay={1.5} 
        stagger={0.02}
        style={{ marginTop: '3rem' }}
      >
        <p>First paragraph with character animation</p>
        <p>Second paragraph with character animation</p>
        <p>Third paragraph with character animation</p>
      </SplitTextChar>

      {/* Without scroll trigger */}
      <SplitTextChar 
        animateOnScroll={false} 
        delay={2}
        style={{ marginTop: '3rem' }}
      >
        <h4>This animates immediately without scroll trigger</h4>
      </SplitTextChar>

      {/* Custom wrapper tag */}
      <SplitTextChar 
        delay={2.5}
        wrapperTag="section"
        className="custom-section"
        style={{ marginTop: '3rem', border: '1px solid #ddd', padding: '1rem' }}
      >
        <h5>Using a section wrapper instead of div</h5>
      </SplitTextChar>
    </div>
  );
}

export default App;
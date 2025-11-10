import SplitTextLines from './SplitTextLines';

function App() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>SplitTextLines Examples</h1>
      
      {/* Basic usage */}
      <SplitTextLines delay={0.5}>
        <h2>We craft identities and experiences for the bold.</h2>
      </SplitTextLines>

      {/* Custom styling and animation */}
      <SplitTextLines 
        delay={1} 
        duration={1.5} 
        stagger={1.15}
        className="custom-text"
      >
        <h3 style={{ color: '#ff6b6b', fontSize: '2rem' }}>
          This text has custom styling and slower animation
        </h3>
      </SplitTextLines>

      {/* Multiple elements */}
      <SplitTextLines 
        delay={1.5} 
        stagger={0.2}
        style={{ marginTop: '3rem' }}
      >
        <p>First paragraph with line-by-line animation</p>
        <p>Second paragraph with line-by-line animation</p>
        <p>Third paragraph with line-by-line animation</p>
      </SplitTextLines>

      {/* Without scroll trigger */}
      <SplitTextLines 
        animateOnScroll={false} 
        delay={2}
        style={{ marginTop: '3rem' }}
      >
        <h4>This animates immediately without scroll trigger</h4>
      </SplitTextLines>
    </div>
  );
}

export default App;
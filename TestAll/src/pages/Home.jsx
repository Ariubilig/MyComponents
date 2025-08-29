import Up from '../SplitText/Up/SplitTextUp';

export default function  home() {
    return(
      <>

      <br /><br />

      {/* Basic usage */}
      <Up delay={0.5}>
        <h1>We craft identities and experiences for the bold.</h1>
      </Up>

      <br />

      {/* Custom styling and animation */}
      <Up 
        delay={1} 
        duration={1.5} 
        stagger={0.15}
        className="custom-text"
        style={{ marginTop: '3rem' }}
      >
        <h3 style={{ color: '#ff6b6b', fontSize: '2rem' }}>
          This text has custom styling and slower animation
        </h3>
      </Up>

      <br />

      {/* Multiple elements */}
      <Up 
        delay={1.5} 
        stagger={0.2}
      >
        <p>First paragraph with line-by-line animation</p>
        <p>Second paragraph with line-by-line animation</p>
        <p>Third paragraph with line-by-line animation</p>
      </Up>

      <br />

      {/* Without scroll trigger */}
      <Up 
        animateOnScroll={false} 
        delay={2}
      >
        <h4>This animates immediately without scroll trigger</h4>
      </Up>

      <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
            <Up delay={1}>
        <h1>We craft identities and experiences for the bold.</h1>
      </Up>
      </>
    )
}
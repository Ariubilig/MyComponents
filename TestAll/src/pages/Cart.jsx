import Each from "../SplitText/EachWord/SplitTextEach"


export default function  Cart() {

    return(
        <>
            
        <br /><br /><br />
        {/* Basic usage */}
        <Each delay={0.5}>
            <h1>Timeless Form</h1>
        </Each>

        {/* Custom styling and animation */}
        <Each 
            delay={1} 
            duration={1.5} 
            stagger={0.05}
            className="custom-text"
            style={{ marginTop: '3rem' }}
        >
            <h3 style={{ color: '#4ecdc4', fontSize: '2rem' }}>
            Character by character animation
            </h3>
        </Each>

        {/* Multiple elements */}
        <Each 
            delay={1.5} 
            stagger={0.02}
            style={{ marginTop: '3rem' }}
        >
            <p>First paragraph with character animation</p>
            <p>Second paragraph with character animation</p>
            <p>Third paragraph with character animation</p>
        </Each>

        {/* Without scroll trigger */}
        <Each 
            animateOnScroll={false} 
            delay={2}
            style={{ marginTop: '3rem' }}
        >
            <h4>This animates immediately without scroll trigger</h4>
        </Each>

        {/* Custom wrapper tag */}
        <Each 
            delay={2.5}
            wrapperTag="section"
            className="custom-section"
            style={{ marginTop: '3rem', border: '1px solid #ddd', padding: '1rem' }}
        >
            <h5>Using a section wrapper instead of div</h5>
        </Each>

        <br /><br /><br /><br /><br /><br /><br />        <br /><br /><br /><br /><br /><br /><br />
        <br /><br /><br /><br /><br /><br /><br />
        <br /><br /><br /><br /><br /><br /><br />
        <br /><br /><br /><br /><br /><br /><br />

        <Each delay={0.5}>
            <h1>Timeless Form</h1>
        </Each>
        
        </>
    )
}
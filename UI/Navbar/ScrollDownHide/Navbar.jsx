import './Navbar.css';
import { Link } from 'react-router-dom';
import Up from '../../UX/SplitText/SplitTextUp';
import { useState, useEffect, useRef } from "react";


export default function Navbar() {

  const [hidden, setHidden] = useState(false);

  // refs to keep stable values inside the scroll handler
  const lastScrollY = useRef(typeof window !== 'undefined' ? window.scrollY : 0);
  const hiddenRef = useRef(false);
  const hidePoint = useRef(0);

  // tuning values
  const smallDelta = 7;      // ignore tiny jitter
  const upDownThreshold = 200; // px to scroll down before hiding, and px to scroll up before showing

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY || window.pageYOffset;
      const diff = current - lastScrollY.current;

      // SCROLLING DOWN
      if (diff > smallDelta) {
        // If not hidden and we passed the threshold, hide and record hide point
        if (!hiddenRef.current && current > upDownThreshold) {
          setHidden(true);
          hiddenRef.current = true;
          hidePoint.current = current;
        } else if (hiddenRef.current && current > hidePoint.current) {
          // if user keeps scrolling down while hidden, update hidePoint to the max
          hidePoint.current = current;
        }
      }

      // SCROLLING UP
      else if (diff < -smallDelta) {
        // Only show after we've scrolled up at least `upDownThreshold` from hidePoint
        if (hiddenRef.current && current < hidePoint.current - upDownThreshold) {
          setHidden(false);
          hiddenRef.current = false;
          hidePoint.current = 0; // optional reset
        }
      }

      lastScrollY.current = current;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  

  return (
    <div className={`Navbar ${hidden ? 'Navbar--hidden' : ''}`}>
      <Up delay={1}>
        <Link to="/" className="h1">ЭЛИКСИР КОМБИНАТ</Link>
      </Up>

      <Up delay={1}>
        <div className="links">
          <Link to="/Music">MUSIC</Link>
          <Link to="/Merch">Merch</Link>
        </div>
      </Up>
    </div>
  );
}

import './navbar.css';
import { Link } from 'react-router-dom';


function Navbar() {
    return(
        <>
        
        <div className='nav'>
            <Link  to="/" >home</Link>
            <Link  to="/Cart" >Cart</Link>
            <Link  to="/Slider" >Slider</Link>
            <Link  to="/Marquee" >Marquee</Link>
            <Link  to="/ScrollSlider" >ScrollSlider</Link>
            <Link  to="/AboutPage" >About</Link>
        </div>

        </>
    )
}

export default Navbar
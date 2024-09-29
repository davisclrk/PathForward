import './navbar.css';
import homeIcon from '../Assets/homeIcon.svg';
import personIcon from '../Assets/personIcon.svg';
import transparentImage from '../Assets/transparent_image.png';

function Navbar() {
    return (
        <div className="navbar">
            <div className="links">
                <a href='#'>
                    <img src={homeIcon} alt="Home" />
                </a>
                <a href="">
                    <img src={personIcon} alt="Profile" />
                </a>
            </div>
            <div className="bottom-image">
                <img src={transparentImage} alt="Transparent" />
            </div>
        </div>
    );
}


export default Navbar;
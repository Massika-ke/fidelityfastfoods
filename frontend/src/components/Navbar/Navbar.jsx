


import { useContext, useState, useEffect } from 'react'
import { assets } from '../../assets/assets'
import './Navbar.css'
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';

// eslint-disable-next-line react/prop-types
const Navbar = ({setShowLogin}) => {

    const [menu, setMenu] = useState("home");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const {getTotalCartAmount, token, setToken} = useContext(StoreContext);

    const navigate = useNavigate();

    // Handle scroll effect for sticky navbar
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        setToken("");
        navigate("/")
    }

    // Close mobile menu when clicking a link
    const handleMenuClick = (menuName) => {
        setMenu(menuName);
        setMobileMenuOpen(false);
    }

    // Toggle mobile menu
    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    }
    
    return (
        <div className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <Link to='/' onClick={() => handleMenuClick('home')}>
                <img src={assets.logo} alt="Fidelity Foods Logo" className='logo' />
            </Link>

            {/* Mobile Menu Toggle */}
            <div 
                className={`navbar-toggle ${mobileMenuOpen ? 'active' : ''}`}
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
            >
                <span></span>
                <span></span>
                <span></span>
            </div>

            <ul className={`navbar-menu ${mobileMenuOpen ? 'active' : ''}`}>
                <Link 
                    to='/' 
                    onClick={() => handleMenuClick('home')} 
                    className={menu === "home" ? "active" : ""}
                >
                    home
                </Link>
                <a  
                    href='#explore-menu' 
                    onClick={() => handleMenuClick('menu')} 
                    className={menu === "menu" ? "active" : ""}
                >
                    menu
                </a>
                <a 
                    href='#app-download' 
                    onClick={() => handleMenuClick('mobile-app')} 
                    className={menu === "mobile-app" ? "active" : ""}
                >
                    mobile-app
                </a>
                <a 
                    href='#footer' 
                    onClick={() => handleMenuClick('contact-us')} 
                    className={menu === "contact-us" ? "active" : ""}
                >
                    contact-us
                </a>
            </ul>

            <div className="navbar-right">
                <img 
                    src={assets.search_icon} 
                    alt="Search" 
                    title="Search"
                />
                <div className="navbar-search-icon">
                    <Link to='/Cart'>
                        <img 
                            src={assets.basket_icon} 
                            alt="Shopping Cart" 
                            title="View Cart"
                        />
                    </Link>
                    <div 
                        className={getTotalCartAmount() === 0 ? "" : "dot"}
                        title={getTotalCartAmount() === 0 ? "" : "Items in cart"}
                    ></div>
                </div>
                
                {!token ? 
                    <button 
                        onClick={() => setShowLogin(true)}
                        aria-label="Sign in to your account"
                    >
                        sign in
                    </button>
                    : 
                    <div className="navbar-profile">
                        <img 
                            src={assets.profile_icon} 
                            alt="User Profile" 
                            title="My Account"
                        />
                        <ul className="nav-profile-dropdown">
                            <li onClick={() => navigate('/myorders')}>
                                <img src={assets.bag_icon} alt="" />
                                <p>Orders</p>
                            </li>
                            <hr />
                            <li onClick={logout}>
                                <img src={assets.logout_icon} alt="" />
                                <p>Logout</p>
                            </li>
                        </ul>
                    </div>
                }
            </div>
        </div>
    )
}

export default Navbar
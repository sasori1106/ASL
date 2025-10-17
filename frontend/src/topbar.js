import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './topbar.css';

const Topbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Dictionary', path: '/dictionary' },
    { name: 'Practice', path: '/app' },
    { name: 'Learn', path: '/learn' },
    { name: 'About', path: '/about' }
  ];

  return (
    <nav className="topbar" role="banner">
      <div className="topbar-container">
        {/* Logo */}
        <Link to="/" className="topbar-logo" aria-label="ASL Learning Platform">
          <div className="logo-text">ASL Learning</div>
        </Link>

        {/* Desktop Navigation */}
        <div className="topbar-nav">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`topbar-link ${location.pathname === item.path ? 'active' : ''}`}
              onClick={closeMenu}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          className={`topbar-menu-btn ${isMenuOpen ? 'open' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <div className="menu-icon">
            <span className="menu-line"></span>
            <span className="menu-line"></span>
            <span className="menu-line"></span>
          </div>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`topbar-overlay ${isMenuOpen ? 'open' : ''}`}>
        <nav className="topbar-mobile-nav">
          <div className="mobile-nav-content">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`mobile-nav-link ${location.pathname === item.path ? 'active' : ''}`}
                onClick={closeMenu}
              >
                {item.name}
              </Link>
            ))}
          </div>
          
          {/* Social Links */}
          <div className="mobile-social">
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Facebook">
                <svg width="21" height="20" viewBox="0 0 21 20" fill="none">
                  <path d="M12.0482 20V10.8777H15.1089L15.5681 7.32156H12.0482V5.05147C12.0482 4.0222 12.3329 3.32076 13.8105 3.32076L15.692 3.31999V0.13923C15.3667 0.0969453 14.2497 0 12.9497 0C10.2351 0 8.37666 1.65697 8.37666 4.69927V7.32156H5.30664V10.8777H8.37666V20H12.0482Z" fill="url(#facebook-gradient)"/>
                </svg>
              </a>
              <a href="#" className="social-link" aria-label="Instagram">
                <svg width="21" height="20" viewBox="0 0 21 20" fill="none">
                  <path d="M15.0862 0H5.91381C2.92858 0 0.5 2.42858 0.5 5.41381V14.5863C0.5 17.5714 2.92858 20 5.91381 20H15.0863C18.0714 20 20.5 17.5714 20.5 14.5863V5.41381C20.5 2.42858 18.0714 0 15.0862 0Z" fill="url(#instagram-gradient)"/>
                </svg>
              </a>
              <a href="#" className="social-link" aria-label="LinkedIn">
                <svg width="21" height="20" viewBox="0 0 21 20" fill="none">
                  <path d="M18.5002 17.9996V12.1396C18.5002 9.25957 17.8802 7.05957 14.5202 7.05957C12.9002 7.05957 11.8202 7.93957 11.3802 8.77957H11.3402V7.31957H8.16016V17.9996H11.4802V12.6996C11.4802 11.2996 11.7402 9.95957 13.4602 9.95957C15.1602 9.95957 15.1802 11.5396 15.1802 12.7796V17.9796H18.5002V17.9996Z" fill="url(#linkedin-gradient)"/>
                </svg>
              </a>
            </div>
          </div>
        </nav>
      </div>
    </nav>
  );
};

export default Topbar;

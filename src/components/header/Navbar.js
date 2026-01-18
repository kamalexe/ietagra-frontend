import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getToken } from '../../services/LocalStorageService';

const Navbar = () => {
  const { access_token } = getToken();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for extra glassmorphism intensity
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled
          ? 'bg-white/80 shadow-md backdrop-blur-md border-b border-gray-100'
          : 'bg-white/60 backdrop-blur-sm border-b border-transparent'
        }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Section */}
          <div className="flex shrink-0 items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <img
                className="h-10 w-auto transition-transform duration-300 group-hover:scale-105"
                src="./images/institute-of-engineering-and-technology-logo.png"
                alt="IET AGRA Logo"
              />
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-gray-900 leading-none group-hover:text-blue-700 transition-colors">
                  IET AGRA
                </span>
                <span className="text-[10px] font-medium text-gray-500 uppercase tracking-widest leading-none">
                  Khandari Campus
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-8">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/tandpcell">Career Hub</NavLink>
            <NavLink to="/events">Events</NavLink>
            <NavLink to="/about-us">About Us</NavLink>
            <NavLink to="/gallery">Gallery</NavLink>
          </div>

          {/* Auth Button */}
          <div className="hidden md:flex md:items-center">
            {access_token ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                to="/login"
                  className="inline-flex items-center justify-center rounded-full bg-gray-900 px-6 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-gray-800 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 transition-colors hover:bg-gray-100 focus:outline-none"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                    className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                    strokeWidth="2"
                  stroke="currentColor"
                    aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-64 opacity-100 border-t border-gray-100' : 'max-h-0 opacity-0'
          }`}
      >
        <div className="space-y-1 px-4 py-4 bg-white/90 backdrop-blur-lg">
          <MobileNavLink to="/">Home</MobileNavLink>
          <MobileNavLink to="/tandpcell">Career Excellence Hub</MobileNavLink>
          <MobileNavLink to="/gallery">Gallery</MobileNavLink>
          <div className="mt-4 pt-4 border-t border-gray-100">
            {access_token ? (
              <Link
                to="/dashboard"
                className="block w-full rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-blue-700 active:bg-blue-800"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                to="/login"
                className="block w-full rounded-lg bg-gray-900 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-gray-800 active:bg-gray-700"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, children }) => {
  const isActive = useLocation().pathname === to;
  return (
    <Link
      to={to}
      className={`relative py-1 text-sm font-medium transition-colors duration-200 ${isActive ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
        }`}
    >
      {children}
      {isActive && (
        <span className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-blue-600" />
      )}
    </Link>
  );
};

const MobileNavLink = ({ to, children }) => {
  const isActive = useLocation().pathname === to;
  return (
    <Link
      to={to}
      className={`block rounded-lg px-3 py-2 text-base font-medium transition-colors ${isActive
          ? 'bg-blue-50 text-blue-700'
          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      {children}
    </Link>
  );
};

export default Navbar;

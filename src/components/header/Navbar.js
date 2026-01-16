import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getToken } from '../../services/LocalStorageService';
import { HashLink } from 'react-router-hash-link';

const Navbar = () => {
  const { access_token } = getToken();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 z-50 w-full border-b border-white/20 bg-white/30 py-4 shadow-md backdrop-blur-xl">
      <div className="px-6 flex items-center justify-between max-w-screen-xl mx-auto">
        {/* Logo */}
        <Link to="/" aria-current="page" className="flex items-center gap-2">
          <img
            className="h-8 w-auto"
            src="./images/institute-of-engineering-and-technology-logo.png"
            alt="IET AGRA"
          />
          <span className="text-lg font-bold text-gray-800">IET AGRA</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex md:items-center md:gap-8">
          <NavLink to="/" exact>Home</NavLink>

          <HashLink smooth to="/#our-department" className="px-3 py-1 text-sm font-medium">
            Our Department
          </HashLink>
          <NavLink to="/tandpcell">Career Excellence Hub</NavLink>
          <NavLink to="/gallery">Gallery</NavLink>
        </div>

        {/* Auth Button */}
        <div className="hidden md:flex items-center gap-3">
          {access_token ? (
            <Link
              to="/dashboard"
              className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition-transform duration-200 hover:scale-105"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              to="/login"
              className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition-transform duration-200 hover:scale-105"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={toggleMobileMenu} className="p-2 focus:outline-none">
            {isMobileMenuOpen ? (
              <svg className="h-6 w-6 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 space-y-3 px-6">
          <NavLink to="/" exact>Home</NavLink>
          <NavLink to="/tandpcell">Career Excellence Hub</NavLink>
          <NavLink to="/gallery">Gallery</NavLink>
          {access_token ? (
            <Link
              to="/dashboard"
              className="block rounded-xl bg-gradient-to-r from-blue-600 to-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-md"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              to="/login"
              className="block rounded-xl bg-gradient-to-r from-blue-600 to-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-md"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>

  );
};

const NavLink = ({ to, children, exact }) => {
  const isActive = useLocation().pathname === to;
  return (
    <Link
      to={to}
      className={`relative px-3 py-1 text-sm font-medium transition-all duration-200 ${isActive
        ? 'text-blue-600 after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-blue-600 after:rounded-full'
        : 'text-gray-800 hover:text-blue-600 hover:scale-105'
        }`}
    >
      {children}
    </Link>
  );
};

export default Navbar;

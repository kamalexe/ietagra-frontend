import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { getToken } from '../../services/LocalStorageService';
import NavbarService from '../../services/NavbarService';

const DEFAULT_LINKS = [
  { label: 'Home', path: '/' },
  {
    label: 'Admissions',
    dropdownItems: [
      { label: 'Admission Procedure', path: '/#admission-procedure' },
      { label: 'Fees & Scholarships', path: '/#fees' },
    ]
  },
  {
    label: 'Administration',
    dropdownItems: [
      { label: 'Director Message', path: '/#director' },
      { label: 'Registrar Office', path: '/#registrar' },
      { label: 'Organizational Chart', path: '/#org-chart' },
    ]
  },
  {
    label: 'Academics',
    dropdownItems: [
      { label: 'Departments', path: '/#departments' },
      { label: 'Career Excellence Hub', path: '/tandpcell' },
      { label: 'Events & News', path: '/events' },
    ]
  },
  {
    label: 'Examinations',
    dropdownItems: [
      { label: 'Syllabus', path: '/#syllabus' },
      { label: 'Results', path: '/#results' },
      { label: 'Examination Schedule', path: '/#schedule' },
    ]
  },
  {
    label: 'Explore',
    dropdownItems: [
      { label: 'Gallery', path: '/gallery' },
      { label: 'Infrastructure', path: '/#infrastructure' },
      { label: 'Faculty Profile', path: '/#faculty' },
    ]
  },
  {
    label: 'Student Life',
    dropdownItems: [
      { label: 'Hostel & Facilities', path: '/#facilities' },
      { label: 'Alumni', path: '/#alumni' },
      { label: 'Feedback', path: '/#feedback' },
    ]
  },
  { label: 'About Us', path: '/about-us' },
];

const Navbar = () => {
  const { access_token } = getToken();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [navConfig, setNavConfig] = useState({
    logoUrl: './images/institute-of-engineering-and-technology-logo.png',
    navLinks: DEFAULT_LINKS
  });

  useEffect(() => {
    const fetchNavbar = async () => {
      try {
        const data = await NavbarService.getNavbarConfig();
        if (data && data.navLinks) {
          setNavConfig(data);
        }
      } catch (error) {
        console.error("Error fetching navbar config:", error);
      }
    };
    fetchNavbar();

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location]);

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-500 ${scrolled
        ? 'bg-white/90 shadow-lg backdrop-blur-md border-b border-gray-100 py-1'
        : 'bg-white/70 backdrop-blur-sm border-b border-transparent py-3'
        }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Section */}
          <div className="flex shrink-0 items-center">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute -inset-1 bg-blue-600 rounded-full opacity-0 group-hover:opacity-20 transition-opacity blur"></div>
                <img
                  className="h-12 w-auto relative transform transition-transform duration-500 group-hover:rotate-[360deg]"
                  src={navConfig.logoUrl || './images/institute-of-engineering-and-technology-logo.png'}
                  alt="IET AGRA Logo"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-gray-900 leading-none group-hover:text-blue-700 transition-colors">
                  IET AGRA
                </span>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mt-1 leading-none">
                  Digital Campus
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-2">
            {navConfig.navLinks.map((link, idx) => (
              <div
                key={idx}
                className="relative group h-16 flex items-center"
                onMouseEnter={() => setActiveDropdown(idx)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {link.dropdownItems && link.dropdownItems.length > 0 ? (
                  <>
                    <button
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${activeDropdown === idx ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                        }`}
                    >
                      {link.label}
                      <ChevronDownIcon className={`h-4 w-4 transition-transform duration-300 ${activeDropdown === idx ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Desktop Dropdown */}
                    <div className={`absolute top-full left-0 w-52 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 transition-all duration-300 origin-top transform ${activeDropdown === idx ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                      }`}>
                      {link.dropdownItems.map((item, subIdx) => (
                        <Link
                          key={subIdx}
                          to={item.path}
                          className="block px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <NavLink to={link.path}>{link.label}</NavLink>
                )}
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex md:items-center gap-4">
            {access_token ? (
              <Link
                to="/dashboard"
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-full p-0.5 font-bold"
              >
                <span className="absolute h-full w-full bg-gradient-to-br from-[#1e40af] via-[#3b82f6] to-[#60a5fa] group-hover:from-[#1e3a8a] group-hover:to-[#2563eb]"></span>
                <span className="relative rounded-full bg-white px-6 py-2 transition-all duration-200 group-hover:bg-opacity-0">
                  <span className="relative text-blue-700 group-hover:text-white transition-colors duration-300 text-sm">Dashboard</span>
                </span>
              </Link>
            ) : (
              <Link
                to="/login"
                  className="inline-flex items-center justify-center rounded-full bg-gray-900 px-6 py-2.5 text-sm font-bold text-white shadow-[0_10px_20px_-10px_rgba(0,0,0,0.5)] transition-all duration-300 hover:bg-blue-600 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0"
              >
                  Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`inline-flex items-center justify-center rounded-xl p-2.5 text-gray-600 transition-all duration-300 hover:bg-gray-100 focus:outline-none ${isMobileMenuOpen ? 'bg-blue-50 text-blue-600' : ''}`}
            >
              {isMobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden fixed inset-x-0 top-[4.5rem] bg-white border-t border-gray-100 shadow-2xl transition-all duration-500 ease-in-out transform ${isMobileMenuOpen ? 'translate-y-0 opacity-100 visible' : '-translate-y-10 opacity-0 invisible pointer-events-none'}`}>
        <div className="px-4 py-8 space-y-4 max-h-[80vh] overflow-y-auto">
          {navConfig.navLinks.map((link, idx) => (
            <div key={idx} className="space-y-2">
              {link.dropdownItems && link.dropdownItems.length > 0 ? (
                <MobileDropdown link={link} />
              ) : (
                <MobileNavLink to={link.path}>{link.label}</MobileNavLink>
              )}
            </div>
          ))}

          <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col gap-3">
            {access_token ? (
              <Link to="/dashboard" className="w-full rounded-2xl bg-blue-600 py-4 text-center text-base font-bold text-white shadow-lg active:scale-95 transition-transform">
                Go to Dashboard
              </Link>
            ) : (
                <Link to="/login" className="w-full rounded-2xl bg-gray-900 py-4 text-center text-base font-bold text-white shadow-lg active:scale-95 transition-transform">
                  Sign In to Account
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
      className={`relative px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${isActive ? 'text-blue-700 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
        }`}
    >
      {children}
    </Link>
  );
};

const MobileNavLink = ({ to, children }) => {
  const isActive = useLocation().pathname === to;
  return (
    <Link
      to={to}
      className={`block rounded-2xl px-5 py-4 text-lg font-bold transition-all ${isActive
        ? 'bg-blue-600 text-white shadow-xl shadow-blue-200'
        : 'text-gray-900 hover:bg-gray-50 active:bg-gray-100'
        }`}
    >
      {children}
    </Link>
  );
};

const MobileDropdown = ({ link }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="space-y-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-2xl px-5 py-4 text-lg font-bold text-gray-900 transition-colors hover:bg-gray-50"
      >
        {link.label}
        <ChevronDownIcon className={`h-5 w-5 transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-600' : 'text-gray-400'}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-64 opacity-100 mb-4' : 'max-h-0 opacity-0'}`}>
        <div className="pl-6 space-y-1 border-l-2 border-blue-100 ml-5">
          {link.dropdownItems.map((item, idx) => (
            <Link
              key={idx}
              to={item.path}
              className="block rounded-xl px-4 py-3 text-base font-semibold text-gray-600 hover:text-blue-600 hover:bg-blue-50 active:bg-blue-100 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Navbar;

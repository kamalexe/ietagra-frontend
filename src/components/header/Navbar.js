import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { getToken, registerAccount, getAccounts } from '../../services/LocalStorageService';
import NavbarService from '../../services/NavbarService';
import AccountSwitcher from '../dashboard/AccountSwitcher';
import { useGetLoggedUserQuery } from '../../services/userAuthApi';

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
  const { access_token } = useSelector(state => state.auth);
  // Fetch logged user data for the navbar
  const { data: currentUser, isSuccess } = useGetLoggedUserQuery(access_token, {
    skip: !access_token,
  });

  useEffect(() => {
    if (currentUser && isSuccess && access_token) {
      // Auto-register account for switching whenever Navbar loads a logged-in user
      const tokens = getToken();
      // Note: getToken() reads from localStorage, which should be updated by whatever mechanism updates Redux state.
      // If Redux updates first, we might need to rely on that. 
      // But typically auth slice syncs to localStorage. 
      // To be safe, let's construct the token object if we can, or just trust getToken() is fresh enough or pass access_token directly if valid.
      // Better: if we have access_token from Redux, use it. But we need refresh_token too.
      // Let's rely on getToken() but trigger this effect when access_token changes.
      registerAccount(tokens, currentUser);
    }
  }, [currentUser, isSuccess, access_token]);

  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [navConfig, setNavConfig] = useState({
    logoUrl: './images/iet_logo.png',
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
                  src={navConfig.logoUrl || './images/iet_logo.png'}
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
              <div className="relative group z-50">
                <button className="flex items-center gap-2 group-hover:opacity-100 transition-opacity">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
                    {/* Initial or User Icon */}
                    {currentUser?.user?.name ? (
                      <span className="text-sm">{currentUser.user.name.charAt(0).toUpperCase()}</span>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                    )}
                  </div>
                </button>

                <div className="absolute right-0 top-full pt-2 w-72 origin-top-right transition-all opacity-0 invisible group-hover:opacity-100 group-hover:visible transform translate-y-2 group-hover:translate-y-0">
                  <div className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
                    <div className="p-2 space-y-1">
                      <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                        </svg>
                        Dashboard
                      </Link>
                    </div>

                    <div className="border-t border-gray-100 p-2">
                      <p className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">Account</p>
                      <AccountSwitcher currentUser={currentUser?.user} />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              getAccounts().length > 0 ? (
                <div className="relative group z-50">
                  {/* Show switcher for logged-out users with saved accounts */}
                  <AccountSwitcher currentUser={null} />
                  <div className="absolute right-0 top-full pt-2 w-72 origin-top-right transition-all opacity-0 invisible group-hover:opacity-100 group-hover:visible transform translate-y-2 group-hover:translate-y-0">
                    <div className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
                      <div className="p-2">
                        <p className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">Saved Accounts</p>
                        <AccountSwitcher currentUser={null} />
                      </div>
                    </div>
                  </div>
                </div>
                ) : (
              <Link
                to="/login"
                  className="inline-flex items-center justify-center rounded-full bg-gray-900 px-6 py-2.5 text-sm font-bold text-white shadow-[0_10px_20px_-10px_rgba(0,0,0,0.5)] transition-all duration-300 hover:bg-blue-600 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0"
              >
                  Sign In
              </Link>
                  )
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

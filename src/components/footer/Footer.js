import React from 'react';
import {
    MapPinIcon,
    EnvelopeIcon,
    PhoneIcon
} from '@heroicons/react/24/solid';

function Footer() {
    return (
        <footer className="bg-gray-900 text-white pt-16 pb-8 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                    {/* Column 1: Institute Info */}
                    <div className="col-span-1 lg:col-span-2 space-y-4">
                        <div className="flex items-center space-x-3 mb-6">
                            <img
                                src="../../images/Dr_B._R._Ambedkar_University_Logo.png"
                                className="h-16 w-auto p-1 bg-white rounded-full shadow-lg"
                                alt="University Logo"
                            />
                            <div>
                                <h2 className="text-xl font-bold leading-tight text-white">
                                    Institute of Engineering & Technology, Agra
                                </h2>
                                <p className="text-sm text-gray-400">
                                    Dr. Bhimrao Ambedkar University, Agra
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3 text-gray-300">
                            <div className="flex items-start space-x-3">
                                <MapPinIcon className="h-6 w-6 text-blue-500 mt-1 flex-shrink-0" />
                                <p className="leading-relaxed">
                                    Swami Vivekanand Campus Khandari,<br />
                                    Agra, India - 282002
                                </p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <EnvelopeIcon className="h-5 w-5 text-blue-500 flex-shrink-0" />
                                <a href="mailto:icfcsai2025@gmail.com" className="hover:text-blue-400 transition-colors">
                                    icfcsai2025@gmail.com
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Useful Links */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-6 border-b-2 border-blue-600 inline-block pb-1">
                            Useful Links
                        </h3>
                        <ul className="space-y-3">
                            {[
                                { name: "Download Paper Template", href: "#" },
                                { name: "Download Submission Guidelines", href: "#" },
                                { name: "ICFCSAI-2025 Brochure", href: "#" },
                                { name: "Registration Form", href: "#" },
                                { name: "Dr. Bhimrao Ambedkar University", href: "http://dbrau.org.in/" },
                            ].map((link, index) => (
                                <li key={index}>
                                    <a
                                        href={link.href}
                                        className="text-gray-400 hover:text-white hover:translate-x-1 transform transition-all duration-200 flex items-center"
                                    >
                                        <span className="mr-2 text-blue-500">›</span>
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Help */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-6 border-b-2 border-blue-600 inline-block pb-1">
                            Help
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <a
                                    href="/contact"
                                    className="text-gray-400 hover:text-white hover:translate-x-1 transform transition-all duration-200 flex items-center"
                                >
                                    <span className="mr-2 text-blue-500">›</span>
                                    Contact
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <p className="mb-4 md:mb-0">
                        &copy; {new Date().getFullYear()} IET Agra. All Rights Reserved.
                    </p>
                    <div className="flex items-center space-x-1">
                        <span>Designed and Developed by</span>
                        <a
                            href="#"
                            className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                        >
                            IOTA
                        </a>
                        <span className="text-red-500 animate-pulse">❤️</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;

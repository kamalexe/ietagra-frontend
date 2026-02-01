import React, { useEffect, useState } from 'react';
import {
    MapPinIcon,
    EnvelopeIcon,
    PhoneIcon
} from '@heroicons/react/24/solid';
import {
    FaFacebook,
    FaTwitter,
    FaLinkedin,
    FaInstagram,
    FaYoutube,
    FaGithub,
    FaDiscord
} from 'react-icons/fa';
import FooterService from '../../services/FooterService';

const SOCIAL_ICONS = {
    'facebook': FaFacebook,
    'twitter': FaTwitter,
    'linkedin': FaLinkedin,
    'instagram': FaInstagram,
    'youtube': FaYoutube,
    'github': FaGithub,
    'discord': FaDiscord
};

function Footer() {
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const data = await FooterService.getFooterConfig();
                setConfig(data);
            } catch (error) {
                console.error("Failed to load footer config:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchConfig();
    }, []);

    if (loading) {
        return <div className="bg-gray-900 h-64 animate-pulse"></div>;
    }

    if (!config) {
        return null;
    }

    const { institute, contact, usefulLinks, helpLinks, socialMedia, credits } = config;

    return (
        <footer className="bg-gray-900 text-white pt-16 pb-8 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                    {/* Column 1: Institute Info */}
                    <div className="col-span-1 lg:col-span-2 space-y-4">
                        <div className="flex items-center space-x-3 mb-6">
                            <img
                                src={institute?.logoUrl || "../../images/Dr_B._R._Ambedkar_University_Logo.png"}
                                className="h-16 w-auto p-1 bg-white rounded-full shadow-lg"
                                alt="University Logo"
                            />
                            <div>
                                <h2 className="text-xl font-bold leading-tight text-white">
                                    {institute?.name}
                                </h2>
                                <p className="text-sm text-gray-400">
                                    {institute?.subtitle}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3 text-gray-300">
                            <div className="flex items-start space-x-3">
                                <MapPinIcon className="h-6 w-6 text-blue-500 mt-1 flex-shrink-0" />
                                <p className="leading-relaxed whitespace-pre-line">
                                    {contact?.address}
                                </p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <EnvelopeIcon className="h-5 w-5 text-blue-500 flex-shrink-0" />
                                <a href={`mailto:${contact?.email}`} className="hover:text-blue-400 transition-colors">
                                    {contact?.email}
                                </a>
                            </div>
                            {contact?.phone && (
                                <div className="flex items-center space-x-3">
                                    <PhoneIcon className="h-5 w-5 text-blue-500 flex-shrink-0" />
                                    <a href={`tel:${contact?.phone}`} className="hover:text-blue-400 transition-colors">
                                        {contact?.phone}
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Social Media Section */}
                        {socialMedia && socialMedia.length > 0 && (
                            <div className="mt-6 flex space-x-4">
                                {socialMedia.map((social) => {
                                    const IconComponent = SOCIAL_ICONS[social.platform.toLowerCase()] || FaFacebook;
                                    return (
                                        <a
                                            key={social._id}
                                            href={social.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-400 hover:text-white transition-colors transform hover:scale-110"
                                        >
                                            <IconComponent className="h-6 w-6" />
                                        </a>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Column 2: Useful Links */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-6 border-b-2 border-blue-600 inline-block pb-1">
                            Useful Links
                        </h3>
                        <ul className="space-y-3">
                            {usefulLinks?.map((link, index) => (
                                <li key={index}>
                                    <a
                                        href={link.href}
                                        target={link.openInNewTab ? "_blank" : "_self"}
                                        rel={link.openInNewTab ? "noopener noreferrer" : ""}
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
                            {helpLinks?.map((link, index) => (
                                <li key={index}>
                                    <a
                                        href={link.href}
                                        target={link.openInNewTab ? "_blank" : "_self"}
                                        rel={link.openInNewTab ? "noopener noreferrer" : ""}
                                        className="text-gray-400 hover:text-white hover:translate-x-1 transform transition-all duration-200 flex items-center"
                                    >
                                        <span className="mr-2 text-blue-500">›</span>
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <p className="mb-4 md:mb-0">
                        &copy; {new Date().getFullYear()} IET Agra. All Rights Reserved.
                    </p>
                    <div className="flex items-center space-x-1">
                        <span>{credits?.text?.split('IOTA')[0] || 'Designed and Developed by'}</span>
                        <a
                            href="#"
                            className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                        >
                            IOTA
                        </a>
                        <span className={`${credits?.heartColor || 'text-red-500'} animate-pulse`}>❤️</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;

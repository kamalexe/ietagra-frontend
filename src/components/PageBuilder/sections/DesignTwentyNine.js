import React from 'react';

const DesignTwentyNine = ({ id,
    title = "Announcements",
    announcements = [
        { text: "Kashi Tamil Sangamam (KTS) 4.0", link: "https://kashitamil.bhu.edu.in" },
        { text: "OPD Online Booking [Click here]", link: "https://bhuopd.com/" }
    ],
    themeColor = "bg-red-600",
    speed = "20s"
}) => {
    return (
        <section id={id} className="bg-white border-y border-gray-100 shadow-sm overflow-hidden" id="announcement-marquee">
            <div className="flex items-stretch h-12 md:h-14">
                {/* Fixed Label/Icon Side */}
                <div className={`${themeColor} text-white flex items-center px-4 md:px-6 relative z-10 shadow-lg shrink-0`}>
                    <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-sm md:text-base">
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-5 w-5 md:h-6 md:w-6" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                        </svg>
                        <span className="hidden sm:inline">{title}</span>
                    </div>
                </div>

                {/* Marquee Content */}
                <div className="relative flex-1 bg-gray-50 overflow-hidden flex items-center">
                    <div className="marquee-container flex items-center whitespace-nowrap">
                        <div className="marquee-content flex items-center">
                            {announcements.map((item, idx) => (
                                <div key={idx} className="flex items-center px-8 md:px-12">
                                    <span className="shrink-0 w-2 h-2 rounded-full bg-red-500 mr-3"></span>
                                    {item.link ? (
                                        <a 
                                            href={item.link} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-gray-800 font-medium hover:text-blue-600 hover:underline transition-colors text-sm md:text-base"
                                        >
                                            {item.text}
                                        </a>
                                    ) : (
                                        <span className="text-gray-800 font-medium text-sm md:text-base">{item.text}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                        {/* Duplicate for seamless scrolling */}
                        <div className="marquee-content flex items-center" aria-hidden="true">
                            {announcements.map((item, idx) => (
                                <div key={`dup-${idx}`} className="flex items-center px-8 md:px-12">
                                    <span className="shrink-0 w-2 h-2 rounded-full bg-red-500 mr-3"></span>
                                    {item.link ? (
                                        <a 
                                            href={item.link} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-gray-800 font-medium hover:text-blue-600 hover:underline transition-colors text-sm md:text-base"
                                        >
                                            {item.text}
                                        </a>
                                    ) : (
                                        <span className="text-gray-800 font-medium text-sm md:text-base">{item.text}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .marquee-container {
                    display: flex;
                    width: max-content;
                    animation: marquee linear infinite;
                    animation-duration: ${speed};
                }

                .marquee-content {
                    display: flex;
                    align-items: center;
                }

                @keyframes marquee {
                    0% {
                        transform: translate3d(0, 0, 0);
                    }
                    100% {
                        transform: translate3d(-50%, 0, 0);
                    }
                }

                /* Pause on hover if user prefers */
                .marquee-container:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </section>
    );
};

export default DesignTwentyNine;

import React from 'react';

const DesignTwentyEight = ({ id,
    title = "Message from the Director",
    name = "Prof. V. Kamakoti",
    designation = "Director - IIT Madras",
    image = "/sites/default/files/2022-01/Director-Best_Resized_0.png",
    greeting = "Greetings to all!",
    content = "",
    themeColor = "blue-600"
}) => {
    return (
        <section id={id} className="py-16 bg-white overflow-hidden">
            <div className="container mx-auto px-4">
                {/* Section Heading */}
                <div className="mb-12 text-center lg:text-left">
                    <h2 className={`text-3xl md:text-4xl font-bold text-gray-900 inline-block relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-0 lg:after:left-0 after:right-0 after:mx-auto lg:after:mx-0 after:w-24 after:h-1.5 after:bg-${themeColor}`}>
                        {title}
                    </h2>
                </div>

                <div className="flex flex-col lg:flex-row items-start gap-12">
                    {/* Image and Signature Side */}
                    <div className="lg:w-1/3 w-full flex flex-col items-center">
                        <div className="relative group w-full max-w-sm">
                            {/* Decorative border */}
                            <div className={`absolute -inset-4 border-2 border-${themeColor}/20 rounded-2xl transform rotate-2 group-hover:rotate-0 transition-transform duration-500`}></div>
                            
                            <div className="relative overflow-hidden rounded-xl shadow-2xl bg-gray-100 aspect-[4/5] flex items-center justify-center">
                                <img 
                                    src={image} 
                                    alt={name} 
                                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                                    loading="lazy"
                                />
                            </div>
                        </div>

                        <div className="mt-8 text-center lg:text-left w-full pl-0 lg:pl-4">
                            <h3 className="text-2xl font-bold text-gray-900">{name}</h3>
                            <p className={`text-${themeColor} font-medium text-lg`}>{designation}</p>
                            
                            {/* Visual signature accent */}
                            <div className={`mt-4 w-16 h-1 bg-${themeColor}/30 rounded`}></div>
                        </div>
                    </div>

                    {/* Message Content Side */}
                    <div className="lg:w-2/3 w-full">
                        <div className="bg-gray-50/50 p-8 md:p-10 rounded-3xl border border-gray-100 shadow-sm relative">
                            {/* Quote icon accent */}
                            <div className="absolute top-6 left-6 text-gray-200 opacity-50 pointer-events-none">
                                <svg width="60" height="45" viewBox="0 0 60 45" fill="currentColor">
                                    <path d="M15.4286 0C6.90214 0 0 6.90214 0 15.4286V45H25.7143V15.4286H8.57143C8.57143 11.6421 11.6421 8.57143 15.4286 8.57143V0ZM49.7143 0C41.1879 0 34.2857 6.90214 34.2857 15.4286V45H60V15.4286H42.8571C42.8571 11.6421 45.9279 8.57143 49.7143 8.57143V0Z" />
                                </svg>
                            </div>

                            <div className="relative z-10">
                                {greeting && (
                                    <h4 className="text-xl font-semibold text-gray-800 mb-6 italic">
                                        {greeting}
                                    </h4>
                                )}

                                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4 text-justify">
                                    {content ? (
                                        <div 
                                            className="section-content"
                                            dangerouslySetInnerHTML={{ __html: content }} 
                                        />
                                    ) : (
                                        <div className="animate-pulse">
                                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                                            <div className="h-4 bg-gray-200 rounded mb-4"></div>
                                            <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
                                            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Decorative element at bottom right */}
                            <div className={`absolute bottom-6 right-6 w-12 h-12 border-r-2 border-b-2 border-${themeColor}/20`}></div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .section-content :global(p) {
                    margin-bottom: 1.25rem;
                }
                .section-content :global(em) {
                    color: #4b5563;
                    font-weight: 500;
                }
            `}</style>
        </section>
    );
};

export default DesignTwentyEight;

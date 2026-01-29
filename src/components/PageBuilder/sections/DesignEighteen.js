import React from 'react';

const DesignEighteen = ({
    title = "Computer Science & Engineering",
    subtitle = "Institute of Engineering and Technology, Swami Vivekanand Campus, Dr. Bhimrao Ambedkar University, Agra",
    stats = [
        { value: "12+", label: "Modern Labs" },
        { value: "95%", label: "Placement Rate" },
        { value: "8+", label: "Research Areas" }
    ],
    buttons = [
        { text: "Explore Department", link: "#about", variant: "primary" },
        { text: "Contact Us", link: "#contact", variant: "secondary" }
    ]
}) => {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-800 via-blue-700 to-indigo-800 text-white">
            {/* Background Patterns */}
            <div className="absolute inset-0 overflow-hidden z-0" style={{ opacity: 0.07 }}>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/binary.png')] opacity-40"></div>
            </div>
            <div className="absolute inset-0 opacity-20 z-0">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')]"></div>
            </div>

            {/* Floating Icons */}
            <div className="absolute text-2xl top-[15%] left-[10%] opacity-30" style={{ transform: 'translateY(-9.74906px)' }}>
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 640 512" className="text-white/80" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                    <path d="M278.9 511.5l-61-17.7c-6.4-1.8-10-8.5-8.2-14.9L346.2 8.7c1.8-6.4 8.5-10 14.9-8.2l61 17.7c6.4 1.8 10 8.5 8.2 14.9L293.8 503.3c-1.9 6.4-8.5 10.1-14.9 8.2zm-114-112.2l43.5-46.4c4.6-4.9 4.3-12.7-.8-17.2L117 256l90.6-79.7c5.1-4.5 5.5-12.3.8-17.2l-43.5-46.4c-4.5-4.8-12.1-5.1-17-.5L3.8 247.2c-5.1 4.7-5.1 12.8 0 17.5l144.1 135.1c4.9 4.6 12.5 4.4 17-.5zm327.2.6l144.1-135.1c5.1-4.7 5.1-12.8 0-17.5L492.1 112.1c-4.8-4.5-12.4-4.3-17 .5L431.6 159c-4.6 4.9-4.3 12.7.8 17.2L523 256l-90.6 79.7c-5.1 4.5-5.5 12.3-.8 17.2l43.5 46.4c4.5 4.9 12.1 5.1 17 .6z"></path>
                </svg>
            </div>
            <div className="absolute text-3xl top-[25%] right-[15%] opacity-30" style={{ transform: 'translateY(-9.02523px)' }}>
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 640 512" className="text-white/80" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                    <path d="M255.03 261.65c6.25 6.25 16.38 6.25 22.63 0l11.31-11.31c6.25-6.25 6.25-16.38 0-22.63L253.25 192l35.71-35.72c6.25-6.25 6.25-16.38 0-22.63l-11.31-11.31c-6.25-6.25-16.38-6.25-22.63 0l-58.34 58.34c-6.25 6.25-6.25 16.38 0 22.63l58.35 58.34zm96.01-11.3l11.31 11.31c6.25 6.25 16.38 6.25 22.63 0l58.34-58.34c6.25-6.25 6.25-16.38 0-22.63l-58.34-58.34c-6.25-6.25-16.38-6.25-22.63 0l-11.31 11.31c-6.25 6.25-6.25 16.38 0 22.63L386.75 192l-35.71 35.72c-6.25 6.25-6.25 16.38 0 22.63zM624 416H381.54c-.74 19.81-14.71 32-32.74 32H288c-18.69 0-33.02-17.47-32.77-32H16c-8.8 0-16 7.2-16 16v16c0 35.2 28.8 64 64 64h512c35.2 0 64-28.8 64-64v-16c0-8.8-7.2-16-16-16zM576 48c0-26.4-21.6-48-48-48H112C85.6 0 64 21.6 64 48v336h512V48zm-64 272H128V64h384v256z"></path>
                </svg>
            </div>
            {/* ... other icons can be added similarly, keeping it concise for now or paste all if needed. I will accept the user's aesthetic and keep at least a few meaningful ones. */}
            
            <div className="hidden lg:block">
                <div className="absolute top-1/4 -left-20 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl"></div>
            </div>

            <div className="relative container mx-auto px-4 py-16 md:py-28 z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="flex justify-center mb-6">
                        <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full" style={{ transform: 'rotateY(142.411deg)' }}>
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 640 512" className="text-4xl md:text-5xl text-white" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                <path d="M255.03 261.65c6.25 6.25 16.38 6.25 22.63 0l11.31-11.31c6.25-6.25 6.25-16.38 0-22.63L253.25 192l35.71-35.72c6.25-6.25 6.25-16.38 0-22.63l-11.31-11.31c-6.25-6.25-16.38-6.25-22.63 0l-58.34 58.34c-6.25 6.25-6.25 16.38 0 22.63l58.35 58.34zm96.01-11.3l11.31 11.31c6.25 6.25 16.38 6.25 22.63 0l58.34-58.34c6.25-6.25 6.25-16.38 0-22.63l-58.34-58.34c-6.25-6.25-16.38-6.25-22.63 0l-11.31 11.31c-6.25 6.25-6.25 16.38 0-22.63L386.75 192l-35.71 35.72c-6.25 6.25-6.25 16.38 0 22.63zM624 416H381.54c-.74 19.81-14.71 32-32.74 32H288c-18.69 0-33.02-17.47-32.77-32H16c-8.8 0-16 7.2-16 16v16c0 35.2 28.8 64 64 64h512c35.2 0 64-28.8 64-64v-16c0-8.8-7.2-16-16-16zM576 48c0-26.4-21.6-48-48-48H112C85.6 0 64 21.6 64 48v336h512V48zm-64 272H128V64h384v256z"></path>
                            </svg>
                        </div>
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4">{title}</h1>
                    <div className="h-1.5 bg-gradient-to-r from-blue-400 to-indigo-300 mx-auto mb-6" style={{ width: '6rem' }}></div>
                    <p className="text-base sm:text-lg md:text-xl opacity-90 mb-8 max-w-3xl mx-auto px-2">{subtitle}</p>
                    
                    <div className="flex flex-col sm:flex-row justify-center gap-5">
                        {buttons && buttons.map((button, index) => (
                            <a
                                key={index}
                                href={button.link}
                                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg text-base inline-flex items-center justify-center space-x-2 ${button.variant === 'primary'
                                        ? 'bg-white text-blue-800 shadow-sm hover:shadow-xl'
                                        : 'bg-transparent border-2 border-white/70 backdrop-blur-sm text-white hover:bg-white/10'
                                    } ${index > 0 ? 'mt-3 sm:mt-0' : ''}`}
                            >
                                <span>{button.text}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                                </svg>
                            </a>
                        ))}
                    </div>

                    <div className="mt-12 grid grid-cols-3 gap-6 max-w-lg mx-auto">
                        {stats && stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
                                <p className="text-blue-100 text-sm">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Wave Divider */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
                    <path fill="rgba(255,255,255,0.3)" d="M0,128L48,138.7C96,149,192,171,288,154.7C384,139,480,85,576,90.7C672,96,768,160,864,186.7C960,213,1056,203,1152,181.3C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto absolute bottom-0">
                    <path fill="#ffffff" fillOpacity="1" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
                </svg>
            </div>
        </section>
    );
};

export default DesignEighteen;

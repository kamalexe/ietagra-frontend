import React from "react";

const DesignEighteen = ({
    id,
    title = "Computer Science & Engineering",
    subtitle = "Institute of Engineering and Technology, Swami Vivekanand Campus, Dr. Bhimrao Ambedkar University, Agra",
    icon = "💻",
    stats = [
        { value: "12+", label: "Modern Labs", icon: "🔬" },
        { value: "95%", label: "Placement Rate", icon: "🎓" },
        { value: "8+", label: "Research Areas", icon: "📚" }
    ],
    buttons = [
        { text: "Explore Department", link: "#about", variant: "primary" },
        { text: "Contact Us", link: "#contact", variant: "secondary" }
    ]
}) => {
    return (
      <section
          id={id}
          className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white"
      >

          {/* Pattern */}
          <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')]"></div>
          </div>

          {/* Glow blobs */}
          <div className="absolute top-1/3 -left-32 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 -right-32 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl"></div>

          {/* Floating Icons */}
          <div className="absolute left-[10%] top-[20%] text-4xl opacity-30 animate-float">
                {icon}
          </div>

          <div className="absolute right-[15%] top-[30%] text-4xl opacity-30 animate-float">
              {"</>"}
          </div>

          <div className="absolute left-[20%] bottom-[25%] text-4xl opacity-30 animate-float">
              ⚙️
          </div>

          {/* Main Content */}
          <div className="relative container mx-auto px-6 py-24 z-10">
              <div className="max-w-6xl mx-auto text-center">

                  {/* Icon */}
                  <div className="flex justify-center mb-8">
                      <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shadow-xl">
                            <span className="text-4xl">{icon}</span>
                      </div>
                  </div>

                  {/* Title */}
                  <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                      {title}
                  </h1>

                  {/* Divider */}
                  <div className="h-1.5 w-24 bg-gradient-to-r from-blue-400 to-indigo-300 mx-auto mb-6"></div>

                  {/* Subtitle */}
                  <p className="text-lg md:text-xl opacity-90 mb-12 max-w-3xl mx-auto">
                      {subtitle}
                  </p>

                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row justify-center gap-6 mb-16">
                        {buttons && buttons.map((button, index) => (
                            <a
                                key={index}
                                href={button.link || "#"}
                                className={`px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition ${button.variant === 'primary'
                                    ? 'bg-white text-blue-900'
                                    : 'border border-white/70 backdrop-blur-md hover:bg-white/10'
                                    }`}
                            >
                                {button.text}
                            </a>
                        ))}
                  </div>

                  {/* Glass Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
                      {stats.map((stat, i) => (
                          <div
                              key={i}
                              className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:-translate-y-1"
                          >
                              <div className="flex flex-col items-center">
                                  {stat.icon && <span className="text-2xl mb-2">{stat.icon}</span>}
                                  <h3 className="text-3xl font-bold">{stat.value}</h3>
                                  <p className="text-blue-100">{stat.label}</p>
                              </div>
                          </div>
                      ))}
                  </div>

              </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 animate-bounce">
              <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
                  <div className="w-1 h-3 bg-white mt-2 rounded"></div>
              </div>
          </div>

          {/* Wave Divider */}
          <div className="absolute bottom-0 w-full">
              <svg viewBox="0 0 1440 120" className="w-full">
                  <path
                      fill="#ffffff"
                      d="M0,64L80,69C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58L1440,64L1440,120L0,120Z"
                  />
              </svg>
          </div>
      </section>
  );
};

export default DesignEighteen;
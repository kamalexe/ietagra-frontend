import React, { useRef } from 'react';
import Slider from 'react-slick';
import { motion, useScroll, useTransform } from 'framer-motion';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const DesignTwentySeven = ({
    title1 = "HOW IT",
    title2 = "WORKS?",
    cards = []
}) => {
    // Default cards
    const defaultCards = [
        {
            stepLabel: "STEP 1",
            title: "BOOK YOUR SERVICE",
            description: "Need help now? Get an expert at your doorstep. Schedule what works best for you.",
            image: "https://placehold.co/600x400/png?text=Step+1"
        },
        {
            stepLabel: "STEP 2",
            title: "SET TIME & DURATION",
            description: "Choose a time, set the duration, and get multiple tasks done in one booking.",
            image: "https://placehold.co/600x400/png?text=Step+2"
        },
        {
            stepLabel: "STEP 3",
            title: "EXPERTS ARRIVE ON-TIME",
            description: "Our experts reach your doorstep at the scheduled time. Enjoy a smooth experience.",
            image: "https://placehold.co/600x400/png?text=Step+3"
        }
    ];

    const data = cards.length ? cards : defaultCards;

    // Mobile slider
    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        autoplay: true,
        autoplaySpeed: 3000,
        centerMode: true,
        centerPadding: '20px'
    };

    // Desktop scroll
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    return (
        <section className="bg-[#F6F6F6] text-[#3C172A] font-sans">

            {/* ---------------- MOBILE ---------------- */}
            <div className="block sm:hidden py-10 overflow-hidden">
                <div className="text-center mb-8 px-4">
                    <h2 className="text-5xl font-black tracking-tighter leading-tight">
                        <span className="block">{title1}</span>
                        <span className="block text-[#FF2E6D] italic">{title2}</span>
                    </h2>
                </div>

                <Slider {...settings}>
                    {data.map((card, index) => (
                        <div key={index} className="px-2">
                            <div className="bg-white rounded-[24px] shadow-xl overflow-hidden h-[500px] flex flex-col">
                                <div className="h-[250px]">
                                    <img src={card.image} alt={card.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="p-8 flex-1">
                                    <span className="inline-block bg-[#FF2E6D] text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4">
                                        {card.stepLabel}
                                    </span>
                                    <h3 className="text-2xl font-black mb-2">{card.title}</h3>
                                    <p className="text-sm leading-relaxed">{card.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>

            {/* ---------------- DESKTOP ---------------- */}
            <div
                ref={containerRef}
                className="hidden sm:block relative"
                style={{ height: `${(data.length + 1) * 70}vh` }}
            >
                <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">

                    {/* Title */}
                    <div className="absolute top-[10vh] z-10 text-center">
                        <h2 className="text-6xl font-black tracking-tighter">
                            <span className="mr-3">{title1}</span>
                            <span className="text-[#FF2E6D] italic">{title2}</span>
                        </h2>
                    </div>

                    {/* Cards */}
                    <div className="relative w-[80vw] max-w-[1100px] h-[50vh] mt-[10vh]">
                        {data.map((card, index) => (
                            <DesktopCard
                                key={index}
                                card={card}
                                index={index}
                                total={data.length}
                                scrollYProgress={scrollYProgress}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

const DesktopCard = ({ card, index, total, scrollYProgress }) => {
    const step = 1 / total;
    const start = index * step;

    // Down → Up motion
    const y = useTransform(
        scrollYProgress,
        [start - 0.15, start],
        [120, 0]
    );

    const opacity = useTransform(
        scrollYProgress,
        [start - 0.15, start, start + step * 0.6],
        [0, 1, 1]
    );

    const scale = useTransform(
        scrollYProgress,
        [start, start + step],
        [1, 0.95]
    );

    return (
        <motion.div
            style={{
                y,
                opacity,
                scale,
                zIndex: index + 1
            }}
            className="absolute inset-0 w-full h-full"
        >
            <div className="w-full h-full bg-white rounded-[40px] shadow-2xl flex overflow-hidden border">
                <div className="w-1/3 p-8 bg-gray-50">
                    <img
                        src={card.image}
                        alt={card.title}
                        className="w-full h-full object-contain"
                    />
                </div>

                <div className="w-2/3 p-12 flex flex-col justify-center">
                    <span className="bg-[#FF2E6D] text-white font-bold py-2 px-6 rounded-full self-start mb-6 text-sm">
                        {card.stepLabel}
                    </span>
                    <h3 className="text-5xl font-black mb-6 tracking-tighter uppercase">
                        {card.title}
                    </h3>
                    <p className="text-2xl leading-relaxed max-w-2xl">
                        {card.description}
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default DesignTwentySeven;
